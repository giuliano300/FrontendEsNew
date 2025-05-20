import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormStorageService } from '../../services/form-storage.service';
import { secretKey } from '../../../main';
import * as CryptoJS from 'crypto-js';
import { FrontBack, HaveBulletin, PrintType, ProductTypes, ShippingTypes } from '../../interfaces/EnumTypes';
import { CommonModule } from '@angular/common';
import { CompleteOperation } from '../../interfaces/ViewModel/CompleteOperation';
import { Users } from '../../interfaces/Users';
import { CompleteRecipient } from '../../interfaces/ViewModel/CompleteRecipient';
import { RecipientROL } from '../../interfaces/RecipientROL';
import { Senders } from '../../interfaces/Senders';
import { OperationService } from '../../services/operation.service';
import { Operations } from '../../interfaces/Operations';
import { GetFilePrice, Prices } from '../../fncUtils/getPrices';

@Component({
  selector: 'app-calcolo-preventivo',
  imports: [RouterLink, CommonModule],
  templateUrl: './calcolo-preventivo.component.html',
  styleUrl: './calcolo-preventivo.component.scss'
})
export class CalcoloPreventivoComponent {

  constructor(
    private router: Router,
    private formStorage: FormStorageService,
    private operationService: OperationService
  ) 
  {
  }

  bulletin: boolean = false;
  productType: number | null = null;
  shippingTypes: number  | null = null;
  productName: string = "";
  routerLink: string = "";
  user:Users | null = null;
  tipoStampa: string | null = null;
  tipoColore: string | null = null;
  fronteRetro: string | null = null;
  tipoPosta?: string | null = null;
  boolTipoColore: boolean = false;

  //VARIABILI PAGINA
  Inviitotali: number = 0;
  ImportoNetto: number = 0;
  Iva: number = 0;
  totale: number = 0;
  ricevutaRitorno: string | null = null;

  calcolaPreventivo(){
    Promise.all([
      this.formStorage.getForm('numero-pagine-totali'),
    ]).then(([step1]) => {
      
      let n = parseInt(step1);
      let p: Prices = GetFilePrice(this.productType!, n, this.boolTipoColore, this.tipoPosta!)
      this.totale = p.totalPrice;
      this.ImportoNetto = p.vatPrice;
      this.ImportoNetto = p.price
    });
  }

  ngOnInit(): void {
    const user = localStorage.getItem('user');
    if (!user) {
      this.router.navigate(['/']);
      return;
    }

    this.user! = JSON.parse(user!);

    Promise.all([
      this.formStorage.getForm('step2'),
    ]).then(([step1]) => {
      const datiDecriptati = JSON.parse(CryptoJS.AES.decrypt(step1, secretKey).toString(CryptoJS.enc.Utf8));
      //console.log(datiDecriptati);
      if(datiDecriptati.bollettino == HaveBulletin.si)
        this.bulletin = true;

      this.productType = datiDecriptati.prodotto;
      this.shippingTypes = datiDecriptati.tipoinvio;
      this.fronteRetro = datiDecriptati.tipoStampa;
      this.tipoColore = datiDecriptati.tipoColore;
      this.ricevutaRitorno = datiDecriptati.tipoRicevuta;
      this.boolTipoColore = this.tipoColore == "BiancoNero" ? false : true;

      this.calcolaPreventivo();

      switch(parseInt(datiDecriptati.prodotto)){
          case ProductTypes.ROL: 
            this.productName = "raccomandata";
            if(datiDecriptati.tipoinvio == ShippingTypes.singola){
              this.routerLink = "/invioSingoloRaccomandata5";
              this.Inviitotali = 1;
            }
            else
              this.routerLink = "/invioMultiploRaccomandata4";           
      }
    });
  }

  sendShipping(){
    let operationName = "";
    let o: CompleteOperation = new CompleteOperation;
    let completeRecipients: CompleteRecipient[] = [];
    switch(Number(this.productType!)){
      case ProductTypes.ROL: 
      if(this.shippingTypes == ShippingTypes.singola){
          Promise.all(
          [
            this.formStorage.getForm('step3-raccomandata-singola-mittente'),
            this.formStorage.getForm('step3-raccomandata-singola-destinararioAR'),
            this.formStorage.getForm('step4-raccomandata-singola-destinatario'),
            this.formStorage.getForm('step-5-raccomandata-singola-file-upload'),
          ]
          ).then(([step1, step2, step3, step4]) => {

            let sender: Senders = JSON.parse(CryptoJS.AES.decrypt(step1, secretKey).toString(CryptoJS.enc.Utf8));
            let senderAR: Senders | null = null;
            if(step2 != undefined){
              senderAR = JSON.parse(CryptoJS.AES.decrypt(step2, secretKey).toString(CryptoJS.enc.Utf8));
              senderAR!.AR = true;
            }

            const decrypted = JSON.parse(
              CryptoJS.AES.decrypt(step3, secretKey).toString(CryptoJS.enc.Utf8)
            );

            let file = JSON.parse(CryptoJS.AES.decrypt(step4, secretKey).toString(CryptoJS.enc.Utf8));
            let recipientROL: RecipientROL = Object.assign(new RecipientROL(), decrypted);

            recipientROL.fileName = file.name;
            recipientROL.attachedFile = file.base64;
            recipientROL.numberOfPages = file.pages;

            //FRONTE RETRO, BIANCO NERO, FORMAQTO, RR
            recipientROL.frontBack = (this.tipoStampa == "SI" ? FrontBack.FronteRetro : FrontBack.SoloFronte);
            recipientROL.printType = (this.tipoColore == "BiancoNero" ? PrintType.BiancoNero : PrintType.Colori);

            const completeRecipient: CompleteRecipient = {
              recipientROL: recipientROL,
              sender: sender,
              senderAR: senderAR
            };

            completeRecipients.push(completeRecipient);

            operationName = 'Invio raccomandata singola ' + (this.bulletin + " con bollettino");

            o = {
              operation: {
                id: 0,
                insertDate: new Date().toISOString(),
                userId: this.user!.id!,
                userParentId: this.user!.parentId!,
                operationType: this.productType!,
                numberOfRecipient: 1,
                name: operationName,
                complete: true,
                areaTestOperation: false,
                error: false,
                errorMessage: null,
                csvFileName: null
              },
              completeRecipient: completeRecipients
            };

            this.operationService.setOperation(o)
            .subscribe((data: Operations) => {
              if (!data) {
                this.router.navigate(['/errore500']);
              } 
              else 
              {
                let res = {
                  operationId: data.id,
                  destinatari: this.Inviitotali,
                  data: data.insertDate
                };

                this.formStorage.saveForm("riepilogo", res);

                this.router.navigate(['/riepilogoSpedizione']);
              }
            });
      
          });          
      }
      break;
    }

    
  }
}


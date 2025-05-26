import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormStorageService } from '../../services/form-storage.service';
import { bulletin, secretKey } from '../../../main';
import * as CryptoJS from 'crypto-js';
import { FrontBack, HaveBulletin, PrintType, ProductTypes, ShippingTypes } from '../../interfaces/EnumTypes';
import { CommonModule } from '@angular/common';
import { CompleteOperation } from '../../ViewModel/CompleteOperation';
import { Users } from '../../interfaces/Users';
import { CompleteRecipient } from '../../ViewModel/CompleteRecipient';
import { Recipients } from '../../classes/Recipients';
import { Senders } from '../../classes/Senders';
import { OperationService } from '../../services/operation.service';
import { Operations } from '../../classes/Operations';
import { GetFilePrice, Prices } from '../../fncUtils/getPrices';
import { Bulletins } from '../../classes/Bulletins';
import { FncUtils } from '../../fncUtils/fncUtils';
import { PdfBase64List } from '../../classes/PdfBase64List';

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
  format: number = 0;
  boolTipoColore: boolean = false;
  logoId?: number = 0;
  send:boolean = false;
  errorMessage: string = "";
  tipoLettera?: string | null = null;
  tipoInvio: string = "";
  tipoNotificante?: number | null = null;
  nomeNotificante: string = "";

  //VARIABILI PAGINA
  Inviitotali: string = "0";
  ImportoNetto: string = "0";
  Iva: string = "0";
  totale: string = "0";
  ricevutaRitorno: string | null = null;
  ifIsCalcolable: boolean = false;

  bulletinw:string = "con bollettino";

  calcolaPreventivo(){
    Promise.all([
      this.formStorage.getForm('invii-totali'),
    ]).then(([step1]) => {
      
      const datiDecriptati = JSON.parse(CryptoJS.AES.decrypt(step1, secretKey).toString(CryptoJS.enc.Utf8));
      this.Inviitotali = datiDecriptati.numeroInvii;
      let numeroPagineTotali: any[] = datiDecriptati.numeroPagineTotali;
      let tots: Prices = new Prices();
      for(let i = 0; i < numeroPagineTotali.length; i++){
        let p = GetFilePrice(this.productType!, numeroPagineTotali[i], this.boolTipoColore, this.tipoLettera!);
        tots.price += p.price;
        tots.vatPrice += p.vatPrice;
        tots.totalPrice += p.totalPrice;
      }      
      this.totale = FncUtils.formatPrice(tots.totalPrice);
      this.Iva = FncUtils.formatPrice(tots.vatPrice);
      this.ImportoNetto = FncUtils.formatPrice(tots.price);
    });
  }

  havePrice(): boolean{
    if(this.productType == ProductTypes.LOL || this.productType == ProductTypes.ROL || this.productType == ProductTypes.TOL)
      this.ifIsCalcolable = true;

    return this.ifIsCalcolable;
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
      if(!step1)
        this.router.navigate(['/']);

      const datiDecriptati = JSON.parse(CryptoJS.AES.decrypt(step1, secretKey).toString(CryptoJS.enc.Utf8));
     
      if(datiDecriptati.bollettino == HaveBulletin.si)
        this.bulletin = true;
      else
        this.bulletinw = "senza bollettino";

      this.productType = datiDecriptati.prodotto;
      this.shippingTypes = datiDecriptati.tipoinvio;
      this.fronteRetro = datiDecriptati.tipoStampa;
      this.tipoColore = datiDecriptati.tipoColore;
      this.ricevutaRitorno = datiDecriptati.tipoRicevuta;
      this.boolTipoColore = this.tipoColore == "BiancoNero" ? false : true;
      this.logoId = datiDecriptati.selLogo == "" ? 0 : parseInt(datiDecriptati.selLogo);
      if(datiDecriptati.tipoFormato == "FormatoSpeciale")
        this.format = 1;

      this.tipoLettera = datiDecriptati.tipoLettera;
      this.tipoNotificante = datiDecriptati.tipoNotificante;
      this.nomeNotificante = datiDecriptati.nomeNotificante;

      if(this.havePrice!)
        this.calcolaPreventivo();
      
      switch(parseInt(datiDecriptati.prodotto)){
          case ProductTypes.ROL: 
          case ProductTypes.MOL: 
            this.productName = "raccomandata";
            if(datiDecriptati.tipoinvio == ShippingTypes.singola){
              this.routerLink = "/invioSingoloRaccomandata5";
              this.tipoInvio = "singolo";
            }
            else{
              this.routerLink = "/invioMultiploRaccomandata4";           
              this.tipoInvio = "multiplo";
            }
            break;
          case ProductTypes.LOL: 
          case ProductTypes.COL: 
            this.productName = "lettera";
            if(datiDecriptati.tipoinvio == ShippingTypes.singola){
              this.routerLink = "/invioSingoloLettera5";
              this.tipoInvio = "singolo";
            }
            else
            {
              this.routerLink = "/invioMultiploLettera4";      
              this.tipoInvio = "multiplo";
            }
          break;     
          case ProductTypes.AGOL: 
            this.productName = "agol";
            if(datiDecriptati.tipoinvio == ShippingTypes.singola){
              this.routerLink = "/invioSingoloAgol5";
              this.tipoInvio = "singolo";
            }
            else
            {
              this.routerLink = "/invioMultiploAgol4";      
              this.tipoInvio = "multiplo";
            }
          break;     
      }
    });
  }

  sendShipping(){
    this.send = true;
    let operationName = "";
    let o: CompleteOperation = new CompleteOperation;
    let completeRecipients: CompleteRecipient[] = [];
    Promise.all(
    [
      this.formStorage.getForm('mittente'),
      this.formStorage.getForm('destinararioAR'),
      this.formStorage.getForm('destinatari'),
      this.formStorage.getForm('files-upload'),
      this.formStorage.getForm('bollettini'),
    ]
    ).then(([mittente, destinararioAR, destinatari, filesupload, bollettini]) => {

      let sender: Senders = JSON.parse(CryptoJS.AES.decrypt(mittente, secretKey).toString(CryptoJS.enc.Utf8));
      let senderAR: Senders | null = null;
      if(destinararioAR != undefined){
        senderAR = JSON.parse(CryptoJS.AES.decrypt(destinararioAR, secretKey).toString(CryptoJS.enc.Utf8));
        senderAR!.AR = true;
      }

      const destinatariDec = JSON.parse(
        CryptoJS.AES.decrypt(destinatari, secretKey).toString(CryptoJS.enc.Utf8)
      );

      const filesuploadDec:PdfBase64List[] = filesupload;

      let bs: Bulletins[] | null = [];
      if(this.bulletin){
        const decryptedBulletin = JSON.parse(
          CryptoJS.AES.decrypt(bollettini, secretKey).toString(CryptoJS.enc.Utf8)
        );

        bs = decryptedBulletin.map((item: any) =>
            Object.assign(new Bulletins(), item)
        );      
      }
      else
        bs = null;

      for(let i = 0; i < destinatariDec.length; i++){

          const fileTrovato = filesuploadDec.find(a => a.name === destinatariDec[i].fileName);
          let Recipient: Recipients = Object.assign(new Recipients(), destinatariDec[i]);

          Recipient.fileName = fileTrovato!.name;
          Recipient.attachedFile = fileTrovato!.base64;
          Recipient.numberOfPages = fileTrovato!.pages;
          Recipient.productType = this.productType!;
          Recipient.logoId = this.logoId;
          Recipient.format = this.format;
          Recipient.posteType = this.tipoLettera;
          Recipient.tipologiaNotificante = this.tipoNotificante;
          Recipient.valoreNotificante = this.nomeNotificante;

          //FRONTE RETRO, BIANCO NERO, FORMAQTO, RR
          Recipient.frontBack = (this.tipoStampa == "SI" ? FrontBack.FronteRetro : FrontBack.SoloFronte);
          Recipient.printType = (this.tipoColore == "BiancoNero" ? PrintType.BiancoNero : PrintType.Colori);

          let b: Bulletins | null = new Bulletins();
          if(this.bulletin)
            b = bs!.find(a => a.tempRecipientGuid == Recipient.tempGuid)!;
          else
           b = null;

          const completeRecipient: CompleteRecipient = {
            Recipient: Recipient,
            bulletin: b
          };

          completeRecipients.push(completeRecipient);

      }


      operationName = 'Invio ' +  this.productName + (this.shippingTypes == ShippingTypes.singola ? ' singolo' : ' multiplo ') + (this.bulletin  ? ' con bollettino' : '');

      o = {
        operation: {
          id: 0,
          insertDate: new Date().toISOString(),
          userId: this.user!.id!,
          userParentId: this.user!.parentId!,
          operationType: this.productType!,
          numberOfRecipient: completeRecipients.length,
          name: operationName,
          complete: true,
          areaTestOperation: false,
          error: false,
          errorMessage: null,
          csvFileName: null
        },
        completeRecipient: completeRecipients,
        sender: sender,
        senderAR: senderAR,
      };

      var test = JSON.stringify(o);
      console.log(test);
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

          this.send = false;
          if(res.operationId == 0)
            this.errorMessage= "Si è verificato un errore nella creazione della spedizione.";
          else
          {
            this.formStorage.saveForm("riepilogo", res);

            this.router.navigate(['/riepilogoSpedizione']);
          }
        }
      });
  
    })
  }
}


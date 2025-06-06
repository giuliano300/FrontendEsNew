import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { secretKey } from '../../../main';
import { FormStorageService } from '../../services/form-storage.service';
import { ProductTypes } from '../../interfaces/EnumTypes';
import { CommonModule } from '@angular/common';
import * as CryptoJS from 'crypto-js';
import { FncUtils } from '../../fncUtils/fncUtils';

@Component({
  selector: 'app-riepilogo-spedizione',
  imports: [RouterLink, CommonModule],
  templateUrl: './riepilogo-spedizione.component.html',
  styleUrl: './riepilogo-spedizione.component.scss'
})
export class RiepilogoSpedizioneComponent {

  constructor(
    private formStorage: FormStorageService,
    private router: Router
  ) 
  {
  } 

  bulletin: boolean = false;
  tipoSpedizione: string = "singola";
  productType: number | null = null;
  productName: string = "";
  numeroLotto: number = 0;
  numeroDestinatari: number = 0;
  dataCreazione: string  | null = null;
  ffwLink: string = "";
  isTelegram: boolean = false;
  rrTelegramma?: string | null = null;
  isVisura: boolean = false;

  ngOnInit(): void {

    Promise.all([
      this.formStorage.getForm('step2'),
      this.formStorage.getForm('riepilogo'),
    ]).then(([step1, step2]) => {
      if(!step1)
        this.router.navigate(['/']);
      
       const datiDecriptati = JSON.parse(CryptoJS.AES.decrypt(step1, secretKey).toString(CryptoJS.enc.Utf8));
       if(datiDecriptati.bollettino == 1)
        this.bulletin = true;

       switch(parseInt(datiDecriptati.prodotto)){
          case ProductTypes.ROL: 
          case ProductTypes.MOL: 
            this.productName = "raccomandata";
            this.ffwLink = "/statoInvii/1";
            break;
          case ProductTypes.LOL: 
          case ProductTypes.COL: 
            this.productName = "lettera";
            this.ffwLink = "/statoInvii/2";
            break;
          case ProductTypes.TOL: 
            this.productName = "telegramma";
            this.ffwLink = "/statoInvii/3";
            this.isTelegram = true;
            this.rrTelegramma = datiDecriptati.rrTelegramma ? "Con " : "Senza ";
            break;
          case ProductTypes.AGOL: 
            this.productName = "atti giudiziari";
            this.ffwLink = "/statoInvii/4";
            break;
          case ProductTypes.VOL: 
            this.productName = "visure/Certificati";
            this.ffwLink = "/statoInvii/7";
            this.isVisura = true;
            break;
        }

        if(step2.destinatari > 1)
          this.tipoSpedizione = "multipla"

        this.numeroLotto = step2.operationId;
        this.numeroDestinatari = step2.destinatari;
        this.dataCreazione =  FncUtils.GetFormattedData(step2.data);

      //this.formStorage.clearAll();
    })
  }

}

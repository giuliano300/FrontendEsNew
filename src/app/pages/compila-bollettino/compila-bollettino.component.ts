import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { alertBollCap, alertBollIndirizzo, alertBollLocalita, alertBollNominativo } from '../../enviroments/enviroments';
import { Users } from '../../interfaces/Users';
import { FormStorageService } from '../../services/form-storage.service';
import { bulletin, secretKey } from '../../../main';
import { ProductTypes } from '../../interfaces/EnumTypes';
import * as CryptoJS from 'crypto-js';
import { Bulletins } from '../../classes/Bulletins';
import { Recipients } from '../../classes/Recipients';


@Component({
  selector: 'app-compila-bollettino',
  imports: [ReactiveFormsModule, CommonModule, RouterLink, NgbModule],
  templateUrl: './compila-bollettino.component.html',
  styleUrl: './compila-bollettino.component.scss'
})
export class CompilaBollettinoComponent {
  constructor(private router: Router, private formStorage: FormStorageService) {}
  alertMessage = false;
  alertText = '';
  alertBollNominativo = alertBollNominativo;
  alertBollIndirizzo = alertBollIndirizzo;
  alertBollCap = alertBollCap;
  alertBollLocalita = alertBollLocalita;
  user: Users | null = null;
  productName: string | null = null;
  productType: number | null = null;
  recipients: Recipients[] | null = null;
  
  form = new FormGroup({
    conto_corrente: new FormControl('', [Validators.required]),
    eseguito_nominativo: new FormControl('', [Validators.required]),
    anno_riferimento: new FormControl('', [Validators.required]),
    intestatario: new FormControl('', [Validators.required]),
    eseguito_indirizzo: new FormControl('', [Validators.required]),
    eseguito_cap: new FormControl('', [Validators.required, Validators.maxLength(5)]),
    importo: new FormControl('', [Validators.required]),
    eseguito_localita: new FormControl('', [Validators.required]),
    codice_cliente: new FormControl('', [Validators.required]),
    causale: new FormControl('', [Validators.required]),
  });


  ngOnInit(): void {
    Promise.all([
      this.formStorage.getForm('step2'),
      this.formStorage.getForm('destinatari'),
    ]).then(([step1, step2]) => {
      const datiDecriptati = JSON.parse(CryptoJS.AES.decrypt(step1, secretKey).toString(CryptoJS.enc.Utf8));
      const destinatari = JSON.parse(CryptoJS.AES.decrypt(step2, secretKey).toString(CryptoJS.enc.Utf8));

      this.recipients = destinatari;

      this.productType = datiDecriptati.prodotto;

      switch(parseInt(datiDecriptati.prodotto)){
          case ProductTypes.ROL: 
            this.productName = "raccomandata";
            break;
          case ProductTypes.LOL: 
            this.productName = "lettera";
            break;
      }

    })

  }


  onSubmit(): void {
   
    if (this.form.valid) {

      let b: Bulletins = new Bulletins();
      Object.assign(b, {
        numeroContoCorrente: this.form.value.conto_corrente,
        intestatoA: this.form.value.intestatario,
        importoEuro: this.form.value.importo?.toString(),
        eseguitoDaNominativo: this.form.value.eseguito_nominativo,
        eseguitoDaIndirizzo: this.form.value.eseguito_indirizzo,
        eseguitoDaLocalita: this.form.value.eseguito_localita,
        annoDiRiferimento: this.form.value.anno_riferimento,
        eseguitoDaCap: this.form.value.eseguito_cap,
        codiceCliente: this.form.value.codice_cliente,
        causale: this.form.value.causale,
        productType: this.productType,
        tempRecipientGuid: this.recipients![0].tempGuid
      });

      let bs: Bulletins[] = [];
      bs.push(b);

      const encrypted = CryptoJS.AES.encrypt(JSON.stringify(bs), secretKey).toString();
      this.formStorage.saveForm('bollettini', encrypted);

      this.router.navigate(['/calcoloPreventivo']);
    } 
    else 
    {
      this.alertMessage = true;
      this.alertText = 'Compila tutti i campi obbligatori correttamente.';
    }
  }



}

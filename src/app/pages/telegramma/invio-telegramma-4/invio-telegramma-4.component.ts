import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { FormStorageService } from '../../../services/form-storage.service';
import { secretKey } from '../../../../main';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-invio-telegramma-4',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './invio-telegramma-4.component.html',
  styleUrl: './invio-telegramma-4.component.scss'
})
export class InvioTelegramma4Component {
  constructor(private router: Router, private formStorage: FormStorageService) {}  
  rr: string = "Con ";
    alertMessage = false;
    alertText = '';

  form = new FormGroup({
    messaggio: new FormControl('', [Validators.required]),
  });

  ngOnInit(): void {
    Promise.all([
          this.formStorage.getForm('step2')
        ])
        .then(([step1]) => {
          const datiDecriptati = JSON.parse(CryptoJS.AES.decrypt(step1, secretKey).toString(CryptoJS.enc.Utf8));
          if(!parseInt(datiDecriptati.rrTelegramma))
            this.rr = "Senza ";
    })
  }

  onSubmit(): void {
   
    if (this.form.valid) {

        const msgObject = {
          message: this.form.value.messaggio!
        };
      
        const msgObjectEnc = CryptoJS.AES.encrypt(JSON.stringify(msgObject), secretKey).toString();
        this.formStorage.saveForm('messaggioTelegramma', msgObjectEnc);
 
        let Inviitotali = {
          numeroInvii: 1,
          numeroPagineTotali: [0]
        };

        const encryptedInvii = CryptoJS.AES.encrypt(JSON.stringify(Inviitotali), secretKey).toString();
        this.formStorage.saveForm("invii-totali", encryptedInvii);      

      this.router.navigate(['/calcoloPreventivo']);
    } else {
      this.alertMessage = true;
      this.alertText = 'Scrivi un messaggio.';
    }
  }


}

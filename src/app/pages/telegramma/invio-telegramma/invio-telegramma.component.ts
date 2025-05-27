import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { ProductTypes } from '../../../interfaces/EnumTypes';
import { FormStorageService } from '../../../services/form-storage.service';
import { secretKey } from '../../../../main';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-invio-telegramma',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './invio-telegramma.component.html',
  styleUrl: './invio-telegramma.component.scss'
})
export class InvioTelegrammaComponent {

  constructor(private router: Router,
    private formStorage: FormStorageService
  ) {}
  alertMessage = false;
  alertText = '';



form = new FormGroup({
  ricevutaRitorno: new FormControl('', [Validators.required])
});


onSubmit(): void {
  const errors: string[] = [];

  const ricevutaRitorno = this.form.value.ricevutaRitorno;

  // Costruisce lista errori se manca qualcosa
  if (!ricevutaRitorno) errors.push('Ricevuta di ritorno');

  if (errors.length > 0) {
    this.alertText = `${errors.join(', ')}.`;
    this.alertMessage = true;
    return;
  }

  // Se tutti sono presenti, vai alla pagina

  const datiDecriptati = {
    prodotto: ProductTypes.TOL,
    tipoRicevuta:  ricevutaRitorno!.toString() ? "SI" : "NO"
  };

  const encryptedAR = CryptoJS.AES.encrypt(JSON.stringify(datiDecriptati), secretKey).toString();
  this.formStorage.saveForm('step2', encryptedAR);

  this.router.navigate(['/invioTelegramma2']);
}

removeErroMessage(): void {
  this.alertMessage = false;
  this.alertText = '';
}


}

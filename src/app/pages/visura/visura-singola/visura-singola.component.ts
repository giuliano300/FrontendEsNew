import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { FormStorageService } from '../../../services/form-storage.service';
import { secretKey, sendType } from '../../../../main';
import { ProductTypes } from '../../../interfaces/EnumTypes';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-visura-singola',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './visura-singola.component.html',
  styleUrl: './visura-singola.component.scss'
})
export class VisuraSingolaComponent {

  constructor(private router: Router, private formStorage: FormStorageService) {}
  alertMessage = false;
  alertText = '';



form = new FormGroup({
  sel_documento: new FormControl('', [Validators.required]),
  tipoRichiesta: new FormControl('', [Validators.required]),
  tipoDestinatario: new FormControl('', [Validators.required]),
});


visuraOptions = [
  { value: '5', label: 'Bilancio completo (BICM)' },
  { value: '6', label: 'Fascicolo completo (FASC)' },
  { value: '7', label: 'Ricerca protesti (RIPR)' },
  { value: '8', label: 'Scheda persona (SCPE)' },
  { value: '9', label: 'Scheda socio (SCSC)' },
  { value: '10', label: 'Scheda società (SCSO)' },
  { value: '12', label: 'Trasferimenti di azienda (TRSF)' },
  { value: '13', label: 'Visura ordinaria (VISO)' },
  { value: '14', label: 'Visura storica (VISS)' },
];

certificatoOptions = [
  { value: '0', label: 'Certificato Artigiano (CART)' },
  { value: '1', label: 'Certificato Ordinario Sintetico (CRIA)' },
  { value: '2', label: 'Certificato Ordinario (CRIM)' },
  { value: '3', label: 'Certificato Storico (CRIS)' },
  { value: '11', label: 'Dichiarazione Sostitutiva (SOST)' },
];

filteredOptions: { value: string, label: string }[] = [];

ngOnInit() {

  this.form.get('tipoRichiesta')?.valueChanges.subscribe(value => {
  this.form.get('sel_documento')?.setValue(''); // <-- importante: imposta la select al valore vuoto

      if (value === 'Visura') {
        this.filteredOptions = this.visuraOptions;
      } else if (value === 'Certificato') {
        this.filteredOptions = this.certificatoOptions;
      } else {
        this.filteredOptions = [];
      }
  });
}



onSubmit(): void {
  const errors: string[] = [];

  const sel_documento = this.form.value.sel_documento;
  const tipoRichiesta = this.form.value.tipoRichiesta;
  const tipoDestinatario = this.form.value.tipoDestinatario;

  // Costruisce lista errori se manca qualcosa
  if (!tipoRichiesta) errors.push('Tipo richiesta');
  if (!sel_documento) {errors.push('Tipo documento');}
  if (!tipoDestinatario) errors.push('Destinatario diverso');


  if (errors.length > 0) {
    this.alertText = `${errors.join(', ')}.`;
    this.alertMessage = true;
    return;
  }

    const datiForm = {
      selLogo: 0,
      tipoFormato: 0,
      tipoColore: 0,
      tipoStampa: 0,
      tipoRicevuta: 0,
      tipoinvio: sendType.singolo,
      prodotto: ProductTypes.VOL,
      bollettino: 0,
      tipoRichiesta: tipoRichiesta,
      sel_documento: sel_documento,
      tipoDestinatario: tipoDestinatario
    };
  
    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(datiForm), secretKey).toString();
  
    this.formStorage.saveForm('step2', encrypted);
  

  // Se tutti sono presenti, vai alla pagina
    this.router.navigate(['/visuraSingola2'], 
    {
      state: { tipoDestinatario: tipoDestinatario }
    });

}

removeErroMessage(): void {
  this.alertMessage = false;
  this.alertText = '';
}


}

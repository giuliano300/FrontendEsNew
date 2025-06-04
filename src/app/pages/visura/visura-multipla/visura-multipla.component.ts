import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-visura-multipla',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './visura-multipla.component.html',
  styleUrl: './visura-multipla.component.scss'
})
export class VisuraMultiplaComponent {

    constructor(private router: Router) {}
  alertMessage = false;
  alertText = '';



form = new FormGroup({
  sel_mittente: new FormControl('', [Validators.required]),
  sel_documento: new FormControl('', [Validators.required]),
  tipoRichiesta: new FormControl('', [Validators.required]),
  tipoDestinatario: new FormControl('', [Validators.required]),
  nome_2: new FormControl('', [Validators.required]),
  cognome_2: new FormControl('', [Validators.required]),
  telefono_2: new FormControl('', [Validators.required]),
  email_2: new FormControl('', [Validators.required]),
  indirizzo_2: new FormControl('', [Validators.required]),
  cap_2: new FormControl('', [Validators.required, Validators.maxLength(5)]),
  provincia_2: new FormControl('', [Validators.required, Validators.maxLength(2)]),
  citta_2: new FormControl('', [Validators.required]),
  stato_2: new FormControl('', [Validators.required]),
});


visuraOptions = [
  { value: 'bilancio completo', label: 'Bilancio completo (BICM)' },
  { value: 'fascicolo completo', label: 'Fascicolo completo (FASC)' },
  { value: 'ricerca protesti', label: 'Ricerca protesti (RIPR)' },
  { value: 'scheda persona', label: 'Scheda persona (SCPE)' },
  { value: 'scheda socio', label: 'Scheda socio (SCSC)' },
  { value: 'scheda societa', label: 'Scheda società (SCSO)' },
  { value: 'trasferimenti di azienda', label: 'Trasferimenti di azienda (TRSF)' },
  { value: 'visura ordinaria', label: 'Visura ordinaria (VISO)' },
  { value: 'visura storica', label: 'Visura storica (VISS)' },
];

certificatoOptions = [
  { value: 'certificato artigiano', label: 'Certificato Artigiano (CART)' },
  { value: 'certificato ordinario sintetico', label: 'Certificato Ordinario Sintetico (CRIA)' },
  { value: 'certificato ordinario', label: 'Certificato Ordinario (CRIM)' },
  { value: 'certificato storico', label: 'Certificato Storico (CRIS)' },
  { value: 'dichiarazione sostitutiva', label: 'Dichiarazione Sostitutiva (SOST)' },
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

    this.form.get('tipoDestinatario')?.valueChanges.subscribe(value => {
        const destinatarioControls = [
          'nome_2', 'cognome_2', 'telefono_2', 'email_2',
          'indirizzo_2', 'cap_2', 'provincia_2', 'citta_2', 'stato_2'
        ];

        destinatarioControls.forEach(control => {
          const ctrl = this.form.get(control);
          if (value === 'DestinatarioSI') {
            ctrl?.enable();
            ctrl?.setValidators(Validators.required);
          } else {
            ctrl?.disable();
            ctrl?.clearValidators();
            ctrl?.setValue('');
          }
          ctrl?.updateValueAndValidity();
        });
      });

      // Disattiva inizialmente i campi destinatario
      const destinatarioControls = [
        'nome_2', 'cognome_2', 'telefono_2', 'email_2',
        'indirizzo_2', 'cap_2', 'provincia_2', 'citta_2', 'stato_2'
      ];
      destinatarioControls.forEach(control => this.form.get(control)?.disable());

}



onSubmit(): void {
  const errors: string[] = [];

  const sel_mittente = this.form.value.sel_mittente;
  const sel_documento = this.form.value.sel_documento;
  const tipoRichiesta = this.form.value.tipoRichiesta;
  const tipoDestinatario = this.form.value.tipoDestinatario;

  // Costruisce lista errori se manca qualcosa
  if (!sel_mittente) errors.push('Seleziona richiedente');
  if (!sel_documento) errors.push('Seleziona tipo documento');
  if (!tipoRichiesta) errors.push('Tipo richiesta');
  if (!tipoDestinatario) errors.push('Destinatario diverso');

  if (tipoDestinatario === 'DestinatarioSI') {
    const destinatarioFields = [
      { name: 'nome_2', label: 'Nome destinatario' },
      { name: 'cognome_2', label: 'Cognome destinatario' },
      { name: 'telefono_2', label: 'Telefono destinatario' },
      { name: 'email_2', label: 'Email destinatario' },
      { name: 'indirizzo_2', label: 'Indirizzo destinatario' },
      { name: 'cap_2', label: 'CAP destinatario' },
      { name: 'provincia_2', label: 'Provincia destinatario' },
      { name: 'citta_2', label: 'Città destinatario' },
      { name: 'stato_2', label: 'Stato destinatario' }
    ];

    destinatarioFields.forEach(field => {
      const control = this.form.get(field.name);
      if (!control?.value) {
        errors.push(field.label);
      }
    });
  }

  if (errors.length > 0) {
    this.alertText = `${errors.join(', ')}.`;
    this.alertMessage = true;
    return;
  }
 
  // Se tutti sono presenti, vai alla pagina
    this.router.navigate(['/visuraMultipla2']);

}

removeErroMessage(): void {
  this.alertMessage = false;
  this.alertText = '';
}


}

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-visura-singola',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './visura-singola.component.html',
  styleUrl: './visura-singola.component.scss'
})
export class VisuraSingolaComponent {

  constructor(private router: Router) {}
  alertMessage = false;
  alertText = '';



form = new FormGroup({
  sel_documento: new FormControl('', [Validators.required]),
  tipoRichiesta: new FormControl('', [Validators.required]),
  tipoDestinatario: new FormControl('', [Validators.required]),
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
}



onSubmit(): void {
  const errors: string[] = [];

  const sel_documento = this.form.value.sel_documento;
  const tipoRichiesta = this.form.value.tipoRichiesta;
  const tipoDestinatario = this.form.value.tipoDestinatario;

  // Costruisce lista errori se manca qualcosa
  if (!tipoRichiesta) errors.push('Tipo richiesta');
  if (!this.form.value.sel_documento) {errors.push('Tipo documento');}
  if (!tipoDestinatario) errors.push('Destinatario diverso');


  if (errors.length > 0) {
    this.alertText = `${errors.join(', ')}.`;
    this.alertMessage = true;
    return;
  }

  // Se tutti sono presenti, vai alla pagina
    this.router.navigate(['/visuraSingola2'], {
      state: { tipoDestinatario: tipoDestinatario }
    });

}

removeErroMessage(): void {
  this.alertMessage = false;
  this.alertText = '';
}


}

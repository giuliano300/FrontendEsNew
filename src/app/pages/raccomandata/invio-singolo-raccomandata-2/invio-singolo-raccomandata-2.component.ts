import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-invio-singolo-raccomandata-2',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './invio-singolo-raccomandata-2.component.html',
  styleUrl: './invio-singolo-raccomandata-2.component.scss'
})
export class InvioSingoloRaccomandata2Component {

  constructor(private router: Router) {}
  alertMessage = false;
  alertText = '';

form = new FormGroup({
  sel_logo: new FormControl('', [Validators.required]),
  tipoFormato: new FormControl('', [Validators.required]),
  tipoColore: new FormControl('', [Validators.required]),
  tipoStampa: new FormControl('', [Validators.required]),
  tipoRicevuta: new FormControl('', [Validators.required])
});

onSubmit(): void {
  const errors: string[] = [];

  const selLogo = this.form.value.sel_logo;
  const tipoFormato = this.form.value.tipoFormato;
  const tipoColore = this.form.value.tipoColore;
  const tipoStampa = this.form.value.tipoStampa;
  const tipoRicevuta = this.form.value.tipoRicevuta;

  // Costruisce lista errori se manca qualcosa
  if (!selLogo) errors.push('Logo'); 
  if (!tipoFormato) errors.push('Formato');
  if (!tipoColore) errors.push('Colore');
  if (!tipoStampa) errors.push('Stampa');
  if (!tipoRicevuta) errors.push('Ricevuta');

  if (errors.length > 0) {
    this.alertText = `${errors.join(', ')}.`;
    this.alertMessage = true;
    return;
  }

  // Se tutti sono presenti, vai alla pagina
  this.router.navigate(['/invioSingoloRaccomandata3']);
}

removeErroMessage(): void {
  this.alertMessage = false;
  this.alertText = '';
}


}

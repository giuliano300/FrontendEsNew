import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-invio-pacco',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './invio-pacco.component.html',
  styleUrl: './invio-pacco.component.scss'
})
export class InvioPaccoComponent {

    constructor(private router: Router) {}
    alertMessage = false;
    alertText = '';



form = new FormGroup({
  sel_mittente: new FormControl('', [Validators.required]),
  mitt_contratto: new FormControl('', [Validators.required]),
  sel_prodotto: new FormControl('', [Validators.required]),
});



onSubmit(): void {
  const errors: string[] = [];

  const sel_mittente = this.form.value.sel_mittente;
  const mitt_contratto = this.form.value.mitt_contratto;
  const sel_prodotto = this.form.value.sel_prodotto;

  // Costruisce lista errori se manca qualcosa
  if (!sel_mittente) errors.push('Seleziona mittente');
  if (!mitt_contratto) errors.push('Mittente da contratto');
  if (!sel_prodotto) errors.push('Seleziona tipo prodotto');


  if (errors.length > 0) {
    this.alertText = `${errors.join(', ')}.`;
    this.alertMessage = true;
    return;
  }
 
  // Se tutti sono presenti, vai alla pagina
    this.router.navigate(['/invioPacco2']);

}

removeErroMessage(): void {
  this.alertMessage = false;
  this.alertText = '';
}


}

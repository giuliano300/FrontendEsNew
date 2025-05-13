import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-invio-singolo-raccomandata-3',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './invio-singolo-raccomandata-3.component.html',
  styleUrl: './invio-singolo-raccomandata-3.component.scss'
})
export class InvioSingoloRaccomandata3Component {

  constructor(private router: Router) {}
  alertMessage = false;
  alertText = '';



  form = new FormGroup({
    sel_mittente: new FormControl('', [Validators.required]),
    nominativo: new FormControl('', [Validators.required, Validators.maxLength(44)]),
    indirizzo: new FormControl('', [Validators.required]),
    cap: new FormControl('', [Validators.required, Validators.maxLength(5)]),
    provincia: new FormControl('', [Validators.required, Validators.maxLength(2)]),
    comp_nominativo: new FormControl('', [Validators.required]),
    comp_indirizzo: new FormControl('', [Validators.required]),
    citta: new FormControl('', [Validators.required]),
    stato: new FormControl('', [Validators.required]),
    destinatario: new FormControl(true),
    nominativo_ar: new FormControl(''),
    comp_nominativo_ar: new FormControl(''),
    indirizzo_ar: new FormControl(''),
    comp_indirizzo_ar: new FormControl(''),
    cap_ar: new FormControl(''),
    provincia_ar: new FormControl(''),
    citta_ar: new FormControl(''),
    stato_ar: new FormControl(''),
  });

  ngOnInit(): void {
    this.form.get('destinatario')?.valueChanges.subscribe((checked) => {
      if (!checked) {
        this.setDestinatarioARValidators(true); // checkbox NON selezionato → attiva i campi AR
      } else {
        this.setDestinatarioARValidators(false); // checkbox selezionato → disattiva i campi AR
      }
    });
  
    // Applica lo stato iniziale alla creazione
    this.setDestinatarioARValidators(!this.form.get('destinatario')?.value);
  }

  setDestinatarioARValidators(active: boolean): void {
    const controls = [
      'nominativo_ar',
      'comp_nominativo_ar',
      'indirizzo_ar',
      'comp_indirizzo_ar',
      'cap_ar',
      'provincia_ar',
      'citta_ar',
      'stato_ar',
    ];

    controls.forEach(controlName => {
      const control = this.form.get(controlName);
      if (active) {
        control?.setValidators([Validators.required]);
      } else {
        control?.clearValidators();
      }
      control?.updateValueAndValidity();
    });
  }

  onSubmit(): void {
   
    if (this.form.valid) {
      this.router.navigate(['/invioSingoloRaccomandata4']);
    } else {
      this.alertMessage = true;
      this.alertText = 'Compila tutti i campi obbligatori correttamente.';
    }
  }

}

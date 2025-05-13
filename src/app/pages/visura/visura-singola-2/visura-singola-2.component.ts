import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-visura-singola-2',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './visura-singola-2.component.html',
  styleUrl: './visura-singola-2.component.scss'
})
export class VisuraSingola2Component {

  constructor(private router: Router) {}
  alertMessage = false;
  alertText = '';



  form = new FormGroup({
    sel_mittente: new FormControl(''),
    nome: new FormControl('', [Validators.required]),
    cognome: new FormControl('', [Validators.required]),
    telefono: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
    indirizzo: new FormControl('', [Validators.required]),
    cap: new FormControl('', [Validators.required, Validators.maxLength(5)]),
    provincia: new FormControl('', [Validators.required, Validators.maxLength(2)]),
    citta: new FormControl('', [Validators.required]),
    stato: new FormControl('', [Validators.required]),
    destinatario: new FormControl(true),
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

  ngOnInit(): void {
    const navigationState = history.state;
    const tipoDestinatario = navigationState.tipoDestinatario;

    // Se è "DestinatarioSI", mostra i campi destinatarioAR
    if (tipoDestinatario === 'DestinatarioSI') {
      this.form.get('destinatario')?.setValue(false); // Mostra il destinatario alternativo
    } else {
      this.form.get('destinatario')?.setValue(true); // Nasconde
    }

    this.form.get('destinatario')?.valueChanges.subscribe((checked) => {
      if (!checked) {
        this.setDestinatarioARValidators(true); 
      } else {
        this.setDestinatarioARValidators(false);
      }
    });
  
    // Applica lo stato iniziale alla creazione
    this.setDestinatarioARValidators(!this.form.get('destinatario')?.value);
  }

  setDestinatarioARValidators(active: boolean): void {
    const controls = [
      'nome_2',
      'cognome_2',
      'telefono_2',
      'email_2',
      'indirizzo_2',
      'cap_2',
      'provincia_2',
      'citta_2',
      'stato_2'
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
      this.router.navigate(['/visuraSingola3']);
    } else {
      this.alertMessage = true;
      this.alertText = 'Compila tutti i campi obbligatori correttamente.';
    }
  }



}

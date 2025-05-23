import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dati-personali',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './dati-personali.component.html',
  styleUrl: './dati-personali.component.scss'
})
export class DatiPersonaliComponent {

    constructor(private router: Router) {}
    alertMessage = false;
    alertMessagePwd = false;
    alertText = '';
    alertTextPwd = '';


      form = new FormGroup({
        nome: new FormControl('', [Validators.required]),
        cognome: new FormControl('', [Validators.required]),
        rag_soc: new FormControl('', [Validators.required]),
        indirizzo: new FormControl('', [Validators.required]),
        cap: new FormControl('', [Validators.required]),
        citta: new FormControl('', [Validators.required]),
        prov: new FormControl('', [Validators.required]),
        telefono: new FormControl('', [Validators.required]),
        email: new FormControl('', [Validators.required]),
      });

      form_pwd = new FormGroup({
        old_pwd: new FormControl('', [Validators.required]),
        new_pwd: new FormControl('', [Validators.required]),
        rpt_new_pwd: new FormControl('', [Validators.required]),
      });


  onSubmit(): void {
   
    if (this.form.valid) {
      this.router.navigate(['/datiPersonali']);
    } else {
      this.alertMessage = true;
      this.alertText = 'Compila tutti i campi obbligatori .';
    }
  }

    onSubmitPwd(): void {
   
    if (this.form.valid) {
      this.router.navigate(['/datiPersonali']);
    } else {
      this.alertMessagePwd = true;
      this.alertTextPwd = 'Compila tutti i campi obbligatori per aggiornare la password.';
    }
  }



}

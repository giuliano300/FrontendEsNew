import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { alertName,alertComplName,alertAddress,alertComplAddress,alertProvince, alertState, alertMailDest } from '../../../enviroments/enviroments';

@Component({
  selector: 'app-invio-singolo-raccomandata-4',
  imports: [ReactiveFormsModule, CommonModule, RouterLink,NgbModule],
  templateUrl: './invio-singolo-raccomandata-4.component.html',
  styleUrl: './invio-singolo-raccomandata-4.component.scss'
})
export class InvioSingoloRaccomandata4Component {

  constructor(private router: Router) {}
  alertMessage = false;
  alertText = '';
  
  alertName = alertName;
  alertComplName = alertComplName;
  alertAddress = alertAddress;
  alertComplAddress = alertComplAddress;
  alertProvince = alertProvince;
  alertState = alertState;
  alertMailDest= alertMailDest;




  form = new FormGroup({
    sel_destinatario: new FormControl('', [Validators.required]),
    sel_spedizione: new FormControl('', [Validators.required]),
    nominativo: new FormControl('', [Validators.required, Validators.maxLength(44)]),
    indirizzo: new FormControl('', [Validators.required]),
    cap: new FormControl('', [Validators.required, Validators.maxLength(5)]),
    provincia: new FormControl('', [Validators.required, Validators.maxLength(2)]),
    comp_nominativo: new FormControl('', [Validators.required]),
    comp_indirizzo: new FormControl('', [Validators.required]),
    citta: new FormControl('', [Validators.required]),
    stato: new FormControl('', [Validators.required]),
  });

  onSubmit(): void {
   
    if (this.form.valid) {
      this.router.navigate(['/invioSingoloRaccomandata5']);
    } else {
      this.alertMessage = true;
      this.alertText = 'Compila tutti i campi obbligatori correttamente.';
    }
  }



}

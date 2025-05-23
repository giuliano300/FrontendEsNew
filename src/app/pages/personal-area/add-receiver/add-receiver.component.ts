import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { alertName,alertComplName,alertAddress,alertComplAddress,alertProvince, alertState,infoCodiceFiscale,alertName2 } from '../../../enviroments/enviroments';

@Component({
  selector: 'app-add-receiver',
  imports: [ReactiveFormsModule, CommonModule, NgbModule],
  templateUrl: './add-receiver.component.html',
  styleUrl: './add-receiver.component.scss'
})
export class AddReceiverComponent {
    constructor(private router: Router) {}
    alertMessage = false;
    alertText = '';

    alertName = alertName;
    alertComplName = alertComplName;
    alertAddress = alertAddress;
    alertComplAddress = alertComplAddress;
    alertProvince = alertProvince;
    alertState = alertState;
    infoCodiceFiscale = infoCodiceFiscale;
    alertName2 = alertName2;
    
    form = new FormGroup({
      rag_soc: new FormControl('', [Validators.required]),
      nome: new FormControl('', [Validators.required]),
      cognome: new FormControl('', [Validators.required]),
      indirizzo: new FormControl('', [Validators.required]),
      cap: new FormControl('', [Validators.required, Validators.maxLength(5)]),
      provincia: new FormControl('', [Validators.required, Validators.maxLength(2)]),
      comp_nominativo: new FormControl('', [Validators.required]),
      comp_indirizzo: new FormControl('', [Validators.required]),
      citta: new FormControl('', [Validators.required]),
      stato: new FormControl('', [Validators.required]),
      cod_fisc: new FormControl('', [Validators.required]),
    });


    onSubmit(): void {
    
      if (this.form.valid) {
        this.router.navigate(['/userSenders']);
      } else {
        this.alertMessage = true;
        this.alertText = 'Compila tutti i campi obbligatori correttamente.';
      }
    }
}

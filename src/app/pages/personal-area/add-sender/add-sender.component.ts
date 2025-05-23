import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { alertName,alertComplName,alertAddress,alertComplAddress,alertProvince, alertState } from '../../../enviroments/enviroments';


@Component({
  selector: 'app-add-sender',
  imports: [ReactiveFormsModule, CommonModule, NgbModule],
  templateUrl: './add-sender.component.html',
  styleUrl: './add-sender.component.scss'
})
export class AddSenderComponent {

    constructor(private router: Router) {}
    alertMessage = false;
    alertText = '';

    alertName = alertName;
    alertComplName = alertComplName;
    alertAddress = alertAddress;
    alertComplAddress = alertComplAddress;
    alertProvince = alertProvince;
    alertState = alertState;

    form = new FormGroup({
      nominativo: new FormControl('', [Validators.required, Validators.maxLength(44)]),
      indirizzo: new FormControl('', [Validators.required]),
      cap: new FormControl('', [Validators.required, Validators.maxLength(5)]),
      provincia: new FormControl('', [Validators.required, Validators.maxLength(2)]),
      comp_nominativo: new FormControl('', [Validators.required]),
      comp_indirizzo: new FormControl('', [Validators.required]),
      citta: new FormControl('', [Validators.required]),
      stato: new FormControl('', [Validators.required]),
      telefono: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
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

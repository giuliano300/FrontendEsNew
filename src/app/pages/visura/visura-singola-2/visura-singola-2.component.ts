import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { alertName,alertComplName,alertAddress,alertComplAddress,alertProvince, alertState } from '../../../enviroments/enviroments';
import { FormStorageService } from '../../../services/form-storage.service';
import { secretKey } from '../../../../main';
import * as CryptoJS from 'crypto-js';
import { UserSendersService } from '../../../services/user-senders.service';
import { UserSenders } from '../../../interfaces/UserSenders';
import { Observable, of } from 'rxjs';
import { Comune } from '../../../interfaces/Comune';
import { Users } from '../../../interfaces/Users';

@Component({
  selector: 'app-visura-singola-2',
  imports: [ReactiveFormsModule, CommonModule, RouterLink, NgbModule],
  templateUrl: './visura-singola-2.component.html',
  styleUrl: './visura-singola-2.component.scss'
})
export class VisuraSingola2Component {

  constructor(private router: Router, private userSendersService: UserSendersService,  private formStorage: FormStorageService) {}
  alertMessage = false;
  alertText = '';
  alertName = alertName;
  alertComplName = alertComplName;
  alertAddress = alertAddress;
  alertComplAddress = alertComplAddress;
  alertProvince = alertProvince;
  alertState = alertState;

  userSenders: UserSenders[] = [];

  filteredCAPs: Observable<string[]> = of([]);

  userSender: UserSenders | null = null;

  comuni: Comune[] = [];
  comuniDaCap: Comune[] = [];
  
  user: Users | null  = null;  

  form = new FormGroup({
    sel_mittente: new FormControl(''),
    nominativo: new FormControl('', [Validators.required]),
    comp_nominativo: new FormControl(''),
    email: new FormControl('', [Validators.required]),
    indirizzo: new FormControl('', [Validators.required]),
    comp_indirizzo: new FormControl(''),
    cap: new FormControl('', [Validators.required, Validators.maxLength(5)]),
    provincia: new FormControl('', [Validators.required, Validators.maxLength(2)]),
    citta: new FormControl('', [Validators.required]),
    stato: new FormControl('', [Validators.required]),
    destinatario: new FormControl(true),
    nominativo_ar: new FormControl(''),
    comp_indirizzo_ar: new FormControl(''),
    comp_nominativo_ar: new FormControl(''),
    email_ar: new FormControl(''),
    indirizzo_ar: new FormControl(''),
    cap_ar: new FormControl(''),
    provincia_ar: new FormControl(''),
    citta_ar: new FormControl(''),
    stato_ar: new FormControl('')
  });

  ngOnInit(): void {
    const navigationState = history.state;
    const tipoDestinatario = navigationState.tipoDestinatario;

    const user = localStorage.getItem('user');
    if (!user) {
      this.router.navigate(['/']);
      return;
    }

    this.user! = JSON.parse(user!);


     Promise.all([
          this.formStorage.getForm('step2')
        ])
        .then(([step1]) => {
          const datiDecriptati = JSON.parse(CryptoJS.AES.decrypt(step1, secretKey).toString(CryptoJS.enc.Utf8));
          console.log(datiDecriptati);
    })
      
    // Se è "DestinatarioSI", mostra i campi destinatarioAR
    if (tipoDestinatario === 'SI') {
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

    this. getUserSenders();

  }

  getUserSenders(){
    this.userSendersService.getUserSenders(this.user!.id!)
      .subscribe((data: UserSenders[]) => {
        if (!data || data.length === 0) {
          console.log('Nessun dato disponibile');
        } 
        else 
        {
          this.userSenders = data;
        }
      });
  }


  setFormSenderUser(){
    const selectedValue = this.form.get('sel_mittente')?.value;
    if(selectedValue == "")
      this.removeFields();
    else
      this.getUserSender(parseInt(selectedValue!));
  }  

  removeFields(){
    const fieldsToClear = [
        'nominativo',
        'comp_nominativo',
        'comp_indirizzo',
        'indirizzo',
        'cap',
        'citta',
        'provincia',
        'stato',
        'email'
    ];

    const emptyValues: { [key: string]: string } = {};
    fieldsToClear.forEach(field => emptyValues[field] = '');

    this.form.patchValue(emptyValues);  
  }


  getUserSender(id: number){
    this.userSendersService.getUserSender(id)
      .subscribe((data: UserSenders) => {
        if (!data) {
          console.log('Nessun dato disponibile');
        } 
        else 
        {
          this.userSender = data;
          this.setFormValue(this.userSender);
        }
    });
  }


  setFormValue(u: UserSenders){
    this.form.patchValue({
      nominativo: u.businessName,
      comp_nominativo: u.complementNames,
      indirizzo: u.address,
      comp_indirizzo: u.complementAddress,
      cap: u.zipCode,
      citta: u.city,
      provincia: u.province,
      stato: u.state,
      email: u.email
    });
  }

  setDestinatarioARValidators(active: boolean): void {
    const controls = [
      'nominativo_ar',
      'indirizzo_ar',
      'cap_ar',
      'provincia_ar',
      'citta_ar',
      'stato_ar'
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

    markAllFieldsAsTouched(this.form);
    if (this.form.invalid) {
      checkFormErrors(this.form);
      return;
    }
   
    const mittente = {
      businessName: this.form.value.nominativo,
      complementNames: this.form.value.comp_nominativo,
      address: this.form.value.indirizzo,
      complementAddress: this.form.value.comp_indirizzo,
      zipCode: this.form.value.cap,
      city: this.form.value.citta,
      province: this.form.value.provincia,
      state: this.form.value.stato
    };

    let destinatarioAR = {};
    if(!this.form.value.destinatario){
        destinatarioAR = {
          businessName: this.form.value.nominativo_ar,
          completamentoNominativo: this.form.value.comp_nominativo_ar,
          address: this.form.value.indirizzo_ar,
          complementAddress: this.form.value.comp_indirizzo_ar,
          zipCode: this.form.value.cap_ar,
          city: this.form.value.citta_ar,
          province: this.form.value.provincia_ar,
          state: this.form.value.stato_ar
        };
    }
    else
      destinatarioAR = mittente;

    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(mittente), secretKey).toString();

    this.formStorage.saveForm('mittente', encrypted);

    const encryptedAR = CryptoJS.AES.encrypt(JSON.stringify(destinatarioAR), secretKey).toString();
    this.formStorage.saveForm('destinararioAR', encryptedAR);
   
    this.router.navigate(['/visuraSingola3']);
  } 

}

function checkFormErrors(form: FormGroup | FormArray) {
  Object.keys(form.controls).forEach(field => {
    const control = form.get(field);
    //if (control && control.invalid) {
      //console.warn(`Errore nel campo: ${field}`, control.errors);
    //}

    // Ricorsione se è un gruppo o un array
    if (control instanceof FormGroup || control instanceof FormArray) {
      checkFormErrors(control);
    }
  });
}

function markAllFieldsAsTouched(control: AbstractControl) {
  if (control instanceof FormGroup || control instanceof FormArray) {
    Object.values(control.controls).forEach(ctrl => {
      markAllFieldsAsTouched(ctrl);
    });
  } else {
    control.markAsTouched();
  }
}
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { alertName,alertComplName,alertAddress,alertComplAddress,alertProvince, alertState } from '../../../enviroments/enviroments';
import { UserSenders } from '../../../interfaces/UserSenders';
import { UserSendersService } from '../../../services/user-senders.service';
import { Users } from '../../../interfaces/Users';

// Import Angular Material modules necessari
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

import { Comune } from '../../../interfaces/Comune';
import { filter, map, Observable, of, startWith } from 'rxjs';
import { GlobalServicesService } from '../../../services/global-services.service';
import { FormStorageService } from '../../../services/form-storage.service';
import { secretKey } from '../../../../main';
import * as CryptoJS from 'crypto-js';
import { ProductTypes } from '../../../interfaces/EnumTypes';


@Component({
  selector: 'app-select-sender',
  imports: [ReactiveFormsModule, CommonModule, RouterLink, NgbModule, MatFormFieldModule, MatInputModule, MatAutocompleteModule],
  templateUrl: './select-sender.component.html',
  styleUrl: './select-sender.component.scss'
})
export class SelectSenderComponent {

  constructor(private router: Router, private userSendersService: UserSendersService, 
    private globalServices: GlobalServicesService, private formStorage: FormStorageService) {}
  alertMessage = false;
  alertText = '';

  userSenders: UserSenders[] = [];

  filteredCAPs: Observable<string[]> = of([]);

  userSender: UserSenders | null = null;

  comuni: Comune[] = [];
  comuniDaCap: Comune[] = [];
  
  user: Users | null  = null;

  isOne:boolean = true;
  backLink: string | null = null;
  ffwLink: string | null = null;

  ricevutaDiRitorno: boolean = false;

  alertName = alertName;
  alertComplName = alertComplName;
  alertAddress = alertAddress;
  alertComplAddress = alertComplAddress;
  alertProvince = alertProvince;
  alertState = alertState;

  form = new FormGroup({
    sel_mittente: new FormControl(''),
    nominativo: new FormControl('', [Validators.required, Validators.maxLength(44)]),
    indirizzo: new FormControl('', [Validators.required]),
    cap: new FormControl('', [Validators.required, Validators.maxLength(5)]),
    provincia: new FormControl('', [Validators.required, Validators.maxLength(2)]),
    comp_nominativo: new FormControl(''),
    comp_indirizzo: new FormControl(''),
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
  

  getThisUser(){
    const user = localStorage.getItem('user');
    if (!user) {
      this.router.navigate(['/']);
      return;
    }

    this.user! = JSON.parse(user!);


    //datiDecriptati = {
      //  selLogo: this.form.value.sel_logo,
        //tipoFormato: this.form.value.tipoFormato,
        //tipoColore: this.form.value.tipoColore,
        //tipoStampa: this.form.value.tipoStampa,
        //tipoRicevuta: this.form.value.tipoRicevuta,
        //tipoinvio: localStorage.getItem('sendType'),
        //prodotto: localStorage.getItem('productType'),
        //bollettino:  localStorage.getItem('bulletin'),
      //};

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
        'indirizzo',
        'cap',
        'citta',
        'provincia',
        'stato'
    ];

    const emptyValues: { [key: string]: string } = {};
    fieldsToClear.forEach(field => emptyValues[field] = '');

    this.form.patchValue(emptyValues);  
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
        nominativo_ar: u.businessName
      });
  }

  getComuni(){
    this.globalServices.getComuni()
      .subscribe((data: Comune[]) => {
        if (!data || data.length === 0) {
          console.log('Nessun dato disponibile');
        } 
        else 
        {
          this.comuni = data;
          this.setListOfComuni();
        }
      });
  }

  setProvince(event: Event){
    const v = (event.target as HTMLSelectElement).value;
    const comune = this.comuni.filter(comune =>
          comune.denominazione_ita.startsWith(v!)
    );

    this.form.patchValue({
      provincia: comune[0].sigla_provincia
    });

  }

  setListOfComuni(){

    const capsUnici = Array.from(new Set(this.comuni.map(c => c.cap)));

    this.filteredCAPs = this.form.get('cap')!.valueChanges.pipe(
      startWith(''),
      map(value => value ?? ''), 
      filter((value: string | null): value is string => !!value && value.length >= 2),
      map(value => this._filterCAP(value, capsUnici))
    );
  }

  private _filterCAP(value: string, caps: string[]): string[] {
    const filterValue = value.trim();
    return caps.filter(cap => cap.startsWith(filterValue));
  }

  setInputCityProvince(event: MatAutocompleteSelectedEvent){
     const v = event.option.value;
     if(v){

      this.form.patchValue({
        provincia: ""
      });

      const comune = this.comuni.filter(comune =>
          comune.cap.startsWith(v!)
      );
      
      if(comune.length == 1)
      {
        this.isOne = true;

        this.form.patchValue({
          citta: comune[0].denominazione_ita,
          provincia: comune[0].sigla_provincia,
          stato: "ITALIA"
        });

      }
      else
      {
        this.isOne = false;
        this.comuniDaCap = comune;
        this.form.get('citta')?.setValue('');
     }
     }
  }

  ngOnInit(): void {
    
    Promise.all([
      this.formStorage.getForm('step2')
    ]).then(([step1]) => {
      const datiDecriptati = JSON.parse(CryptoJS.AES.decrypt(step1, secretKey).toString(CryptoJS.enc.Utf8));
      if(datiDecriptati.tipoRicevuta == "SI")
        this.ricevutaDiRitorno = true;

      switch(parseInt(datiDecriptati.prodotto)){
        case ProductTypes.ROL:
          this.backLink = "/invioSingoloRaccomandata2";
          this.ffwLink = "/invioSingoloRaccomandata4";
          break;
        case ProductTypes.LOL:
          this.backLink = "/invioSingoloLettera2";
          this.ffwLink = "/invioSingoloLettera4";
          break;
      }

    });
    

    
    this.getThisUser();

    this. getUserSenders();

    this.getComuni();

    this.form.get('destinatario')?.valueChanges.subscribe((checked) => {
      if (!checked) {
        this.setDestinatarioARValidators(true); // checkbox NON selezionato → attiva i campi AR
      } else {
        this.setDestinatarioARValidators(false); // checkbox selezionato → disattiva i campi AR
      }
    });

    this.form.get('nominativo')?.valueChanges.subscribe(value => {
      this.form.get('nominativo_ar')?.setValue(value, { emitEvent: false });
    });  
    // Applica lo stato iniziale alla creazione
    this.setDestinatarioARValidators(!this.form.get('destinatario')?.value);
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

  setDestinatarioARValidators(active: boolean): void {
    const controls = [
      'nominativo_ar',
      'indirizzo_ar',
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
        if(this.ricevutaDiRitorno)
        {
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
        }

      const encrypted = CryptoJS.AES.encrypt(JSON.stringify(mittente), secretKey).toString();

      this.formStorage.saveForm('mittente', encrypted);

      
      if (Object.keys(destinatarioAR).length > 0){
        const encryptedAR = CryptoJS.AES.encrypt(JSON.stringify(destinatarioAR), secretKey).toString();
        this.formStorage.saveForm('destinararioAR', encryptedAR);
      }

      this.router.navigate([this.ffwLink]);
    } else {
      this.alertMessage = true;
      this.alertText = 'Compila tutti i campi obbligatori correttamente.';
    }
  }

}

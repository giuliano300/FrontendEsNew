import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { alertName,alertComplName,alertAddress,alertComplAddress,alertProvince, alertState, alertMailDest } from '../../../enviroments/enviroments';
import { UserRecipients } from '../../../interfaces/UserRecipients';
import { filter, map, Observable, of, startWith } from 'rxjs';
import { Comune } from '../../../interfaces/Comune';
import { Users } from '../../../interfaces/Users';
import { UserRecipientsService } from '../../../services/user-recipients.service';
import { GlobalServicesService } from '../../../services/global-services.service';
import { FormStorageService } from '../../../services/form-storage.service';
import * as CryptoJS from 'crypto-js';


// Import Angular Material modules necessari
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { productType, secretKey } from '../../../../main';
import { FncUtils } from '../../../fncUtils/fncUtils';

@Component({
  selector: 'app-invio-singolo-raccomandata-4',
  imports: [ReactiveFormsModule, CommonModule, RouterLink, NgbModule, MatFormFieldModule, MatInputModule, MatAutocompleteModule],
  templateUrl: './invio-singolo-raccomandata-4.component.html',
  styleUrl: './invio-singolo-raccomandata-4.component.scss'
})
export class InvioSingoloRaccomandata4Component {

  constructor(private router: Router, 
    private userRecipientService: UserRecipientsService,
    private globalServices: GlobalServicesService, 
    private formStorage: FormStorageService
  ) {}
  alertMessage = false;
  alertText = '';
  
  alertName = alertName;
  alertComplName = alertComplName;
  alertAddress = alertAddress;
  alertComplAddress = alertComplAddress;
  alertProvince = alertProvince;
  alertState = alertState;
  alertMailDest= alertMailDest;

  userRecipients: UserRecipients[] = [];

  userRecipient: UserRecipients | null = null;

  filteredCAPs: Observable<string[]> = of([]);

  comuni: Comune[] = [];
  comuniDaCap: Comune[] = [];
  
  user: Users | null  = null;

  isOne: boolean = true;
  ifItalia: boolean = true;
  form = new FormGroup({
    sel_destinatario: new FormControl('', [Validators.required]),
    sel_spedizione: new FormControl('Italia'),
    nominativo: new FormControl('', [Validators.required, Validators.maxLength(44)]),
    indirizzo: new FormControl('', [Validators.required]),
    cap: new FormControl('', [Validators.required, Validators.maxLength(5)]),
    provincia: new FormControl('', [Validators.required, Validators.maxLength(2)]),
    comp_nominativo: new FormControl(''),
    comp_indirizzo: new FormControl(''),
    citta: new FormControl('', [Validators.required]),
    stato: new FormControl('', [Validators.required]),
    email: new FormControl(''),
    addRecipient: new FormControl('')
  });

  onStatoChange(event: Event) {
    this.ifItalia = (event.target as HTMLSelectElement).value === 'Italia';
  }

  getUserRecipient(id: number){
    this.userRecipientService.getUserRecipient(id)
      .subscribe((data: UserRecipients) => {
        if (!data) {
          console.log('Nessun dato disponibile');
        } 
        else 
        {
          this.userRecipient = data;
          this.setFormValue(this.userRecipient);
        }
    });
  }

  setFormValue(u: UserRecipients){
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

  getThisUser(){
    const user = localStorage.getItem('user');
      if (!user) {
        this.router.navigate(['/']);
        return;
      }

      this.user! = JSON.parse(user!);
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

  getUserRecipients(){
    this.userRecipientService.getUserRecipients(this.user!.id!)
      .subscribe((data: UserRecipients[]) => {
        if (!data || data.length === 0) {
          console.log('Nessun dato disponibile');
        } 
        else 
        {
          this.userRecipients = data;
        }
      });
  }
  
  setFormRecipientUser(){
    const selectedValue = this.form.get('sel_destinatario')?.value;
    if(selectedValue == "")
      this.removeFields();
    else
      this.getUserRecipient(parseInt(selectedValue!));
  }

    removeFields(){
    const fieldsToClear = [
        'nominativo',
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


  ngOnInit(): void {

    this.getThisUser();

    this.getUserRecipients();

    this.getComuni();
  }

  onSubmit(): void {

    const destinatario = {
      businessName: this.form.value.nominativo!,
      complementName: this.form.value.comp_nominativo!,
      address: this.form.value.indirizzo!,
      complementAddress: this.form.value.comp_indirizzo!,
      zipCode: this.form.value.cap!,
      city: this.form.value.citta!,
      province: this.form.value.provincia!,
      state: this.form.value.stato!,
      email: this.form.value.email!,
      fileName: null,
      tempGuid: FncUtils.generateGuid(),
      userId: this.user!.id!,
      userParentId: this.user!.parentId!
    };

    const destinatari = [];
    destinatari.push(destinatario);
  
    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(destinatari), secretKey).toString();
    this.formStorage.saveForm('destinatari', encrypted);
  
    if (this.form.valid) {

      if(this.form.value.addRecipient)
        this.userRecipientService.setUserRecipient(destinatario!).subscribe(data => {
          this.router.navigate(['/invioSingoloRaccomandata5']);
        });
      else
        this.router.navigate(['/invioSingoloRaccomandata5']);


    } else {
      this.alertMessage = true;
      this.alertText = 'Compila tutti i campi obbligatori correttamente.';
    }
  }

}

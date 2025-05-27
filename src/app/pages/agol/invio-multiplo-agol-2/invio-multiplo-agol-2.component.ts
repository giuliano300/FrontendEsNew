import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { bulletin, secretKey } from '../../../../main';
import { UserLogos } from '../../../interfaces/UserLogos';
import { Users } from '../../../interfaces/Users';
import { UserLogosService } from '../../../services/user-logos.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { alertName,alertComplName,alertAddress,alertComplAddress,alertProvince, alertState } from '../../../enviroments/enviroments';
import { UserSenders } from '../../../interfaces/UserSenders';
import { Comune } from '../../../interfaces/Comune';
import { UserSendersService } from '../../../services/user-senders.service';
import { GlobalServicesService } from '../../../services/global-services.service';
import { FormStorageService } from '../../../services/form-storage.service';
import { filter, map, Observable, of, startWith } from 'rxjs';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-invio-multiplo-agol-2',
  imports: [ReactiveFormsModule, CommonModule, RouterLink, NgbModule, MatAutocompleteModule],
  templateUrl: './invio-multiplo-agol-2.component.html',
  styleUrl: './invio-multiplo-agol-2.component.scss'
})
export class InvioMultiploAgol2Component {

  constructor(private router: Router, 
      private userSendersService: UserSendersService, 
      private userLogosService: UserLogosService, 
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

  //FILTRO CAP
  filteredCAPs: Observable<string[]> = of([]);
  comuni: Comune[] = [];
  comuniDaCap: Comune[] = [];
  isOne:boolean = true;


  bulletin: string | null = "senza bollettino";

  userLogos: UserLogos[] =[];
  userSenders: UserSenders[] =[];
  userSender: UserSenders | null = null;

  user: Users | null  = null;

form = new FormGroup({
  sel_logo: new FormControl(''),
  sel_mittente: new FormControl('', [Validators.required]),
  tipoFormato: new FormControl('', [Validators.required]),
  tipoColore: new FormControl('', [Validators.required]),
  tipoStampa: new FormControl('', [Validators.required]),
  tipoNotificante: new FormControl(''),
  nomeNotificante: new FormControl(''),
  nominativo_ar: new FormControl('', [Validators.required]),
  indirizzo_ar: new FormControl('', [Validators.required]),
  comp_nominativo_ar: new FormControl('', [Validators.required]),
  comp_indirizzo_ar: new FormControl('', [Validators.required]),
  cap_ar: new FormControl('', [Validators.required]),
  provincia_ar: new FormControl('', [Validators.required]),
  citta_ar: new FormControl('', [Validators.required]),
  stato_ar: new FormControl('', [Validators.required])
});

  ngOnInit() {
    const user = localStorage.getItem('user');
      if (!user) {
        this.router.navigate(['/']);
        return;
      }

    this.user! = JSON.parse(user!);
    
    const bul = localStorage.getItem('bulletin')!;
    if(parseInt(bul) == bulletin.si)
      this.bulletin = "con bollettino";

    this.getUserLogos();
    this.getUserSenders();
    this.getComuni();
  }

  getUserLogos(){
    this.userLogosService.getUserLogos(this.user!.id!)
    .subscribe((data: UserLogos[]) => {
      if (!data || data.length === 0) {
        console.log('Nessun dato disponibile');
      } 
      else 
      {
        this.userLogos = data;
      }
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
       provincia_ar: comune[0].sigla_provincia
     });
 
   }
 
   setListOfComuni(){
 
     const capsUnici = Array.from(new Set(this.comuni.map(c => c.cap)));
 
     this.filteredCAPs = this.form.get('cap_ar')!.valueChanges.pipe(
       startWith(''),
       map(value => value ?? ''), 
       filter((value: string | null): value is string => !!value && value.length >= 2),
       map(value => this._filterCAP(value, capsUnici))
     );

    console.log("attivo");

   }
 
   private _filterCAP(value: string, caps: string[]): string[] {
     const filterValue = value.trim();
     return caps.filter(cap => cap.startsWith(filterValue));
   }
 
   setInputCityProvince(event: MatAutocompleteSelectedEvent){
      const v = event.option.value;
      if(v){
 
       this.form.patchValue({
         provincia_ar: ""
       });
 
       const comune = this.comuni.filter(comune =>
           comune.cap.startsWith(v!)
       );
       
       if(comune.length == 1)
       {
         this.isOne = true;
 
         this.form.patchValue({
           citta_ar: comune[0].denominazione_ita,
           provincia_ar: comune[0].sigla_provincia,
           stato_ar: "ITALIA"
         });
 
       }
       else
       {
         this.isOne = false;
         this.comuniDaCap = comune;
         this.form.get('citta_ar')?.setValue('');
      }
      }
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

  getUserSender(id: number){
    this.userSendersService.getUserSender(id)
      .subscribe((data: UserSenders) => {
        if (!data) {
          console.log('Nessun dato disponibile');
        } 
        else 
        {
          this.userSender = data;
          this.form.get('nominativo_ar')?.setValue(this.userSender!.businessName);
        }
    });
  }

  setFormSenderUser(){
    this.removeErroMessage();
    const selectedValue = this.form.get('sel_mittente')?.value;
    if(selectedValue == "")
      this.form.get('nominativo_ar')?.setValue('');
    else
      this.getUserSender(parseInt(selectedValue!));
  }


  onSubmit(): void {
    const errors: string[] = [];

    const sel_mittente = this.form.value.sel_mittente;
    const tipoFormato = this.form.value.tipoFormato;
    const tipoColore = this.form.value.tipoColore;
    const tipoStampa = this.form.value.tipoStampa;
    const tipoNotificante = this.form.value.tipoNotificante;
    const nomeNotificante = this.form.value.nomeNotificante;
    const nominativo_ar = this.form.value.nominativo_ar;
    const indirizzo_ar = this.form.value.indirizzo_ar;
    const cap_ar = this.form.value.cap_ar;
    const provincia_ar = this.form.value.provincia_ar;
    const comp_nominativo_ar = this.form.value.comp_nominativo_ar;
    const comp_indirizzo_ar = this.form.value.comp_indirizzo_ar;
    const citta_ar = this.form.value.citta_ar;
    const stato_ar = this.form.value.stato_ar;
    

    // Costruisce lista errori se manca qualcosa
    if (!sel_mittente) errors.push('Mittente');
    if (!tipoFormato) errors.push('Formato');
    if (!tipoColore) errors.push('Colore');
    if (!tipoStampa) errors.push('Tipo stampa');
    if (!nominativo_ar) errors.push('Nominativo');
    if (!indirizzo_ar) errors.push('Indirizzo');
    if (!cap_ar) errors.push('Cap');
    if (!citta_ar) errors.push('Città');
    if (!provincia_ar) errors.push('Provincia');
    if (!stato_ar) errors.push('Stato');

    if(tipoNotificante != "")
      if (!nomeNotificante) errors.push('Nome notificante');


    if (errors.length > 0) {
      this.alertText = `${errors.join(', ')}.`;
      this.alertMessage = true;
      return;
    }


    const datiForm = {
      selLogo: this.form.value.sel_logo,
      tipoFormato: this.form.value.tipoFormato,
      tipoColore: this.form.value.tipoColore,
      tipoStampa: this.form.value.tipoStampa,
      tipoNotificante: this.form.value.tipoNotificante,
      nomeNotificante: this.form.value.nomeNotificante,
      tipoinvio: localStorage.getItem('sendType'),
      prodotto: localStorage.getItem('productType'),
      bollettino:  localStorage.getItem('bulletin'),
    };

    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(datiForm), secretKey).toString();

    this.formStorage.saveForm('step2', encrypted);

    
    const mittente = this.userSender!;
    const encryptedMittente = CryptoJS.AES.encrypt(JSON.stringify(mittente), secretKey).toString();
    this.formStorage.saveForm('mittente', encryptedMittente);

    const destinatarioAR = {
      businessName: nominativo_ar,
      completamentoNominativo: comp_nominativo_ar,
      address: indirizzo_ar,
      complementAddress: comp_indirizzo_ar,
      zipCode: cap_ar,
      city: citta_ar,
      province: provincia_ar,
      state: stato_ar
    };

    const encryptedAR = CryptoJS.AES.encrypt(JSON.stringify(destinatarioAR), secretKey).toString();
    this.formStorage.saveForm('destinararioAR', encryptedAR);
    
    // Se tutti sono presenti, vai alla pagina
    this.router.navigate(['/invioMultiploAgol3']);
  }

  removeErroMessage(): void {
    this.alertMessage = false;
    this.alertText = '';
  }


}

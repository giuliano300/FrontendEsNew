import { AppTourService } from '@app/services/app-tour.service';
import { AppStorageService } from '@app/services/app-storage.service';
import { UiTourRestartComponent, UiAlertComponent } from '@app/shared/ui';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import {  bulletin, secretKey  } from '@app/config/app-constants';
import { UserLogos } from '../../../interfaces/UserLogos';
import { UserLogosService } from '../../../services/user-logos.service';
import { Users } from '../../../interfaces/Users';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { alertName,alertComplName,alertAddress,alertComplAddress,alertProvince, alertState, alertMailDest } from '../../../enviroments/enviroments';
import { FormStorageService } from '../../../services/form-storage.service';
import { UserSendersService } from '../../../services/user-senders.service';
import { UserSenders } from '../../../interfaces/UserSenders';
import { CryptoJS } from '@app/utils/crypto';
import { filter, map, Observable, of, startWith } from 'rxjs';
import { Comune } from '../../../interfaces/Comune';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { GlobalServicesService } from '../../../services/global-services.service';
import { ShepherdService } from 'angular-shepherd';
import { Placement as PopperPlacement } from '@popperjs/core';
import { TourPage } from '../../../interfaces/EnumTypes';
import { TourSeen } from '../../../interfaces/TourSeen';



@Component({
  selector: 'app-invio-multiplo-raccomandata-2',
  imports: [UiAlertComponent, UiTourRestartComponent, ReactiveFormsModule, CommonModule, RouterLink, NgbModule, MatAutocompleteModule],
  templateUrl: './invio-multiplo-raccomandata-2.component.html',
  styleUrl: './invio-multiplo-raccomandata-2.component.scss'
})
export class InvioMultiploRaccomandata2Component {
  
  
  private appTour = inject(AppTourService);
private appStorage = inject(AppStorageService);
constructor(
    private router: Router, 
    private userSendersService: UserSendersService, 
    private userLogosService: UserLogosService, 
    private globalServices: GlobalServicesService,     
    private formStorage: FormStorageService,
    private shepherdService: ShepherdService
    ) {}

  page: number = TourPage.raccomandataMultipla2;

  alertMessage = false;
  alertText = '';
  
  alertName = alertName;
  alertComplName = alertComplName;
  alertAddress = alertAddress;
  alertComplAddress = alertComplAddress;
  alertProvince = alertProvince;
  alertState = alertState;
  alertMailDest = alertMailDest;

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
    tipoFormato: new FormControl('A4', [Validators.required]),
    tipoColore: new FormControl('', [Validators.required]),
    tipoStampa: new FormControl('', [Validators.required]),
    tipoRicevuta: new FormControl('', [Validators.required]),

    // campi AR, inizialmente senza required
    nominativo_ar: new FormControl(''),
    indirizzo_ar: new FormControl(''),
    cap_ar: new FormControl(''),
    provincia_ar: new FormControl(''),
    comp_nominativo_ar: new FormControl(''),
    comp_indirizzo_ar: new FormControl(''),
    citta_ar: new FormControl(''),
    stato_ar: new FormControl('')
  });


   getComuni(){
     this.globalServices.getComuni()
       .subscribe((data: Comune[]) => {
         if (!data || data.length === 0) {
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


  ngOnInit() {
    const user = this.appStorage.getItem('user');
      if (!user) {
        this.router.navigate(['/']);
        return;
      }

    this.user! = JSON.parse(user!);
    
    this.form.get('tipoRicevuta')?.valueChanges.subscribe(value => {
      if (value === 'SI') {
        this.enableARValidators();
      } else {
        this.disableARValidators();
      }
      
    });
    const bul = this.appStorage.getItem('bulletin')!;
      if(parseInt(bul) == bulletin.si)
        this.bulletin = "con bollettino";

    this.getUserLogos();
    this.getUserSenders();
    this.getComuni();

    this.getTourInThisPage();
  }

  getUserLogos(){
    this.userLogosService.getUserLogos(this.user!.id!)
    .subscribe((data: UserLogos[]) => {
      if (!data || data.length === 0) {
      } 
      else 
      {
        this.userLogos = data;
      }
    });
  }

enableARValidators() {
  this.form.get('nominativo_ar')?.setValidators([Validators.required, Validators.maxLength(44)]);
  this.form.get('indirizzo_ar')?.setValidators([Validators.required]);
  this.form.get('cap_ar')?.setValidators([Validators.required, Validators.maxLength(5)]);
  this.form.get('provincia_ar')?.setValidators([Validators.required, Validators.maxLength(2)]);
  this.form.get('citta_ar')?.setValidators([Validators.required]);
  this.form.get('stato_ar')?.setValidators([Validators.required]);

  // aggiorna lo stato di validità
  this.form.get('nominativo_ar')?.updateValueAndValidity();
  this.form.get('indirizzo_ar')?.updateValueAndValidity();
  this.form.get('cap_ar')?.updateValueAndValidity();
  this.form.get('provincia_ar')?.updateValueAndValidity();
  this.form.get('citta_ar')?.updateValueAndValidity();
  this.form.get('stato_ar')?.updateValueAndValidity();
}

disableARValidators() {
  // rimuove i validators e resetta i campi
  ['nominativo_ar', 'indirizzo_ar', 'cap_ar', 'provincia_ar', 'citta_ar', 'stato_ar'].forEach(field => {
    const control = this.form.get(field);
    control?.clearValidators();
    control?.updateValueAndValidity();
  });
}

selectMittente(){
  const senderId = this.form.value.sel_mittente;
}

onSubmit(): void {
      const errors: string[] = [];

      const selLogo = this.form.value.sel_logo;
      const selMittente = this.form.value.sel_mittente;
      const tipoFormato = this.form.value.tipoFormato;
      const tipoColore = this.form.value.tipoColore;
      const tipoStampa = this.form.value.tipoStampa;
      const tipoRicevuta = this.form.value.tipoRicevuta;

      // Costruisce lista errori se manca qualcosa
      if (!selMittente) errors.push('Mittente');
      if (!tipoFormato) errors.push('Formato');
      if (!tipoColore) errors.push('Colore');
      if (!tipoStampa) errors.push('Stampa');
      if (!tipoRicevuta) errors.push('Ricevuta');

      if (tipoRicevuta === 'SI') {
        const requiredARFields = [
          { key: 'nominativo_ar', label: 'Nominativo AR' },
          { key: 'indirizzo_ar', label: 'Indirizzo AR' },
          { key: 'cap_ar', label: 'CAP AR' },
          { key: 'provincia_ar', label: 'Provincia AR' },
          { key: 'citta_ar', label: 'Città AR' },
          { key: 'stato_ar', label: 'Stato AR' },
        ];
        
        requiredARFields.forEach(field => {
          if (!this.form.get(field.key)?.value) {
            errors.push(field.label);
          }
        });
      }

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
        tipoRicevuta: this.form.value.tipoRicevuta,
        tipoinvio: this.appStorage.getItem('sendType'),
        prodotto: this.appStorage.getItem('productType'),
        bollettino:  this.appStorage.getItem('bulletin'),
      };

      const encryptedStep2 = CryptoJS.AES.encrypt(JSON.stringify(datiForm), secretKey).toString();

      this.formStorage.saveForm('step2', encryptedStep2);

      const mittente = this.userSender!;

      let destinatarioAR = {};
      if(this.form.value.tipoRicevuta === "SI")
      {
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

    const encryptedMittente = CryptoJS.AES.encrypt(JSON.stringify(mittente), secretKey).toString();

    this.formStorage.saveForm('mittente', encryptedMittente);

    
    if (Object.keys(destinatarioAR).length > 0){
      const encryptedAR = CryptoJS.AES.encrypt(JSON.stringify(destinatarioAR), secretKey).toString();
      this.formStorage.saveForm('destinararioAR', encryptedAR);
    }
      

      // Se tutti sono presenti, vai alla pagina
      this.router.navigate(['/invioMultiploRaccomandata3']);
  }

    removeErroMessage(): void {
      this.alertMessage = false;
      this.alertText = '';
    }

  startTour() {
    const steps = [
      {
        id: 'multipleraccomandata',
        text: "Seleziona un mittente dal menu a tendina.",
        attachTo: {
          element: '.step-1',
          on: 'bottom' as PopperPlacement,
        },
        modalOverlayOpeningPadding: 15, // evidenzia con margine
        modalOverlayOpeningRadius: 5,   // bordo arrotondato
        classes: 'margin-step-y', 
        buttons: [
          { text: 'X Chiudi tour', action: () => this.shepherdService.complete(), classes:"close" },
          { text: 'Avanti', action: () => this.shepherdService.next() }
        ]
      },
      {
        id: 'multipleraccomandata2',
        text: "Seleziona il logo dalla lista.<br>Una volta selezionato apparirà nel frontespizio della tua comunicazione.",
        attachTo: {
          element: '.step-2',
          on: 'bottom' as PopperPlacement,
        },
        modalOverlayOpeningPadding: 15, // evidenzia con margine
        modalOverlayOpeningRadius: 5,   // bordo arrotondato
        classes: 'margin-step-y', 
        buttons: [
          { text: 'X Chiudi tour', action: () => this.shepherdService.complete(), classes:"close" },
          { text: 'Avanti', action: () => this.shepherdService.next() }
        ]
      },
      {
        id: 'multipleraccomandata3',
        text: "Imposta la raccomandata selezionando il formato, la stampa (fronte o fronte/retro) e la ricevuta di ritorno, se desiderata.",
        attachTo: {
          element: '.step-3',
          on: 'bottom' as PopperPlacement,
        },
        modalOverlayOpeningPadding: 15, // evidenzia con margine
        modalOverlayOpeningRadius: 5,   // bordo arrotondato
        classes: 'margin-step-y', 
        buttons: [
          { text: 'X Chiudi tour', action: () => this.shepherdService.complete(), classes:"close" },
          { text: 'Avanti', action: () => this.shepherdService.next() }
        ]
      },
      {
        id: 'multipleraccomandata4',
        text: "Se hai scelto la ricevuta di ritorno compila i campi del destinatario AR.",
        attachTo: {
          element: '.step-4',
          on: 'bottom' as PopperPlacement,
        },
        modalOverlayOpeningPadding: 15, // evidenzia con margine
        modalOverlayOpeningRadius: 5,   // bordo arrotondato
        classes: 'margin-step-y', 
        buttons: [
          { text: 'X Chiudi tour', action: () => this.shepherdService.complete(), classes:"close" },
          { text: 'Avanti', action: () => this.shepherdService.next() }
        ]
      },
      {
        id: 'multipleraccomandataend',
        text: "Clicca su <strong>'AVANTI'</strong> per continuare, oppure su <strong>'INDIETRO'</strong> per tornare allo step precedente.",
        attachTo: {
          element: '.step-end',
          on: 'bottom' as PopperPlacement,
        },
        modalOverlayOpeningPadding: 15, // evidenzia con margine
        modalOverlayOpeningRadius: 5,   // bordo arrotondato
        classes: 'margin-step-y', 
        buttons: [
          { text: 'Fine', action: () => this.shepherdService.complete() }
        ]
      }
    ];
    this.appTour.start(this.page, steps);

  }

    //COPIARE SENZA TOCCARE
    restartTour(){
      this.startTour();
    }
  
    getTourInThisPage(){
      let userTourPage: TourSeen[] = JSON.parse(this.appStorage.getItem("userTourPage")?.toString() || "[]");
      if(!userTourPage.some(tour => tour.page === this.page))
        this.startTour();
    }
  
    ///////////////////////////


}

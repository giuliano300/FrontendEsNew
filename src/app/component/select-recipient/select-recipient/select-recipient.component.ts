import { AppTourService } from '@app/services/app-tour.service';
import { AppStorageService } from '@app/services/app-storage.service';
import { UiTourRestartComponent, UiAlertComponent } from '@app/shared/ui';
import { Component, DestroyRef, inject } from '@angular/core';
import { UserRecipientsService } from '../../../services/user-recipients.service';
import { GlobalServicesService } from '../../../services/global-services.service';
import { FormStorageService } from '../../../services/form-storage.service';
import { alertAddress, alertComplAddress, alertComplName, alertMailDest, alertName, alertProvince, alertState, alertCron } from '../../../enviroments/enviroments';
import { UserRecipients } from '../../../interfaces/UserRecipients';
import { filter, finalize, map, Observable, of, startWith } from 'rxjs';
import { Comune } from '../../../interfaces/Comune';
import { Users } from '../../../interfaces/Users';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { FncUtils } from '../../../fncUtils/fncUtils';
import {  secretKey  } from '@app/config/app-constants';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CryptoJS } from '@app/utils/crypto';
import { ProductTypes } from '../../../interfaces/EnumTypes';
import { ShepherdService } from 'angular-shepherd';
import { Placement as PopperPlacement } from '@popperjs/core';
import { TourPage } from '../../../interfaces/EnumTypes';
import { TourSeen } from '../../../interfaces/TourSeen';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AddressLookupService, AddressSuggestion } from '../../../services/address-lookup.service';
import { hasInvalidEncodingCharacters, POSTAL_TEXT_PATTERN } from '../../../fncUtils/CheckRecipient';

@Component({
  selector: 'app-select-recipient',
  imports: [UiAlertComponent, UiTourRestartComponent, ReactiveFormsModule, CommonModule, RouterLink, NgbModule, MatFormFieldModule, MatInputModule, MatAutocompleteModule],
  templateUrl: './select-recipient.component.html',
  styleUrl: './select-recipient.component.scss'
})
export class SelectRecipientComponent {
  
  
  private appTour = inject(AppTourService);
  private appStorage = inject(AppStorageService);
  private destroyRef = inject(DestroyRef);
constructor(private router: Router, 
    private userRecipientService: UserRecipientsService,
    private globalServices: GlobalServicesService, 
    private formStorage: FormStorageService,
    private shepherdService: ShepherdService,
    private addressLookupService: AddressLookupService
  ) {}

  page: number = TourPage.selectRecipent;

  alertMessage = false;
  alertText = '';
  
  alertName = alertName;
  alertComplName = alertComplName;
  alertAddress = alertAddress;
  alertComplAddress = alertComplAddress;
  alertProvince = alertProvince;
  alertState = alertState;
  alertMailDest = alertMailDest;
  alertCron = alertCron;

  userRecipients: UserRecipients[] = [];

  userRecipient: UserRecipients | null = null;

  filteredCAPs: Observable<string[]> = of([]);
  addressSuggestions: AddressSuggestion[] = [];
  addressLookupLoading = false;
  addressLookupMessage = '';
  addressLookupSelectionComplete = false;

  comuni: Comune[] = [];
  comuniDaCap: Comune[] = [];
  
  user: Users | null  = null;

  isOne: boolean = true;
  ifItalia: boolean = true;
  isNotAgol: boolean = true;

  backLink: string | null = null;
  ffwLink: string | null = null;

  form = new FormGroup({
    sel_destinatario: new FormControl(''),
    sel_spedizione: new FormControl('Italia'),
    nominativo: new FormControl('', [Validators.required, Validators.maxLength(44), Validators.pattern(POSTAL_TEXT_PATTERN)]),
    indirizzo: new FormControl('', [Validators.required, Validators.pattern(POSTAL_TEXT_PATTERN)]),
    cap: new FormControl('', [Validators.required, Validators.maxLength(5)]),
    provincia: new FormControl('', [Validators.required, Validators.maxLength(2)]),
    comp_nominativo: new FormControl('', [Validators.pattern(POSTAL_TEXT_PATTERN)]),
    comp_indirizzo: new FormControl('', [Validators.pattern(POSTAL_TEXT_PATTERN)]),
    citta: new FormControl('', [Validators.required, Validators.pattern(POSTAL_TEXT_PATTERN)]),
    stato: new FormControl('', [Validators.required, Validators.pattern(POSTAL_TEXT_PATTERN)]),
    email: new FormControl(''),
    addRecipient: new FormControl(''),
    pec: new FormControl(''),
    cron: new FormControl('')
  });

  onStatoChange(event: Event) {
    this.ifItalia = (event.target as HTMLSelectElement).value === 'Italia';
  }

  getUserRecipient(id: number){
    this.userRecipientService.getUserRecipient(id)
      .subscribe((data: UserRecipients) => {
        if (!data) {
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
        email: u.email,
        pec: u.pec,
        cron: u.cron
      });
  }

  getThisUser(){
    const user = this.appStorage.getItem('user');
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
    const comune = this.comuni.find(comune =>
          comune.denominazione_ita === v
    );

    if (!comune) {
      return;
    }

    this.form.patchValue({
      provincia: comune.sigla_provincia,
      stato: "ITALIA"
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

  lookupAddress(): void {
    const address = this.form.controls.indirizzo.value?.trim() || '';
    if (address.length < 4) {
      this.addressSuggestions = [];
      this.addressLookupSelectionComplete = false;
      this.addressLookupMessage = 'Inserisci almeno 4 caratteri dell’indirizzo.';
      return;
    }

    const location = [
      address,
      this.form.controls.cap.value,
      this.form.controls.citta.value
    ].filter(Boolean).join(' ');

    this.addressLookupLoading = true;
    this.addressLookupSelectionComplete = false;
    this.addressLookupMessage = '';
    this.addressSuggestions = [];

    this.addressLookupService.searchItalianAddresses(location, address).pipe(
      finalize(() => this.addressLookupLoading = false),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: suggestions => {
        this.addressSuggestions = suggestions.map(suggestion => this.localizeSuggestionCity(suggestion));
        if (!this.addressSuggestions.length) {
          this.addressLookupMessage = 'Nessun indirizzo trovato. Aggiungi città o CAP alla ricerca.';
        }
      },
      error: () => {
        this.addressLookupMessage = 'Servizio di ricerca momentaneamente non disponibile.';
      }
    });
  }

  private localizeSuggestionCity(suggestion: AddressSuggestion): AddressSuggestion {
    const candidates = this.comuni.filter(comune => comune.cap === suggestion.postcode);
    const normalizedCity = this.normalizeLocationValue(suggestion.city);
    const exactMatch = candidates.find(comune =>
      this.normalizeLocationValue(comune.denominazione_ita) === normalizedCity
      || this.normalizeLocationValue(comune.denominazione_ita_altra) === normalizedCity
    );
    const distinctCities = Array.from(new Set(candidates.map(comune => comune.denominazione_ita)));
    const cityByPostcode = distinctCities.length === 1 ? distinctCities[0] : undefined;
    const localizedCity = exactMatch?.denominazione_ita
      || cityByPostcode
      || this.translateCommonCityName(suggestion.city);

    if (!localizedCity || localizedCity === suggestion.city) return suggestion;

    return {
      ...suggestion,
      city: localizedCity,
      displayName: [suggestion.address, suggestion.postcode, localizedCity].filter(Boolean).join(', ')
    };
  }

  private translateCommonCityName(city: string): string {
    const translations: Record<string, string> = {
      ROME: 'Roma',
      FLORENCE: 'Firenze',
      MILAN: 'Milano',
      TURIN: 'Torino',
      NAPLES: 'Napoli',
      VENICE: 'Venezia',
      GENOA: 'Genova',
      PADUA: 'Padova'
    };
    return translations[this.normalizeLocationValue(city)] || city;
  }

  setAddressSuggestion(suggestion: AddressSuggestion): void {
    if (!suggestion?.address) return;

    const enteredAddress = this.form.controls.indirizzo.value?.trim();
    const enteredHouseNumber = this.extractHouseNumber(enteredAddress || '');
    const civicVerified = !!enteredHouseNumber
      && this.normalizeLocationValue(enteredHouseNumber) === this.normalizeLocationValue(suggestion.houseNumber);
    const addressToUse = suggestion.houseNumber
      ? suggestion.address
      : [suggestion.address, enteredHouseNumber].filter(Boolean).join(' ');
    const matchingComuni = this.comuni.filter(comune => comune.cap === suggestion.postcode);
    const normalizedCity = this.normalizeLocationValue(suggestion.city);
    const matchingComune = matchingComuni.find(comune =>
      this.normalizeLocationValue(comune.denominazione_ita) === normalizedCity
      || this.normalizeLocationValue(comune.denominazione_ita_altra) === normalizedCity
    ) ?? (matchingComuni.length === 1 ? matchingComuni[0] : undefined);

    this.isOne = true;
    this.form.patchValue({
      indirizzo: addressToUse,
      cap: suggestion.postcode,
      citta: matchingComune?.denominazione_ita || suggestion.city,
      provincia: matchingComune?.sigla_provincia || '',
      stato: 'ITALIA'
    });
    this.addressSuggestions = [];
    this.addressLookupSelectionComplete = true;
    const selectedLocation = [
      suggestion.postcode,
      matchingComune?.denominazione_ita || suggestion.city,
      matchingComune?.sigla_provincia ? `(${matchingComune.sigla_provincia})` : ''
    ].filter(Boolean).join(' ');
    this.addressLookupMessage = civicVerified
      ? `Selezionato: ${selectedLocation}. Civico verificato.`
      : `Selezionato: ${selectedLocation}.`;
  }

  private extractHouseNumber(address: string): string {
    const matches = address.match(/\b\d+[a-z]?(?:[\/-][a-z0-9]+)?\b/gi) ?? [];
    const possibleHouseNumbers = matches.filter(value => !/^\d{5}$/.test(value));
    return possibleHouseNumbers.at(-1) ?? '';
  }

  private normalizeLocationValue(value: string): string {
    return (value ?? '')
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[\u2018\u2019`\u00b4]/g, "'")
      .replace(/\s+/g, ' ')
      .toUpperCase();
  }

  getUserRecipients(){
    this.userRecipientService.getUserRecipients(this.user!.id!)
      .subscribe((data: UserRecipients[]) => {
        if (!data || data.length === 0) {
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
        'email',
        'pec'
    ];

    const emptyValues: { [key: string]: string } = {};
    fieldsToClear.forEach(field => emptyValues[field] = '');

    this.form.patchValue(emptyValues);  
  }


  ngOnInit(): void {
    
    Promise.all([
      this.formStorage.getForm('step2')
    ]).then(([step1]) => {
      const datiDecriptati = JSON.parse(CryptoJS.AES.decrypt(step1, secretKey).toString(CryptoJS.enc.Utf8));

      switch(parseInt(datiDecriptati.prodotto)){
        case ProductTypes.ROL:
          this.backLink = "/invioSingoloRaccomandata3";
          this.ffwLink = "/invioSingoloRaccomandata5";
          break;
        case ProductTypes.LOL:
          this.backLink = "/invioSingoloLettera3";
          this.ffwLink = "/invioSingoloLettera5";
          break;
        case ProductTypes.AGOL:
          this.backLink = "/invioSingoloAgol3";
          this.ffwLink = "/invioSingoloAgol5";
          this.isNotAgol = false;
          break;
        case ProductTypes.TOL:
          this.backLink = "/invioTelegramma2";
          this.ffwLink = "/invioTelegramma4";
          break;
      }

    });
    this.getThisUser();

    this.getUserRecipients();

    this.getComuni();

    this.getTourInThisPage();
  }

  onSubmit(): void {

    const labels: Record<string, string> = {
      nominativo: 'Nominativo',
      comp_nominativo: 'Completamento nominativo',
      indirizzo: 'Indirizzo',
      comp_indirizzo: 'Completamento indirizzo',
      cap: 'CAP',
      provincia: 'Provincia',
      citta: 'Città',
      stato: 'Stato',
      email: 'Email',
      pec: 'PEC',
      cron: 'Cron'
    };
    const campiConCodificaNonValida = Object.keys(this.form.controls)
      .filter(key => hasInvalidEncodingCharacters(this.form.get(key)?.value))
      .map(key => labels[key] ?? key);

    if (campiConCodificaNonValida.length) {
      this.alertMessage = true;
      this.alertText = 'Caratteri non ammessi (�, Ã o Â) nei seguenti campi: ' + campiConCodificaNonValida.join(', ');
      return;
    }

    if (this.form.valid) {

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
        userParentId: this.user!.parentId!,
        pec: this.form.value.pec!,
        cron: this.form.value.cron!
      };

      const destinatari = [];
      destinatari.push(destinatario);

      const encrypted = CryptoJS.AES.encrypt(
        JSON.stringify(destinatari),
        secretKey
      ).toString();

      this.formStorage.saveForm('destinatari', encrypted);

      if (this.form.value.addRecipient) {
        this.userRecipientService
          .setUserRecipient(destinatario)
          .subscribe(() => {
            this.router.navigate([this.ffwLink]);
          });
      } else {
        this.router.navigate([this.ffwLink]);
      }

    } else {

      this.form.markAllAsTouched();

      const campiMancanti = Object.keys(this.form.controls)
        .filter(key => this.form.get(key)?.invalid)
        .map(key => labels[key])
        .filter(label => label);

      const campiConCaratteriSpeciali = Object.keys(this.form.controls)
        .filter(key => this.form.get(key)?.hasError('pattern'))
        .map(key => labels[key])
        .filter(label => label);

      this.alertMessage = true;
      this.alertText = campiConCaratteriSpeciali.length
        ? 'Rimuovi i caratteri speciali non ammessi dai seguenti campi: ' + campiConCaratteriSpeciali.join(', ')
        : 'Compila i seguenti campi obbligatori: ' + campiMancanti.join(', ');
    }
  }

  startTour() {
    const steps = [
      {
        id: 'singleraccomandata',
        text: "Seleziona un destinarario dal menu a tendina.",
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
        id: 'singleraccomandata2',
        text: "Scegli se spedire in Italia o all'estero",
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
        id: 'singleraccomandata3',
        text: "Se non hai un destinatario in rubrica, inseriscilo manualmente compilando tutti i campi.",
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
        id: 'singleraccomandata3',
        text: "Clicca su <strong>'AVANTI'</strong> per continuare, oppure su <strong>'INDIETRO'</strong> per tornare allo step precedente.",
        attachTo: {
          element: '.step-end',
          on: 'top' as PopperPlacement,
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

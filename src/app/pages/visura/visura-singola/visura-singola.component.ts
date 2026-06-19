import { AppTourService } from '@app/services/app-tour.service';
import { AppStorageService } from '@app/services/app-storage.service';
import { UiTourRestartComponent, UiAlertComponent } from '@app/shared/ui';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { FormStorageService } from '../../../services/form-storage.service';
import {  secretKey, sendType  } from '@app/config/app-constants';
import { ProductTypes } from '../../../interfaces/EnumTypes';
import { CryptoJS } from '@app/utils/crypto';
import { ShepherdService } from 'angular-shepherd';
import { Placement as PopperPlacement } from '@popperjs/core';
import { TourPage } from '../../../interfaces/EnumTypes';
import { TourSeen } from '../../../interfaces/TourSeen';

@Component({
  selector: 'app-visura-singola',
  imports: [UiAlertComponent, UiTourRestartComponent, ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './visura-singola.component.html',
  styleUrl: './visura-singola.component.scss'
})
export class VisuraSingolaComponent {

  
  
  private appTour = inject(AppTourService);
private appStorage = inject(AppStorageService);
constructor(private router: Router, private formStorage: FormStorageService, private shepherdService: ShepherdService) {}
  alertMessage = false;
  alertText = '';

  page: number = TourPage.visuraSingola1;



form = new FormGroup({
  sel_documento: new FormControl('', [Validators.required]),
  tipoRichiesta: new FormControl('', [Validators.required]),
  tipoDestinatario: new FormControl('', [Validators.required]),
});


visuraOptions = [
  { value: '5', label: 'Bilancio completo (BICM)' },
  { value: '6', label: 'Fascicolo completo (FASC)' },
  { value: '7', label: 'Ricerca protesti (RIPR)' },
  { value: '8', label: 'Scheda persona (SCPE)' },
  { value: '9', label: 'Scheda socio (SCSC)' },
  { value: '10', label: 'Scheda società (SCSO)' },
  { value: '12', label: 'Trasferimenti di azienda (TRSF)' },
  { value: '13', label: 'Visura ordinaria (VISO)' },
  { value: '14', label: 'Visura storica (VISS)' },
];

certificatoOptions = [
  { value: '0', label: 'Certificato Artigiano (CART)' },
  { value: '1', label: 'Certificato Ordinario Sintetico (CRIA)' },
  { value: '2', label: 'Certificato Ordinario (CRIM)' },
  { value: '3', label: 'Certificato Storico (CRIS)' },
  { value: '11', label: 'Dichiarazione Sostitutiva (SOST)' },
];

filteredOptions: { value: string, label: string }[] = [];

ngOnInit() {

  this.form.get('tipoRichiesta')?.valueChanges.subscribe(value => {
  this.form.get('sel_documento')?.setValue(''); // <-- importante: imposta la select al valore vuoto

      if (value === 'Visura') {
        this.filteredOptions = this.visuraOptions;
      } else if (value === 'Certificato') {
        this.filteredOptions = this.certificatoOptions;
      } else {
        this.filteredOptions = [];
      }
  });

  this.getTourInThisPage();
}



onSubmit(): void {
  const errors: string[] = [];

  const sel_documento = this.form.value.sel_documento;
  const tipoRichiesta = this.form.value.tipoRichiesta;
  const tipoDestinatario = this.form.value.tipoDestinatario;

  // Costruisce lista errori se manca qualcosa
  if (!tipoRichiesta) errors.push('Tipo richiesta');
  if (!sel_documento) {errors.push('Tipo documento');}
  if (!tipoDestinatario) errors.push('Destinatario diverso');


  if (errors.length > 0) {
    this.alertText = `${errors.join(', ')}.`;
    this.alertMessage = true;
    return;
  }

    const datiForm = {
      selLogo: 0,
      tipoFormato: 0,
      tipoColore: 0,
      tipoStampa: 0,
      tipoRicevuta: 0,
      tipoinvio: sendType.singolo,
      prodotto: ProductTypes.VOL,
      bollettino: 0,
      tipoRichiesta: tipoRichiesta,
      sel_documento: sel_documento,
      tipoDestinatario: tipoDestinatario
    };
  
    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(datiForm), secretKey).toString();
  
    this.formStorage.saveForm('step2', encrypted);
  

  // Se tutti sono presenti, vai alla pagina
    this.router.navigate(['/visuraSingola2'], 
    {
      state: { tipoDestinatario: tipoDestinatario }
    });

}

removeErroMessage(): void {
  this.alertMessage = false;
  this.alertText = '';
}

  startTour() {
      const steps = [
        {
          id: 'visura1',
          text: 'Seleziona se richiedere una <strong>visura</strong> o un <strong>certificato</strong>, scegli il tipo di documento e indica se desideri inviarlo a un destinatario diverso dal richiedente.',
          attachTo: {
            element: '.step-1',
            on: 'bottom' as PopperPlacement
          },
          modalOverlayOpeningPadding: 14,
          modalOverlayOpeningRadius: 5,
          classes: 'margin-step-y', 
          buttons: [
            { text: 'X Chiudi tour', action: () => this.shepherdService.complete(), classes:"close" },
            { text: 'Avanti', action: () => this.shepherdService.next() }
          ]
        },
      {
        id: 'visuraend',
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
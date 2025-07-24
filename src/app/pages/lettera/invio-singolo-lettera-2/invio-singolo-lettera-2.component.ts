import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { bulletin, secretKey } from '../../../../main';
import { UserLogos } from '../../../interfaces/UserLogos';
import { Users } from '../../../interfaces/Users';
import { UserLogosService } from '../../../services/user-logos.service';
import { FormStorageService } from '../../../services/form-storage.service';
import * as CryptoJS from 'crypto-js';
import { ShepherdService } from 'angular-shepherd';
import { Placement as PopperPlacement } from '@popperjs/core';
import { TourPage } from '../../../interfaces/EnumTypes';
import { TourSeen } from '../../../interfaces/TourSeen';
import { TourSeenService } from '../../../services/tourSeen.service';


@Component({
  selector: 'app-invio-singolo-lettera-2',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './invio-singolo-lettera-2.component.html',
  styleUrl: './invio-singolo-lettera-2.component.scss'
})
export class InvioSingoloLettera2Component {

  bulletin: string | null = "senza bollettino";
  constructor(private router: Router,  
    private userLogosService: UserLogosService,
    private formStorage: FormStorageService,
    private shepherdService: ShepherdService, 
    private tourService: TourSeenService
  ) {}

  page: number = TourPage.letteraSingola2;

  alertMessage = false;
  alertText = '';

  userLogos: UserLogos[] =[];

  user: Users | null  = null;


form = new FormGroup({
  sel_logo: new FormControl(''),
  tipoFormato: new FormControl('', [Validators.required]),
  tipoColore: new FormControl('', [Validators.required]),
  tipoStampa: new FormControl('', [Validators.required]),
  tipoLettera: new FormControl('', [Validators.required])
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

  this.getTourInThisPage();
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


onSubmit(): void {
  const errors: string[] = [];

  const tipoFormato = this.form.value.tipoFormato;
  const tipoColore = this.form.value.tipoColore;
  const tipoStampa = this.form.value.tipoStampa;
  const tipoLettera = this.form.value.tipoLettera;

  // Costruisce lista errori se manca qualcosa
  if (!tipoFormato) errors.push('Formato');
  if (!tipoLettera) errors.push('Tipo lettera');
  if (!tipoColore) errors.push('Colore');
  if (!tipoStampa) errors.push('Stampa');

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
      tipoRicevuta: false,
      tipoinvio: localStorage.getItem('sendType'),
      prodotto: localStorage.getItem('productType'),
      bollettino:  localStorage.getItem('bulletin'),
      tipoLettera: this.form.value.tipoLettera
    };

    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(datiForm), secretKey).toString();

    this.formStorage.saveForm('step2', encrypted);


  // Se tutti sono presenti, vai alla pagina
  this.router.navigate(['/invioSingoloLettera3']);
}

removeErroMessage(): void {
  this.alertMessage = false;
  this.alertText = '';
}

  startTour() {
    const steps = [
      {
        id: 'singlelettera',
        text: "Seleziona il logo dalla lista.<br>Una volta selezionato apparirà nel frontespizio della tua comunicazione.",
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
        id: 'singlelettera2',
        text: "Imposta la lettera selezionando il formato, la stampa (fronte o fronte/retro) e il tipo lettera (P1 o P4).",
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
        id: 'singleletteraend',
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

    // Abilita il dark overlay
    this.shepherdService.modal = true;

    // Opzioni di default per tutti gli step
    this.shepherdService.defaultStepOptions = {
      scrollTo: true,
      cancelIcon: { enabled: true },
      classes: 'shepherd-theme-arrows'
    };

    // Carica e avvia il tour
    this.shepherdService.addSteps(steps);

    // Ritarda il primo step
    setTimeout(() => {
      this.shepherdService.start();
      this.completeTour();
    }, 300);

  }

    //COPIARE SENZA TOCCARE
    restartTour(){
      this.startTour();
    }
    
    completeTour()
    {
      this.shepherdService.tourObject?.on('complete', () => {
        this.tourService.setTourSeen(this.page).subscribe();
      });
    }
  
    getTourInThisPage(){
      let userTourPage: TourSeen[] = JSON.parse(localStorage.getItem("userTourPage")?.toString() || "[]");
      if(!userTourPage.some(tour => tour.page === this.page))
        this.startTour();
    }
  
    ///////////////////////////


}

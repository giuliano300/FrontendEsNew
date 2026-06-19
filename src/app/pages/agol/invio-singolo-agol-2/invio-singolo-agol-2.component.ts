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
import { Users } from '../../../interfaces/Users';
import { UserLogosService } from '../../../services/user-logos.service';
import { FormStorageService } from '../../../services/form-storage.service';
import { CryptoJS } from '@app/utils/crypto';
import { ShepherdService } from 'angular-shepherd';
import { Placement as PopperPlacement } from '@popperjs/core';
import { TourPage } from '../../../interfaces/EnumTypes';
import { TourSeen } from '../../../interfaces/TourSeen';

@Component({
  selector: 'app-invio-singolo-agol-2',
  imports: [UiAlertComponent, UiTourRestartComponent, ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './invio-singolo-agol-2.component.html',
  styleUrl: './invio-singolo-agol-2.component.scss'
})
export class InvioSingoloAgol2Component {

  
  
  private appTour = inject(AppTourService);
private appStorage = inject(AppStorageService);
bulletin: string | null = "senza bollettino";
  constructor(
    private router: Router,  
    private userLogosService: UserLogosService, 
    private formStorage: FormStorageService,
    private shepherdService: ShepherdService

  ) {}

  page: number = TourPage.agolSingolo2;

  alertMessage = false;
  alertText = '';

  userLogos: UserLogos[] =[];

  user: Users | null  = null;


form = new FormGroup({
  sel_logo: new FormControl(''),
  tipoFormato: new FormControl('A4', [Validators.required]),
  tipoColore: new FormControl('', [Validators.required]),
  tipoStampa: new FormControl('', [Validators.required]),
  tipoNotificante: new FormControl('', [Validators.required]),
  nomeNotificante: new FormControl('', [Validators.required])
});

ngOnInit() {
  const user = this.appStorage.getItem('user');
    if (!user) {
      this.router.navigate(['/']);
      return;
    }

  this.user! = JSON.parse(user!);
  
  const bul = this.appStorage.getItem('bulletin')!;
  if(parseInt(bul) == bulletin.si)
    this.bulletin = "con bollettino";

  this.getUserLogos();
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


onSubmit(): void {
  const errors: string[] = [];

  const tipoFormato = this.form.value.tipoFormato;
  const tipoColore = this.form.value.tipoColore;
  const tipoStampa = this.form.value.tipoStampa;
  const tipoNotificante = this.form.value.tipoNotificante;
  const nomeNotificante = this.form.value.nomeNotificante;

  // Costruisce lista errori se manca qualcosa
  if (!tipoFormato) errors.push('Formato');
  if (!tipoColore) errors.push('Colore');
  if (!tipoStampa) errors.push('Stampa');
  //if (!tipoNotificante) errors.push('Tipo notificante');
  //if (!nomeNotificante) errors.push('Nome notificante');
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
    tipoinvio: this.appStorage.getItem('sendType'),
    prodotto: this.appStorage.getItem('productType'),
    bollettino:  this.appStorage.getItem('bulletin'),
    tipoRicevuta: "SI"
  };

  const encrypted = CryptoJS.AES.encrypt(JSON.stringify(datiForm), secretKey).toString();

  this.formStorage.saveForm('step2', encrypted);

  // Se tutti sono presenti, vai alla pagina
  this.router.navigate(['/invioSingoloAgol3']);
}

removeErroMessage(): void {
  this.alertMessage = false;
  this.alertText = '';
}

  startTour() {
    const steps = [
      {
        id: 'singleagol1',
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
        id: 'singleagol2',
        text: "Imposta l'Agol selezionando il formato, la stampa (fronte o fronte/retro) e la tipologia del notificante.",
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
        id: 'singleagolend',
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

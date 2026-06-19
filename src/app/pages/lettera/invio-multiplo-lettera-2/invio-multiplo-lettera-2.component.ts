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
import { UserSendersService } from '../../../services/user-senders.service';
import { GlobalServicesService } from '../../../services/global-services.service';
import { FormStorageService } from '../../../services/form-storage.service';
import { alertAddress, alertComplAddress, alertComplName, alertMailDest, alertName, alertProvince, alertState } from '../../../enviroments/enviroments';
import { Observable, of } from 'rxjs';
import { Comune } from '../../../interfaces/Comune';
import { UserSenders } from '../../../interfaces/UserSenders';
import { CryptoJS } from '@app/utils/crypto';
import { ShepherdService } from 'angular-shepherd';
import { Placement as PopperPlacement } from '@popperjs/core';
import { TourPage } from '../../../interfaces/EnumTypes';
import { TourSeen } from '../../../interfaces/TourSeen';


@Component({
  selector: 'app-invio-multiplo-lettera-2',
  imports: [UiAlertComponent, UiTourRestartComponent, ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './invio-multiplo-lettera-2.component.html',
  styleUrl: './invio-multiplo-lettera-2.component.scss'
})
export class InvioMultiploLettera2Component {
  
  
  private appTour = inject(AppTourService);
private appStorage = inject(AppStorageService);
constructor(private router: Router, 
      private userSendersService: UserSendersService, 
      private userLogosService: UserLogosService, 
      private globalServices: GlobalServicesService,     
      private formStorage: FormStorageService,
      private shepherdService: ShepherdService
) {}

    page: number = TourPage.letteraMultipla2;
      
    alertMessage = false;
    alertText = '';

    alertName = alertName;
    alertComplName = alertComplName;
    alertAddress = alertAddress;
    alertComplAddress = alertComplAddress;
    alertProvince = alertProvince;
    alertState = alertState;
    alertMailDest= alertMailDest;

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
    tipoLettera: new FormControl('Posta4', [Validators.required]),

  });

  ngOnInit() {
    this.getTourInThisPage();

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
      this.getUserSenders();
      
  }

  setFormSenderUser(){
    this.removeErroMessage();
    const selectedValue = this.form.get('sel_mittente')?.value;
    if(selectedValue != "")
      this.getUserSender(parseInt(selectedValue!));
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
        }
    });
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

      const selMittente = this.form.value.sel_mittente;
      const tipoFormato = this.form.value.tipoFormato;
      const tipoColore = this.form.value.tipoColore;
      const tipoStampa = this.form.value.tipoStampa;
      const tipoLettera = this.form.value.tipoLettera;

      // Costruisce lista errori se manca qualcosa
      if (!selMittente) errors.push('Mittente');
      if (!tipoFormato) errors.push('Formato');
      if (!tipoColore) errors.push('Colore');
      if (!tipoStampa) errors.push('Stampa');
      if (!tipoLettera) errors.push('Tipo Lettera');

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
        tipoLettera: this.form.value.tipoLettera,
        tipoinvio: this.appStorage.getItem('sendType'),
        prodotto: this.appStorage.getItem('productType'),
        bollettino:  this.appStorage.getItem('bulletin'),
      };

      const encryptedStep2 = CryptoJS.AES.encrypt(JSON.stringify(datiForm), secretKey).toString();

      this.formStorage.saveForm('step2', encryptedStep2);

      const mittente = this.userSender!;

    const encryptedMittente = CryptoJS.AES.encrypt(JSON.stringify(mittente), secretKey).toString();

    this.formStorage.saveForm('mittente', encryptedMittente);

    
      // Se tutti sono presenti, vai alla pagina
      this.router.navigate(['/invioMultiploLettera3']);
  }

    removeErroMessage(): void {
      this.alertMessage = false;
      this.alertText = '';
    }

  startTour() {
    const steps = [
      {
        id: 'multiplelettera',
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
        id: 'multipleletter2',
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
        id: 'multipleletter3',
        text: "Imposta la lettera selezionando il formato, la stampa (fronte o fronte/retro) e il tipo lettera (P1 o P4).",
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
        id: 'multipleletteraend',
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

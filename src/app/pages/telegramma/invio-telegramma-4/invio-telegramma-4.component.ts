import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { FormStorageService } from '../../../services/form-storage.service';
import { secretKey } from '../../../../main';
import * as CryptoJS from 'crypto-js';
import { ShepherdService } from 'angular-shepherd';
import { Placement as PopperPlacement } from '@popperjs/core';
import { TourPage } from '../../../interfaces/EnumTypes';
import { TourSeen } from '../../../interfaces/TourSeen';
import { TourSeenService } from '../../../services/tourSeen.service';

@Component({
  selector: 'app-invio-telegramma-4',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './invio-telegramma-4.component.html',
  styleUrl: './invio-telegramma-4.component.scss'
})
export class InvioTelegramma4Component {
  constructor(
    private router: Router, 
    private formStorage: FormStorageService,
    private shepherdService: ShepherdService, 
    private tourService: TourSeenService
  ) {}  
  rr: string = "Con ";
    alertMessage = false;
    alertText = '';

  form = new FormGroup({
    messaggio: new FormControl('', [Validators.required]),
  });

  page: number = TourPage.telegramma4;

  ngOnInit(): void {
    Promise.all([
          this.formStorage.getForm('step2')
        ])
        .then(([step1]) => {
          const datiDecriptati = JSON.parse(CryptoJS.AES.decrypt(step1, secretKey).toString(CryptoJS.enc.Utf8));
          if(!parseInt(datiDecriptati.rrTelegramma))
            this.rr = "Senza ";
    })

    this.getTourInThisPage();
  }

  onSubmit(): void {
   
    if (this.form.valid) {

        const msgObject = {
          message: this.form.value.messaggio!
        };
      
        const msgObjectEnc = CryptoJS.AES.encrypt(JSON.stringify(msgObject), secretKey).toString();
        this.formStorage.saveForm('messaggioTelegramma', msgObjectEnc);
 
        let Inviitotali = {
          numeroInvii: 1,
          numeroPagineTotali: [0]
        };

        const encryptedInvii = CryptoJS.AES.encrypt(JSON.stringify(Inviitotali), secretKey).toString();
        this.formStorage.saveForm("invii-totali", encryptedInvii);      

      this.router.navigate(['/calcoloPreventivo']);
    } else {
      this.alertMessage = true;
      this.alertText = 'Scrivi un messaggio.';
    }
  }

      startTour() {
      const steps = [
        {
          id: 'telegramma',
          text: "Scrivi il messaggio del tuo telegramma nell'area di testo.",
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
          id: 'telegrammaend',
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

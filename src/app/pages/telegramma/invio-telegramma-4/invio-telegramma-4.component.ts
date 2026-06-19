import { AppTourService } from '@app/services/app-tour.service';
import { AppStorageService } from '@app/services/app-storage.service';
import { UiTourRestartComponent, UiAlertComponent } from '@app/shared/ui';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { FormStorageService } from '../../../services/form-storage.service';
import {  secretKey  } from '@app/config/app-constants';
import { CryptoJS } from '@app/utils/crypto';
import { ShepherdService } from 'angular-shepherd';
import { Placement as PopperPlacement } from '@popperjs/core';
import { TourPage } from '../../../interfaces/EnumTypes';
import { TourSeen } from '../../../interfaces/TourSeen';

@Component({
  selector: 'app-invio-telegramma-4',
  imports: [UiAlertComponent, UiTourRestartComponent, ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './invio-telegramma-4.component.html',
  styleUrl: './invio-telegramma-4.component.scss'
})
export class InvioTelegramma4Component {
  
  
  private appTour = inject(AppTourService);
private appStorage = inject(AppStorageService);
constructor(
    private router: Router, 
    private formStorage: FormStorageService,
    private shepherdService: ShepherdService
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
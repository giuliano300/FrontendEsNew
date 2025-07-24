import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { FncUtils } from '../../../fncUtils/fncUtils';
import { secretKey } from '../../../../main';
import { FormStorageService } from '../../../services/form-storage.service';
import { Users } from '../../../interfaces/Users';
import * as CryptoJS from 'crypto-js';
import { ShepherdService } from 'angular-shepherd';
import { Placement as PopperPlacement } from '@popperjs/core';
import { TourPage } from '../../../interfaces/EnumTypes';
import { TourSeen } from '../../../interfaces/TourSeen';
import { TourSeenService } from '../../../services/tourSeen.service';

@Component({
  selector: 'app-visura-singola-3',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './visura-singola-3.component.html',
  styleUrl: './visura-singola-3.component.scss'
})
export class VisuraSingola3Component {

    constructor(private router: Router, private formStorage: FormStorageService, private shepherdService: ShepherdService, private tourService: TourSeenService) {}

    page: number = TourPage.visuraSingola3;

    alertMessage = false;
    alertText = '';

  user: Users | null = null;

  form = new FormGroup({
    piva: new FormControl('', [Validators.required]),
    nominativo: new FormControl('', [Validators.required]),
    cciaa: new FormControl('', [Validators.required]),
    numero_rea: new FormControl('', [Validators.required]),
  });

  ngOnInit(): void {
    const navigationState = history.state;
    const tipoDestinatario = navigationState.tipoDestinatario;

    const user = localStorage.getItem('user');
    if (!user) {
      this.router.navigate(['/']);
      return;
    }

    this.user! = JSON.parse(user!);

    this.getTourInThisPage();
  }

  onSubmit(): void {
    if (this.form.valid) {

      const destinatario = {
        businessName: this.form.value.nominativo!,
        vat: this.form.value.piva,
        cciaa: this.form.value.cciaa,
        reaNumber: this.form.value.numero_rea,
        address: "-",
        zipCode: "0000",
        city: "-",
        province: "-",
        state: "-",
        email: "-",
        fileName: null,
        tempGuid: FncUtils.generateGuid(),
        userId: this.user!.id!,
        userParentId: this.user!.parentId!,
      };
  
      const destinatari = [];
      destinatari.push(destinatario);
    
      const encrypted = CryptoJS.AES.encrypt(JSON.stringify(destinatari), secretKey).toString();
      this.formStorage.saveForm('destinatari', encrypted);

      let Inviitotali = {
        numeroInvii: 1,
        numeroPagineTotali: 0
      };

      const encryptedInvii = CryptoJS.AES.encrypt(JSON.stringify(Inviitotali), secretKey).toString();
      this.formStorage.saveForm("invii-totali", encryptedInvii);
      
        
      this.router.navigate(['/calcoloPreventivo']);
    } 
    else 
    {
      this.alertMessage = true;
      this.alertText = 'Compila tutti i campi obbligatori correttamente.';
    }
  }

    startTour() {
      const steps = [
        {
          id: 'visura1',
          text: "Compila i campi del form per inserire i dati dell'intestatario",
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

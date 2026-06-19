import { AppTourService } from '@app/services/app-tour.service';
import { AppStorageService } from '@app/services/app-storage.service';
import { UiTourRestartComponent, UiAlertComponent } from '@app/shared/ui';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { FncUtils } from '../../../fncUtils/fncUtils';
import {  secretKey  } from '@app/config/app-constants';
import { FormStorageService } from '../../../services/form-storage.service';
import { Users } from '../../../interfaces/Users';
import { CryptoJS } from '@app/utils/crypto';
import { ShepherdService } from 'angular-shepherd';
import { Placement as PopperPlacement } from '@popperjs/core';
import { TourPage } from '../../../interfaces/EnumTypes';
import { TourSeen } from '../../../interfaces/TourSeen';

@Component({
  selector: 'app-visura-singola-3',
  imports: [UiAlertComponent, UiTourRestartComponent, ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './visura-singola-3.component.html',
  styleUrl: './visura-singola-3.component.scss'
})
export class VisuraSingola3Component {

    
  
  private appTour = inject(AppTourService);
private appStorage = inject(AppStorageService);
constructor(private router: Router, private formStorage: FormStorageService, private shepherdService: ShepherdService) {}

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
    const navigationState = history.state ?? {};
    const tipoDestinatario = navigationState?.tipoDestinatario;

    const user = this.appStorage.getItem('user');
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
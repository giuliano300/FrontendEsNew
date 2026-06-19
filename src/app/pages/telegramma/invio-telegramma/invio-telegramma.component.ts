import { AppTourService } from '@app/services/app-tour.service';
import { AppStorageService } from '@app/services/app-storage.service';
import { UiTourRestartComponent, UiAlertComponent } from '@app/shared/ui';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { ProductTypes } from '../../../interfaces/EnumTypes';
import { FormStorageService } from '../../../services/form-storage.service';
import {  secretKey  } from '@app/config/app-constants';
import { CryptoJS } from '@app/utils/crypto';
import { ShepherdService } from 'angular-shepherd';
import { Placement as PopperPlacement } from '@popperjs/core';
import { TourPage } from '../../../interfaces/EnumTypes';
import { TourSeen } from '../../../interfaces/TourSeen';



@Component({
  selector: 'app-invio-telegramma',
  imports: [UiAlertComponent, UiTourRestartComponent, ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './invio-telegramma.component.html',
  styleUrl: './invio-telegramma.component.scss'
})
export class InvioTelegrammaComponent {

  
  
  private appTour = inject(AppTourService);
private appStorage = inject(AppStorageService);
constructor(private router: Router,
    private formStorage: FormStorageService,
    private shepherdService: ShepherdService
  ) {}

  page: number = TourPage.telegramma1;

  alertMessage = false;
  alertText = '';



form = new FormGroup({
  ricevutaRitorno: new FormControl('', [Validators.required])
});


onSubmit(): void {
  const errors: string[] = [];

  const ricevutaRitorno = this.form.value.ricevutaRitorno;

  // Costruisce lista errori se manca qualcosa
  if (!ricevutaRitorno) errors.push('Ricevuta di ritorno');

  if (errors.length > 0) {
    this.alertText = `${errors.join(', ')}.`;
    this.alertMessage = true;
    return;
  }

  // Se tutti sono presenti, vai alla pagina

  const datiDecriptati = {
    prodotto: ProductTypes.TOL,
    tipoRicevuta:  ricevutaRitorno!.toString() ? "SI" : "NO"
  };

  const encryptedAR = CryptoJS.AES.encrypt(JSON.stringify(datiDecriptati), secretKey).toString();
  this.formStorage.saveForm('step2', encryptedAR);

  this.router.navigate(['/invioTelegramma2']);
}

removeErroMessage(): void {
  this.alertMessage = false;
  this.alertText = '';
}


    ngOnInit() {
      this.getTourInThisPage();
    }

    startTour() {
      const steps = [
        {
          id: 'telegramma',
          text: 'Specificare se si desidera la ricevuta di ritorno del telegramma.',
          attachTo: {
            element: '.step-1',
            on: 'bottom' as PopperPlacement
          },
          modalOverlayOpeningPadding: 14,
          modalOverlayOpeningRadius: 5,
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
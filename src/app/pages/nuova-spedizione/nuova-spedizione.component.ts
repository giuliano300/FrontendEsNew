import { AppTourService } from '@app/services/app-tour.service';
import { AppStorageService } from '@app/services/app-storage.service';
import { UiTourRestartComponent } from '@app/shared/ui';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormStorageService } from '../../services/form-storage.service';
import { ShepherdService } from 'angular-shepherd';
import { Placement as PopperPlacement } from '@popperjs/core';
import { TourPage } from '../../interfaces/EnumTypes';
import { TourSeen } from '../../interfaces/TourSeen';


@Component({
  selector: 'app-nuova-spedizione',
  imports: [UiTourRestartComponent, RouterLink],
  templateUrl: './nuova-spedizione.component.html',
  styleUrl: './nuova-spedizione.component.scss'
})
export class NuovaSpedizioneComponent {
    
  
  private appTour = inject(AppTourService);
private appStorage = inject(AppStorageService);
constructor(private formStorage: FormStorageService, private shepherdService: ShepherdService) {}
    
    page: number = TourPage.nuovaSpedizione;
    
    ngOnInit() {
        this.formStorage.clearAll();

        this.getTourInThisPage();
    }


    startTour() {
    const steps = [
      {
        id: 'nuovaspedizione',
        text: 'Scegli il prodotto postale e invia la tua corrispondenza',
        attachTo: {
          element: '.step-1',
          on: 'right' as PopperPlacement,
        },
        modalOverlayOpeningPadding: 15, // evidenzia con margine
        modalOverlayOpeningRadius: 5,   // bordo arrotondato
        classes: 'margin-step-x', 
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
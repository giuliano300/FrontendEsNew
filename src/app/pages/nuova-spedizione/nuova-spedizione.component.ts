import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormStorageService } from '../../services/form-storage.service';
import { ShepherdService } from 'angular-shepherd';
import { Placement as PopperPlacement } from '@popperjs/core';


@Component({
  selector: 'app-nuova-spedizione',
  imports: [RouterLink],
  templateUrl: './nuova-spedizione.component.html',
  styleUrl: './nuova-spedizione.component.scss'
})
export class NuovaSpedizioneComponent {
    constructor(private formStorage: FormStorageService, private shepherdService: ShepherdService ) {}
    
    
    ngOnInit() {
        this.formStorage.clearAll();

        //if(!localStorage.getItem("tour")){
          this.startTour();
          //localStorage.setItem("tour", "true");
        //}
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
    }, 300);

  }

}

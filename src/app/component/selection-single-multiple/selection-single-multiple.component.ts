import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ProductTypes } from '../../interfaces/EnumTypes';
import { ShepherdService } from 'angular-shepherd';
import { Placement as PopperPlacement } from '@popperjs/core';
import { TourPage } from '../../interfaces/EnumTypes';
import { TourSeen } from '../../interfaces/TourSeen';
import { TourSeenService } from '../../services/tourSeen.service';


@Component({
  selector: 'app-selection-single-multiple',
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './selection-single-multiple.component.html',
  styleUrl: './selection-single-multiple.component.scss'
})
export class SelectionSingleMultipleComponent {

  constructor(private router: Router, private shepherdService: ShepherdService, private tourService: TourSeenService) {}

  page: number = TourPage.sigleMultiple;

  alertMessage = false;

  @Input() tipoProdotto!: number; 


  navigationSingolo: string | null = null;
  navigationMultiplo: string | null = null;

  form = new FormGroup({
    tipoInvio: new FormControl('', [Validators.required])
  });

  ngOnInit(): void{
    this.getTourInThisPage();
  }

  onSubmit(): void {
    if (this.form.valid) {
      const tipoInvio = this.form.value.tipoInvio;

      switch(this.tipoProdotto){
        case ProductTypes.ROL:
          this.navigationSingolo = '/invioSingoloRaccomandata';
          this.navigationMultiplo = '/invioMultiploRaccomandata';
          break;
          case ProductTypes.LOL:
            this.navigationSingolo = '/invioSingoloLettera';
            this.navigationMultiplo = '/invioMultiploLettera';
            break;
            case ProductTypes.AGOL:
              this.navigationSingolo = '/invioSingoloAgol';
              this.navigationMultiplo = '/invioMultiploAgol';
              break;
          default:
            this.navigationSingolo = '/not-found';
            this.navigationMultiplo = '/not-found';
            break;
      }

      if (tipoInvio === 'invio-singolo') {
        this.router.navigate([this.navigationSingolo]);
      } 
      
      if (tipoInvio === 'invio-multiplo') {
        this.router.navigate([this.navigationMultiplo]);
      }
    }
    else
      this.alertMessage = true;
  }

  removeErroMessage(){
    this.alertMessage = false;
  }

  startTour() {
    const steps = [
      {
        id: 'singlemultiple',
        text: 'Scegli il tipo di invio: <strong>singolo o multiplo</strong>.',
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
        id: 'singlemultiple2',
        text: "Clicca su <strong>'AVANTI'</strong> per continuare, oppure su <strong>'INDIETRO'</strong> per tornare allo step precedente.",
        attachTo: {
          element: '.step-2',
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

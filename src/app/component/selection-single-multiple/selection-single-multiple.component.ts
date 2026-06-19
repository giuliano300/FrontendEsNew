import { AppTourService } from '@app/services/app-tour.service';
import { AppStorageService } from '@app/services/app-storage.service';
import { UiTourRestartComponent, UiAlertComponent } from '@app/shared/ui';
import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ProductTypes } from '../../interfaces/EnumTypes';
import { ShepherdService } from 'angular-shepherd';
import { Placement as PopperPlacement } from '@popperjs/core';
import { TourPage } from '../../interfaces/EnumTypes';
import { TourSeen } from '../../interfaces/TourSeen';


@Component({
  selector: 'app-selection-single-multiple',
  imports: [UiAlertComponent, UiTourRestartComponent, RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './selection-single-multiple.component.html',
  styleUrl: './selection-single-multiple.component.scss'
})
export class SelectionSingleMultipleComponent {

  
  
  private appTour = inject(AppTourService);
private appStorage = inject(AppStorageService);
constructor(private router: Router, private shepherdService: ShepherdService) {}

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
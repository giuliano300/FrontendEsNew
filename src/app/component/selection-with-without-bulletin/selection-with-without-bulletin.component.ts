import { AppTourService } from '@app/services/app-tour.service';
import { AppStorageService } from '@app/services/app-storage.service';
import { UiTourRestartComponent, UiAlertComponent } from '@app/shared/ui';
import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {  sendType  } from '@app/config/app-constants';
import { ProductTypes } from '../../interfaces/EnumTypes';
import { ShepherdService } from 'angular-shepherd';
import { Placement as PopperPlacement } from '@popperjs/core';
import { TourPage } from '../../interfaces/EnumTypes';
import { TourSeen } from '../../interfaces/TourSeen';



@Component({
  selector: 'app-selection-with-without-bulletin',
  imports: [UiAlertComponent, UiTourRestartComponent, ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './selection-with-without-bulletin.component.html',
  styleUrl: './selection-with-without-bulletin.component.scss'
})
export class SelectionWithWithoutBulletinComponent {

  
  
  private appTour = inject(AppTourService);
private appStorage = inject(AppStorageService);
constructor(private router: Router, private shepherdService: ShepherdService){}

  page: number = TourPage.withWithoutBulletin;

  @Input() tipoInvio!: number; 

  navigation: string | null = null;

  sType: string | null = "";

  alertMessage = false;

  form = new FormGroup({
    tipoDocumento: new FormControl('', [Validators.required])
  });

  ngOnInit(): void{
    const sendTypes = this.appStorage.getItem("sendType");
    this.sType = sendType[parseInt(sendTypes!)];

    this.getTourInThisPage();

  }

  onSubmit(): void {
    if (this.form.valid) {
      this.appStorage.setItem('bulletin', this.form.value.tipoDocumento!);

      const tipoProdotto = parseInt(this.appStorage.getItem("productType")!);

      switch(tipoProdotto){
        case ProductTypes.ROL:
          switch(this.tipoInvio){
            case sendType.mutiplo:
              this.navigation = "/invioMultiploRaccomandata2";
              break;
            case sendType.singolo:
              this.navigation = "/invioSingoloRaccomandata2";
              break;
            default:
              this.navigation = "/not-found";
              break;
          }
          break;
          case ProductTypes.LOL:
            switch(this.tipoInvio){
              case sendType.mutiplo:
                this.navigation = "/invioMultiploLettera2";
                break;
              case sendType.singolo:
                this.navigation = "/invioSingoloLettera2";
                break;
              default:
                this.navigation = "/not-found";
                break;
            }
            break;
            case ProductTypes.AGOL:
              switch(this.tipoInvio){
                case sendType.mutiplo:
                  this.navigation = "/invioMultiploAgol2";
                  break;
                case sendType.singolo:
                  this.navigation = "/invioSingoloAgol2";
                  break;
                default:
                  this.navigation = "/not-found";
                  break;
              }
              break;
          default:
          this.navigation = "/not-found";
          break;
    }

      this.router.navigate([this.navigation]);
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
        text: "Scegli se includere il bollettino nell'invio.",
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
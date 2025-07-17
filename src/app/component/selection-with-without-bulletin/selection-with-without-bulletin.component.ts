import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { sendType } from '../../../main';
import { ProductTypes } from '../../interfaces/EnumTypes';
import { ShepherdService } from 'angular-shepherd';
import { Placement as PopperPlacement } from '@popperjs/core';


@Component({
  selector: 'app-selection-with-without-bulletin',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './selection-with-without-bulletin.component.html',
  styleUrl: './selection-with-without-bulletin.component.scss'
})
export class SelectionWithWithoutBulletinComponent {

  constructor(private router: Router, private shepherdService: ShepherdService){}

  @Input() tipoInvio!: number; 

  navigation: string | null = null;

  sType: string | null = "";

  alertMessage = false;

  form = new FormGroup({
    tipoDocumento: new FormControl('', [Validators.required])
  });

  ngOnInit(): void{
    const sendTypes = localStorage.getItem("sendType");
    this.sType = sendType[parseInt(sendTypes!)];

    //if(!localStorage.getItem("tour")){
      this.startTour();
      //localStorage.setItem("tour", "true");
    //}

  }

  onSubmit(): void {
    if (this.form.valid) {
      localStorage.setItem('bulletin', this.form.value.tipoDocumento!);

      const tipoProdotto = parseInt(localStorage.getItem("productType")!);

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


}

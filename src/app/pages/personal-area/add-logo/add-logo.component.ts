import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { alertLogo } from '../../../enviroments/enviroments';
import { UserLogosService } from '../../../services/user-logos.service';
import { UserLogos } from '../../../interfaces/UserLogos';
import { Users } from '../../../interfaces/Users';
import { ShepherdService } from 'angular-shepherd';
import { Placement as PopperPlacement } from '@popperjs/core';
import { TourPage } from '../../../interfaces/EnumTypes';
import { TourSeen } from '../../../interfaces/TourSeen';
import { TourSeenService } from '../../../services/tourSeen.service';


@Component({
  selector: 'app-add-logo',
  imports: [ReactiveFormsModule, CommonModule, NgbModule],
  templateUrl: './add-logo.component.html',
  styleUrl: './add-logo.component.scss'
})
export class AddLogoComponent {
    constructor(private router: Router, private userLogosService: UserLogosService, private shepherdService: ShepherdService, private tourService: TourSeenService) {}

    page: number = TourPage.addLogo;

    alertMessage = false;
    alertText = '';

    alertLogo = alertLogo;

    user: Users | null = null;

    @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
    
    form = new FormGroup({
      name: new FormControl('', [Validators.required]),
      logo: new FormControl('', [Validators.required]),
    });

    ngOnInit(): void {
      const user = localStorage.getItem('user');
      if (!user) {
        this.router.navigate(['/']);
        return;
      }
  
      this.user! = JSON.parse(user!);
      this.getTourInThisPage();
    }


    onSubmit(): void {

      this.alertMessage = false;
      
      const file = this.fileInput.nativeElement.files?.[0];

      if (!file) {
        this.alertMessage = true;
        this.alertText = 'Seleziona un logo prima di inviare.';
        return;
      }

      const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        this.alertMessage = true;
        this.alertText = 'Formato file non supportato.';
        return;
      }

      const reader = new FileReader();
        reader.onload = () => {
          const logoBase64 = reader.result as string;

          const formValues = this.form.value;

          const dataToSend: UserLogos = {
            name: formValues.name!,
            logo: logoBase64,
            userId: this.user!.id!,
            parentUserId: this.user!.parentId!
          };


          this.userLogosService.setUserLogos(dataToSend)
            .subscribe((data: UserLogos) => {
            if (!data) {
              console.log('Nessun dato disponibile');
            } 
            this.router.navigate(['/personalizzazioneCover']);
          });
          
      };

      reader.readAsDataURL(file);
    }

        startTour() {
      const steps = [
        {
          id: 'addLogoend',
          text: "Assegna un nome al logo e carica il tuo file grafico (95mm X 22mm)",
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

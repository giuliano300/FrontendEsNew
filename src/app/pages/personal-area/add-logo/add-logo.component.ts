import { AppTourService } from '@app/services/app-tour.service';
import { AppStorageService } from '@app/services/app-storage.service';
import { UiTourRestartComponent, UiAlertComponent } from '@app/shared/ui';
import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, inject } from '@angular/core';
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


@Component({
  selector: 'app-add-logo',
  imports: [UiAlertComponent, UiTourRestartComponent, ReactiveFormsModule, CommonModule, NgbModule],
  templateUrl: './add-logo.component.html',
  styleUrl: './add-logo.component.scss'
})
export class AddLogoComponent {
    
  
  private appTour = inject(AppTourService);
private appStorage = inject(AppStorageService);
constructor(private router: Router, private userLogosService: UserLogosService, private shepherdService: ShepherdService) {}

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
      const user = this.appStorage.getItem('user');
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

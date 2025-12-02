import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { alertName,alertComplName,alertAddress,alertComplAddress,alertProvince, alertState, inserisciText, modificaText } from '../../../enviroments/enviroments';
import { Users } from '../../../interfaces/Users';
import { UserSendersService } from '../../../services/user-senders.service';
import { UserSenders } from '../../../interfaces/UserSenders';
import { CapitalizePipe } from '../../../fncUtils/CapitalizePipe';
import { ShepherdService } from 'angular-shepherd';
import { Placement as PopperPlacement } from '@popperjs/core';
import { TourPage } from '../../../interfaces/EnumTypes';
import { TourSeen } from '../../../interfaces/TourSeen';
import { TourSeenService } from '../../../services/tourSeen.service';



@Component({
  selector: 'app-add-sender',
  imports: [ReactiveFormsModule, CommonModule, NgbModule, CapitalizePipe],
  templateUrl: './add-sender.component.html',
  styleUrl: './add-sender.component.scss'
})
export class AddSenderComponent {

    form: FormGroup;
    alertMessage = false;
    alertText = '';
    user: Users | null = null;
    inserimento = false;

    alertName = alertName;
    alertComplName = alertComplName;
    alertAddress = alertAddress;
    alertComplAddress = alertComplAddress;
    alertProvince = alertProvince;
    alertState = alertState;
    inserisciModificaText = inserisciText;

    constructor(private router: Router, private fb: FormBuilder, private userSenderService: UserSendersService, private route: ActivatedRoute, private shepherdService: ShepherdService, private tourService: TourSeenService) {
      this.form = this.fb.group({
        businessName: ['', [Validators.required, Validators.maxLength(44)]],
        address: ['', [Validators.required]],
        zipCode: ['', [Validators.required, Validators.maxLength(5)]],
        province: ['', [Validators.required, Validators.maxLength(2)]],
        complementNames: [''],
        complementAddress: [''],
        city: ['', [Validators.required]],
        state: ['', [Validators.required]],
        mobile: [''],
        email: [''],
        id: [''] 
      });
   }

   page: number = TourPage.addSender;

    ngOnInit(): void {
      const user = localStorage.getItem('user');
      if (!user) {
        this.router.navigate(['/']);
        return;
      }
  
      this.user! = JSON.parse(user!);
  
      this.form.patchValue({
        id: 0
      });
  
      this.route.paramMap.subscribe(params => {
        if(!params.get('id')){
          this.form.get('pwd')?.setValidators([Validators.required]);
          this.form.get('pwd')?.updateValueAndValidity();
          this.inserimento = true;
          return;
        }
  
        this.inserisciModificaText = modificaText

        const id = parseInt(params.get('id')!);
          this.userSenderService.getUserSender(id)
          .subscribe((data: UserSenders) => {
          if (!data) {
            console.log("errore nella risposta");
          } 
          else 
            this.form.patchValue({
              businessName: data.businessName || '',
              address: data.address || '',
              zipCode: data.zipCode || '',
              complementNames: data.complementNames || '',
              complementAddress: data.complementAddress || '',
              province: data.province || '',
              city: data.city || '',
              state: data.state || '',
              mobile: data.mobile || '',
              email: data.email || '',
              id: data.id
            });
        });
      });

      this.getTourInThisPage();
  
    }
  
    onSubmit(): void {
    
    if (this.form.valid) {
      const userData = this.form.value;
      userData.id = this.form.value.id;
      userData.userId = this.user!.id!;

      //let x = JSON.stringify(userData);

      if(userData.id == 0)
      {
        this.userSenderService.setUserSender(userData)
          .subscribe((data: UserSenders) => {
          if (!data) {
            console.log('Nessun dato disponibile');
          } 
          this.router.navigate(['/userSenders']);
        });
      }
      else
      {
        this.userSenderService.updateUserSender(userData)
          .subscribe((data: UserSenders) => {
          if (!data) {
            console.log('Nessun dato disponibile');
          } 
          this.router.navigate(['/userSenders']);
        });
      }

    } else {
        this.alertMessage = true;
        this.alertText = 'Compila tutti i campi obbligatori correttamente.';
      }
    }

        startTour() {
      const steps = [
        {
          id: 'archiviovisure1',
          text: "Comepila i campi del form per aggiungere un nuovo mittente alla rubrica.",
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

import { AppTourService } from '@app/services/app-tour.service';
import { AppStorageService } from '@app/services/app-storage.service';
import { UiTourRestartComponent, UiAlertComponent } from '@app/shared/ui';
import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Users } from '../../../interfaces/Users';
import { UsersService } from '../../../services/users.service';
import { ChangePasswordFromSite } from '../../../interfaces/ChangePasswordFromSite';
import { FncUtils } from '../../../fncUtils/fncUtils';
import { ShepherdService } from 'angular-shepherd';
import { Placement as PopperPlacement } from '@popperjs/core';
import { TourPage } from '../../../interfaces/EnumTypes';
import { TourSeen } from '../../../interfaces/TourSeen';

@Component({
  selector: 'app-dati-personali',
  templateUrl: './dati-personali.component.html',
  styleUrl:'./dati-personali.component.scss',
  imports: [UiAlertComponent, UiTourRestartComponent, ReactiveFormsModule, CommonModule]
})
export class DatiPersonaliComponent implements OnInit {
  
  
  private appTour = inject(AppTourService);
private appStorage = inject(AppStorageService);
form!: FormGroup;
  form_pwd!: FormGroup;

  alertMessage = false;
  alertText = '';
  alertMessagePwd = false;
  alertTextPwd = '';
  updateOk = false;
  updatePwdOk = false;
  errorMessagePwd = false;
  user: Users | null = null;

  new_pwd = '';
  showStrength = true;
  FncUtils = FncUtils;

  constructor(private router: Router, private fb: FormBuilder, private userService: UsersService, private shepherdService: ShepherdService) {}

     page: number = TourPage.datiPersonali;


  ngOnInit(): void {
    const userStr = this.appStorage.getItem('user');
    if (!userStr) {
      this.router.navigate(['/']);
      return;
    }

    this.user = JSON.parse(userStr);

    this.form = this.fb.group({
      businessName: [this.user!.businessName || '', Validators.required],
      vatNumber: [this.user!.vatNumber || '', Validators.required],
      email: [this.user!.email || '', [Validators.required, Validators.email]],
      pec: [this.user!.pec || '', [Validators.required, Validators.email]],
      address: [this.user!.address || ''],
      zipCode: [this.user!.zipCode || ''],
      city: [this.user!.city || ''],
      province: [this.user!.province || ''],
      mobile: [this.user!.mobile || '']
    });

    this.form_pwd = this.fb.group({
      old_pwd: ['', Validators.required],
      new_pwd: ['', [Validators.required, Validators.minLength(6)]],
      rpt_new_pwd: ['', Validators.required]
    });

    this.getTourInThisPage();

  }

  onSubmit(): void {
    if (this.form.valid) {
      const userData: Users = this.form.value;
      //console.log('Dati utente da salvare:', userData);
      userData.id = this.user?.id;

      const updatedUser = Object.assign({}, this.user, userData);

      this.userService.updateUser(updatedUser)
        .subscribe(response => {
          if(response){
            this.user = response;
            this.appStorage.setItem('user', JSON.stringify(this.user!));
            
            this.userService.setUserName(this.user!.businessName);

            this.updateOk = true;
          }
        });
      this.alertMessage = false;
    } else {
      this.alertMessage = true;
      this.alertText = 'Compila correttamente tutti i campi richiesti.';
    }
  }

  onSubmitPwd(): void {
    this.alertMessagePwd = false;
    this.updatePwdOk = false;
    const { old_pwd, new_pwd, rpt_new_pwd } = this.form_pwd.value;

    if (this.form_pwd.invalid) {
      this.alertMessagePwd = true;
      this.alertTextPwd = 'Compila tutti i campi.';
      return;
    }

    if (new_pwd !== rpt_new_pwd) {
      this.alertMessagePwd = true;
      this.alertTextPwd = 'Le nuove password non coincidono.';
      return;
    }
    
    const changePasswordFromSite: ChangePasswordFromSite = {
      id: this.user!.id!,
      newPassword: this.form_pwd.value.new_pwd,
      oldPassword: this.form_pwd.value.old_pwd
    };

    this.userService.updatePassword(changePasswordFromSite)
    .subscribe(response => {
      if(response){
        if(response.success){
          this.updatePwdOk = true;
          this.form_pwd.reset();
        }
        else
        {
          this.alertMessagePwd = true;
          this.alertTextPwd = response.message;
        }
      }
    });

  }


  getPasswordClass(): string {
    const strength = FncUtils.checkPasswordStrength(this.new_pwd);
    return `pwd-in pwd-${strength}`;
  }
  
  get passwordStrength(): 'debole' | 'media' | 'forte' {
    return FncUtils.checkPasswordStrength(this.new_pwd);
  }


    startTour() {
      const steps = [
        {
          id: 'archiviovisure1',
          text: "Da questa sezione puoi modificare i tuoi dati personali.",
          attachTo: {
            element: '.step-1',
            on: 'bottom' as PopperPlacement
          },
          modalOverlayOpeningPadding: 14,
          modalOverlayOpeningRadius: 5,
          classes: 'margin-step-y', 
          buttons: [
            { text: 'X Chiudi tour', action: () => this.shepherdService.complete(), classes:"close" },
            { text: 'Avanti', action: () => this.shepherdService.next() }
          ]
        },
        {
          id: 'archiviovisure1',
          text: "Da questa sezione puoi modificare la password di accesso al sistema.",
          attachTo: {
            element: '.step-end',
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
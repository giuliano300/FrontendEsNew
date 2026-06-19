import { AppTourService } from '@app/services/app-tour.service';
import { AppStorageService } from '@app/services/app-storage.service';
import { UiTourRestartComponent, UiAlertComponent } from '@app/shared/ui';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserSendersService } from '../../../services/user-senders.service';
import { Users } from '../../../interfaces/Users';
import { UserSenders } from '../../../interfaces/UserSenders';
import { MatListModule, MatSelectionListChange } from '@angular/material/list';
import { FncUtils } from '../../../fncUtils/fncUtils';
import { UsersService } from '../../../services/users.service';
import { inserisciText, modificaText } from '../../../enviroments/enviroments';
import { CapitalizePipe } from '../../../fncUtils/CapitalizePipe';
import { ShepherdService } from 'angular-shepherd';
import { Placement as PopperPlacement } from '@popperjs/core';
import { TourPage } from '../../../interfaces/EnumTypes';
import { TourSeen } from '../../../interfaces/TourSeen';


@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [UiAlertComponent, UiTourRestartComponent, ReactiveFormsModule, CommonModule, MatListModule, CapitalizePipe],
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.scss'
})
export class AddUserComponent {
  
  
  private appTour = inject(AppTourService);
private appStorage = inject(AppStorageService);
alertMessage = false;
  alertText = '';
  user: Users | null = null;
  oldUser: Users | null = null;

  options: UserSenders[] = [];
  selectedOptions: number[] = [];
  password = '';
  showStrength = true;
  FncUtils = FncUtils;
  inserimento = false;
  inserisciModificaText = inserisciText

  selectedSenderIds: number[] = [];

  form: FormGroup;

  constructor(private router: Router, private fb: FormBuilder, 
    private userSenderService: UserSendersService, private userService: UsersService, 
    private route: ActivatedRoute, private shepherdService: ShepherdService) {
    this.form = this.fb.group({
      userTypes: ['', [Validators.required]],
      businessName: ['', [Validators.required, Validators.maxLength(44)]],
      address: ['', [Validators.required]],
      zipCode: ['', [Validators.required, Validators.maxLength(5)]],
      province: ['', [Validators.required, Validators.maxLength(2)]],
      city: ['', [Validators.required]],
      mobile: ['', [Validators.required]],
      email: ['', [Validators.required]],
      pwd: [''],
      pec: [''],
      id: ['']
    });
  }

  page: number = TourPage.userAdd;

  ngOnInit(): void {
    const user = this.appStorage.getItem('user');
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

      this.inserisciModificaText = modificaText;

      const id = parseInt(params.get('id')!);
       this.userService.getUserById(id)
        .subscribe((data: Users) => {
        if (!data) {
        } 
        else 
          this.form.patchValue({
            userTypes: data.userTypes || '',
            businessName: data.businessName || '',
            address: data.address || '',
            zipCode: data.zipCode || '',
            province: data.province || '',
            city: data.city || '',
            mobile: data.mobile || '',
            email: data.email || '',
            pec: data.pec || '',
            id: data.id
          });
          this.selectedSenderIds = JSON.parse(data.arraySenderId!);  
          this.selectedOptions = JSON.parse(data.arraySenderId!);
      });
    });


    this.getUserSenders();

    this.getTourInThisPage();
  }

  getUserSenders(){
    this.userSenderService.getUserSenders(this.user!.id!)
    .subscribe((data: UserSenders[]) => {
      if (!data || data.length === 0) {
      } 
      else 
      {
        this.options = data;
      }
    });
  }

  onCheckboxChange(event: MatSelectionListChange) {
    this.selectedOptions = event.source.selectedOptions.selected.map(option => option.value);
    //console.log(this.selectedOptions);
  }


  onSubmit(): void {
    if (this.form.valid) {
     const formValues = this.form.value;
     const userData: Users = this.user!;
      Object.assign(userData, {
        userTypes: formValues.userTypes,
        businessName: formValues.businessName,
        address: formValues.address,
        zipCode: formValues.zipCode,
        province: formValues.province,
        city: formValues.city,
        mobile: formValues.mobile,
        email: formValues.email,
        password: formValues.pwd,
        pec: formValues.pec,
        parentId: this.user!.id
      });

      userData.arraySenderId =  JSON.stringify(this.selectedOptions);
      userData.id = formValues.id;

      if(userData.id == 0)
      {
        this.userService.setUser(userData)
          .subscribe((data: Users) => {
          if (!data) {
          } 
          this.router.navigate(['/utentiList']);
        });
      }
      else
      {
        this.userService.updateUser(userData)
          .subscribe((data: Users) => {
          if (!data) {
          } 
          this.router.navigate(['/utentiList']);
        });
      }
      
    }
    else 
    {
      this.alertMessage = true;
      this.alertText = 'Compila tutti i campi obbligatori correttamente.';
    }
  }


  getPasswordClass(): string {
    const strength = FncUtils.checkPasswordStrength(this.password);
    return `pwd-in pwd-${strength}`;
  }
  
  get passwordStrength(): 'debole' | 'media' | 'forte' {
    return FncUtils.checkPasswordStrength(this.password);
  }

  onPasswordInput() {
    this.password = this.form.get('pwd')?.value || '';
  }

        startTour() {
      const steps = [
        {
          id: 'archiviovisure1',
          text: "Compila i dati del nuovo utente e specifica se può solo visualizzare o anche inserire contenuti.",
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
          text: "Seleziona uno o più mittenti con cui l'utente potrà spedire o visualizzare le comunicazioni",
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

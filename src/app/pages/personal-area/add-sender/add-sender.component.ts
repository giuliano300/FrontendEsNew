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

    constructor(private router: Router, private fb: FormBuilder, private userSenderService: UserSendersService, private route: ActivatedRoute) {
      this.form = this.fb.group({
        businessName: ['', [Validators.required, Validators.maxLength(44)]],
        address: ['', [Validators.required]],
        zipCode: ['', [Validators.required, Validators.maxLength(5)]],
        province: ['', [Validators.required, Validators.maxLength(2)]],
        complementNames: [''],
        complementAddress: [''],
        city: ['', [Validators.required]],
        state: ['', [Validators.required]],
        mobile: ['', [Validators.required]],
        email: ['', [Validators.required]],
        id: [''] 
      });
   }

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

}

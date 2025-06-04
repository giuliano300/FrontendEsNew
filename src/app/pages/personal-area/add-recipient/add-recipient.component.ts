import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { alertName,alertComplName,alertAddress,alertComplAddress,alertProvince, alertState,infoCodiceFiscale,alertName2, inserisciText, modificaText } from '../../../enviroments/enviroments';
import { CapitalizePipe } from '../../../fncUtils/CapitalizePipe';
import { UserRecipientsService } from '../../../services/user-recipients.service';
import { Users } from '../../../interfaces/Users';
import { UserRecipients } from '../../../interfaces/UserRecipients';

@Component({
  selector: 'app-add-recipient',
  imports: [ReactiveFormsModule, CommonModule, NgbModule, CapitalizePipe],
  templateUrl: './add-recipient.component.html',
  styleUrl: './add-recipient.component.scss'
})
export class AddRecipientComponent {

    form: FormGroup;
    user: Users | null = null;
    inserimento = false;
    
    alertMessage = false;
    alertText = '';

    alertName = alertName;
    alertComplName = alertComplName;
    alertAddress = alertAddress;
    alertComplAddress = alertComplAddress;
    alertProvince = alertProvince;
    alertState = alertState;
    infoCodiceFiscale = infoCodiceFiscale;
    alertName2 = alertName2;
    inserisciModificaText = inserisciText

    constructor(private router: Router, private fb: FormBuilder, private userRecipientService: UserRecipientsService, private route: ActivatedRoute) {
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
        fiscalCode: [''],
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
           this.userRecipientService.getUserRecipient(id)
           .subscribe((data: UserRecipients) => {
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
               fiscalCode: data.fiscalCode || '',
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

      let x = JSON.stringify(userData);

      if(userData.id == 0)
      {
        this.userRecipientService.setUserRecipient(userData)
          .subscribe((data: UserRecipients) => {
          if (!data) {
            console.log('Nessun dato disponibile');
          } 
          this.router.navigate(['/rubricaDestinatari']);
        });
      }
      else
      {
        this.userRecipientService.updateUserRecipient(userData)
          .subscribe((data: UserRecipients) => {
          if (!data) {
            console.log('Nessun dato disponibile');
          } 
          this.router.navigate(['/rubricaDestinatari']);
        });
      }

    } else {
        this.alertMessage = true;
        this.alertText = 'Compila tutti i campi obbligatori correttamente.';
      }
  }
  
}

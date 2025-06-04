import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
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

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MatListModule, CapitalizePipe],
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.scss'
})
export class AddUserComponent {
  alertMessage = false;
  alertText = '';
  user: Users | null = null;
  oldUser: Users | null = null;

  options: string[] = ['Opzione A', 'Opzione B', 'Opzione C'];
  selectedOptions: string[] = [];

  form: FormGroup;

  constructor(private router: Router, private fb: FormBuilder, 
    private userSenderService: UserSendersService, private userService: UsersService, 
    private route: ActivatedRoute) {
    this.form = this.fb.group({
      nominativo: ['', [Validators.required, Validators.maxLength(44)]],
      indirizzo: ['', [Validators.required]],
      cap: ['', [Validators.required, Validators.maxLength(5)]],
      provincia: ['', [Validators.required, Validators.maxLength(2)]],
      comp_nominativo: ['', [Validators.required]],
      comp_indirizzo: ['', [Validators.required]],
      citta: ['', [Validators.required]],
      stato: ['', [Validators.required]],
      telefono: ['', [Validators.required]],
      email: ['', [Validators.required]],
      selectedOptions: [[], [this.minSelectedOptions(1)]]
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

      this.inserisciModificaText = modificaText;

      const id = parseInt(params.get('id')!);
       this.userService.getUserById(id)
        .subscribe((data: Users) => {
        if (!data) {
          console.log("errore nella risposta");
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
  }

  getUserSenders(){
    this.userSenderService.getUserSenders(this.user!.id!)
    .subscribe((data: UserSenders[]) => {
      if (!data || data.length === 0) {
        console.log('Nessun dato disponibile');
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
      this.router.navigate(['/userSenders']);
    } else {
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

}
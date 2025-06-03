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

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MatListModule],
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.scss'
})
export class AddUserComponent {
  alertMessage = false;
  alertText = '';
  user: Users | null = null;
  oldUser: Users | null = null;

  options: UserSenders[] = [];
  selectedOptions: number[] = [];
  password = '';
  showStrength = true;
  FncUtils = FncUtils;

  selectedSenderIds: number[] = [];

  form: FormGroup;

  constructor(private router: Router, private fb: FormBuilder, 
    private userSenderService: UserSendersService, private userService: UsersService, 
    private route: ActivatedRoute) {
    this.form = this.fb.group({
      userTypes: ['', [Validators.required]],
      businessName: ['', [Validators.required, Validators.maxLength(44)]],
      address: ['', [Validators.required]],
      zipCode: ['', [Validators.required, Validators.maxLength(5)]],
      province: ['', [Validators.required, Validators.maxLength(2)]],
      city: ['', [Validators.required]],
      mobile: ['', [Validators.required]],
      email: ['', [Validators.required]],
      pwd: ['', [Validators.required]],
      pec: [''],
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
        pwd: formValues.pwd,
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
            console.log('Nessun dato disponibile');
          } 
          this.router.navigate(['/utentiList']);
        });
      }
      else
      {
        this.userService.updateUser(userData)
          .subscribe((data: Users) => {
          if (!data) {
            console.log('Nessun dato disponibile');
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

}
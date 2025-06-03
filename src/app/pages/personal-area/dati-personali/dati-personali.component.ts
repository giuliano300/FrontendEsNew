import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Users } from '../../../interfaces/Users';
import { UsersService } from '../../../services/users.service';
import { ChangePasswordFromSite } from '../../../interfaces/ChangePasswordFromSite';
import { FncUtils } from '../../../fncUtils/fncUtils';

@Component({
  selector: 'app-dati-personali',
  templateUrl: './dati-personali.component.html',
  styleUrl:'./dati-personali.component.scss',
  imports:[ReactiveFormsModule, CommonModule]
})
export class DatiPersonaliComponent implements OnInit {
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

  constructor(private router: Router, private fb: FormBuilder, private userService: UsersService) {}

  ngOnInit(): void {
    const userStr = localStorage.getItem('user');
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
            localStorage.setItem('user', JSON.stringify(this.user!));
            
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


}

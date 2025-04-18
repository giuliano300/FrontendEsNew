import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FncUtils } from '../../fncUtils/fncUtils'; 
import { UsersService } from '../../services/users.service';
import { ChangePassword } from '../../interfaces/ChangePassword';
import { Responses } from '../../interfaces/Responses';

@Component({
  selector: 'app-password-change',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './password-change.component.html',
  styleUrl: './password-change.component.scss'
})
export class PasswordChangeComponent {
  token: string | null = null;
  constructor(private usersService: UsersService, private router: Router, private route: ActivatedRoute) {
    this.route.queryParamMap.subscribe(params => {
      this.token = params.get('token');
    });
  }

  errorMessage: string | null = null;
  message: string | null = null;

  password = '';
  showStrength = true;
  FncUtils = FncUtils;

  form = new FormGroup({
    password: new FormControl('', Validators.required)
  });

  ngOnInit(): void {
    const token = localStorage.getItem('authToken');
    if (token) 
      this.router.navigate(['/dashboard']);
  }

  onSubmit() {
    if (this.form.valid) {
      this.errorMessage = null; 

      const pwd = this.form.value.password!;
      const tk = this.token!;

      const changePassword: ChangePassword = {
          password: pwd,
          token: tk
      }

      this.usersService.changePassword(changePassword)
        .subscribe((data: Responses) => {
          this.showStrength = false;
          if(!data.valid){
            this.errorMessage = data.message;
          }
          else {
            this.message = data.message;
          }
        });
    }
  }

  getPasswordClass(): string {
    const strength = FncUtils.checkPasswordStrength(this.password);
    return `pwd pwd-${strength}`;
  }

  get passwordStrength(): 'debole' | 'media' | 'forte' {
    return FncUtils.checkPasswordStrength(this.password);
  }
}

import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Login } from '../../interfaces/Login';
import { Router, RouterLink } from '@angular/router';
import { Users } from '../../interfaces/Users';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  constructor(private authService: AuthService, private router: Router) {}

  errorMessage: string | null = null;
  user: Users  | null = null;

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
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

      const login: Login = {
        email: this.form.value.email!,
        pwd: this.form.value.password!
      };
      
      this.authService.login(login)
        .subscribe((data: any) => {
          if(data == null){
            this.errorMessage = 'Email o password non corretti.';
          }
          else {
            this.user! = data.user;
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('user', JSON.stringify(this.user!));
            this.router.navigate(['/dashboard']);
          }
        });
    }
  }
}

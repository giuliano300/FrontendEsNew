import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { Users } from '../../interfaces/Users';

@Component({
  selector: 'app-two-factor',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './two-factor.component.html',
  styleUrl: './two-factor.component.scss'
})
export class TwoFactorComponent {
  constructor(private authService: AuthService, private router: Router) {}

  errorMessage: string | null = null;
  user: Users  | null = null;
  sendLogin: boolean = false;

  form = new FormGroup({
    code: new FormControl('', [Validators.required]),
  });

  ngOnInit(): void {
    const token = localStorage.getItem('authToken');
    if (token) 
      this.router.navigate(['/dashboard']);
  }

  onSubmit() {
    if (this.form.valid) {
      this.sendLogin = true;
      this.errorMessage = null; 

      const code = this.form.value.code!;

      const pending2faData = localStorage.getItem('pending2faData');
      if (!pending2faData) {
        this.router.navigate(['/']);
        return;
      }

      const p = JSON.parse(pending2faData);

      const verificationRequest = {
        userId: p.user?.id!,
        code: code
      };
      
      this.authService.verifyCode(verificationRequest)
        .subscribe((data: any) => {
          if(data == null){
            this.errorMessage = 'Codice di verifica non valido.';
             this.sendLogin = false;
          }
          else if(data.success === false)
          {
            this.errorMessage = data.message || 'Codice di verifica non valido.';
            this.sendLogin = false;
          }
          else
          {
            // Estraggo i dati temporanei salvati
            this.user! = p.user;
            
            this.authService.saveLocalStorage(p);
            
            this.router.navigate(['/dashboard']);
          }
        });
    }
  }
}

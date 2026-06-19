import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Users } from '../../interfaces/Users';
import { AppStorageService } from '../../services/app-storage.service';

@Component({
  selector: 'app-two-factor',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './two-factor.component.html',
  styleUrl: './two-factor.component.scss'
})
export class TwoFactorComponent {
  constructor(private authService: AuthService, private router: Router, private storage: AppStorageService) {}

  errorMessage: string | null = null;
  user: Users  | null = null;
  sendLogin: boolean = false;

  form = new FormGroup({
    code: new FormControl('', [Validators.required]),
  });

  ngOnInit(): void {
    const token = this.storage.getAuthToken();
    if (token) 
      this.router.navigate(['/dashboard']);
  }

  onSubmit() {
    if (this.form.valid) {
      this.sendLogin = true;
      this.errorMessage = null; 

      const code = this.form.value.code!;

      const p = this.storage.getPending2faData<any>();
      if (!p) {
        this.router.navigate(['/']);
        return;
      }

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

import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { PasswordRecoveryService } from '../../services/passwordRecovery.service';

@Component({
  selector: 'app-password-component',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './password-recovery.component.html',
  styleUrl: './password-recovery.component.scss'
})
export class PasswordRecoveryComponent {
  constructor(private passwordRecoveryService: PasswordRecoveryService, private router: Router) {}

  errorMessage: string | null = null;
  message: string | null = null;

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email])
  });

  ngOnInit(): void {
    const token = localStorage.getItem('authToken');
    if (token) 
      this.router.navigate(['/dashboard']);
  }

  onSubmit() {
    if (this.form.valid) {
      this.errorMessage = null; 

      const email = this.form.value.email!;

      this.passwordRecoveryService.getLinkToRecovery(email)
        .subscribe((data: boolean) => {
          if(!data){
            this.errorMessage = 'Email non presente nei nostri archivi.';
          }
          else {
            this.message = 'Email inviata all\'indirizzo specificato';
          }
        });
    }
  }
}

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-invio-telegramma-4',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './invio-telegramma-4.component.html',
  styleUrl: './invio-telegramma-4.component.scss'
})
export class InvioTelegramma4Component {
    constructor(private router: Router) {}
    alertMessage = false;
    alertText = '';

  form = new FormGroup({
    messaggio: new FormControl('', [Validators.required]),
  });

  onSubmit(): void {
   
    if (this.form.valid) {
      this.router.navigate(['/calcoloPreventivo']);
    } else {
      this.alertMessage = true;
      this.alertText = 'Scrivi un messaggio.';
    }
  }


}

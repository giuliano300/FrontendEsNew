import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tipo-visura',
  imports: [ReactiveFormsModule, RouterModule, CommonModule],
  templateUrl: './tipo-visura.component.html',
  styleUrl: './tipo-visura.component.scss'
})
export class TipoVisuraComponent {
form: FormGroup;
  alertMessage = false;

  constructor(private fb: FormBuilder, private router: Router) {
    this.form = this.fb.group({
      tipoInvio: [null, Validators.required]
    });
  }

  removeErroMessage() {
    this.alertMessage = false;
  }

  onSubmit() {
    if (this.form.valid) {
      const tipoInvio = this.form.value.tipoInvio;

      if (tipoInvio === 'invio-singolo') 
      {
        this.router.navigate(['/visuraSingola']);
      } 
      else if (tipoInvio === 'invio-multiplo') {
        this.router.navigate(['/visuraMultipla']);
      }
    } else {
      this.alertMessage = true;
    }
  }

}

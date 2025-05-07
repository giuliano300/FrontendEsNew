import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-invio-multiplo-raccomandata',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './invio-multiplo-raccomandata.component.html',
  styleUrl: './invio-multiplo-raccomandata.component.scss'
})
export class InvioMultiploRaccomandataComponent {
  constructor(private router: Router) {}
  alertMessage = false;


  form = new FormGroup({
    tipoDocumento: new FormControl('', [Validators.required])
  });

  onSubmit(): void {
    if (this.form.valid) {
      const tipoDocumento = this.form.value.tipoDocumento;

      if (tipoDocumento === 'invio-senza-bollettino') {
        this.router.navigate(['/invioMultiploRaccomandata2']);
      } else if (tipoDocumento === 'invio-con-bollettino') {
        this.router.navigate(['/invioMultiploRaccomandata2']);
      }
    }
    else
      this.alertMessage = true;
  }

  removeErroMessage(){
    this.alertMessage = false;
  }

}

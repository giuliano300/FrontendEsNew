import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-tipo-spedizione',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './tipo-spedizione.component.html',
  styleUrl: './tipo-spedizione.component.scss'
})
export class TipoSpedizioneRaccomandataComponent {
  constructor(private router: Router) {}
  alertMessage = false;


  form = new FormGroup({
    tipoInvio: new FormControl('', [Validators.required])
  });

  onSubmit(): void {
    if (this.form.valid) {
      const tipoInvio = this.form.value.tipoInvio;

      if (tipoInvio === 'invio-singolo') {
        this.router.navigate(['/invioSingoloRaccomandata']);
      } else if (tipoInvio === 'invio-multiplo') {
        this.router.navigate(['/invioMultiploRaccomandata']);
      }
    }
    else
      this.alertMessage = true;
  }

  removeErroMessage(){
    this.alertMessage = false;
  }
}

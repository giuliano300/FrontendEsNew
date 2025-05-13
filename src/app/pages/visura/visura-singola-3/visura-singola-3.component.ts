import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-visura-singola-3',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './visura-singola-3.component.html',
  styleUrl: './visura-singola-3.component.scss'
})
export class VisuraSingola3Component {

    constructor(private router: Router) {}
    alertMessage = false;
    alertText = '';



  form = new FormGroup({
    piva: new FormControl('', [Validators.required]),
    nominativo: new FormControl('', [Validators.required]),
    cciaa: new FormControl('', [Validators.required]),
    numero_rea: new FormControl('', [Validators.required]),
  });




  onSubmit(): void {


    if (this.form.valid) {
      this.router.navigate(['/calcoloPreventivo']);
    } else {
      this.alertMessage = true;
      this.alertText = 'Compila tutti i campi obbligatori correttamente.';
    }
  }



}

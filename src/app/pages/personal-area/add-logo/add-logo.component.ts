import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { alertLogo } from '../../../enviroments/enviroments';


@Component({
  selector: 'app-add-logo',
  imports: [ReactiveFormsModule, CommonModule, NgbModule],
  templateUrl: './add-logo.component.html',
  styleUrl: './add-logo.component.scss'
})
export class AddLogoComponent {
    constructor(private router: Router) {}
    alertMessage = false;
    alertText = '';

    alertLogo = alertLogo;

    
    form = new FormGroup({
      nome_logo: new FormControl('', [Validators.required]),
      upl_logo: new FormControl('', [Validators.required]),
    });


    onSubmit(): void {
    
      if (this.form.valid) {
        this.router.navigate(['/personalizzazioneCover']);
      } else {
        this.alertMessage = true;
        this.alertText = 'Compila tutti i campi obbligatori correttamente.';
      }
    }
}

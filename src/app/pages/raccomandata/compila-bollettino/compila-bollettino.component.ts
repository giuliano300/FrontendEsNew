import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { alertBollCap, alertBollIndirizzo, alertBollLocalita, alertBollNominativo } from '../../../enviroments/enviroments';


@Component({
  selector: 'app-compila-bollettino',
  imports: [ReactiveFormsModule, CommonModule, RouterLink, NgbModule],
  templateUrl: './compila-bollettino.component.html',
  styleUrl: './compila-bollettino.component.scss'
})
export class CompilaBollettinoComponent {
  constructor(private router: Router) {}
  alertMessage = false;
  alertText = '';
  alertBollNominativo=alertBollNominativo;
  alertBollIndirizzo=alertBollIndirizzo;
  alertBollCap=alertBollCap;
  alertBollLocalita=alertBollLocalita;
  
  form = new FormGroup({
    conto_corrente: new FormControl('', [Validators.required]),
    eseguito_nominativo: new FormControl('', [Validators.required]),
    anno_riferimento: new FormControl('', [Validators.required]),
    intestatario: new FormControl('', [Validators.required]),
    eseguito_indirizzo: new FormControl('', [Validators.required]),
    eseguito_cap: new FormControl('', [Validators.required, Validators.maxLength(5)]),
    importo: new FormControl('', [Validators.required]),
    eseguito_localita: new FormControl('', [Validators.required]),
    codice_cliente: new FormControl('', [Validators.required]),
    causale: new FormControl('', [Validators.required]),
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

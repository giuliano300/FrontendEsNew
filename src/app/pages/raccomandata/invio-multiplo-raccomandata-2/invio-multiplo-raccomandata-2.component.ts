import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { bulletin } from '../../../../main';
import { UserLogos } from '../../../interfaces/UserLogos';
import { UserLogosService } from '../../../services/user-logos.service';
import { Users } from '../../../interfaces/Users';

@Component({
  selector: 'app-invio-multiplo-raccomandata-2',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './invio-multiplo-raccomandata-2.component.html',
  styleUrl: './invio-multiplo-raccomandata-2.component.scss'
})
export class InvioMultiploRaccomandata2Component {
  constructor(private router: Router, private userLogosService: UserLogosService) {}
  alertMessage = false;
  alertText = '';

  bulletin: string | null = "senza bollettino";

  userLogos: UserLogos[] =[];

  user: Users | null  = null;
  

  form = new FormGroup({
    sel_logo: new FormControl(''),
    sel_mittente: new FormControl('', [Validators.required]),
    tipoFormato: new FormControl('', [Validators.required]),
    tipoColore: new FormControl('', [Validators.required]),
    tipoStampa: new FormControl('', [Validators.required]),
    tipoRicevuta: new FormControl('', [Validators.required]),

    // campi AR, inizialmente senza required
    nominativo_ar: new FormControl(''),
    indirizzo_ar: new FormControl(''),
    cap_ar: new FormControl(''),
    provincia_ar: new FormControl(''),
    comp_nominativo_ar: new FormControl(''),
    comp_indirizzo_ar: new FormControl(''),
    citta_ar: new FormControl(''),
    stato_ar: new FormControl('')
  });

  ngOnInit() {
    const user = localStorage.getItem('user');
      if (!user) {
        this.router.navigate(['/']);
        return;
      }

    this.user! = JSON.parse(user!);
    
    this.form.get('tipoRicevuta')?.valueChanges.subscribe(value => {
      if (value === 'RicevutaRitornoSI') {
        this.enableARValidators();
      } else {
        this.disableARValidators();
      }
    });
    const bul = localStorage.getItem('bulletin')!;
      if(parseInt(bul) == bulletin.si)
        this.bulletin = "con bollettino";

      this.getUserLogos();
  }

  getUserLogos(){
    this.userLogosService.getUserLogos(this.user!.id!)
    .subscribe((data: UserLogos[]) => {
      if (!data || data.length === 0) {
        console.log('Nessun dato disponibile');
      } 
      else 
      {
        this.userLogos = data;
      }
    });
  }

enableARValidators() {
  this.form.get('nominativo_ar')?.setValidators([Validators.required, Validators.maxLength(44)]);
  this.form.get('indirizzo_ar')?.setValidators([Validators.required]);
  this.form.get('cap_ar')?.setValidators([Validators.required, Validators.maxLength(5)]);
  this.form.get('provincia_ar')?.setValidators([Validators.required, Validators.maxLength(2)]);
  this.form.get('citta_ar')?.setValidators([Validators.required]);
  this.form.get('stato_ar')?.setValidators([Validators.required]);

  // aggiorna lo stato di validità
  this.form.get('nominativo_ar')?.updateValueAndValidity();
  this.form.get('indirizzo_ar')?.updateValueAndValidity();
  this.form.get('cap_ar')?.updateValueAndValidity();
  this.form.get('provincia_ar')?.updateValueAndValidity();
  this.form.get('citta_ar')?.updateValueAndValidity();
  this.form.get('stato_ar')?.updateValueAndValidity();
}

disableARValidators() {
  // rimuove i validators e resetta i campi
  ['nominativo_ar', 'indirizzo_ar', 'cap_ar', 'provincia_ar', 'citta_ar', 'stato_ar'].forEach(field => {
    const control = this.form.get(field);
    control?.clearValidators();
    control?.updateValueAndValidity();
  });
}

onSubmit(): void {
      const errors: string[] = [];

      const selLogo = this.form.value.sel_logo;
      const selMittente = this.form.value.sel_mittente;
      const tipoFormato = this.form.value.tipoFormato;
      const tipoColore = this.form.value.tipoColore;
      const tipoStampa = this.form.value.tipoStampa;
      const tipoRicevuta = this.form.value.tipoRicevuta;

      // Costruisce lista errori se manca qualcosa
      if (!selMittente) errors.push('Mittente');
      if (!tipoFormato) errors.push('Formato');
      if (!tipoColore) errors.push('Colore');
      if (!tipoStampa) errors.push('Stampa');
      if (!tipoRicevuta) errors.push('Ricevuta');

      if (tipoRicevuta === 'RicevutaRitornoSI') {
        const requiredARFields = [
          { key: 'nominativo_ar', label: 'Nominativo AR' },
          { key: 'indirizzo_ar', label: 'Indirizzo AR' },
          { key: 'cap_ar', label: 'CAP AR' },
          { key: 'provincia_ar', label: 'Provincia AR' },
          { key: 'citta_ar', label: 'Città AR' },
          { key: 'stato_ar', label: 'Stato AR' },
        ];
        
        requiredARFields.forEach(field => {
          if (!this.form.get(field.key)?.value) {
            errors.push(field.label);
          }
        });
      }

      if (errors.length > 0) {
        this.alertText = `${errors.join(', ')}.`;
        this.alertMessage = true;
        return;
      }

      // Se tutti sono presenti, vai alla pagina
      this.router.navigate(['/invioMultiploRaccomandata3']);
    }

    removeErroMessage(): void {
      this.alertMessage = false;
      this.alertText = '';
    }

}

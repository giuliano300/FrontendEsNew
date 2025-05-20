import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { bulletin } from '../../../../main';
import { UserLogos } from '../../../interfaces/UserLogos';
import { Users } from '../../../interfaces/Users';
import { UserLogosService } from '../../../services/user-logos.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { alertName,alertComplName,alertAddress,alertComplAddress,alertProvince, alertState } from '../../../enviroments/enviroments';


@Component({
  selector: 'app-invio-multiplo-agol-2',
  imports: [ReactiveFormsModule, CommonModule, RouterLink,NgbModule],
  templateUrl: './invio-multiplo-agol-2.component.html',
  styleUrl: './invio-multiplo-agol-2.component.scss'
})
export class InvioMultiploAgol2Component {

  bulletin: string | null = "senza bollettino";
  constructor(private router: Router,  private userLogosService: UserLogosService) {}
  alertMessage = false;
  alertText = '';

  alertName = alertName;
  alertComplName = alertComplName;
  alertAddress = alertAddress;
  alertComplAddress = alertComplAddress;
  alertProvince = alertProvince;
  alertState = alertState;

  userLogos: UserLogos[] =[];

  user: Users | null  = null;


form = new FormGroup({
  sel_logo: new FormControl(''),
  sel_mittente: new FormControl('', [Validators.required]),
  tipoFormato: new FormControl('', [Validators.required]),
  tipoColore: new FormControl('', [Validators.required]),
  tipoStampa: new FormControl('', [Validators.required]),
  tipoNotificante: new FormControl(''),
  nomeNotificante: new FormControl(''),
  nominativo_ar: new FormControl(''),
  indirizzo_ar: new FormControl(''),
  cap_ar: new FormControl(''),
  provincia_ar: new FormControl(''),
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


onSubmit(): void {
  const errors: string[] = [];

  const sel_mittente = this.form.value.sel_mittente;
  const tipoFormato = this.form.value.tipoFormato;
  const tipoColore = this.form.value.tipoColore;
  const tipoStampa = this.form.value.tipoStampa;
  const tipoNotificante = this.form.value.tipoNotificante;
  const nomeNotificante = this.form.value.nomeNotificante;
  

  // Costruisce lista errori se manca qualcosa
  if (!sel_mittente) errors.push('Seleziona mittente');
  if (!tipoFormato) errors.push('Formato');
  if (!tipoColore) errors.push('Colore');
  if (!tipoStampa) errors.push('Stampa');
  if (!tipoNotificante) errors.push('Tipo notificante');
  if (!nomeNotificante) errors.push('Nome notificante');


  if (errors.length > 0) {
    this.alertText = `${errors.join(', ')}.`;
    this.alertMessage = true;
    return;
  }

  // Se tutti sono presenti, vai alla pagina
  this.router.navigate(['/invioMultiploAgol3']);
}

removeErroMessage(): void {
  this.alertMessage = false;
  this.alertText = '';
}


}

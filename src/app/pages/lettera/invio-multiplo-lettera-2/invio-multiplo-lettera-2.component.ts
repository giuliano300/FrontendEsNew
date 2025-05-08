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
  selector: 'app-invio-multiplo-lettera-2',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './invio-multiplo-lettera-2.component.html',
  styleUrl: './invio-multiplo-lettera-2.component.scss'
})
export class InvioMultiploLettera2Component {
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
    tipoLettera: new FormControl('', [Validators.required]),

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

      const selMittente = this.form.value.sel_mittente;
      const tipoFormato = this.form.value.tipoFormato;
      const tipoColore = this.form.value.tipoColore;
      const tipoStampa = this.form.value.tipoStampa;
      const tipoLettera = this.form.value.tipoLettera;

      // Costruisce lista errori se manca qualcosa
      if (!selMittente) errors.push('Mittente');
      if (!tipoFormato) errors.push('Formato');
      if (!tipoLettera) errors.push('Tipo lettera');
      if (!tipoColore) errors.push('Colore');
      if (!tipoStampa) errors.push('Stampa');


      if (errors.length > 0) {
        this.alertText = `${errors.join(', ')}.`;
        this.alertMessage = true;
        return;
      }

      // Se tutti sono presenti, vai alla pagina
      this.router.navigate(['/invioMultiploLettera3']);
    }

    removeErroMessage(): void {
      this.alertMessage = false;
      this.alertText = '';
    }

}

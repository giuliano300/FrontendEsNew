import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { productType, sendType } from '../../../main';


@Component({
  selector: 'app-selection-single-multiple',
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './selection-single-multiple.component.html',
  styleUrl: './selection-single-multiple.component.scss'
})
export class SelectionSingleMultipleComponent {

  constructor(private router: Router) {}

  alertMessage = false;

  @Input() tipoProdotto!: number; 


  navigationSingolo: string | null = null;
  navigationMultiplo: string | null = null;

  form = new FormGroup({
    tipoInvio: new FormControl('', [Validators.required])
  });

  ngOnInit(): void{

  }

  onSubmit(): void {
    if (this.form.valid) {
      const tipoInvio = this.form.value.tipoInvio;

      switch(this.tipoProdotto){
        case productType.raccomandata:
          this.navigationSingolo = '/invioSingoloRaccomandata';
          this.navigationMultiplo = '/invioMultiploRaccomandata';
          break;
          case productType.lettera:
            this.navigationSingolo = '/invioSingoloLettera';
            this.navigationMultiplo = '/invioMultiploLettera';
            break;
            case productType.agol:
              this.navigationSingolo = '/invioSingoloAgol';
              this.navigationMultiplo = '/invioMultiploAgol';
              break;
          default:
            this.navigationSingolo = '/not-found';
            this.navigationMultiplo = '/not-found';
            break;
      }

      if (tipoInvio === 'invio-singolo') {
        this.router.navigate([this.navigationSingolo]);
      } 
      
      if (tipoInvio === 'invio-multiplo') {
        this.router.navigate([this.navigationMultiplo]);
      }
    }
    else
      this.alertMessage = true;
  }

  removeErroMessage(){
    this.alertMessage = false;
  }

}

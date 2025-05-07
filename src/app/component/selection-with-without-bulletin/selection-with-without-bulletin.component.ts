import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { bulletin, productType, sendType } from '../../../main';

@Component({
  selector: 'app-selection-with-without-bulletin',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './selection-with-without-bulletin.component.html',
  styleUrl: './selection-with-without-bulletin.component.scss'
})
export class SelectionWithWithoutBulletinComponent {

  constructor(private router: Router){}

  @Input() tipoInvio!: number; 

  navigation: string | null = null;

  sType: string | null = "";

  alertMessage = false;

  form = new FormGroup({
    tipoDocumento: new FormControl('', [Validators.required])
  });

  ngOnInit(): void{
    const sendTypes = localStorage.getItem("sendType");
    this.sType = sendType[parseInt(sendTypes!)];
  }

  onSubmit(): void {
    if (this.form.valid) {
      localStorage.setItem('bulletin', this.form.value.tipoDocumento!);

      const tipoProdotto = parseInt(localStorage.getItem("productType")!);

      switch(tipoProdotto){
        case productType.raccomandata:
          switch(this.tipoInvio){
            case sendType.mutiplo:
              this.navigation = "/invioMultiploRaccomandata2";
              break;
            case sendType.singolo:
              this.navigation = "/invioSingoloRaccomandata2";
              break;
            default:
              this.navigation = "/not-found";
              break;
          }
          break;
          case productType.lettera:
            switch(this.tipoInvio){
              case sendType.mutiplo:
                this.navigation = "/invioMultiploLettera2";
                break;
              case sendType.singolo:
                this.navigation = "/invioSingoloLettera2";
                break;
              default:
                this.navigation = "/not-found";
                break;
            }
            break;
        default:
          this.navigation = "/not-found";
          break;
    }

      this.router.navigate([this.navigation]);
    }
    else
      this.alertMessage = true;
  }

  removeErroMessage(){
    this.alertMessage = false;
  }


}

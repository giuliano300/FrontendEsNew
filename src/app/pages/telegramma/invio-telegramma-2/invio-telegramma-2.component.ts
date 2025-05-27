import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SelectSenderComponent } from "../../../component/select-sender/select-sender/select-sender.component";
import * as CryptoJS from 'crypto-js';
import { secretKey } from '../../../../main';
import { FormStorageService } from '../../../services/form-storage.service';


@Component({
  selector: 'app-invio-telegramma-2',
  imports: [SelectSenderComponent],
  templateUrl: './invio-telegramma-2.component.html',
  styleUrl: './invio-telegramma-2.component.scss'
})
export class InvioTelegramma2Component {

  constructor(private router: Router, private formStorage: FormStorageService) {}  
  rr: string = "Con ";
  
 getThisUser(){
  const user = localStorage.getItem('user');
    if (!user) {
      this.router.navigate(['/']);
      return;
    }

  }


  ngOnInit(): void {
    Promise.all([
          this.formStorage.getForm('step2')
        ])
        .then(([step1]) => {
          const datiDecriptati = JSON.parse(CryptoJS.AES.decrypt(step1, secretKey).toString(CryptoJS.enc.Utf8));
          if(datiDecriptati.tipoRicevuta != "SI")
            this.rr = "Senza ";
    })
  }

}

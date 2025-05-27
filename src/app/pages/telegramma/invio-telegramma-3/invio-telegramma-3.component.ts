import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormStorageService } from '../../../services/form-storage.service';
import { secretKey } from '../../../../main';
import { SelectRecipientComponent } from "../../../component/select-recipient/select-recipient/select-recipient.component";


@Component({
  selector: 'app-invio-telegramma-3',
  imports: [ SelectRecipientComponent],
  templateUrl: './invio-telegramma-3.component.html',
  styleUrl: './invio-telegramma-3.component.scss'
})
export class InvioTelegramma3Component {

  constructor(private router: Router, private formStorage: FormStorageService) {}  
  rr: string = "Con ";

  ngOnInit(): void {
    Promise.all([
          this.formStorage.getForm('step2')
        ])
        .then(([step1]) => {
          const datiDecriptati = JSON.parse(CryptoJS.AES.decrypt(step1, secretKey).toString(CryptoJS.enc.Utf8));
          if(!parseInt(datiDecriptati.rrTelegramma))
            this.rr = "Senza ";
    })
  }


}

import { Component, inject } from '@angular/core';
import { AppStorageService } from '@app/services/app-storage.service';
import { Router } from '@angular/router';
import { SelectSenderComponent } from "../../../component/select-sender/select-sender/select-sender.component";
import { CryptoJS } from '@app/utils/crypto';
import { secretKey } from '@app/config/app-constants';
import { FormStorageService } from '../../../services/form-storage.service';


@Component({
  selector: 'app-invio-telegramma-2',
  imports: [SelectSenderComponent],
  templateUrl: './invio-telegramma-2.component.html',
  styleUrl: './invio-telegramma-2.component.scss'
})
export class InvioTelegramma2Component {
  private appStorage = inject(AppStorageService);

  constructor(private router: Router, private formStorage: FormStorageService) {}  
  rr: string = "Con ";
  
 getThisUser(){
  const user = this.appStorage.getItem('user');
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

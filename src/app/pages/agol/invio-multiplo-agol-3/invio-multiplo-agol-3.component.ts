import { Router } from '@angular/router';

// Import Angular Material modules necessari
import { FormStorageService } from '../../../services/form-storage.service';
import { Component } from '@angular/core';
import { secretKey } from '@app/config/app-constants';
import { UploadCsvMultiploComponent } from "../../../component/upload-csv-multiplo/upload-csv-multiplo.component";
import { CryptoJS } from '@app/utils/crypto';


@Component({
  selector: 'app-invio-multiplo-agol-3',
  imports: [UploadCsvMultiploComponent],
  templateUrl: './invio-multiplo-agol-3.component.html',
  styleUrl: './invio-multiplo-agol-3.component.scss'
})
export class InvioMultiploAgol3Component {

  bulletin: boolean = false;
  bulletinText: string | null = "senza bollettino";

  constructor(
    private router: Router,
        private formStorage: FormStorageService
  ) {
 
  }

ngOnInit(): void {
    
    Promise.all([
        this.formStorage.getForm('step2'),
      ]).then(([step1]) => {
        if(!step1)
          this.router.navigate(['/']);
  
          const datiDecriptati = JSON.parse(CryptoJS.AES.decrypt(step1, secretKey).toString(CryptoJS.enc.Utf8));
          if(datiDecriptati.bollettino == 1){
            this.bulletin = true;
            this.bulletinText = "con bollettimo";
          }

      });

  }

}

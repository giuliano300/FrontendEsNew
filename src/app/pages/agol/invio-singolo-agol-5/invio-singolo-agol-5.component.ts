import { Component } from '@angular/core';
import { UploadFileComponent } from "../../../component/upload-file/upload-file/upload-file.component";
import { FormStorageService } from '../../../services/form-storage.service';
import { secretKey } from '../../../../main';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-invio-singolo-agol-5',
  imports: [UploadFileComponent],
  templateUrl: './invio-singolo-agol-5.component.html',
  styleUrl: './invio-singolo-agol-5.component.scss'
})
export class InvioSingoloAgol5Component {

  bulletin: string = "con bollettino";
  
  constructor(
    private formStorage: FormStorageService
  ) {
    
  }
  ngOnInit(): void {
    Promise.all([
      this.formStorage.getForm('step2')
    ]).then(([step1]) => {
      const datiDecriptati = JSON.parse(CryptoJS.AES.decrypt(step1, secretKey).toString(CryptoJS.enc.Utf8));
      if(datiDecriptati.bollettino == 0)
        this.bulletin = "senza bolletino";

    });
  }
}

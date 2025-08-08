import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgxFileDropModule } from 'ngx-file-drop';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { secretKey } from '../../../../main';
import { FormStorageService } from '../../../services/form-storage.service';
import * as CryptoJS from 'crypto-js';
import { Recipients } from '../../../classes/Recipients';
import { checkRecipient } from '../../../fncUtils/CheckRecipient';

import { PdfBase64List } from '../../../classes/PdfBase64List';
import { UploadZipComponent } from "../../../component/upload-zip/upload-zip.component";


@Component({
  selector: 'app-invio-multiplo-lettera-4',
  imports: [CommonModule, ReactiveFormsModule, NgxFileDropModule, RouterLink, UploadZipComponent],
  templateUrl: './invio-multiplo-lettera-4.component.html',
  styleUrl: './invio-multiplo-lettera-4.component.scss'
})
export class InvioMultiploLettera4Component  {

  form: FormGroup;
  uploadProgress: number | null = null;
  uploadCompleted: boolean = false;
  errorMessage: string | null = null;
  pdfBase64List: PdfBase64List[] = [];
  recipients: Recipients[] = [];
  checkRecipient: checkRecipient[] = [];
  checking: boolean = false;
  sincro: boolean = false;
  
  nominativiCaricati: number = 0;
  nominativiValidi: number = 0;
  nominativiInErrore: number = 0;
  bulletin: string = "senza bollettino";


  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private formStorage: FormStorageService
  ) {
    this.form = this.fb.group({
      // eventuali altri controlli
    });
  }

  ngOnInit(): void {

      Promise.all([
        this.formStorage.getForm('step2'),
        this.formStorage.getForm('destinatari'),
      ]).then(([step1, step2]) => {
        if(!step1)
          this.router.navigate(['/']);
  
          const datiDecriptati = JSON.parse(CryptoJS.AES.decrypt(step1, secretKey).toString(CryptoJS.enc.Utf8));
          if(datiDecriptati.bollettino === 1)
            this.bulletin = "con bollettino";
  
          const recipients = JSON.parse(CryptoJS.AES.decrypt(step2, secretKey).toString(CryptoJS.enc.Utf8));
          this.recipients = recipients;

      })
  }

  onCheckRecipientChanged(results: checkRecipient[]) {
    this.checkRecipient = results;
  }

  onSubmit() {
    if (this.form.valid) {

      let destinatari = this.checkRecipient.filter(r => r.valido).map(r => r.recipient);

      const destinatariEnc = CryptoJS.AES.encrypt(JSON.stringify(destinatari), secretKey).toString();

      this.formStorage.saveForm('destinatari', destinatariEnc);
      
      this.router.navigate(['/calcoloPreventivo']);
    }
  }

  get hasValidRecipients(): boolean {
    return this.checkRecipient.some(r => r.valido) ?? false;
  }

}

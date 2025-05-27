import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgxFileDropEntry, FileSystemFileEntry, NgxFileDropModule } from 'ngx-file-drop';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { API_URL, secretKey } from '../../../../main';
import { FormStorageService } from '../../../services/form-storage.service';
import { PdfBase64List } from '../../../classes/PdfBase64List';
import { Recipients } from '../../../classes/Recipients';
import { checkRecipient } from '../../../fncUtils/CheckRecipient';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-invio-multiplo-agol-4',
  imports: [CommonModule, ReactiveFormsModule, NgxFileDropModule, RouterLink],
  templateUrl: './invio-multiplo-agol-4.component.html',
  styleUrl: './invio-multiplo-agol-4.component.scss'
})
export class InvioMultiploAgol4Component {

  form: FormGroup;
  uploadProgress: number | null = null;
  uploadCompleted: boolean = false;
  errorMessage: string | null = null;
  pdfBase64List: PdfBase64List[] = [];
  recipients: Recipients[] = [];
  checkRecipient: checkRecipient[] = [];
  checking:boolean = false;
  
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
          //console.log(this.recipients);
      })
  }
  

  onFileDrop(files: NgxFileDropEntry[]) {
    this.errorMessage = '';
    this.uploadProgress = 0;
    this.uploadCompleted = false;
    this.checkRecipient = [];
    this.checking  = true;

    if (files.length !== 1) {
      this.errorMessage = 'Devi caricare un solo file ZIP alla volta.';
      return;
    }

    const droppedFile = files[0];

    if (droppedFile.fileEntry.isFile) {
      const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
      fileEntry.file((file: File) => {
        const formData = new FormData();
        formData.append('file', file, file.name);

        this.http.post(API_URL + 'Uploads/upload-zip', formData, {
          reportProgress: true,
          observe: 'events'
        }).subscribe({
          next: event => {
            if (event.type === HttpEventType.UploadProgress && event.total) {
              this.uploadProgress = Math.round(100 * event.loaded / event.total);
            } 
            else if (event.type === HttpEventType.Response) 
            {
              this.uploadCompleted = true;
              this.pdfBase64List = event.body as PdfBase64List[];

              let filesUpload: PdfBase64List[] = [];          

              const numeroPagineTotali: number[] = [];

              this.recipients.forEach(async recipient => {
                const result = new checkRecipient();
                result.recipient = recipient;
                                             
                const fileTrovato = this.pdfBase64List.find(pdf => pdf.name === result.recipient!.fileName);

                if (!fileTrovato) 
                {
                  result.valido = false;
                  result.errore = "Nessun file corrispondente";
                } 
                else
                {
                  let file:PdfBase64List = {
                    name: fileTrovato.name,
                    base64: fileTrovato.base64,
                    pages: fileTrovato.pages
                  };
                  numeroPagineTotali.push(fileTrovato.pages);
                  filesUpload.push(file);
                }
                
                this.checkRecipient.push(result);
              });

              this.nominativiCaricati = this.checkRecipient.length;
              this.nominativiValidi = this.checkRecipient.filter(r => r.valido).length;
              this.nominativiInErrore = this.checkRecipient.filter(r => !r.valido).length;   
              
              this.formStorage.saveForm("files-upload", filesUpload);
    
              let Inviitotali = {
                numeroInvii: this.nominativiValidi,
                numeroPagineTotali: numeroPagineTotali
              };
    
              const encryptedInvii = CryptoJS.AES.encrypt(JSON.stringify(Inviitotali), secretKey).toString();
              this.formStorage.saveForm("invii-totali", encryptedInvii);
              this.checking = false;

            }
          },
          error: error => {
            this.errorMessage = 'Errore durante l\'upload. Controllare che il file .zip contenga file .pdf';
            console.error(error);
            this.checking = false;

          },
          complete: () => {
            this.checking = false;
          }
        });
      });
    }
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

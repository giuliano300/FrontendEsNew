import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PdfBase64List } from '../../classes/PdfBase64List';
import { Recipients } from '../../classes/Recipients';
import { checkRecipient } from '../../fncUtils/CheckRecipient';
import { NgxFileDropEntry, NgxFileDropModule } from 'ngx-file-drop';
import { Users } from '../../interfaces/Users';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { FormStorageService } from '../../services/form-storage.service';
import { ShepherdService } from 'angular-shepherd';
import { TourSeenService } from '../../services/tourSeen.service';
import { CommonModule } from '@angular/common';
import { API_URL, secretKey } from '../../../main';
import * as CryptoJS from 'crypto-js';


@Component({
  selector: 'app-upload-zip',
  imports: [CommonModule, ReactiveFormsModule, NgxFileDropModule],
  templateUrl: './upload-zip.component.html',
  styleUrl: './upload-zip.component.scss'
})
export class UploadZipComponent {
  
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private formStorage: FormStorageService,
    private shepherdService: ShepherdService, 
    private tourService: TourSeenService

  ) {}

    uploadProgress: number | null = null;
    uploadCompleted: boolean = false;
    errorMessage: string | null = null;
    pdfBase64List: PdfBase64List[] = [];
    checking:boolean = false;
    sincro: boolean = false;
    checkRecipients: checkRecipient[] = [];
    
    nominativiCaricati: number = 0;
    nominativiValidi: number = 0;
    nominativiInErrore: number = 0;
    bulletin: string = "senza bollettino";

    @Input() recipients: Recipients[] = [];

    @Output() checkRecipient = new EventEmitter<checkRecipient[]>();

  onFileDrop(files: NgxFileDropEntry[]) {
    const u = localStorage.getItem('user');
    let user: Users | null = null;
      if (!u) {
        this.router.navigate(['/']);
        return;
    }
    user = JSON.parse(u) as Users;
  
    this.errorMessage = '';
    this.uploadProgress = 0;
    this.uploadCompleted = false;
    this.checkRecipients = [];
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

        this.http.post(API_URL + 'Uploads/upload-zip?userId=' + user.id, formData, {
          reportProgress: true,
          observe: 'events'
        }).subscribe({
          next: event => {
            if (event.type === HttpEventType.UploadProgress && event.total) {
              this.uploadProgress = Math.round(100 * event.loaded / event.total);
              if(this.uploadProgress == 100)
                this.sincro = true;
            } 
            else if (event.type === HttpEventType.Response) 
            {
              this.uploadCompleted = true;
              this.pdfBase64List = event.body as PdfBase64List[];

              let filesUpload: PdfBase64List[] = [];          

              const numeroPagineTotali: number[] = [];

             for (const recipient of this.recipients) {
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
                  let file: PdfBase64List = {
                    name: fileTrovato.name,
                    pages: fileTrovato.pages,
                    id: fileTrovato.id
                  };
                  numeroPagineTotali.push(fileTrovato.pages);
                  filesUpload.push(file);
                }
                
                this.checkRecipients.push(result);
              };

              this.checkRecipient.emit(this.checkRecipients);

              this.nominativiCaricati = this.checkRecipients.length;
              this.nominativiValidi = this.checkRecipients.filter(r => r.valido).length;
              this.nominativiInErrore = this.checkRecipients.filter(r => !r.valido).length;   
              
              this.formStorage.saveForm("files-upload", filesUpload);
    
              let Inviitotali = {
                numeroInvii: this.nominativiValidi,
                numeroPagineTotali: numeroPagineTotali
              };
    
              const encryptedInvii = CryptoJS.AES.encrypt(JSON.stringify(Inviitotali), secretKey).toString();
              this.formStorage.saveForm("invii-totali", encryptedInvii);
              this.checking = false;
              this.sincro = false;
            }
          },
          error: error => {
            this.errorMessage = 'Errore durante l\'upload. Controllare che il file .zip contenga file .pdf';
            console.error(error);
            this.checking = false;
            this.sincro = false;
          },
          complete: () => {
            this.checking = false;
            this.sincro = false;
          }
        });
      });
    }
  }

}

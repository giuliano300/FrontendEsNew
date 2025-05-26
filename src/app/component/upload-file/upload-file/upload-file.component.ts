import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgxFileDropEntry, FileSystemFileEntry, NgxFileDropModule } from 'ngx-file-drop';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { FormStorageService } from '../../../services/form-storage.service';
import { secretKey } from '../../../../main';
import * as CryptoJS from 'crypto-js';
import { PDFDocument } from 'pdf-lib'
import { ProductTypes } from '../../../interfaces/EnumTypes';

@Component({
  selector: 'app-upload-file',
  imports: [CommonModule, ReactiveFormsModule, NgxFileDropModule, RouterLink],
  standalone: true,
  templateUrl: './upload-file.component.html',
  styleUrl: './upload-file.component.scss'
})
export class UploadFileComponent {  
  form: FormGroup;
  uploadProgress: number | null = null;
  uploadCompleted: boolean = false;

  fileName: string = '';
  base64File: string = '';
  errorMessage: string = '';
  bulletin: boolean = false;
  destinatariDec: any;
  backLink: string | null = null;

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

  onFileDrop(files: NgxFileDropEntry[]) {
    this.errorMessage = '';
    this.fileName = '';
    this.base64File = '';
    this.uploadProgress = 0;
    this.uploadCompleted = false;

    if (files.length !== 1) {
      this.errorMessage = 'Puoi caricare solo un file alla volta.';
      return;
    }

    const droppedFile = files[0];

    if (droppedFile.fileEntry.isFile) {
      const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;

      fileEntry.file((file: File) => {
        if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
          this.errorMessage = 'Il file deve essere in formato PDF.';
          return;
        }

        this.fileName = file.name;
        const reader = new FileReader();

        reader.onprogress = (event) => {
          if (event.lengthComputable) {
            this.uploadProgress = Math.round((event.loaded / event.total) * 100);
          }
        };

        reader.onload = async () => {
          this.base64File = (reader.result as string).split(',')[1];
          this.uploadCompleted = true;
          this.uploadProgress = 100;

          // Convert base64 in Uint8Array
          const base64 = (reader.result as string).split(',')[1];
          const byteArray = Uint8Array.from(atob(base64), c => c.charCodeAt(0));

          const arrayBuffer = reader.result as ArrayBuffer;
          const pdfDoc = await PDFDocument.load(arrayBuffer);
          const numPages = pdfDoc.getPageCount();

          let file = {
            name: this.fileName,
            base64: this.base64File,
            pages: numPages
          };

          let files = [];
          files.push(file);

          //const encrypted = CryptoJS.AES.encrypt(JSON.stringify(files), secretKey).toString();
          this.formStorage.saveForm("files-upload", files);

          let Inviitotali = {
            numeroInvii: 1,
            numeroPagineTotali: [numPages]
          };
 
          const encryptedInvii = CryptoJS.AES.encrypt(JSON.stringify(Inviitotali), secretKey).toString();
          this.formStorage.saveForm("invii-totali", encryptedInvii);

          this.destinatariDec[0].fileName = this.fileName;

           const encryptedDestinatari = CryptoJS.AES.encrypt(JSON.stringify(this.destinatariDec), secretKey).toString();
          this.formStorage.saveForm("destinatari", encryptedDestinatari);
      };

        reader.onerror = () => {
          this.errorMessage = 'Errore durante la lettura del file.';
          this.uploadProgress = 0;
        };

        reader.readAsDataURL(file);
      });
    } else {
      this.errorMessage = 'Non è stato caricato un file valido.';
    }
  }

  downloadFile() {
    if (!this.base64File || !this.fileName) return;

    const link = document.createElement('a');
    link.href = `data:application/pdf;base64,${this.base64File}`;
    link.download = this.fileName;
    link.click();
  }

  ngOnInit(): void {
    Promise.all([
      this.formStorage.getForm('step2'),
      this.formStorage.getForm('destinatari')
    ]).then(([step1, destinatari]) => {
      const datiDecriptati = JSON.parse(CryptoJS.AES.decrypt(step1, secretKey).toString(CryptoJS.enc.Utf8));
      if(datiDecriptati.bollettino == 1)
        this.bulletin = true;

      this.destinatariDec = JSON.parse(CryptoJS.AES.decrypt(destinatari, secretKey).toString(CryptoJS.enc.Utf8));

      switch(parseInt(datiDecriptati.prodotto)){
        case ProductTypes.ROL:
          this.backLink = "/invioSingoloRaccomandata4";
          break;
        case ProductTypes.LOL:
          this.backLink = "/invioSingoloLettera4";
          break;
        case ProductTypes.AGOL:
          this.backLink = "/invioSingoloAgol4";
          break;
      }
      
    });
  }

  onSubmit() {
    if (this.form.valid) {
      if(this.bulletin)
        this.router.navigate(['/compilaBollettino']);
      else
        this.router.navigate(['/calcoloPreventivo']);
    }
  }

}

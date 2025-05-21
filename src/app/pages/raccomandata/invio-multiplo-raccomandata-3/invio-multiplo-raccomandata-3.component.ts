import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule,Validators,FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgxFileDropEntry, FileSystemFileEntry, NgxFileDropModule } from 'ngx-file-drop';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { alertName,alertComplName,alertAddress,alertComplAddress,alertProvince, alertState } from '../../../enviroments/enviroments';


import { Recipients } from '../../../classes/Recipients';
import { FncUtils } from '../../../fncUtils/fncUtils';
import { checkRecipient, CheckRecipient } from '../../../interfaces/CheckRecipient';
import { FormStorageService } from '../../../services/form-storage.service';
import { bulletinFields, maxUploadLimit, secretKey } from '../../../../main';
import * as CryptoJS from 'crypto-js';
import { Bulletins } from '../../../classes/Bulletins';

@Component({
  selector: 'app-invio-multiplo-raccomandata-3',
  imports: [CommonModule, ReactiveFormsModule, NgxFileDropModule, RouterLink, NgbModule],
  templateUrl: './invio-multiplo-raccomandata-3.component.html',
  styleUrl: './invio-multiplo-raccomandata-3.component.scss'
})
export class InvioMultiploRaccomandata3Component {
  form: FormGroup;
  uploadProgress: number | null = null;
  uploadCompleted: boolean = false;
  currentModalRef: any;

  fileName: string = '';
  base64File: string = '';
  errorMessage: string = '';
  bulletin: boolean = false;
  csvData: any[] = [];
  recipients: Recipients[] = [];
  bulletins?: Bulletins[] = [];
  checkRecipient: checkRecipient[] = [];
  nominativiCaricati: number = 0;
  nominativiValidi: number = 0;
  nominativiInErrore: number = 0;
  bulletinText: string | null = "senza bollettino";

  
  notUploaded:boolean = true;
  checking:boolean = false;


  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private formStorage: FormStorageService,
    private modalService: NgbModal
  ) {
    this.form = this.fb.group({
      // eventuali altri controlli
    });
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
      })
  }

  parseCsv(csvText: string): { recipient: Recipients, bulletin?: Bulletins }[] {
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(';').map(h => h.trim().toLowerCase());
    const result: { recipient: Recipients, bulletin?: Bulletins }[] = [];

    const hasBulletin = bulletinFields.some(f => headers.includes(f));

    for (let i = 1; i < lines.length; i++) {
      const rowValues = lines[i].split(';').map(v => v.trim());
      if (rowValues.length !== headers.length) continue;

      const row: any = {};
      for (let j = 0; j < headers.length; j++) {
        row[headers[j]] = rowValues[j] || null;
      }

      const recipient = FncUtils.mapCsvToRecipient(row);
      const bulletin = hasBulletin ? FncUtils.mapCsvToBulletin(row, recipient.tempGuid) : undefined;

      result.push({ recipient, bulletin });
    }

    return result;
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
        if (file.type !== 'text/csv' && !file.name.toLowerCase().endsWith('.csv')) {
          this.errorMessage = 'Il file deve essere in formato CSV.';
          return;
        }


        this.fileName = file.name;
        const reader = new FileReader();

        reader.onprogress = (event) => {
          if (event.lengthComputable) {
            this.uploadProgress = Math.round((event.loaded / event.total) * 100);
          }
        };

        reader.onload = () => {
          this.checking = true;
          const text = reader.result as string;

          const parsedRows = this.parseCsv(text);
          
          // Estrai solo i recipients
          this.recipients = parsedRows.map(r => r.recipient);
          
          // Salva anche i bulletins, se presenti
          this.bulletins = parsedRows
              .filter(r => r.bulletin !== undefined)
              .map(r => r.bulletin!);

          // Conta le righe (ignorando eventualmente una riga vuota finale)
          const lines = text.split(/\r\n|\n/).filter(line => line.trim() !== '');

          if (lines.length > maxUploadLimit) {
            this.errorMessage = 'Il file non può contenere più di ' + maxUploadLimit + ' righe.';
            this.uploadProgress = 0;
            this.checking = false;
            return;
          }

          this.checkRecipient = [];
          FncUtils.getComuniList(this.http).subscribe({
            next: data => {
             for(var i = 0; i < this.recipients.length; i++){
                const result = CheckRecipient( this.recipients[i], data, false);
                this.checkRecipient.push(result);
              };

              this.nominativiCaricati = this.checkRecipient.length;
              this.nominativiValidi = this.checkRecipient.filter(r => r.valido).length;
              this.nominativiInErrore = this.checkRecipient.filter(r => !r.valido).length;        
              this.checking = false;    
              this.notUploaded = false;
            },
            error: err => {
              console.error(err);
            }
          });
        };
        reader.readAsText(file);

        reader.onerror = () => {
          this.errorMessage = 'Errore durante la lettura del file.';
          this.uploadProgress = 0;
        };
      });

    } else {
      this.errorMessage = 'Non è stato caricato un file valido.';
    }
  }
  

  onSubmit() {
    if (this.form.valid) {

      let destinatari = this.checkRecipient.filter(r => r.valido).map(r => r.recipient);

      const destinatariEnc = CryptoJS.AES.encrypt(JSON.stringify(destinatari), secretKey).toString();

      this.formStorage.saveForm('destinatari', destinatariEnc);

      if(this.bulletin)
      {
        const validGuids = new Set(destinatari.map(r => r!.tempGuid));

        const bollettini = this.bulletins!.filter(b => b.tempRecipientGuid && validGuids.has(b.tempRecipientGuid));     
      
        const bollettiniEnc = CryptoJS.AES.encrypt(JSON.stringify(bollettini), secretKey).toString();

        this.formStorage.saveForm('bollettini', bollettiniEnc);

      }
      
      this.router.navigate(['/invioMultiploRaccomandata4']);
    }
  }


    // Metodo per aprire il modal e salvare il riferimento
  openModal(content: any) {
    const modalRef = this.modalService.open(content, { centered: true, backdrop: 'static', keyboard: true });
    this.currentModalRef = modalRef;

    // Gestione della chiusura "manuale" o tramite esc/click esterno
    modalRef.result.catch(() => {}); // evita errori non gestiti
  }

  // Metodo per navigare e chiudere il modal
    navigateAndClose(route: string) {
      if (this.currentModalRef) {
        this.currentModalRef.close();
      }
      this.router.navigate([route]);
    }


}

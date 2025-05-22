import { ChangeDetectorRef, Component, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule,Validators,FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgxFileDropEntry, FileSystemFileEntry, NgxFileDropModule } from 'ngx-file-drop';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { alertName,alertComplName,alertAddress,alertComplAddress,alertProvince, alertState, alertBollNominativo, alertBollIndirizzo, alertBollCap, alertBollLocalita } from '../../../enviroments/enviroments';

// Import Angular Material modules necessari
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

import { Recipients } from '../../../classes/Recipients';
import { FncUtils } from '../../../fncUtils/fncUtils';
import { checkRecipient, CheckRecipient } from '../../../fncUtils/CheckRecipient';
import { FormStorageService } from '../../../services/form-storage.service';
import { bulletinFields, maxUploadLimit, secretKey } from '../../../../main';
import * as CryptoJS from 'crypto-js';
import { Bulletins } from '../../../classes/Bulletins';
import { EditRecipientComponent } from '../../../component/edit-recipient/edit-recipient.component';

@Component({
  selector: 'app-invio-multiplo-raccomandata-3',
  imports: [CommonModule, ReactiveFormsModule, NgxFileDropModule, RouterLink, NgbModule, MatFormFieldModule, MatInputModule, MatAutocompleteModule],
  templateUrl: './invio-multiplo-raccomandata-3.component.html',
  styleUrl: './invio-multiplo-raccomandata-3.component.scss'
})
export class InvioMultiploRaccomandata3Component {
  form: FormGroup;
  formFinale: FormGroup;
  uploadProgress: number | null = null;
  uploadCompleted: boolean = false;
  valid?:boolean | null = null;
  currentModalRef: any;
  alertMessage = false;
  alertText = '';
  templateRefClose: any;

  fileName: string = '';
  base64File: string = '';
  errorMessage: string = '';
  bulletin: boolean = false;
  csvData: any[] = [];
  recipients: Recipients[] = [];
  bulletins?: Bulletins[] = [];
  checkRecipient: checkRecipient[] = [];
  checkRecipientAll: checkRecipient[] = [];
  nominativiCaricati: number = 0;
  nominativiValidi: number = 0;
  nominativiInErrore: number = 0;
  bulletinText: string | null = "senza bollettino";
  result: { recipient: Recipients, bulletin?: Bulletins }[] = [];
  recipientBulletin: { recipient: Recipients, isValid:boolean,  bulletin?: Bulletins } = {
    recipient: new Recipients,
    bulletin: undefined,
    isValid: false
  };

  notUploaded:boolean = true;
  checking:boolean = false;


  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private formStorage: FormStorageService,
    private modalService: NgbModal,
  ) {
    this.form = this.fb.group({
      // eventuali altri controlli
    });
    this.formFinale = this.fb.group({
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

      });

  }

  parseCsv(csvText: string): { recipient: Recipients, bulletin?: Bulletins }[] {
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(';').map(h => h.trim().toLowerCase());

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

      this.result.push({ recipient, bulletin });
    }

    //console.log(this.result);

    return this.result;
  }

  onFileDrop(files: NgxFileDropEntry[]) {
    this.errorMessage = '';
    this.fileName = '';
    this.base64File = '';
    this.uploadProgress = 0;
    this.uploadCompleted = false;
    this.valid = null;

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
          this.recipients = [];
          this.bulletins = [];
          this.checkRecipient = [];
          this.checkRecipientAll = [];
          this.result = []; 
          this.nominativiCaricati = 0;
          this.nominativiValidi = 0;
          this.nominativiInErrore = 0;         
          const text = reader.result as string;

          const parsedRows = this.parseCsv(text);
          
          // Estrai solo i recipients
          this.recipients = parsedRows.map(r => r.recipient);
          
          // Salva anche i bulletins, se presenti
          this.bulletins = parsedRows
              .filter(r => r.bulletin !== undefined)
              .map(r => r.bulletin!);

          console.log(this.bulletins);

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
              this.checkRecipientAll = this.checkRecipient;
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
    if (this.formFinale.valid) {

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
    openModalWithData(r: checkRecipient): void {
      // Riempie il form con i dati di r

      this.recipientBulletin.recipient = r.recipient!;

      if(this.bulletin){
        const bulletin = this.bulletins?.find(a => a.tempRecipientGuid == r.recipient?.tempGuid);
        this.recipientBulletin.bulletin = bulletin;
      }

      this.recipientBulletin.isValid = r.valido;
      const modalRef = this.modalService.open(EditRecipientComponent);
      modalRef.componentInstance.formData = this.recipientBulletin;
      modalRef.componentInstance.haveBulletin = this.bulletin;

    // Ascolta l'evento dataSaved
      modalRef.componentInstance.dataSaved.subscribe((updatedData: any) => {
        this.recipientBulletin = updatedData;
        this.recipientBulletin;
        modalRef.componentInstance.validChange.subscribe((v: any) => {
          if(v.valid && v.isChange){

            const obj = this.checkRecipient.find(
              r => r.recipient?.tempGuid === this.recipientBulletin.recipient.tempGuid
            );

            obj!.recipient = this.recipientBulletin.recipient;
            if(this.recipientBulletin.bulletin){
              let b = this.bulletins!.find(
                r => r.tempRecipientGuid === this.recipientBulletin.recipient.tempGuid
              );

              b = this.recipientBulletin.bulletin;
            }

            obj!.valido = true;
            obj!.errore = "";

            this.nominativiValidi += 1;
            this.nominativiInErrore -= 1;
            this.getFilterRecipients();

         }

        });
        
        modalRef.close(); // chiudi il modale manualmente
      });

      // Ascolta la chiusura (se usi @Output() close)
      modalRef.componentInstance.close?.subscribe(() => {
        modalRef.dismiss();
      });

    }

    getCheckRecipients(valid?:boolean | null){
      this.valid = valid;
      this.getFilterRecipients();
    };

    getFilterRecipients(){
      if(this.valid === null)
        this.checkRecipient = this.checkRecipientAll; 
      if(this.valid !)
        this.checkRecipient = this.checkRecipientAll.filter(r => r.valido);
      if(this.valid  === false)
        this.checkRecipient = this.checkRecipientAll.filter(r => !r.valido);        

    }

    get hasValidRecipients(): boolean {
      return this.checkRecipientAll?.some(r => r.valido) ?? false;
    }
}

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
import { checkRecipient, CheckRecipient } from '../../../interfaces/CheckRecipient';
import { FormStorageService } from '../../../services/form-storage.service';
import { bulletinFields, maxUploadLimit, secretKey } from '../../../../main';
import * as CryptoJS from 'crypto-js';
import { Bulletins } from '../../../classes/Bulletins';
import { filter, map, Observable, of, startWith } from 'rxjs';
import { GlobalServicesService } from '../../../services/global-services.service';
import { Comune } from '../../../interfaces/Comune';

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

  filteredCAPs: Observable<string[]> = of([]);
  comuni: Comune[] = [];
  comuniDaCap: Comune[] = [];

  alertName = alertName;
  alertComplName = alertComplName;
  alertAddress = alertAddress;
  alertComplAddress = alertComplAddress;
  alertProvince = alertProvince;
  alertState = alertState;

  alertBollNominativo = alertBollNominativo;
  alertBollIndirizzo = alertBollIndirizzo;
  alertBollCap = alertBollCap;
  alertBollLocalita = alertBollLocalita;
  
  isOne:boolean = true;

  notUploaded:boolean = true;
  checking:boolean = false;


  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private formStorage: FormStorageService,
    private globalServices: GlobalServicesService,
    private modalService: NgbModal,
    private cd: ChangeDetectorRef
  ) {
    this.form = this.fb.group({
      // eventuali altri controlli
    });
    this.formFinale = this.fb.group({
      // eventuali altri controlli
    });
  }

   getComuni(){
     this.globalServices.getComuni()
       .subscribe((data: Comune[]) => {
         if (!data || data.length === 0) {
           console.log('Nessun dato disponibile');
         } 
         else 
         {
           this.comuni = data;
           this.setListOfComuni();
         }
       });
   }
 
   setProvince(event: Event){
     const v = (event.target as HTMLSelectElement).value;
     const comune = this.comuni.filter(comune =>
           comune.denominazione_ita.startsWith(v!)
     );
 
     this.form.patchValue({
       provincia: comune[0].sigla_provincia
     });
 
   }
 
   setListOfComuni(){
 
     const capsUnici = Array.from(new Set(this.comuni.map(c => c.cap)));
 
     this.filteredCAPs = this.form.get('cap')!.valueChanges.pipe(
       startWith(''),
       map(value => value ?? ''), 
       filter((value: string | null): value is string => !!value && value.length >= 2),
       map(value => this._filterCAP(value, capsUnici))
     );

    console.log("attivo");

   }
 
   private _filterCAP(value: string, caps: string[]): string[] {
     const filterValue = value.trim();
     return caps.filter(cap => cap.startsWith(filterValue));
   }
 
   setInputCityProvince(event: MatAutocompleteSelectedEvent){
      const v = event.option.value;
      if(v){
 
       this.form.patchValue({
         provincia: ""
       });
 
       const comune = this.comuni.filter(comune =>
           comune.cap.startsWith(v!)
       );
       
       if(comune.length == 1)
       {
         this.isOne = true;
 
         this.form.patchValue({
           citta: comune[0].denominazione_ita,
           provincia: comune[0].sigla_provincia,
           stato: "ITALIA"
         });
 
       }
       else
       {
         this.isOne = false;
         this.comuniDaCap = comune;
         this.form.get('citta')?.setValue('');
      }
      }
   } 

  ngOnInit(): void {
    this.form = new FormGroup({
      rag_soc: new FormControl('', [Validators.required]),
      indirizzo: new FormControl('',[Validators.required]),
      compl_nom: new FormControl(''),
      cod_fisc: new FormControl(''),
      comp_indirizzo: new FormControl(''),
      cap: new FormControl('', [Validators.required, Validators.maxLength(5)]),
      provincia: new FormControl('', [Validators.required, Validators.maxLength(2)]),
      citta: new FormControl('', [Validators.required]),
      stato: new FormControl('', [Validators.required]),
      file: new FormControl('', [Validators.required]),
      tempGuid: new FormControl('', [Validators.required])
    });
    
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

          // Se c'è il bollettino, aggiungiamo i campi relativi
          if (this.bulletin) {
            this.form.addControl('conto_corrente', new FormControl('', [Validators.required]));
            this.form.addControl('eseguito_nominativo', new FormControl('', [Validators.required]));
            this.form.addControl('intestatario', new FormControl('', [Validators.required]));
            this.form.addControl('eseguito_indirizzo', new FormControl('', [Validators.required]));
            this.form.addControl('importo', new FormControl('', [Validators.required]));
            this.form.addControl('eseguito_localita', new FormControl('', [Validators.required]));
            this.form.addControl('codice_cliente', new FormControl('', [Validators.required]));
          }    

          this.setPopUpValidators();
      });

    this.getComuni();

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
    openModalWithData(templateRef: TemplateRef<any>, r: checkRecipient): void {
      // Riempie il form con i dati di r
      this.form.patchValue({
        rag_soc: r.recipient?.businessName || '',
        compl_nom: r.recipient?.complementName || '',
        cod_fisc: r.recipient?.fiscalCode || '',
        comp_indirizzo: r.recipient?.complementAddress || '',
        indirizzo: r.recipient?.address || '',
        cap: r.recipient?.zipCode || '',
        citta: r.recipient?.city || '',
        provincia: r.recipient?.province || '',
        stato: r.recipient?.state || '',
        file: r.recipient?.fileName || '',
        tempGuid: r.recipient?.tempGuid
      });

      if(this.bulletin){
        const bulletin = this.bulletins?.find(a=>a.tempRecipientGuid == r.recipient?.tempGuid);
        this.form.patchValue({
          conto_corrente: bulletin?.numeroContoCorrente || '',
          eseguito_nominativo: bulletin?.eseguitoDaNominativo || '',
          intestatario: bulletin?.intestatoA || '',
          eseguito_indirizzo: bulletin?.eseguitoDaIndirizzo || '',
          importo: (bulletin?.importoEuro || '').replace(',', '.'),
          eseguito_localita: bulletin?.eseguitoDaLocalita || '',
          codice_cliente: bulletin?.codiceCliente || ''
        });
      }

      const modalRef = this.modalService.open(templateRef, { centered: true, backdrop: 'static', keyboard: true });
      this.currentModalRef = modalRef;

    }

    setPopUpValidators(): void {
      const controls = [
        'rag_soc',
        'indirizzo',
        'cap',
        'citta',
        'provincia',
        'stato',
        'file',
      ];

      if(this.bulletin)
      {
        const addControls =[
          'conto_corrente',
          'eseguito_nominativo',
          'intestatario',
          'eseguito_indirizzo',
          'importo',
          'eseguito_localita',
          'codice_cliente'
        ];
        controls.push(...addControls);
      }

      controls.forEach(controlName => {
        const control = this.form.get(controlName);
        control?.setValidators([Validators.required]);
        control?.updateValueAndValidity();
      });
    }  

    onSubmitPopUpForm(){
      if (this.form.valid) 
      {
        const r = this.result.find(a => a.recipient.tempGuid == this.form.value.tempGuid);
        if (r) 
        {
          const obj = this.checkRecipient.find(
            r => r.recipient?.tempGuid === this.form.value.tempGuid
          );

          if (obj && obj.recipient) 
          {
            Object.assign(obj.recipient, {
              businessName: this.form.value.rag_soc,
              complementName: this.form.value.compl_nom,
              fiscalCode: this.form.value.cod_fisc,
              complementAddress: this.form.value.comp_indirizzo,
              address: this.form.value.indirizzo,
              zipCode: this.form.value.cap,
              city: this.form.value.citta,
              province: this.form.value.provincia,
              state: this.form.value.stato,
              fileName: this.form.value.file
            });

            // Ricalcola validazione e messaggi di errore se necessario
            FncUtils.getComuniList(this.http).subscribe({
              next: data => {
                const check =  CheckRecipient(obj.recipient!, data, true);
                obj.valido = check.valido;
                obj.errore = check.errore;

                if(obj.valido)
                {
                  if (this.currentModalRef) {
                    this.currentModalRef.close();
                  }
                  this.nominativiValidi += 1;
                  this.nominativiInErrore -= 1;
                  this.getFilterRecipients();
                }
                else
                {
                  this.alertMessage = true;
                  this.alertText = obj.errore;
                }

              }
            });
          }          
        } 
        else 
        {
          console.warn('Nessun destinatario trovato con tempGuid:', this.form.value.tempGuid);
        }
        
      }
      else 
      {
        this.alertMessage = true;
        this.alertText = 'Compila tutti i campi obbligatori correttamente.';
      }
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
}

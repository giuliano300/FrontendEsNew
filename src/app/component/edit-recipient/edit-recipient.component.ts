import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { alertAddress, alertBollCap, alertBollIndirizzo, alertBollLocalita, alertBollNominativo, alertComplAddress, alertComplName, alertName, alertProvince, alertState } from '../../enviroments/enviroments';
import { filter, map, Observable, of, startWith } from 'rxjs';
import { Comune } from '../../interfaces/Comune';
import { GlobalServicesService } from '../../services/global-services.service';
import { Recipients } from '../../classes/Recipients';
import { Bulletins } from '../../classes/Bulletins';
import { FncUtils } from '../../fncUtils/fncUtils';
import { HttpClient } from '@angular/common/http';
import { CheckRecipient } from '../../fncUtils/CheckRecipient';

@Component({
  selector: 'edit-recipient',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgbTooltipModule, MatAutocompleteModule],
  templateUrl: './edit-recipient.component.html',
  styleUrls: ['./edit-recipient.component.scss']
})
export class EditRecipientComponent {
  @Input() haveBulletin = false;
  @Input() alertMessage = false;
  @Input() alertText = '';

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


  @Input() formData: { recipient: Recipients, isValid: boolean, bulletin?: Bulletins } = 
  {
    recipient: new Recipients,
    bulletin: undefined,
    isValid: false
  };

  outPutData: { recipient: Recipients, bulletin?: Bulletins } = 
  {
    recipient: new Recipients,
    bulletin: undefined
  };

  @Output() dataSaved = new EventEmitter<{ recipient: Recipients, bulletin?: Bulletins }>();

  @Output() validChange = new EventEmitter<{valid:boolean, isChange:boolean}>();

  form: FormGroup;

  constructor(private fb: FormBuilder, 
    private globalServices: GlobalServicesService,     
    private http: HttpClient,
    public activeModal: NgbActiveModal) 
  {
    this.form = this.fb.group({
      
    });
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

    // Se c'è il bollettino, aggiungiamo i campi relativi
    if (this.haveBulletin) {
      this.form.addControl('conto_corrente', new FormControl('', [Validators.required]));
      this.form.addControl('eseguito_nominativo', new FormControl('', [Validators.required]));
      this.form.addControl('intestatario', new FormControl('', [Validators.required]));
      this.form.addControl('eseguito_indirizzo', new FormControl('', [Validators.required]));
      this.form.addControl('importo', new FormControl('', [Validators.required]));
      this.form.addControl('eseguito_localita', new FormControl('', [Validators.required]));
      this.form.addControl('codice_cliente', new FormControl('', [Validators.required]));
      this.form.addControl('annoDiRiferimento', new FormControl('', [Validators.required]));
      this.form.addControl('eseguitoDaCap', new FormControl('', [Validators.required]));
      this.form.addControl('codice_cliente', new FormControl('', [Validators.required]));
      this.form.addControl('iban', new FormControl(''));
      this.form.addControl('causale', new FormControl(''));
    }    


    this.form.patchValue({
      rag_soc: this.formData.recipient?.businessName || '',
      compl_nom: this.formData.recipient?.complementName || '',
      cod_fisc: this.formData.recipient?.fiscalCode || '',
      comp_indirizzo: this.formData.recipient?.complementAddress || '',
      indirizzo: this.formData.recipient?.address || '',
      cap: this.formData.recipient?.zipCode || '',
      citta: this.formData.recipient?.city || '',
      provincia: this.formData.recipient?.province || '',
      stato: this.formData.recipient?.state || '',
      file: this.formData.recipient?.fileName || '',
      tempGuid: this.formData.recipient?.tempGuid
    });

    if(this.haveBulletin){
      this.form.patchValue({
        conto_corrente: this.formData.bulletin?.numeroContoCorrente || '',
        eseguito_nominativo: this.formData.bulletin?.eseguitoDaNominativo || '',
        intestatario: this.formData.bulletin?.intestatoA || '',
        eseguito_indirizzo: this.formData.bulletin?.eseguitoDaIndirizzo || '',
        importo: (this.formData.bulletin?.importoEuro || '').replace(',', '.'),
        eseguito_localita: this.formData.bulletin?.eseguitoDaLocalita || '',
        codice_cliente: this.formData.bulletin?.codiceCliente || '',
        annoDiRiferimento: this.formData.bulletin?.annoDiRiferimento || '',
        eseguitoDaCap: this.formData.bulletin?.eseguitoDaCap || '',
        iban: this.formData.bulletin?.iban || '',
        causale: this.formData.bulletin?.causale || ''
      });
    }

    this.getComuni();

  }

  dismiss() {
    this.activeModal.dismiss('Chiudi cliccato');
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


    onSubmitPopUpForm(){
      if (this.form.valid) 
      {
          Object.assign(this.outPutData.recipient , {
            businessName: this.form.value.rag_soc,
            complementName: this.form.value.compl_nom,
            fiscalCode: this.form.value.cod_fisc,
            complementAddress: this.form.value.comp_indirizzo,
            address: this.form.value.indirizzo,
            zipCode: this.form.value.cap,
            city: this.form.value.citta,
            province: this.form.value.provincia,
            state: this.form.value.stato,
            fileName: this.form.value.file,
            tempGuid: this.form.value.tempGuid
          });
          if(this.haveBulletin)
            this.outPutData.bulletin = new Bulletins({
              numeroContoCorrente: this.form.value.conto_corrente,
              intestatoA: this.form.value.intestatario,
              importoEuro: this.form.value.importo,
              eseguitoDaNominativo: this.form.value.eseguito_nominativo,
              eseguitoDaIndirizzo: this.form.value.eseguito_indirizzo,
              eseguitoDaLocalita: this.form.value.eseguito_localita,
              annoDiRiferimento: this.form.value.annoDiRiferimento,
              eseguitoDaCap: this.form.value.eseguitoDaCap,
              codiceCliente: this.form.value.codice_cliente,
              iban: this.form.value.iban,
              causale: this.form.value.causale,
              tempRecipientGuid: this.form.value.tempGuid
            });

          // Ricalcola validazione e messaggi di errore se necessario
          FncUtils.getComuniList(this.http).subscribe({
            next: data => {
              const check =  CheckRecipient(this.outPutData.recipient!, data, true);

              if(!check.valido)
              {
                this.alertMessage = true;
                this.alertText = check.errore;
              }
              else
              {
                this.dataSaved.emit(this.outPutData);
                this.validChange.emit({valid: check.valido, isChange: !this.formData.isValid});
                this.activeModal.close();
              }

            }
          });
      }          
      else 
      {
        this.alertMessage = true;
        this.alertText = 'Compila tutti i campi obbligatori correttamente.';
      }
   }
  
  }

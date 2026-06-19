import { AppTourService } from '@app/services/app-tour.service';
import { AppStorageService } from '@app/services/app-storage.service';
import { UiTourRestartComponent, UiAlertComponent } from '@app/shared/ui';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { alertBollCap, alertBollIndirizzo, alertBollLocalita, alertBollNominativo } from '../../enviroments/enviroments';
import { Users } from '../../interfaces/Users';
import { FormStorageService } from '../../services/form-storage.service';
import {  bulletin, secretKey  } from '@app/config/app-constants';
import { ProductTypes } from '../../interfaces/EnumTypes';
import { CryptoJS } from '@app/utils/crypto';
import { Bulletins } from '../../classes/Bulletins';
import { Recipients } from '../../classes/Recipients';
import { ShepherdService } from 'angular-shepherd';
import { Placement as PopperPlacement } from '@popperjs/core';
import { TourPage } from '../../interfaces/EnumTypes';
import { TourSeen } from '../../interfaces/TourSeen';
import { ComuniItaliani } from '../../interfaces/ComuniItaliani';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from '../../services/utility.service';



@Component({
  selector: 'app-compila-bollettino',
  imports: [UiAlertComponent, UiTourRestartComponent, ReactiveFormsModule, CommonModule, RouterLink, NgbModule],
  templateUrl: './compila-bollettino.component.html',
  styleUrl: './compila-bollettino.component.scss'
})
export class CompilaBollettinoComponent {
  
  
  private appTour = inject(AppTourService);
private appStorage = inject(AppStorageService);
constructor(
    private http: HttpClient, 
    private router: Router, 
    private utilService: UtilityService, 
    private formStorage: FormStorageService, 
    private shepherdService: ShepherdService) {}

  page: number = TourPage.compilaBollettino;

  alertMessage = false;
  alertText = '';
  alertBollNominativo = alertBollNominativo;
  alertBollIndirizzo = alertBollIndirizzo;
  alertBollCap = alertBollCap;
  alertBollLocalita = alertBollLocalita;
  user: Users | null = null;
  productName: string | null = null;
  productType: number | null = null;
  recipients: Recipients[] | null = null;

  backLink: string | null = null;

  comuniItaliani: ComuniItaliani[] = [];
  
  form = new FormGroup({
    conto_corrente: new FormControl('', [Validators.required]),
    eseguito_nominativo: new FormControl('', [Validators.required]),
    anno_riferimento: new FormControl('', [Validators.required]),
    intestatario: new FormControl('', [Validators.required]),
    eseguito_indirizzo: new FormControl('', [Validators.required]),
    eseguito_cap: new FormControl('', [Validators.required, Validators.maxLength(5)]),
    importo: new FormControl('', [Validators.required]),
    eseguito_localita: new FormControl('', [Validators.required]),
    codice_cliente: new FormControl('', [Validators.required]),
    causale: new FormControl('', [Validators.required]),
    iban: new FormControl(''),
  });


  ngOnInit(): void {
    Promise.all([
      this.formStorage.getForm('step2'),
      this.formStorage.getForm('destinatari'),
    ]).then(([step1, step2]) => {
      const datiDecriptati = JSON.parse(CryptoJS.AES.decrypt(step1, secretKey).toString(CryptoJS.enc.Utf8));
      const destinatari = JSON.parse(CryptoJS.AES.decrypt(step2, secretKey).toString(CryptoJS.enc.Utf8));

      this.recipients = destinatari;

      this.productType = datiDecriptati.prodotto;

      switch(parseInt(datiDecriptati.prodotto)){
          case ProductTypes.ROL: 
          case ProductTypes.MOL: 
            this.productName = "raccomandata";
            this.backLink = "/invioSingoloRaccomandata5";
            break;
          case ProductTypes.LOL: 
          case ProductTypes.COL1: 
          case ProductTypes.COL4: 
            this.productName = "lettera";
            this.backLink = "/invioSingoloLettera5";
           break;
      }

      this.http
        .get<ComuniItaliani[]>('assets/json/comuniItaliani.json')
        .subscribe(data => {
          this.comuniItaliani = data;
        });


      this.getTourInThisPage();

    })

  }

  GetclientCode(){
    const cap = this.form.value.eseguito_cap;
    const annoDiRiferimento = this.form.value.anno_riferimento;
    if(cap && annoDiRiferimento)
    {
      const code = this.utilService.getCodiceClienteBollettino(annoDiRiferimento, cap, this.comuniItaliani);
      const control = this.form.get('codice_cliente') as FormControl;
    
      if (control) {
        control.setValue(code);
      }    
    }
  }


  onSubmit(): void {
   
    if (this.form.valid) {

      let b: Bulletins = new Bulletins();
      Object.assign(b, {
        numeroContoCorrente: this.form.value.conto_corrente,
        intestatoA: this.form.value.intestatario,
        importoEuro: this.form.value.importo?.toString(),
        eseguitoDaNominativo: this.form.value.eseguito_nominativo,
        eseguitoDaIndirizzo: this.form.value.eseguito_indirizzo,
        eseguitoDaLocalita: this.form.value.eseguito_localita,
        annoDiRiferimento: this.form.value.anno_riferimento,
        eseguitoDaCap: this.form.value.eseguito_cap,
        codiceCliente: this.form.value.codice_cliente,
        causale: this.form.value.causale,
        productType: this.productType,
        iban: this.form.value.iban,
        tempRecipientGuid: this.recipients![0].tempGuid
      });

      let bs: Bulletins[] = [];
      bs.push(b);

      const encrypted = CryptoJS.AES.encrypt(JSON.stringify(bs), secretKey).toString();
      this.formStorage.saveForm('bollettini', encrypted);

      this.router.navigate(['/calcoloPreventivo']);
    } 
    else 
    {
      this.alertMessage = true;
      this.alertText = 'Compila tutti i campi obbligatori correttamente.';
    }
  }

      startTour() {
      const steps = [
        {
          id: 'compilabollettino',
          text: 'Avvia una <strong>nuova spedizione</strong> direttamente da qui.',
          attachTo: {
            element: '.step-1',
            on: 'bottom' as PopperPlacement
          },
          modalOverlayOpeningPadding: 14,
          modalOverlayOpeningRadius: 5,
          classes: 'margin-step-y', 
          buttons: [
            { text: 'X Chiudi tour', action: () => this.shepherdService.complete(), classes:"close" },
            { text: 'Avanti', action: () => this.shepherdService.next() }
          ]
        },
        {
          id: 'compilabollettino2',
          text: "Clicca su <strong>'AVANTI'</strong> per continuare, oppure su <strong>'INDIETRO'</strong> per tornare allo step precedente.",
          attachTo: {
            element: '.step-end',
            on: 'bottom' as PopperPlacement
          },
          modalOverlayOpeningPadding: 14,
          modalOverlayOpeningRadius: 5,
          classes: 'margin-step-y', 
          buttons: [
            { text: 'Fine', action: () => this.shepherdService.complete() }
          ]
        }

      ];
    this.appTour.start(this.page, steps);

  }

  
  //COPIARE SENZA TOCCARE
  restartTour(){
    this.startTour();
  }

  getTourInThisPage(){
    let userTourPage: TourSeen[] = JSON.parse(this.appStorage.getItem("userTourPage")?.toString() || "[]");
    if(!userTourPage.some(tour => tour.page === this.page))
      this.startTour();
  }

  ///////////////////////////




}
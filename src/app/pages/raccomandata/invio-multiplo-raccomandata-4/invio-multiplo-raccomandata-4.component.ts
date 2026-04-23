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
import { ShepherdService } from 'angular-shepherd';
import { Placement as PopperPlacement } from '@popperjs/core';
import { TourPage } from '../../../interfaces/EnumTypes';
import { TourSeen } from '../../../interfaces/TourSeen';
import { TourSeenService } from '../../../services/tourSeen.service';
import { UploadZipComponent } from "../../../component/upload-zip/upload-zip.component";



@Component({
  selector: 'app-invio-multiplo-raccomandata-4',
  imports: [CommonModule, ReactiveFormsModule, NgxFileDropModule, RouterLink, UploadZipComponent],
  templateUrl: './invio-multiplo-raccomandata-4.component.html',
  styleUrl: './invio-multiplo-raccomandata-4.component.scss'
})
export class InvioMultiploRaccomandata4Component {

  form: FormGroup;
  uploadProgress: number | null = null;
  uploadCompleted: boolean = false;
  errorMessage: string | null = null;
  pdfBase64List: PdfBase64List[] = [];
  recipients: Recipients[] = [];
  checkRecipient: checkRecipient[] = [];
  checking:boolean = false;
  sincro: boolean = false;
  
  nominativiCaricati: number = 0;
  nominativiValidi: number = 0;
  nominativiInErrore: number = 0;
  bulletin: string = "senza bollettino";
  loaded = false;
  
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private formStorage: FormStorageService,
    private shepherdService: ShepherdService, 
    private tourService: TourSeenService

  ) {
    this.form = this.fb.group({
      // eventuali altri controlli
    });
  }

  page: number = TourPage.raccomandataMultipla4;

  ngOnInit(): void {
      Promise.all([
        this.formStorage.getForm('step2'),
        this.formStorage.getForm('destinatari')
      ]).then(([step1, step2]) => {
        if(!step1)
          this.router.navigate(['/']);
  
          const datiDecriptati = JSON.parse(CryptoJS.AES.decrypt(step1, secretKey).toString(CryptoJS.enc.Utf8));
          if(datiDecriptati.bollettino == 1)
            this.bulletin = "con bollettino";
  
          const r = JSON.parse(CryptoJS.AES.decrypt(step2, secretKey).toString(CryptoJS.enc.Utf8));
          this.recipients = r;
          if(this.recipients.length > 0)
            this.loaded = true;
      })

      this.getTourInThisPage();
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


  startTour() {
      const steps = [
        {
          id: 'uploadmulti',
          text: 'Carcia i file pdf in un archivio .ZIP',
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
          id: 'uploadmulti2',
          text: 'In questa sezione verrà visualizzato il risultato del caricamento con eventuali errori.',
          attachTo: {
            element: '.step-2',
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
          id: 'uploadmultiend',
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

    // Abilita il dark overlay
    this.shepherdService.modal = true;

    // Opzioni di default per tutti gli step
    this.shepherdService.defaultStepOptions = {
      scrollTo: true,
      cancelIcon: { enabled: true },
      classes: 'shepherd-theme-arrows'
    };

    // Carica e avvia il tour
    this.shepherdService.addSteps(steps);

    // Ritarda il primo step
    setTimeout(() => {
      this.shepherdService.start();
      this.completeTour();
    }, 300);

  }

  
  //COPIARE SENZA TOCCARE
  restartTour(){
    this.startTour();
  }
  
  completeTour()
  {
    this.shepherdService.tourObject?.on('complete', () => {
      this.tourService.setTourSeen(this.page).subscribe();
    });
  }

  getTourInThisPage(){
    let userTourPage: TourSeen[] = JSON.parse(localStorage.getItem("userTourPage")?.toString() || "[]");
    if(!userTourPage.some(tour => tour.page === this.page))
      this.startTour();
  }

  ///////////////////////////


}

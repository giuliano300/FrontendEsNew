import { AppTourService } from '@app/services/app-tour.service';
import { AppStorageService } from '@app/services/app-storage.service';
import { UiTourRestartComponent, UiAlertComponent } from '@app/shared/ui';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import {  bulletin, secretKey  } from '@app/config/app-constants';
import { UserLogos } from '../../../interfaces/UserLogos';
import { UserLogosService } from '../../../services/user-logos.service';
import { Users } from '../../../interfaces/Users';
import { UserSendersService } from '../../../services/user-senders.service';
import { GlobalServicesService } from '../../../services/global-services.service';
import { FormStorageService } from '../../../services/form-storage.service';
import { alertAddress, alertComplAddress, alertComplName, alertMailDest, alertName, alertProvince, alertState } from '../../../enviroments/enviroments';
import { Observable, of } from 'rxjs';
import { Comune } from '../../../interfaces/Comune';
import { UserSenders } from '../../../interfaces/UserSenders';
import { CryptoJS } from '@app/utils/crypto';
import { ShepherdService } from 'angular-shepherd';
import { Placement as PopperPlacement } from '@popperjs/core';
import { ProductTypes, TourPage } from '../../../interfaces/EnumTypes';
import { TourSeen } from '../../../interfaces/TourSeen';
import { UserProducts } from '@app/interfaces/UserProducts';
import { UtilityService } from '@app/services/utility.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddSenderModalComponent } from '../../../component/select-sender/select-sender/add-sender-modal.component';


@Component({
  selector: 'app-invio-multiplo-lettera-2',
  imports: [UiAlertComponent, UiTourRestartComponent, ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './invio-multiplo-lettera-2.component.html',
  styleUrl: './invio-multiplo-lettera-2.component.scss'
})
export class InvioMultiploLettera2Component {
  
  
  private appTour = inject(AppTourService);
private appStorage = inject(AppStorageService);
private utilityService = inject(UtilityService);
constructor(private router: Router, 
      private userSendersService: UserSendersService, 
      private userLogosService: UserLogosService, 
      private globalServices: GlobalServicesService,     
      private formStorage: FormStorageService,
      private shepherdService: ShepherdService,
      private modalService: NgbModal
) {}

    page: number = TourPage.letteraMultipla2;
      
    alertMessage = false;
    alertText = '';

    alertName = alertName;
    alertComplName = alertComplName;
    alertAddress = alertAddress;
    alertComplAddress = alertComplAddress;
    alertProvince = alertProvince;
    alertState = alertState;
    alertMailDest= alertMailDest;

    //FILTRO CAP
    filteredCAPs: Observable<string[]> = of([]);
    comuni: Comune[] = [];
    comuniDaCap: Comune[] = [];
    isOne:boolean = true;


    bulletin: string | null = "senza bollettino";

    userLogos: UserLogos[] =[];
    userSenders: UserSenders[] =[];
    userSender: UserSenders | null = null;

    user: Users | null  = null;

    isHidden: boolean = true;


  form = new FormGroup({
    sel_logo: new FormControl(''),
    sel_mittente: new FormControl('', [Validators.required]),
    tipoFormato: new FormControl('A4', [Validators.required]),
    tipoColore: new FormControl('', [Validators.required]),
    tipoStampa: new FormControl('', [Validators.required]),
    tipoLettera: new FormControl('Posta1', [Validators.required]),

  });

  ngOnInit() {
    this.getTourInThisPage();

    const user = this.appStorage.getItem('user');
      if (!user) {
        this.router.navigate(['/']);
        return;
      }

    this.user! = JSON.parse(user!);
    
    const bul = this.appStorage.getItem('bulletin')!;
      if(parseInt(bul) == bulletin.si)
        this.bulletin = "con bollettino";

    this.getUserLogos();
    this.getUserSenders();

    const userProducts: UserProducts[] = JSON.parse(this.appStorage.getItem('userProducts') || 'null');
      if(userProducts.some(product => product.type == ProductTypes.COL1))
        this.isHidden = false;
  }

  setFormSenderUser(){
    this.removeErroMessage();
    const selectedValue = this.form.get('sel_mittente')?.value;
    if (selectedValue === '__add_sender__') {
      this.addSender(this.userSender?.id?.toString() || '');
      return;
    }
    if(selectedValue != "")
      this.getUserSender(parseInt(selectedValue!));
  }

  getUserSenders(){
    this.userSendersService.getUserSenders(this.user!.id!)
      .subscribe((data: UserSenders[]) => {
        if (!data || data.length === 0) {
        } 
        else 
        {
          this.userSenders = data;
        }
      });
  }

    getUserSender(id: number){
    this.userSendersService.getUserSender(id)
      .subscribe((data: UserSenders) => {
        if (!data) {
        } 
        else 
        {
          this.userSender = data;
        }
    });
  }

  addSender(previousSelection = ''): void {
    const modalRef = this.modalService.open(AddSenderModalComponent, {
      size: 'lg',
      centered: true,
      scrollable: true,
      windowClass: 'sender-quick-add-modal'
    });
    modalRef.componentInstance.userId = this.user!.id!;
    modalRef.componentInstance.userParentId = this.user!.parentId || 0;

    modalRef.closed.subscribe((sender: UserSenders) => {
      this.userSenders = [...this.userSenders, sender];
      this.userSender = sender;
      this.form.patchValue({ sel_mittente: sender.id?.toString() || '' });
      this.removeErroMessage();
    });
    modalRef.dismissed.subscribe(() => this.form.patchValue({ sel_mittente: previousSelection }));
  }

  getUserLogos(){
    this.userLogosService.getUserLogos(this.user!.id!)
    .subscribe((data: UserLogos[]) => {
      if (!data || data.length === 0) {
      } 
      else 
      {
        this.userLogos = data;
      }
    });
  }

  onSubmit(): void {
      const errors: string[] = [];

      const selMittente = this.form.value.sel_mittente;
      const tipoFormato = this.form.value.tipoFormato;
      const tipoColore = this.form.value.tipoColore;
      const tipoStampa = this.form.value.tipoStampa;
      const tipoLettera = this.form.value.tipoLettera;

      // Costruisce lista errori se manca qualcosa
      if (!selMittente) errors.push('Mittente');
      if (!tipoFormato) errors.push('Formato');
      if (!tipoColore) errors.push('Colore');
      if (!tipoStampa) errors.push('Stampa');
      if (!tipoLettera) errors.push('Tipo Lettera');

      if (errors.length > 0) {
        this.alertText = `${errors.join(', ')}.`;
        this.alertMessage = true;
        return;
      }

      const productType = Number(this.appStorage.getItem('productType'));
      const effectiveProduct = this.utilityService.getRealProduct(productType, tipoLettera!);
      const effectivePosteType = effectiveProduct === ProductTypes.COL4 ? 'Posta4' : tipoLettera;

      const datiForm = {
        selLogo: this.form.value.sel_logo,
        tipoFormato: this.form.value.tipoFormato,
        tipoColore: this.form.value.tipoColore,
        tipoStampa: this.form.value.tipoStampa,
        tipoLettera: effectivePosteType,
        tipoinvio: this.appStorage.getItem('sendType'),
        prodotto: this.appStorage.getItem('productType'),
        bollettino:  this.appStorage.getItem('bulletin'),
      };

      const encryptedStep2 = CryptoJS.AES.encrypt(JSON.stringify(datiForm), secretKey).toString();

      this.formStorage.saveForm('step2', encryptedStep2);

      const mittente = this.userSender!;

    const encryptedMittente = CryptoJS.AES.encrypt(JSON.stringify(mittente), secretKey).toString();

    this.formStorage.saveForm('mittente', encryptedMittente);

    
      // Se tutti sono presenti, vai alla pagina
      this.router.navigate(['/invioMultiploLettera3']);
  }

    removeErroMessage(): void {
      this.alertMessage = false;
      this.alertText = '';
    }

  startTour() {
    const steps = [
      {
        id: 'multiplelettera',
        text: "Seleziona un mittente dal menu a tendina oppure aggiungine uno alla rubrica con il pulsante dedicato.",
        attachTo: {
          element: '.step-1',
          on: 'bottom' as PopperPlacement,
        },
        modalOverlayOpeningPadding: 15, // evidenzia con margine
        modalOverlayOpeningRadius: 5,   // bordo arrotondato
        classes: 'margin-step-y', 
        buttons: [
          { text: 'X Chiudi tour', action: () => this.shepherdService.complete(), classes:"close" },
          { text: 'Avanti', action: () => this.shepherdService.next() }
        ]
      },
      {
        id: 'multipleletter2',
        text: "Seleziona il logo dalla lista.<br>Una volta selezionato apparir� nel frontespizio della tua comunicazione.",
        attachTo: {
          element: '.step-2',
          on: 'bottom' as PopperPlacement,
        },
        modalOverlayOpeningPadding: 15, // evidenzia con margine
        modalOverlayOpeningRadius: 5,   // bordo arrotondato
        classes: 'margin-step-y', 
        buttons: [
          { text: 'X Chiudi tour', action: () => this.shepherdService.complete(), classes:"close" },
          { text: 'Avanti', action: () => this.shepherdService.next() }
        ]
      },
      {
        id: 'multipleletter3',
        text: "Imposta la lettera selezionando il formato, la stampa (fronte o fronte/retro) e il tipo lettera (P1 o P4).",
        attachTo: {
          element: '.step-3',
          on: 'bottom' as PopperPlacement,
        },
        modalOverlayOpeningPadding: 15, // evidenzia con margine
        modalOverlayOpeningRadius: 5,   // bordo arrotondato
        classes: 'margin-step-y', 
        buttons: [
          { text: 'X Chiudi tour', action: () => this.shepherdService.complete(), classes:"close" },
          { text: 'Avanti', action: () => this.shepherdService.next() }
        ]
      },
      {
        id: 'multipleletteraend',
        text: "Clicca su <strong>'AVANTI'</strong> per continuare, oppure su <strong>'INDIETRO'</strong> per tornare allo step precedente.",
        attachTo: {
          element: '.step-end',
          on: 'bottom' as PopperPlacement,
        },
        modalOverlayOpeningPadding: 15, // evidenzia con margine
        modalOverlayOpeningRadius: 5,   // bordo arrotondato
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

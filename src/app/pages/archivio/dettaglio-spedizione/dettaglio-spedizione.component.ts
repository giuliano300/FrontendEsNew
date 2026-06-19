import { AppTourService } from '@app/services/app-tour.service';
import { AppStorageService } from '@app/services/app-storage.service';
import { UiTourRestartComponent } from '@app/shared/ui';
import { Component, ViewChild, ViewEncapsulation, inject } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { infoBtnDownload } from '../../../enviroments/enviroments';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GetDettaglioSpedizioneResponse } from '../../../interfaces/GetDettaglioSpedizioneResponse';
import { OperationService } from '../../../services/operation.service';
import { Options, ProductTypeDescriptions, ProductTypes, RR } from '../../../interfaces/EnumTypes';
import { FncUtils } from '../../../fncUtils/fncUtils';
import { Prices } from '../../../fncUtils/getPrices';
import { GetDettaglioDestinatario } from '../../../interfaces/GetDettaglioDestinatario';
import { RecipientService } from '../../../services/recipient.service';
import { CommonModule } from '@angular/common';
import { AlertDialogComponent } from '../../../component/alert-dialog/alert-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Users } from '../../../interfaces/Users';
import { UserProducts } from '../../../interfaces/UserProducts';
import { UserOptions } from '../../../interfaces/UserOptions';
import { ModalSpedizioneComponent } from '../../../component/modal-spedizione/invii/modal-spedizione.component';
import { ShepherdService } from 'angular-shepherd';
import { Placement as PopperPlacement } from '@popperjs/core';
import { TourPage } from '../../../interfaces/EnumTypes';
import { TourSeen } from '../../../interfaces/TourSeen';
import { getItalianPaginatorIntl } from '../../../mat-paginator-it';



@Component({
  selector: 'app-dettaglio-spedizione',
  imports: [UiTourRestartComponent, MatTableModule, MatPaginatorModule, MatSortModule, MatIconModule, MatProgressBarModule, NgbModule, ReactiveFormsModule, CommonModule],
  providers: [
    { provide: MatPaginatorIntl, useValue: getItalianPaginatorIntl() }
  ],
  templateUrl: './dettaglio-spedizione.component.html',
  styleUrl: './dettaglio-spedizione.component.scss'
})
export class DettaglioSpedizioneComponent {
  
  
  private appTour = inject(AppTourService);
private appStorage = inject(AppStorageService);
constructor(
    private router: Router, 
    private  route: ActivatedRoute,
    private modalService: NgbModal,
    private operationservice: OperationService,
    private recipientService: RecipientService, 
    private dialog: MatDialog,
    private shepherdService: ShepherdService
  ) {}

  page: number = TourPage.dettaglioSpedizione;

  displayedColumns: string[] = ['businessName', 'address', 'valid', 'insertDate', 'code', 'status', 'actions'];

  infoBtnDownload = infoBtnDownload;
  currentModalRef: any;
  id: number | null = null;
  getDettaglioSpedizioniResponse: GetDettaglioSpedizioneResponse | null = null;
  dataSource = new MatTableDataSource<any>([]);
  totalRecords: number = 0;
  modalData: GetDettaglioDestinatario | null =  null;

  user: Users | null = null;
  userProducts: UserProducts[] = [];
  userOptions: UserOptions[] = [];

  getRR: boolean = false;
  isLoaded: boolean = false;

  firstLoading: boolean = false;

  isDowloadingFiles: boolean = false;
  isDowloadingFilesRR: boolean = false;

  search: boolean = false;

  pageIndex = 0;
  pageSize = 20;

  ngOnInit() {

    const user = this.appStorage.getItem('user');
    if (!user) {
      this.router.navigate(['/']);
      return;
    }

    this.firstLoading = true;

    this.user! = JSON.parse(user!);
    
    const userOptionsString = this.appStorage.getItem('userOptions');
    this.userOptions = userOptionsString ? JSON.parse(userOptionsString) as UserOptions[] : [];

    const userProductsString = this.appStorage.getItem('userProducts');
    this.userProducts = userProductsString ? JSON.parse(userProductsString) as UserProducts[] : [];

    this.route.paramMap.subscribe(params => {
      this.id = parseInt(params.get('id')!);
      //console.log('ID ricevuto:', this.id);
      this.operationservice.getDettaglioSpedizione(this.id, '', '', '', this.pageIndex + 1, this.pageSize)
      .subscribe(response => {
        this.getDettaglioSpedizioniResponse = response;

        this.firstLoading = false;

        if(response.data.operation.operationType == ProductTypes.ROL && this.userOptions.some(a => a.enabled && a.optionId == Options.rr)){
          this.getRR = true;
          this.displayedColumns.push('actions2');
        }

        this.displayedColumns.push('action3');

        this.totalRecords = response.totalCount;
        
        this.dataSource.data = response.data.recipients;    
        
        this.isLoaded = true;
      })
    });

    this.getTourInThisPage();
  }

  onPaginateChange(event: PageEvent) {

    this.firstLoading = true;
    this.pageIndex = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    const businessName = this.form.value.destinatario;
    const code = this.form.value.codice;
    const valid  = this.form.value.sel_esito;

    this.operationservice.getDettaglioSpedizione(this.id!, businessName, code, valid?.toString(), this.pageIndex, this.pageSize)
      .subscribe(response => {
        this.getDettaglioSpedizioniResponse = response;
        
        this.dataSource = new MatTableDataSource(response.data.recipients); // <-- Ricrea
        this.totalRecords = response.totalCount;      
        this.isLoaded = true;
        this.firstLoading = false;
    })
  }
    
  filterData(){
    this.search = true;
    this.firstLoading = true;
    this.pageIndex = 1;
    this.pageSize = 20;
    const businessName = this.form.value.destinatario;
    const code = this.form.value.codice;
    const valid  = this.form.value.sel_esito;

      this.operationservice.getDettaglioSpedizione(this.id!, businessName, code, valid?.toString(), this.pageIndex, this.pageSize)
        .subscribe(response => {
          this.getDettaglioSpedizioniResponse = response;
          
          this.dataSource = new MatTableDataSource(response.data.recipients);
          this.totalRecords = response.totalCount;      
          this.isLoaded = true;
          this.search = false;
          this.firstLoading = false;
        })
  }


  form = new FormGroup({
    destinatario: new FormControl(''),
    codice: new FormControl(''),
    sel_esito: new FormControl(''),
  });
  
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;
  
  
  
    ngAfterViewInit() {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  
    applyFilter(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    openModal(id: number) {
      this.recipientService.getDettaglioDestinatario(id)
        .subscribe(response => {
          this.currentModalRef = this.modalService.open(ModalSpedizioneComponent, { size: 'lg' });
          this.currentModalRef.componentInstance.modalData = response;
      })
    }

    // Metodo per navigare e chiudere il modal
    navigateAndClose(route: string) {
      if (this.currentModalRef) {
        this.currentModalRef.close();
      }
      this.router.navigate([route]);
    }

  getProductName(type: ProductTypes): string{
    return ProductTypeDescriptions[type]
  }
   
  getDate(date:string): string{
    return FncUtils.GetFormattedData(date);
  } 

  getPrices(): Prices{
    const recipients = this.getDettaglioSpedizioniResponse?.data.recipients;
    if (!recipients) return new Prices;
  
    const round = (val: number) => parseFloat(val.toFixed(2));

    const price = round(recipients.reduce((acc, a) => acc + (a.price ?? 0), 0));
    const vat = round(recipients.reduce((acc, a) => acc + (a.vatPrice ?? 0), 0));
    const totalPrice = round(recipients.reduce((acc, a) => acc + (a.totalPrice ?? 0), 0));

    const prices: Prices = new Prices;
    prices.price = price;
    prices.vatPrice = vat;
    prices.totalPrice = totalPrice;
    return prices;
  }


  goBack(){
    this.router.navigate(['/archivioSpedizioni']);
  }

  downloadFile(doc: string, element: any){
    this.recipientService.getFile(doc, element.id)
    .subscribe(response => {
      if(!response)
      {
        this.openDialog("Documento non disponibile","Il documento richiesto non è disponibile per il download.");
        return;
      }

      const blob = FncUtils.getFileFromBase64(response);

      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'documento.pdf';
      link.click();

      window.URL.revokeObjectURL(link.href);
      
    });


  }

  filterRemove(){
    this.form.reset({
      sel_esito: ''
    });
    this.filterData();
  }

  openDialog(title: string, message: string){
    const dialogRef = this.dialog.open(AlertDialogComponent, {
      width: '400px',
      data: { 
        title: title,
        message: message
       }  
    });
  }


  downloadAllFilesAsZip(rr: boolean = true) {

    let doc = "attachedFile";
    if(rr){
      this.isDowloadingFilesRR = true;
      doc = "rr";
    }
    else
      this.isDowloadingFiles = true;

    this.recipientService.getAllFiles(doc, this.id!)
    .subscribe({
      next: (blob) => {
        const a = document.createElement('a');
        const url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = 'files.zip';
        a.click();
        window.URL.revokeObjectURL(url);
        this.isDowloadingFiles = false;
        this.isDowloadingFilesRR = false;
      },
      error: (err) => {
        if (err.status === 404) {
          this.openDialog("Documenti non disponibili","Non ci sono documenti disponibili per il download.");
        } else {
          this.openDialog("Errore","Si è verificato un errore durante il download.");
        }
        this.isDowloadingFiles = false;
        this.isDowloadingFilesRR = false;
      }
    });  
  }

  startTour() {
      const steps = [
        {
          id: 'dettagliosped1',
          text: "Questa sezione mostra i dettagli del lotto, come il codice di spedizione, il tipo di prodotto, il numero totale di destinatari, la data di creazione e il prezzo.",
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
          id: 'dettagliosped2',
          text: "Questa sezione consente di effettuare una ricerca per singolo destinatario utilizzando il nome, il codice o l'esito della spedizione.",
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
          id: 'dettagliosped3',
          text: "In questa tabella sono elencati i destinatari di ciascun lotto di spedizione, con i relativi dati:<br> nominativo, indirizzo, esito della spedizione, codice identificativo e data di accettazione.",
          attachTo: {
            element: '.step-3',
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
          id: 'dettagliosped4',
          text: "Clicca sul link per accedere alla pagina 'Dove e Quando' di Poste Italiane e consultare lo stato aggiornato della spedizione.",
          attachTo: {
            element: '.step-4',
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
          id: 'dettagliosped5',
          text: "Cliccando sul pulsante puoi scaricare il documento inviato a ciascun destinatario della spedizione.",
          attachTo: {
            element: '.step-5',
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
          id: 'dettagliospedend',
          text: "Clicca sul pulsante per scaricare la ricevuta di accettazione.",
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
        },
        

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
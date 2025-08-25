import { Component, ElementRef, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgbModal, NgbModalRef, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { infoBtnDownload } from '../../../enviroments/enviroments';
import { constPageIndex, constPageSize } from '../../../../main';
import { RecipientService } from '../../../services/recipient.service';
import { Users } from '../../../interfaces/Users';
import { FncUtils } from '../../../fncUtils/fncUtils';
import { CommonModule } from '@angular/common';
import { ModalSpedizioneComponent } from '../../../component/modal-spedizione/invii/modal-spedizione.component';
import { ShepherdService } from 'angular-shepherd';
import { Placement as PopperPlacement } from '@popperjs/core';
import { TourPage } from '../../../interfaces/EnumTypes';
import { TourSeen } from '../../../interfaces/TourSeen';
import { TourSeenService } from '../../../services/tourSeen.service';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent } from '../../../component/alert-dialog/alert-dialog.component';
import { getItalianPaginatorIntl } from '../../../mat-paginator-it';
import { GetReportSpedizioni } from '../../../interfaces/GetReportSpedizioni';


@Component({
  selector: 'app-report-spedizioni',
  imports: [MatTableModule, MatPaginatorModule, MatSortModule, MatIconModule, MatProgressBarModule, NgbModule, ReactiveFormsModule, CommonModule],
  providers: [
    { provide: MatPaginatorIntl, useValue: getItalianPaginatorIntl() }
  ],
  templateUrl: './report-spedizioni.component.html',
  styleUrl: './report-spedizioni.component.scss'
})
export class ReportSpedizioniComponent {

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private modalService: NgbModal,
    private recipientService: RecipientService,
    private shepherdService: ShepherdService, 
    private tourService: TourSeenService,
    private renderer: Renderer2
  ) {}

  page: number = TourPage.reportSpedizioni;

  infoBtnDownload = infoBtnDownload;
  user: Users | null  = null;  
  dataSource = new MatTableDataSource<GetReportSpedizioni>([]);

  startDateInit: string | null = new Date().toISOString().split('T')[0];
  startDate: string | null = null;
  endDate: string | null = null;
  code: string | null = null;
  businessName: string | null = null;
  productType: number | null = 0;
  valid: string | null = null;
  
  totalRecords: number = 0;
  constPageSize: number = constPageSize;
  currentModalRef!: NgbModalRef;

  search: boolean = false;
  remove: boolean = false;

  firstLoading: boolean = false;

  pageIndex = 0;
  pageSize = 20;

  ngOnInit() {
    const user = localStorage.getItem('user');
    if (!user) {
      this.router.navigate(['/']);
      return;
    }

    this.user! = JSON.parse(user!);
    this.startDate = this.startDateInit;

    this.getReportSpedizioni();

    this.getTourInThisPage();

  }

  form = new FormGroup({
    start_date: new FormControl(this.startDateInit),
    end_date: new FormControl(''),
    nominativo: new FormControl(''),
    codice: new FormControl(''),
    product: new FormControl<number | null>(null),    
    esito: new FormControl(''),
  });



  displayedColumns: string[] = ['id','productName', 'senderName','businessName', 'esito', 'insertDate', 'price', 'doc', 'code', 'state'];
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  } 
  
  getDate(date:string): string{
    return FncUtils.GetFormattedData(date);
  }

  getReportSpedizioni(){
    this.firstLoading = true;
    const pageIndex = this.paginator?.pageIndex || constPageIndex;
    const pageSize = this.paginator?.pageSize || constPageSize;

    this.recipientService.getReportSpedizioni(
      this.user!.id!,
      false,
      this.startDate,
      this.endDate,
      pageIndex,
      pageSize,
      this.productType!,
      this.businessName,
      this.code,
      this.valid
    )
    .subscribe((response) => {
      this.totalRecords = response.totalCount;
      this.dataSource.data = response.data;
      
      this.search = false;
      this.remove = false;
      this.firstLoading = false;
    });
  }

  onPaginateChange(event: PageEvent) {

    this.pageIndex = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.getReportSpedizioni();
  }
   
  filterResults(){
    this.search = true;
    this.startDate = this.form.value.start_date || null;
    this.endDate = this.form.value.end_date || null;
    this.code = this.form.value.codice || null;
    this.businessName = this.form.value.nominativo || null;
    this.productType = this.form.value.product! || null;
    this.valid = this.form.value.esito || null;
    if (this.paginator) 
        this.paginator.firstPage();

    this.getReportSpedizioni();  
  }

  downloadFile(doc: string, element: any){
    this.recipientService.getFile(doc, element.recipientId)
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

  openDialog(title: string, message: string){
    const dialogRef = this.dialog.open(AlertDialogComponent, {
      width: '400px',
      data: { 
        title: title,
        message: message
        }  
    });
  }


  openModal(id: number) {

    //console.log(id);

    this.recipientService.getDettaglioDestinatario(id)
      .subscribe(response => {
        this.currentModalRef = this.modalService.open(ModalSpedizioneComponent, { size: 'lg' });
        this.currentModalRef.componentInstance.modalData = response;
     })
  }
  
  removeFilter(){
    this.form.reset({
      start_date: this.startDateInit,
      end_date: '',
      nominativo: '',
      codice: '',
      product: null,
      esito: '',
    });
    
    this.remove = true;
    this.startDate = this.startDateInit;
    this.endDate = null;
    this.code = null;
    this.businessName = null;
    this.productType = null;
    this.valid = null;
    if (this.paginator) 
        this.paginator.firstPage();

    this.getReportSpedizioni();  
  }

  startTour() {
      const steps = [
        {
          id: 'reportspedizioni1',
          text: "Personalizza il report delle spedizioni effettuate inserendo un intervallo di date, il codice, il nominativo, il prodotto e l'esito.",
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
          id: 'reportspedizioniend',
          text: "La tabella riporta i risultati del filtro e consente di visualizzare: l'ID lotto,  il tipo di prodotto, il mittente, il destinatario, l'accettazione, il costo, il codice e lo stato.",
          attachTo: {
            element: '.step-end',
            on: 'bottom' as PopperPlacement
          },
          modalOverlayOpeningPadding: 14,
          modalOverlayOpeningRadius: 5,
          classes: 'margin-step-y', 
          buttons: [
            { text: 'X Chiudi tour', action: () => this.shepherdService.complete(), classes:"close" },
            { text: 'Avanti', action: () => this.shepherdService.next() }
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


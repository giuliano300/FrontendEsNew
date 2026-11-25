import { AppTourService } from '@app/services/app-tour.service';
import { AppStorageService } from '@app/services/app-storage.service';
import { UiLoadingStateComponent, UiTourRestartComponent, UiEmptyStateComponent, UiSubmitButtonComponent } from '@app/shared/ui';
import { Component, ViewChild, ViewEncapsulation, inject } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgbModal, NgbModalRef, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { infoBtnDownload } from '../../../enviroments/enviroments';
import {  constPageIndex, constPageSize  } from '@app/config/app-constants';
import { RecipientService } from '../../../services/recipient.service';
import { Users } from '../../../interfaces/Users';
import { FncUtils } from '../../../fncUtils/fncUtils';
import { CommonModule } from '@angular/common';
import { ModalSpedizioneComponent } from '../../../component/modal-spedizione/invii/modal-spedizione.component';
import { ShepherdService } from 'angular-shepherd';
import { Placement as PopperPlacement } from '@popperjs/core';
import { CurrentStateOptions, TourPage } from '../../../interfaces/EnumTypes';
import { TourSeen } from '../../../interfaces/TourSeen';
import { getItalianPaginatorIntl } from '../../../mat-paginator-it';
import { AlertDialogComponent } from '../../../component/alert-dialog/alert-dialog.component';
import { MatDialog } from '@angular/material/dialog';



@Component({
  selector: 'app-report-spedizioni-bollettini',
  imports: [UiSubmitButtonComponent, UiEmptyStateComponent, UiTourRestartComponent, UiLoadingStateComponent, MatTableModule, MatPaginatorModule, MatSortModule, MatIconModule, MatProgressBarModule, NgbModule, ReactiveFormsModule, CommonModule],
  providers: [
    { provide: MatPaginatorIntl, useValue: getItalianPaginatorIntl() }
  ],
  templateUrl: './report-spedizioni-bollettini.component.html',
  styleUrl: './report-spedizioni-bollettini.component.scss'
})
export class ReportSpedizioniBollettiniComponent {

  
  
  private appTour = inject(AppTourService);
private appStorage = inject(AppStorageService);
constructor(
    private router: Router,
    private modalService: NgbModal,
    private recipientService: RecipientService,
    private shepherdService: ShepherdService, 
    private dialog: MatDialog

  ) {}

  page: number = TourPage.reportSpedizioniBollettini;

  infoBtnDownload = infoBtnDownload;
  user: Users | null  = null;  
  dataSource = new MatTableDataSource<any>([]);

  startDate: string | null = null;
  endDate: string | null = null;
  bulletinCode: string | null = null;
  businessName: string | null = null;
  productType: number | null = 0;
  valid: string | null = null;
  paymentDataS: string | null = null;
  paymentDataE: string | null = null;
  paid: string | null = null;
  currentState: number | null = null;
  currentStateOptions = CurrentStateOptions;
  
  totalRecords: number = 0;
  constPageSize: number = constPageSize;
  currentModalRef!: NgbModalRef;
  
  search: boolean = false;
  remove: boolean = false;
  firstLoading: boolean = false;
  exportingCsv: boolean = false;

  startDateInit: string | null = FncUtils.GetTodayInputValue();

  pageIndex = 0;
  pageSize = 20;
  totalCounts = 0;

  form = new FormGroup({
    start_date: new FormControl(this.startDateInit),
    end_date: new FormControl(''),
    nominativo: new FormControl(''),
    codice_bollettino: new FormControl(''),
    product: new FormControl<number | null>(null),    
    esito: new FormControl(''),
    sel_utente: new FormControl(''),
    start_date_pay: new FormControl(''),
    end_date_pay: new FormControl(''),
    sel_pagamento: new FormControl(''),
    current_state: new FormControl<number | null>(null),
  });
  
  ngOnInit() {
    const user = this.appStorage.getItem('user');
    if (!user) {
      this.router.navigate(['/']);
      return;
    }

    this.startDate = this.startDateInit;

    this.user! = JSON.parse(user!);

    this.getReportSpedizioni();

    this.getTourInThisPage();


  }
  
  displayedColumns: string[] = ['operationId','productName', 'senderName','businessName', 'esito', 'insertDate', 'price', 'bulletinAmount', 'bulletinCode', 'doc', 'finalDocument', 'code', 'state'];
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  } 
  
  getDate(date:string): string{
    return FncUtils.GetFormattedData(date);
  }

  formatBulletinAmount(value: number | string | null | undefined): string {
    if (value === null || value === undefined || value === '') return '—';
    const amount = typeof value === 'number' ? value : Number(value.replace(',', '.'));
    return Number.isFinite(amount)
      ? `${amount.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`
      : '—';
  }

  getReportSpedizioni(){
    this.firstLoading = true;
    const pageIndex = this.pageIndex;
    const pageSize = this.pageSize;

    this.recipientService.getReportSpedizioni(
      this.user!.id!,
      true,
      this.startDate,
      this.endDate,
      pageIndex,
      pageSize,
      this.productType!,
      this.businessName,
      null,
      this.valid,
      this.totalCounts,
      this.paymentDataS,
      this.paymentDataE,
      this.paid,
      this.currentState,
      this.bulletinCode
    )
    .subscribe((response) => {
      this.totalRecords = response.totalCount;
      this.totalCounts = response.totalCount;
      this.dataSource.data = response.data;
      this.firstLoading = false;
      this.search = false;
      this.remove = false;
    });
  }

  onPaginateChange(event: PageEvent) {

    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getReportSpedizioni();
  }
   
  filterResults(){
    this.search = true;

    this.startDate = this.form.value.start_date || null;
    this.endDate = this.form.value.end_date || null;
    this.bulletinCode = this.form.value.codice_bollettino || null;
    this.businessName = this.form.value.nominativo || null;
    this.productType = this.form.value.product! || null;
    this.valid = this.form.value.esito || null;
    this.paymentDataS = this.form.value.start_date_pay || null;
    this.paymentDataE = this.form.value.end_date_pay || null;
    this.paid = this.form.value.sel_pagamento || null;
    this.currentState = this.form.value.current_state ?? null;
    this.totalCounts = 0;
    this.pageIndex = 0;
  
    if (this.paginator) 
        this.paginator.firstPage();

    this.getReportSpedizioni();  
  }

  removeFilter(){
    this.form.reset({
      start_date: this.startDateInit,
      end_date: '',
      nominativo: '',
      codice_bollettino: '',
      product: null,
      esito: '',
      start_date_pay: '',
      end_date_pay: '',
      sel_pagamento: '',
      current_state: null
    });
    this.remove = true;
    this.startDate = null;
    this.endDate = null;
    this.bulletinCode = null;
    this.businessName = null;
    this.productType = null;
    this.valid = null;
    this.paymentDataS = null;
    this.paymentDataE = null;
    this.paid = null;
    this.currentState = null;
    this.totalCounts = 0;
    this.pageIndex = 0;
    if (this.paginator) 
        this.paginator.firstPage();

    this.getReportSpedizioni();  
  }

  exportCsv(): void {
    if (this.exportingCsv || !this.user?.id) return;

    this.exportingCsv = true;
    this.recipientService.exportReportSpedizioniCsv(
      this.user.id,
      true,
      this.startDate,
      this.endDate,
      this.productType,
      this.businessName,
      null,
      this.valid,
      this.currentState,
      this.paymentDataS,
      this.paymentDataE,
      this.paid,
      this.bulletinCode
    ).subscribe({
      next: blob => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'report-spedizioni-bollettini.csv';
        link.click();
        window.URL.revokeObjectURL(url);
        this.exportingCsv = false;
      },
      error: () => {
        this.openDialog('Esportazione non disponibile', 'Non è stato possibile creare il file CSV del report.');
        this.exportingCsv = false;
      }
    });
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


      startTour() {
      const steps = [
        {
          id: 'reportspedizioni1',
          text: "Personalizza il report delle spedizioni effettuate inserendo un intervallo di date, il codice bollettino, il nominativo, il prodotto, l'esito, lo stato corrente, la presenza del codice identificativo e lo stato dei pagamenti.",
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
          text: "La tabella riporta i risultati del filtro e consente di visualizzare: l'ID lotto, il tipo di prodotto, il mittente, il destinatario, l'accettazione, il costo, il codice bollettino, il codice spedizione e lo stato.",
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

import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
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
@Component({
  selector: 'app-report-spedizioni-bollettini',
  imports: [MatTableModule, MatPaginatorModule, MatSortModule, MatIconModule, MatProgressBarModule, NgbModule, ReactiveFormsModule, CommonModule],
  templateUrl: './report-spedizioni-bollettini.component.html',
  styleUrl: './report-spedizioni-bollettini.component.scss'
})
export class ReportSpedizioniBollettiniComponent {

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private recipientService: RecipientService
  ) {}

  infoBtnDownload = infoBtnDownload;
  user: Users | null  = null;  
  dataSource = new MatTableDataSource<any>([]);

  startDate: string | null = null;
  endDate: string | null = null;
  code: string | null = null;
  businessName: string | null = null;
  productType: number | null = 0;
  valid: string | null = null;
  paymentDataS: string | null = null;
  paymentDataE: string | null = null;
  paid: string | null = null;
  
  totalRecords: number = 0;
  constPageSize: number = constPageSize;
  currentModalRef!: NgbModalRef;
  

  form = new FormGroup({
    start_date: new FormControl(''),
    end_date: new FormControl(''),
    nominativo: new FormControl(''),
    codice: new FormControl(''),
    product: new FormControl<number | null>(null),    
    esito: new FormControl(''),
    sel_utente: new FormControl(''),
    start_date_pay: new FormControl(''),
    end_date_pay: new FormControl(''),
    sel_pagamento: new FormControl(''),
  });
  
  ngOnInit() {
    const user = localStorage.getItem('user');
    if (!user) {
      this.router.navigate(['/']);
      return;
    }

    this.user! = JSON.parse(user!);

  }
  
  displayedColumns: string[] = ['operationId','productName', 'senderName','businessName', 'insertDate', 'price', 'doc', 'code', 'state'];
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    // Gestione cambio pagina
    this.paginator.page.subscribe(() => {
      this.getReportSpedizioni();
    });

    this.getReportSpedizioni();
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  } 
  
  getDate(date:string): string{
    return FncUtils.GetFormattedData(date);
  }

  getReportSpedizioni(){
    const pageIndex = this.paginator?.pageIndex || constPageIndex;
    const pageSize = this.paginator?.pageSize || constPageSize;

    this.recipientService.getReportSpedizioni(
      this.user!.id!,
      true,
      this.startDate,
      this.endDate,
      pageIndex,
      pageSize,
      this.productType!,
      this.businessName,
      this.code,
      this.valid,
      this.paymentDataS,
      this.paymentDataE,
      this.paid
    )
    .subscribe((response) => {
      this.totalRecords = response.totalCount;
      this.dataSource.data = response.data;
    });
  }
   
  filterResults(){
    this.startDate = this.form.value.start_date || null;
    this.endDate = this.form.value.end_date || null;
    this.code = this.form.value.codice || null;
    this.businessName = this.form.value.nominativo || null;
    this.productType = this.form.value.product! || null;
    this.valid = this.form.value.esito || null;
    this.paymentDataS = this.form.value.start_date_pay || null;
    this.paymentDataE = this.form.value.end_date_pay || null;
    this.paid = this.form.value.sel_pagamento || null;
    if (this.paginator) 
        this.paginator.firstPage();

    this.getReportSpedizioni();  
  }

  removeFilter(){
    this.form.reset({
      start_date: '',
      end_date: '',
      nominativo: '',
      codice: '',
      product: null,
      esito: '',
      start_date_pay: '',
      end_date_pay: '',
      sel_pagamento: ''
    });
    
    this.startDate = null;
    this.endDate = null;
    this.code = null;
    this.businessName = null;
    this.productType = null;
    this.valid = null;
    this.paymentDataS = null;
    this.paymentDataE = null;
    this.paid = null;
    if (this.paginator) 
        this.paginator.firstPage();

    this.getReportSpedizioni();  
  }

  downloadFile(doc:string){

     const blob = FncUtils.getFileFromBase64(doc);

      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'documento.pdf';
      link.click();

      window.URL.revokeObjectURL(link.href);

  }

  openModal(id: number) {

    //console.log(id);

    this.recipientService.getDettaglioDestinatario(id)
      .subscribe(response => {
        this.currentModalRef = this.modalService.open(ModalSpedizioneComponent, { size: 'lg' });
        this.currentModalRef.componentInstance.modalData = response;
     })
  }
}


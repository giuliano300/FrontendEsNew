import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
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
import { subscribe } from 'diagnostics_channel';
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
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { ModalSpedizioneComponent } from '../../../component/modal-spedizione/invii/modal-spedizione.component';


@Component({
  selector: 'app-dettaglio-spedizione',
  imports: [MatTableModule, MatPaginatorModule, MatSortModule, MatIconModule, MatProgressBarModule, NgbModule, ReactiveFormsModule, CommonModule],
  templateUrl: './dettaglio-spedizione.component.html',
  styleUrl: './dettaglio-spedizione.component.scss'
})
export class DettaglioSpedizioneComponent {
  constructor(
    private router: Router, 
    private  route: ActivatedRoute,
    private modalService: NgbModal,
    private operationservice: OperationService,
    private recipientService: RecipientService, 
    private dialog: MatDialog
  ) {}

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

  ngOnInit() {

    const user = localStorage.getItem('user');
    if (!user) {
      this.router.navigate(['/']);
      return;
    }

    this.user! = JSON.parse(user!);
    
    const userOptionsString = localStorage.getItem('userOptions');
    this.userOptions = userOptionsString ? JSON.parse(userOptionsString) as UserOptions[] : [];

    const userProductsString = localStorage.getItem('userProducts');
    this.userProducts = userProductsString ? JSON.parse(userProductsString) as UserProducts[] : [];

    this.route.paramMap.subscribe(params => {
      this.id = parseInt(params.get('id')!);
      //console.log('ID ricevuto:', this.id);
      this.operationservice.getDettaglioSpedizione(this.id)
      .subscribe(response => {
        this.getDettaglioSpedizioniResponse = response;


        if(response.data.operation.operationType == ProductTypes.ROL && this.userOptions.some(a => a.enabled && a.optionId == Options.rr)){
          this.getRR = true;
          this.displayedColumns.push('actions2');
        }

        this.displayedColumns.push('action3');


        this.totalRecords = response.totalCount;
        this.dataSource.data = response.data.recipients;    
        
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        this.isLoaded = true;
      })
    });
  }
    
  filterData(){
    const businessName = this.form.value.destinatario;
    const code = this.form.value.codice;
    const valid  = this.form.value.sel_esito;

    this.operationservice.getDettaglioSpedizione(this.id!, businessName, code, valid?.toString())
      .subscribe(response => {
        this.getDettaglioSpedizioniResponse = response;
        
        this.totalRecords = response.totalCount;
        this.dataSource.data = response.data.recipients;    
        
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        this.isLoaded = true;
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

  downloadFile(doc:string){

    if(doc == ""){
      this.openDialog("Documento non disponibile","Il documento richiesto non è disponibile per il download.");
      return;
    }

    const blob = FncUtils.getFileFromBase64(doc);

    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'documento.pdf';
    link.click();

    window.URL.revokeObjectURL(link.href);

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
    const zip = new JSZip();
    const recipients = this.getDettaglioSpedizioniResponse?.data.recipients;

    if (!recipients || recipients.length === 0) {
        this.openDialog("Documenti non disponibili","Non ci sono documenti disponibili per il download.");
      return;
    }

    let count = 0;
    const total = recipients.length;

    recipients.forEach((recipient) => {
      let base64 = recipient.attachedFileRR; 
      if(!rr)
        base64 = recipient.attachedFile;

      if (base64 && base64.trim() !== '') {
        const fileData = FncUtils.getFileFromBase64(base64);
        const filename = recipient.fileName!;

        zip.file(filename, fileData);
        count++;
      }
    });

    if (count === 0) {
      this.openDialog("Documenti non disponibili","Non ci sono documenti disponibili per il download.");
      return;
    }

    zip.generateAsync({ type: 'blob' }).then(content => {
      saveAs(content, 'documenti.zip');
    });
  }

}

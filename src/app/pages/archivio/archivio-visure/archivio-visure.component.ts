import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { infoBtnDownload } from '../../../enviroments/enviroments';
import { Users } from '../../../interfaces/Users';
import { constPageIndex, constPageSize } from '../../../../main';
import { OperationService } from '../../../services/operation.service';
import { FncUtils } from '../../../fncUtils/fncUtils';
import { CommonModule } from '@angular/common';
import { ShepherdService } from 'angular-shepherd';
import { Placement as PopperPlacement } from '@popperjs/core';
import { TourPage } from '../../../interfaces/EnumTypes';
import { TourSeen } from '../../../interfaces/TourSeen';
import { TourSeenService } from '../../../services/tourSeen.service';


@Component({
  selector: 'app-archivio-visure',
  imports: [MatTableModule, MatPaginatorModule, MatSortModule, MatIconModule, MatProgressBarModule, NgbModule, ReactiveFormsModule, CommonModule],
  templateUrl: './archivio-visure.component.html',
  styleUrl: './archivio-visure.component.scss'
})
export class ArchivioVisureComponent {

  constructor(private router: Router, private  route: ActivatedRoute, private operationService: OperationService, private shepherdService: ShepherdService, private tourService: TourSeenService) {}

  page: number = TourPage.archivioVisure;

  infoBtnDownload = infoBtnDownload;
  user: Users | null  = null;  
  dataSource = new MatTableDataSource<any>([]);
  startDate: string | null = null;
  endDate: string | null = null;
  nominativo: string | null = null;
  piva: string | null = null;
  totalRecords: number = 0;
  constPageSize: number = constPageSize;
  

  form = new FormGroup({
    start_date: new FormControl(''),
    end_date: new FormControl(''),
    nominativo: new FormControl(''),
    piva: new FormControl('')
  });
  

  ngOnInit() {
    const user = localStorage.getItem('user');
    if (!user) {
      this.router.navigate(['/']);
      return;
    }

    this.user! = JSON.parse(user!);

    this.getTourInThisPage();

  }

  getArchivioVisure(){
    const pageIndex = this.paginator?.pageIndex || constPageIndex;
    const pageSize = this.paginator?.pageSize || constPageSize;

    this.operationService.getArchivioVisure(
      this.user!.id!,
      this.startDate,
      this.endDate,
      this.nominativo,
      this.piva,
      pageIndex,
      pageSize
    )
    .subscribe((response) => {
      this.totalRecords = response.totalCount;
      this.dataSource.data = response.data;
    });
  }
  
  
  displayedColumns: string[] = ['productName', 'businessName', 'sender', 'vat', 'valid','date','price','code','state','doc'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    // Gestione cambio pagina
    this.paginator.page.subscribe(() => {
      this.getArchivioVisure();
    });

    this.getArchivioVisure();
  }

  goToDetail(row: any) {
    // Per esempio: vai a /dettaglio/[nome]
    this.router.navigate(['/dettaglioSpedizione', row.id]);
  }
  
  getDate(date:string): string{
    return FncUtils.GetFormattedData(date);
  }

  filterResults(){
    this.startDate = this.form.value.start_date || null;
    this.endDate = this.form.value.end_date || null;
    this.nominativo = this.form.value.nominativo || null;
    this.piva = this.form.value.piva || null;
    if (this.paginator) 
        this.paginator.firstPage();

    this.getArchivioVisure();  
  }

  filterRemove() {
    this.startDate = null;
    this.endDate = null;
    this.nominativo = null;
    this.piva = null;
    this.form.get('nominativo')?.setValue('');
    this.form.get('piva')?.setValue('');

    if (this.paginator)
      this.paginator.firstPage();

    this.getArchivioVisure();
  }

  downloadFile(doc:string){

     const blob = FncUtils.getFileFromBase64(doc);

      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'documento.pdf';
      link.click();

      window.URL.revokeObjectURL(link.href);

  }

    startTour() {
      const steps = [
        {
          id: 'archiviovisure1',
          text: "Filtra le tue spedizioni effettuate inserendo un intervallo di date, il codice fiscale o la Partita IVA, oppure il nome dell’intestatario.",
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
          id: 'archiviovisure2',
          text: "La tabella riporta i risultati del filtro e consente di visualizzare: il tipo di prodotto, l'intestatario, il richiedente, il codice fiscale o la P. IVA, l'esito della spedizione, la data di accettazione, il prezzo, il codice e lo stato.",
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
          id: 'archiviovisure1end',
          text: "Clicca sul pulsante per scaricare il documento richiesto.",
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

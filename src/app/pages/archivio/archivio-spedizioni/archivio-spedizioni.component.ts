import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { infoDettaglioInvii } from '../../../enviroments/enviroments';
import { OperationService } from '../../../services/operation.service';
import { Users } from '../../../interfaces/Users';
import { FncUtils } from '../../../fncUtils/fncUtils';
import { CommonModule } from '@angular/common';
import { constPageSize } from '../../../../main';
import { ShepherdService } from 'angular-shepherd';
import { Placement as PopperPlacement } from '@popperjs/core';
import { TourPage } from '../../../interfaces/EnumTypes';
import { TourSeen } from '../../../interfaces/TourSeen';
import { TourSeenService } from '../../../services/tourSeen.service';
import { getItalianPaginatorIntl } from '../../../mat-paginator-it';


@Component({
  selector: 'app-archivio-spedizioni',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, MatSortModule, MatIconModule, MatProgressBarModule, NgbModule, ReactiveFormsModule, CommonModule],
  providers: [
    { provide: MatPaginatorIntl, useValue: getItalianPaginatorIntl() }
  ],
  templateUrl: './archivio-spedizioni.component.html',
  styleUrl: './archivio-spedizioni.component.scss'
})
export class ArchivioSpedizioniComponent {
  constructor(private router: Router, private operationService: OperationService, private shepherdService: ShepherdService, private tourService: TourSeenService) {}

  page: number = TourPage.archivioSpedizioni;

  infoDettaglioInvii = infoDettaglioInvii;
  user: Users | null  = null;  
  dataSource = new MatTableDataSource<any>([]);
  startDate: string = "";
  endDate: string = "";
  totalRecords: number = 0;
  constPageSize: number = constPageSize;

  firstLoading: boolean = false;

  pageIndex = 0;
  pageSize = 50;

  ngOnInit() {
    const user = localStorage.getItem('user');
    if (!user) {
      this.router.navigate(['/']);
      return;
    }

    this.user! = JSON.parse(user!);

    this.getTourInThisPage();

    this.getArchivioSpedizioni();
  }

  form = new FormGroup({
    start_date: new FormControl(''),    
    end_date: new FormControl(''),
  });


  getArchivioSpedizioni(){
    const pageIndex = this.pageIndex;
    const pageSize = this.pageSize;
    
    this.firstLoading = true;

    this.operationService.getArchivioSpedizioni(
      this.user!.id!,
      this.startDate,
      this.endDate,
      pageIndex,
      pageSize
    )
    .subscribe((response) => {
      this.totalRecords = response.totalCount;
      this.dataSource.data = response.data;
      this.firstLoading = false;
    });
  }

  onPaginateChange(event: PageEvent) {

    this.firstLoading = true;
    this.pageIndex = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.getArchivioSpedizioni();
  }

   
  displayedColumns: string[] = ['insertDate', 'operationType', 'numberOfRecipient', 'totalPriceSum', 'actions'];
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  goToDetail(row: any) {
    // Per esempio: vai a /dettaglio/[nome]
    this.router.navigate(['/dettaglioSpedizione', row.id]);
  }
  
  getDate(date:string): string{
    return FncUtils.GetFormattedData(date);
  }

  getProductName(operationType: number): string{
    return FncUtils.GetProductName(operationType);
  }

  filterResults(){
    this.startDate = this.form.value.start_date || "";
    this.endDate = this.form.value.end_date || "";
    if (this.paginator) 
        this.paginator.firstPage();

    this.getArchivioSpedizioni();  
  }

  filterRemove() {
    this.form.reset({
      start_date: '',
      end_date: ''
    });

    this.startDate = this.form.value.start_date || "";
    this.endDate = this.form.value.end_date || "";
    if (this.paginator)
      this.paginator.firstPage();

    this.getArchivioSpedizioni();
  }


    startTour() {
      const steps = [
        {
          id: 'archiviosped1',
          text: "Filtra le spedizioni effettuate inserendo un intervallo di date nei due campi.",
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
          id: 'archiviosped2',
          text: "La tabella mostra i risultati del fitro, nello specifico è possibile visualizzare in anteprima la data/ora di creazione, il prodotto postale, il numero di destinatari e il prezzo.",
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
          id: 'archiviospedend',
          text: "Clicca sul pulsante per visualizzare il dettaglio della spedizione.",
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

import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CommonModule, NgClass } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { infoDettaglioInvii } from '../../../enviroments/enviroments';
import { GetStatoInvii } from '../../../interfaces/GetStatoInvii';
import { Users } from '../../../interfaces/Users';
import { OperationService } from '../../../services/operation.service';
import { ProductTypes } from '../../../interfaces/EnumTypes';
import { FncUtils } from '../../../fncUtils/fncUtils';
import { ShepherdService } from 'angular-shepherd';
import { Placement as PopperPlacement } from '@popperjs/core';
import { TourPage } from '../../../interfaces/EnumTypes';
import { TourSeen } from '../../../interfaces/TourSeen';
import { TourSeenService } from '../../../services/tourSeen.service';



@Component({
  selector: 'app-invii-raccomandate',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, MatSortModule, MatIconModule, MatProgressBarModule, NgClass, NgbModule, CommonModule],
  templateUrl: './stato-invii.component.html',
  styleUrl: './stato-invii.component.scss',
})

export class StatoInviiComponent {
  
  id!: number;
  productName: string | null = null;
  
  constructor(private router: Router, private operationService: OperationService, private route: ActivatedRoute, private shepherdService: ShepherdService, private tourService: TourSeenService) 
  {
  }

  page: number = TourPage.statoinvii;

  infoDettaglioInvii = infoDettaglioInvii;  


  statoInvii: GetStatoInvii[] = [];

  user: Users | null  = null;  

  firstLoading: boolean = false;

  displayedColumns: string[] = ['date', 'numberOfRecipient', 'transferPercentage'];
  dataSource = new MatTableDataSource<any>([]);
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    const user = localStorage.getItem('user');
    if (!user) {
      this.router.navigate(['/']);
      return;
    }

    this.user! = JSON.parse(user!);

    this.route.paramMap.subscribe(params => {
      this.id = parseInt(params.get('id')!);
      switch(this.id){
        case ProductTypes.ROL:
        case ProductTypes.MOL:
          this.productName = "Raccomandate";
          break;
        case ProductTypes.LOL:
        case ProductTypes.COL:
          this.productName = "Lettere";
          break;
        case ProductTypes.AGOL:
          this.productName = "Atti giudiziari";
          break;
        case ProductTypes.TOL:
          this.productName = "Telegrammi";
          break;
        case ProductTypes.VOL:
          this.productName = "Visure/Certificati";
          break;
      }

      this.getStatoInvii();

    })

    this.getTourInThisPage();

  }

  getStatoInvii(){
    this.firstLoading = true;
    this.operationService.getStatoInvii(this.user!.id!, this.id!)
    .subscribe((data: GetStatoInvii[]) => {
      if (!data || data.length === 0) {
        this.dataSource.data = [];
      } else {
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
      this.firstLoading = false;
    });
  }
  
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getCustomTransferClass(value: number): string {
    return value < 99 ? 'progress-orange' : 'progress-green';
  }    
  
  getDate(date:string): string{
    return FncUtils.GetFormattedData(date);
  }

    startTour() {
      const steps = [
        {
          id: 'statoinvii',
          text: "La tabella mostra i lotti di spedizione con data e ora di creazione, numero di destinatari e stato di trasferimento verso Poste Italiane. I lotti completati saranno disponibili nell'area Archivio.",
          attachTo: {
            element: '.step-1',
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

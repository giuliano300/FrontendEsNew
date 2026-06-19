import { AppTourService } from '@app/services/app-tour.service';
import { AppStorageService } from '@app/services/app-storage.service';
import { UiTourRestartComponent, UiEmptyStateComponent } from '@app/shared/ui';
import { Component, ViewChild, inject } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { Router } from '@angular/router';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { infoBtnDelete } from '../../../enviroments/enviroments';
import { RouterLink } from '@angular/router';
import { DeleteDialogComponent } from '../../../component/delete-dialog/delete-dialog.component';
import { UserLogosService } from '../../../services/user-logos.service';
import { MatDialog } from '@angular/material/dialog';
import { Users } from '../../../interfaces/Users';
import { UserLogos } from '../../../interfaces/UserLogos';
import { CommonModule } from '@angular/common';
import { ShepherdService } from 'angular-shepherd';
import { Placement as PopperPlacement } from '@popperjs/core';
import { TourPage } from '../../../interfaces/EnumTypes';
import { TourSeen } from '../../../interfaces/TourSeen';

@Component({
  selector: 'app-personalizzazione-cover',
  imports: [UiEmptyStateComponent, UiTourRestartComponent, MatTableModule, MatPaginatorModule, MatSortModule, MatIconModule, MatProgressBarModule, NgbModule, RouterLink, CommonModule],
  templateUrl: './personalizzazione-cover.component.html',
  styleUrl: './personalizzazione-cover.component.scss'
})
export class PersonalizzazioneCoverComponent {

  
  
  private appTour = inject(AppTourService);
private appStorage = inject(AppStorageService);
displayedColumns: string[] = ['name','logo', 'delete'];

  UserLogos: UserLogos[] = [];

  user: Users | null  = null;

  constructor(private router: Router, private userLogosService: UserLogosService, private dialog: MatDialog, private shepherdService: ShepherdService) {}

  page: number = TourPage.personalizzazioneCover;

  infoBtnDelete = infoBtnDelete;
      
  dataSource = new MatTableDataSource<UserLogos>();

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

  ngOnInit(): void {
    const user = this.appStorage.getItem('user');
    if (!user) {
      this.router.navigate(['/']);
      return;
    }

    this.user! = JSON.parse(user!);

    this.getUserLogos();
    this.getTourInThisPage();
  }

  getUserLogos(){
    this.userLogosService.getUserLogos(this.user!.id!)
    .subscribe((data: UserLogos[]) => {
      if (!data || data.length === 0) {
      } else {
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    });
  }


    onDelete(element: any): void {
      const dialogRef = this.dialog.open(DeleteDialogComponent, {
        width: '400px',
        data: { 
          name: element.name,
          type: 'userLogos',
          id: element.id
          }
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
            this.getUserLogos();
        }
      });
  
    }

    startTour() {
      const steps = [
        {
          id: 'personalizzazionecover1',
          text: "Clicca sul pulsante per aggiungere un nuovo logo",
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
          id: 'personalizzazionecover2',
          text: "In questa tabella è riportata la lista dei loghi che puoi utilizzare.",
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

const USER_DATA = [
  { name:'Easyway Technology' },
];


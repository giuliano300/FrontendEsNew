import { AppTourService } from '@app/services/app-tour.service';
import { AppStorageService } from '@app/services/app-storage.service';
import { UiTourRestartComponent, UiEmptyStateComponent } from '@app/shared/ui';
import { Component, ViewChild, ViewEncapsulation, inject } from '@angular/core';import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { UserSenders } from '../../../interfaces/UserSenders';
import { UserSendersService } from '../../../services/user-senders.service';
import { Users } from '../../../interfaces/Users';
import { Router } from '@angular/router';
import { DeleteDialogComponent } from '../../../component/delete-dialog/delete-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { RouterLink } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { infoBtnDelete, infoBtnEdit } from '../../../enviroments/enviroments';
import { CommonModule } from '@angular/common';
import { ShepherdService } from 'angular-shepherd';
import { Placement as PopperPlacement } from '@popperjs/core';
import { TourPage } from '../../../interfaces/EnumTypes';
import { TourSeen } from '../../../interfaces/TourSeen';

@Component({
  selector: 'app-user-senders',
  imports: [UiEmptyStateComponent, UiTourRestartComponent, MatTableModule, MatPaginatorModule, MatSortModule, MatIconModule, RouterLink, NgbModule, CommonModule],
  templateUrl: './user-senders.component.html',
  styleUrl: './user-senders.component.scss',
  encapsulation: ViewEncapsulation.None
})

export class UserSendersComponent {

  
  
  private appTour = inject(AppTourService);
private appStorage = inject(AppStorageService);
userSenders: UserSenders[] = [];

  user: Users | null  = null;

  infoBtnDelete=infoBtnDelete
  infoBtnEdit=infoBtnEdit

  constructor(private userSenderService: UserSendersService, private router: Router, private dialog: MatDialog, private shepherdService: ShepherdService) {}

  page: number = TourPage.userSender;

  displayedColumns: string[] = ['businessName', 'address', 'zipCode', 'city', 'province', 'state', 'modifica','elimina'];
  dataSource = new MatTableDataSource<UserSenders>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    const user = this.appStorage.getItem('user');
    if (!user) {
      this.router.navigate(['/']);
      return;
    }

    this.user! = JSON.parse(user!);

    this.getUserSenders();
    this.getTourInThisPage();
  }

  getUserSenders(){
    this.userSenderService.getUserSenders(this.user!.id!)
    .subscribe((data: UserSenders[]) => {
      if (!data || data.length === 0) {
      } else {
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
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

  
  onDelete(element: any): void {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '400px',
      data: { 
        name: element.businessName,
        type: 'userSender',
        id: element.id
       }  // Passa i dati dell'elemento da eliminare
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
          this.getUserSenders();
      }
    });
  }

        startTour() {
        const steps = [
          {
            id: 'archiviovisure1',
            text: "Clicca sul pulsante per aggiungere un nuovo mittente alla rubrica",
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
            id: 'archiviovisure1',
            text: "In questa tabella è riportata la lista dei mittenti.",
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

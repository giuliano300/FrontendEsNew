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
import { infoBtnEdit, infoBtnDelete } from '../../../enviroments/enviroments';
import { RouterLink } from '@angular/router';
import { UserRecipients } from '../../../interfaces/UserRecipients';
import { Users } from '../../../interfaces/Users';
import { UserRecipientsService } from '../../../services/user-recipients.service';
import { DeleteDialogComponent } from '../../../component/delete-dialog/delete-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { ShepherdService } from 'angular-shepherd';
import { Placement as PopperPlacement } from '@popperjs/core';
import { TourPage } from '../../../interfaces/EnumTypes';
import { TourSeen } from '../../../interfaces/TourSeen';

@Component({
  selector: 'app-rubrica-destinatari',
  imports: [UiEmptyStateComponent, UiTourRestartComponent, MatTableModule, MatPaginatorModule, MatSortModule, MatIconModule, MatProgressBarModule, NgbModule, RouterLink, CommonModule],
  templateUrl: './rubrica-destinatari.component.html',
  styleUrl: './rubrica-destinatari.component.scss'
})
export class RubricaDestinatariComponent {

  
  
  private appTour = inject(AppTourService);
private appStorage = inject(AppStorageService);
constructor(private router: Router, private userRecipientService: UserRecipientsService, private dialog: MatDialog, private shepherdService: ShepherdService) {}

  page: number = TourPage.rubricaDestinatari;

  infoBtnEdit = infoBtnEdit;
  infoBtnDelete = infoBtnDelete;

    UserRecipients: UserRecipients[] = [];
  
    user: Users | null  = null;
  
          
  displayedColumns: string[] = ['businessName', 'address', 'zipCode', 'city', 'province', 'state', 'modifica','elimina'];
  dataSource = new MatTableDataSource<UserRecipients>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    const user = this.appStorage.getItem('user');
    if (!user) {
      this.router.navigate(['/']);
      return;
    }

    this.user! = JSON.parse(user!);

    this.getUserRecipients();
    this.getTourInThisPage();
  }

  getUserRecipients(){
    this.userRecipientService.getUserRecipients(this.user!.id!)
    .subscribe((data: UserRecipients[]) => {
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
        name: element.businessName,
        type: 'userRecipient',
        id: element.id
       }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
          this.getUserRecipients();
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

      startTour() {
        const steps = [
          {
            id: 'archiviovisure1',
            text: "Clicca sul pulsante per aggiungere un nuovo destinatario alla rubrica",
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
            text: "In questa tabella è riportata la lista dei destinatari.",
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

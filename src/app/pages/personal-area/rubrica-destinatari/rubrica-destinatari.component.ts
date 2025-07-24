import { Component, ViewChild } from '@angular/core';
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
import { TourSeenService } from '../../../services/tourSeen.service';

@Component({
  selector: 'app-rubrica-destinatari',
  imports: [MatTableModule, MatPaginatorModule, MatSortModule, MatIconModule, MatProgressBarModule, NgbModule,RouterLink, CommonModule],
  templateUrl: './rubrica-destinatari.component.html',
  styleUrl: './rubrica-destinatari.component.scss'
})
export class RubricaDestinatariComponent {

  constructor(private router: Router, private userRecipientService: UserRecipientsService, private dialog: MatDialog, private shepherdService: ShepherdService, private tourService: TourSeenService) {}

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
    const user = localStorage.getItem('user');
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
        console.log('Nessun dato disponibile');
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

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
import { UsersService } from '../../../services/users.service';
import { Users } from '../../../interfaces/Users';
import { UserTypes } from '../../../interfaces/EnumTypes';
import { CommonModule } from '@angular/common';
import { DeleteDialogComponent } from '../../../component/delete-dialog/delete-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ShepherdService } from 'angular-shepherd';
import { Placement as PopperPlacement } from '@popperjs/core';
import { TourPage } from '../../../interfaces/EnumTypes';
import { TourSeen } from '../../../interfaces/TourSeen';

@Component({
  selector: 'app-utenti',
  imports: [UiEmptyStateComponent, UiTourRestartComponent, MatTableModule, MatPaginatorModule, MatSortModule, MatIconModule, MatProgressBarModule, NgbModule, RouterLink, CommonModule],
  templateUrl: './utenti.component.html',
  styleUrl: './utenti.component.scss'
})
export class UtentiComponent {

  
  
  private appTour = inject(AppTourService);
private appStorage = inject(AppStorageService);
constructor(private router: Router, private userService: UsersService, private dialog: MatDialog, private shepherdService: ShepherdService) {}

  page: number = TourPage.utentiList;

  infoBtnEdit = infoBtnEdit;
  infoBtnDelete = infoBtnDelete;
  user: Users | null = null;
        
  displayedColumns: string[] = ['userTypes','businessName', 'email', 'mobile', 'edit', 'delete'];
  dataSource = new MatTableDataSource<any>([]);
  
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
    const userStr = this.appStorage.getItem('user');
    if (!userStr) {
      this.router.navigate(['/']);
      return;
    }

    this.user = JSON.parse(userStr);

    this.getChildern();
    this.getTourInThisPage();
  }

  getChildern(){
    this.userService.getChildren(this.user!.id!)
    .subscribe((data: Users[]) => {
      if (!data || data.length === 0) {
        this.dataSource.data = [];
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
        type: 'users',
        id: element.id
       }  // Passa i dati dell'elemento da eliminare
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
          this.getChildern();
      }
    });
  
  }


  getUserTypeName(value: number): string {
    return UserTypes[value];
  }

    startTour() {
      const steps = [
        {
          id: 'utentilist1',
          text: "Clicca sul pulsante per aggiungere un nuovo utente",
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
          id: 'utentilistend',
          text: "In questa tabella è riportata la lista degli utenti che posso accedere al sistema.",
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
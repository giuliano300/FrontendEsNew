import { AppTourService } from '@app/services/app-tour.service';
import { AppStorageService } from '@app/services/app-storage.service';
import { UiTourRestartComponent } from '@app/shared/ui';
import { Component, ViewChild, inject } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { Router } from '@angular/router';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { infoBtnEdit, infoBtnDelete } from '../../../enviroments/enviroments';
import { CommonModule } from '@angular/common';
import { Users } from '../../../interfaces/Users';
import { Recipients } from '../../../classes/Recipients';
import { RecipientService } from '../../../services/recipient.service';
import { ShepherdService } from 'angular-shepherd';
import { Placement as PopperPlacement } from '@popperjs/core';
import { TourPage } from '../../../interfaces/EnumTypes';
import { TourSeen } from '../../../interfaces/TourSeen';

@Component({
  selector: 'app-errori-notificati',
  imports: [UiTourRestartComponent, MatTableModule, MatPaginatorModule, MatSortModule, MatIconModule, MatProgressBarModule, NgbModule, CommonModule],
  templateUrl: './errori-notificati.component.html',
  styleUrl: './errori-notificati.component.scss'
})
export class ErroriNotificatiComponent {
    
  
  private appTour = inject(AppTourService);
private appStorage = inject(AppStorageService);
constructor(private router: Router, private recipientService: RecipientService, private shepherdService: ShepherdService) {}
  
    page: number = TourPage.erroriNotificati;
    infoBtnEdit = infoBtnEdit;
    infoBtnDelete = infoBtnDelete;
          
    user: Users | null = null;
  
  
    displayedColumns: string[] = ['insertDate','businessName','address', 'zipCode','city', 'province', 'state', 'message'];
    dataSource = new MatTableDataSource<Recipients>();

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    ngOnInit(): void {
      const user = this.appStorage.getItem('user');
      if (!user) {
        this.router.navigate(['/']);
        return;
      }

      this.user! = JSON.parse(user!);

      this.getErroriNotificati();
      this.getTourInThisPage();
    }

    getErroriNotificati(){
      this.recipientService.getErroriNotificati(this.user!.id!, true)
      .subscribe((data: Recipients[]) => {
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

    startTour() {
      const steps = [
        {
          id: 'errorinotificati1',
          text: "In questa tabella trovi la lista degli invii non riusciti per problemi con la validazione di poste.",
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

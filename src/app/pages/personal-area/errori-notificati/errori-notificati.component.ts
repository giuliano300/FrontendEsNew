import { Component, ViewChild } from '@angular/core';
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

@Component({
  selector: 'app-errori-notificati',
  imports: [MatTableModule, MatPaginatorModule, MatSortModule, MatIconModule, MatProgressBarModule, NgbModule, CommonModule],
  templateUrl: './errori-notificati.component.html',
  styleUrl: './errori-notificati.component.scss'
})
export class ErroriNotificatiComponent {
    constructor(private router: Router, private recipientService: RecipientService) {}
  
    infoBtnEdit = infoBtnEdit;
    infoBtnDelete = infoBtnDelete;
          
    user: Users | null = null;
  
  
    displayedColumns: string[] = ['insertDate','businessName','address', 'zipCode','city', 'province', 'state', 'message'];
    dataSource = new MatTableDataSource<Recipients>();

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    ngOnInit(): void {
      const user = localStorage.getItem('user');
      if (!user) {
        this.router.navigate(['/']);
        return;
      }

      this.user! = JSON.parse(user!);

      this.getErroriNotificati();
    }

    getErroriNotificati(){
      this.recipientService.getErroriNotificati(this.user!.id!, true)
      .subscribe((data: Recipients[]) => {
        if (!data || data.length === 0) {
          console.log('Nessun dato disponibile');
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
}

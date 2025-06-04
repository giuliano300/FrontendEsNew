import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { Router } from '@angular/router';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { infoBtnEdit, infoBtnDelete } from '../../../enviroments/enviroments';

@Component({
  selector: 'app-errori-notificati',
  imports: [MatTableModule, MatPaginatorModule, MatSortModule, MatIconModule, MatProgressBarModule, NgbModule],
  templateUrl: './errori-notificati.component.html',
  styleUrl: './errori-notificati.component.scss'
})
export class ErroriNotificatiComponent {
        constructor(private router: Router) {}
      
        infoBtnEdit = infoBtnEdit;
        infoBtnDelete = infoBtnDelete;
             
      
      
        displayedColumns: string[] = ['acceptance','name','address', 'cap','city', 'province', 'state', 'error'];
        dataSource = new MatTableDataSource(USER_DATA);
        
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
}

const USER_DATA = [
  { acceptance:'24/05/2025', name:'Mario Rossi', address:'Viale Michelangelo, 50', cap:'80129', city: 'Napoli', province:'NA', state:'Italia', error:'Impossibile validare indirizzo' },
];


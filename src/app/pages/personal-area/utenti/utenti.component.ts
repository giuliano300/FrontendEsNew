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

@Component({
  selector: 'app-utenti',
  imports: [MatTableModule, MatPaginatorModule, MatSortModule, MatIconModule, MatProgressBarModule, NgbModule,RouterLink],
  templateUrl: './utenti.component.html',
  styleUrl: './utenti.component.scss'
})
export class UtentiComponent {

        constructor(private router: Router) {}
      
        infoBtnEdit = infoBtnEdit;
        infoBtnDelete = infoBtnDelete;
             
      
      
        displayedColumns: string[] = ['type','name', 'surname','email', 'password', 'phone', 'edit', 'delete'];
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
  { type:'Inseritore', name:'Mario', surname:'Rossi', email: 'test@master.it', password:'demo123', phone:'333123567' },
  { type:'Visualizzatore', name:'Domenici', surname:'Carlini', email: 'mimmecarline@gmail.com', password:'prevent29', phone:'3472919317' },
];


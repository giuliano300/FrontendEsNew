import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { infoBtnOpenList, infoBtnDelete } from '../../../enviroments/enviroments';

@Component({
  selector: 'app-liste-destinatari',
  imports: [MatTableModule, MatPaginatorModule, MatSortModule, MatIconModule, MatProgressBarModule, NgbModule, ReactiveFormsModule,RouterLink],
  templateUrl: './liste-destinatari.component.html',
  styleUrl: './liste-destinatari.component.scss'
})
export class ListeDestinatariComponent {

        constructor(private router: Router) {}
      
        infoBtnOpenList = infoBtnOpenList;
        infoBtnDelete = infoBtnDelete;
        
      
        form = new FormGroup({
          list_name: new FormControl(''),
        });
      
      
      
        displayedColumns: string[] = ['date','name', 'detail', 'delete'];
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
  { date:'15/05/2025',name:'Lista test 1'},
];


import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { Router } from '@angular/router';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { infoBtnDelete } from '../../../enviroments/enviroments';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-personalizzazione-cover',
  imports: [MatTableModule, MatPaginatorModule, MatSortModule, MatIconModule, MatProgressBarModule, NgbModule,RouterLink],
  templateUrl: './personalizzazione-cover.component.html',
  styleUrl: './personalizzazione-cover.component.scss'
})
export class PersonalizzazioneCoverComponent {

      constructor(private router: Router) {}
    
      infoBtnDelete = infoBtnDelete;
            
    
    
      displayedColumns: string[] = ['name','logo', 'delete'];
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
  { name:'Easyway Technology' },
];



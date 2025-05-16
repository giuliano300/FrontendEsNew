import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { Router } from '@angular/router';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgClass } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { infoDettaglioInvii } from '../../../enviroments/enviroments';

@Component({
  selector: 'app-richieste-visure',
  imports: [MatTableModule, MatPaginatorModule, MatSortModule, MatIconModule, MatProgressBarModule, NgClass, NgbModule],
  templateUrl: './richieste-visure.component.html',
  styleUrl: './richieste-visure.component.scss'
})
export class RichiesteVisureComponent {

    constructor(private router: Router) {}
  
    infoDettaglioInvii = infoDettaglioInvii;
  
  
    displayedColumns: string[] = ['date', 'type', 'transfer', 'receiver', 'actions'];
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
  
      goToDetail(row: any) {
        this.router.navigate(['/dettaglio', row.name]);
      }
    
  
      getCustomTransferClass(value: number): string {
        return value < 100 ? 'progress-orange' : 'progress-green';
      }    
  
}

const USER_DATA = [
  { date: '12/05/2025 - 09:33', type: 'Visura', transfer: 0, receiver: '1' },
  { date: '8/05/2025 - 15:51', type: 'Visura', transfer: 95, receiver: '4' },
  { date: '5/05/2025 - 16:01', type: 'Certificato', transfer: 100, receiver: '1' },
];

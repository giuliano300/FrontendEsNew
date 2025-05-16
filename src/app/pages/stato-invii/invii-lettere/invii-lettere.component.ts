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
  selector: 'app-invii-lettere',
  imports: [MatTableModule, MatPaginatorModule, MatSortModule, MatIconModule, MatProgressBarModule, NgClass, NgbModule],
  templateUrl: './invii-lettere.component.html',
  styleUrl: './invii-lettere.component.scss'
})
export class InviiLettereComponent {
  constructor(private router: Router) {}

  infoDettaglioInvii = infoDettaglioInvii;


  displayedColumns: string[] = ['date', 'transfer', 'receiver', 'actions'];
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
      // Per esempio: vai a /dettaglio/[nome]
      this.router.navigate(['/dettaglio', row.name]);
    }
  

    getCustomTransferClass(value: number): string {
      return value < 99 ? 'progress-orange' : 'progress-green';
    }    

}

const USER_DATA = [
  { date: '12/05/2025 - 09:33', transfer: 52, receiver: '41' },
  { date: '8/05/2025 - 15:51', transfer: 85, receiver: '168' },
  { date: '5/05/2025 - 16:01', transfer: 100, receiver: '57' },
];


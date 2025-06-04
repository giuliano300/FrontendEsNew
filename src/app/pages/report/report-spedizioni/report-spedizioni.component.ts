import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { infoBtnDownload } from '../../../enviroments/enviroments';

@Component({
  selector: 'app-report-spedizioni',
  imports: [MatTableModule, MatPaginatorModule, MatSortModule, MatIconModule, MatProgressBarModule, NgbModule, ReactiveFormsModule],
  templateUrl: './report-spedizioni.component.html',
  styleUrl: './report-spedizioni.component.scss'
})
export class ReportSpedizioniComponent {

      constructor(private router: Router) {}
    
      infoBtnDownload = infoBtnDownload;
      
    
      form = new FormGroup({
        start_date: new FormControl(''),
        end_date: new FormControl(''),
        nominativo: new FormControl(''),
        codice: new FormControl(''),
        prodotto: new FormControl(''),
        esito: new FormControl(''),
      });
    
    
    
      displayedColumns: string[] = ['id_lotto','product', 'sender','receiver', 'acceptance', 'cost', 'file', 'code', 'status'];
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
  { id_lotto: '564477', product:'RACCOMANDATA', sender:'EWT srl', receiver:'Mario Rossi', acceptance: '12/05/2025', cost: 51.33, code:'ab012345cd', status:'Completato' },
  { id_lotto: '126781', product:'LETTERA', sender:'Azienda test', receiver:'Mimme Carline', acceptance: '08/05/2025', cost: 12.10, code:'aass77899', status:'Completato' },
  { id_lotto: '340900', product:'TELEGRAMMA', sender:'ScialbTech spa', receiver:'Pasquale Farina', acceptance: '08/05/2025', cost: 9.50, code:'pa125677', status:'Completato' },
];


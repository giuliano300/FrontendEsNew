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
  selector: 'app-report-spedizioni-bollettini',
  imports: [MatTableModule, MatPaginatorModule, MatSortModule, MatIconModule, MatProgressBarModule, NgbModule, ReactiveFormsModule],
  templateUrl: './report-spedizioni-bollettini.component.html',
  styleUrl: './report-spedizioni-bollettini.component.scss'
})
export class ReportSpedizioniBollettiniComponent {
      constructor(private router: Router) {}
    
      infoBtnDownload = infoBtnDownload;
      
    
      form = new FormGroup({
        start_date: new FormControl(''),
        end_date: new FormControl(''),
        nominativo: new FormControl(''),
        codice: new FormControl(''),
        prodotto: new FormControl(''),
        esito: new FormControl(''),
        sel_utente: new FormControl(''),
        start_date_pay: new FormControl(''),
        end_date_pay: new FormControl(''),
        sel_pagamento: new FormControl(''),
      });
    
    
    
      displayedColumns: string[] = ['product', 'sender','receiver','result', 'acceptance', 'cost', 'price', 'file', 'code', 'status'];
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
  { product:'RACCOMANDATA', sender:'EWT srl', receiver:'Mario Rossi', result:'OK', acceptance: '12/05/2025', cost: 51.33, price: 11.55, code:'ab012345cd', status:'Completato' },
];



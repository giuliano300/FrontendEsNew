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
  selector: 'app-archivio-visure',
  imports: [MatTableModule, MatPaginatorModule, MatSortModule, MatIconModule, MatProgressBarModule, NgbModule, ReactiveFormsModule],
  templateUrl: './archivio-visure.component.html',
  styleUrl: './archivio-visure.component.scss'
})
export class ArchivioVisureComponent {

    constructor(private router: Router) {}
  
    infoBtnDownload = infoBtnDownload;
    
  
    form = new FormGroup({
      start_date: new FormControl(''),
      end_date: new FormControl(''),
      nominativo: new FormControl(''),
      piva: new FormControl(''),
      prodotto: new FormControl(''),
      esito: new FormControl(''),
    });
  
  
  
    displayedColumns: string[] = ['product', 'receiver','owner','piva','result','acceptance', 'price','code', 'status', 'actions'];
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
  { product:'VISURA', receiver:'EWT srl', owner:'Mario Rossi', piva:'00123444555', result:'ok', acceptance:'15/05/2025', price:31.25, code:'ab012345cd', status:'Completato' },
  { product:'VISURA', receiver:'ComunicoScialb', owner:'Domenici Carlino', piva:'MMOCRL29A16F839C', result:'ok', acceptance:'10/05/2025', price:15, code:'AV555666444', status:'Completato' },
  { product:'CERTIFICATO', receiver:'I Colombi sas', owner:'Carlo Bianchi', piva:'000578933664', result:'ok', acceptance:'21/03/2025', price:18.36, code:'AD342FGCV', status:'Completato' },
];


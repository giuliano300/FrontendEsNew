import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { infoDettaglioInvii } from '../../../enviroments/enviroments';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-archivio-spedizioni',
  imports: [MatTableModule, MatPaginatorModule, MatSortModule, MatIconModule, MatProgressBarModule, NgbModule, ReactiveFormsModule],
  templateUrl: './archivio-spedizioni.component.html',
  styleUrl: './archivio-spedizioni.component.scss'
})
export class ArchivioSpedizioniComponent {
  constructor(private router: Router, private  route: ActivatedRoute) {}

  infoDettaglioInvii = infoDettaglioInvii;

  ngOnInit() {
  const id = this.route.snapshot.paramMap.get('id');
    console.log('ID ricevuto:', id);
  }
    

  form = new FormGroup({
    start_date: new FormControl(''),
    end_date: new FormControl(''),
    nominativo: new FormControl(''),
  });



  displayedColumns: string[] = ['date', 'product', 'receiver', 'price', 'actions'];
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
      this.router.navigate(['/dettaglioSpedizione', row.id]);
    }
  

}


const USER_DATA = [
  {id: 1, date: '12/05/2025 - 09:33', product:'ROL (Standard)', receiver: '41', price:105.60 },
  {id: 2, date: '8/05/2025 - 15:51', product: 'LOL', receiver: '168',price:46.50  },
  {id: 3, date: '5/05/2025 - 16:01', product: 'ROL (Standard)', receiver: '57', price:95.88  },
];


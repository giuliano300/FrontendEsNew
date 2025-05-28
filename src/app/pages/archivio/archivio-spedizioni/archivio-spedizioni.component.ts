import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { infoDettaglioInvii } from '../../../enviroments/enviroments';
import { ActivatedRoute } from '@angular/router';
import { OperationService } from '../../../services/operation.service';
import { Users } from '../../../interfaces/Users';
import { FncUtils } from '../../../fncUtils/fncUtils';
import { CommonModule } from '@angular/common';
import { constPageIndex, constPageSize } from '../../../../main';

@Component({
  selector: 'app-archivio-spedizioni',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, MatSortModule, MatIconModule, MatProgressBarModule, NgbModule, ReactiveFormsModule, CommonModule],
  templateUrl: './archivio-spedizioni.component.html',
  styleUrl: './archivio-spedizioni.component.scss'
})
export class ArchivioSpedizioniComponent {
  constructor(private router: Router, private  route: ActivatedRoute, private operationService: OperationService) {}

  infoDettaglioInvii = infoDettaglioInvii;
  user: Users | null  = null;  
  dataSource = new MatTableDataSource<any>([]);
  startDate: string | null = null;
  endDate: string | null = null;
  totalRecords: number = 0;
  constPageSize: number = constPageSize;

  ngOnInit() {
    const user = localStorage.getItem('user');
    if (!user) {
      this.router.navigate(['/']);
      return;
    }

    this.user! = JSON.parse(user!);

  }

  form = new FormGroup({
    start_date: new FormControl(''),    
    end_date: new FormControl(''),
  });


  getArchivioSpedizioni(){
    const pageIndex = this.paginator?.pageIndex || constPageIndex;
    const pageSize = this.paginator?.pageSize || constPageSize;

    this.operationService.getArchivioSpedizioni(
      this.user!.id!,
      this.startDate,
      this.endDate,
      pageIndex,
      pageSize
    )
    .subscribe((response) => {
      this.totalRecords = response.totalCount;
      this.dataSource.data = response.data;
    });
  }
   
  displayedColumns: string[] = ['date', 'productName', 'numberOfRecipient', 'totalPrice', 'actions'];
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    // Gestione cambio pagina
    this.paginator.page.subscribe(() => {
      this.getArchivioSpedizioni();
    });

    this.getArchivioSpedizioni();
  }

  goToDetail(row: any) {
    // Per esempio: vai a /dettaglio/[nome]
    this.router.navigate(['/dettaglioSpedizione', row.id]);
  }
  
  getDate(date:string): string{
    return FncUtils.GetFormattedData(date);
  }

  filterResults(){
    this.startDate = this.form.value.start_date || null;
    this.endDate = this.form.value.end_date || null;
    if (this.paginator) 
        this.paginator.firstPage();

    this.getArchivioSpedizioni();  
  }

  filterRemove() {
    this.startDate = null;
    this.endDate = null;

    if (this.paginator)
      this.paginator.firstPage();

    this.getArchivioSpedizioni();
  }
}

import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CommonModule, NgClass } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { infoDettaglioInvii } from '../../../enviroments/enviroments';
import { GetStatoInvii } from '../../../interfaces/GetStatoInvii';
import { Users } from '../../../interfaces/Users';
import { OperationService } from '../../../services/operation.service';
import { ProductTypes } from '../../../interfaces/EnumTypes';
import { FncUtils } from '../../../fncUtils/fncUtils';


@Component({
  selector: 'app-invii-raccomandate',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, MatSortModule, MatIconModule, MatProgressBarModule, NgClass, NgbModule, CommonModule],
  templateUrl: './stato-invii.component.html',
  styleUrl: './stato-invii.component.scss',
})

export class StatoInviiComponent {
  
  id!: number;
  productName: string | null = null;
  
  constructor(private router: Router, private operationService: OperationService, private route: ActivatedRoute) 
  {
  }

  infoDettaglioInvii = infoDettaglioInvii;  


  statoInvii: GetStatoInvii[] = [];

  user: Users | null  = null;  

  displayedColumns: string[] = ['date', 'numberOfRecipient', 'transferPercentage'];
  dataSource = new MatTableDataSource<any>([]);
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    const user = localStorage.getItem('user');
    if (!user) {
      this.router.navigate(['/']);
      return;
    }

    this.user! = JSON.parse(user!);

    this.route.paramMap.subscribe(params => {
      this.id = parseInt(params.get('id')!);
      switch(this.id){
        case ProductTypes.ROL:
        case ProductTypes.MOL:
          this.productName = "Raccomandate";
          break;
        case ProductTypes.LOL:
        case ProductTypes.COL:
          this.productName = "Lettere";
          break;
        case ProductTypes.AGOL:
          this.productName = "Atti giudiziari";
          break;
        case ProductTypes.TOL:
          this.productName = "Telegrammi";
          break;
        case ProductTypes.VOL:
          this.productName = "Visure/Certificati";
          break;
      }

      this.getStatoInvii();

    })

  }

  getStatoInvii(){
    this.operationService.getStatoInvii(this.user!.id!, this.id!)
    .subscribe((data: GetStatoInvii[]) => {
      if (!data || data.length === 0) {
        this.dataSource.data = [];
      } else {
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    });
  }
  
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getCustomTransferClass(value: number): string {
    return value < 99 ? 'progress-orange' : 'progress-green';
  }    
  
  getDate(date:string): string{
    return FncUtils.GetFormattedData(date);
  }
}

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
import { DeleteDialogComponent } from '../../../component/delete-dialog/delete-dialog.component';
import { UserLogosService } from '../../../services/user-logos.service';
import { MatDialog } from '@angular/material/dialog';
import { Users } from '../../../interfaces/Users';
import { UserLogos } from '../../../interfaces/UserLogos';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-personalizzazione-cover',
  imports: [MatTableModule, MatPaginatorModule, MatSortModule, MatIconModule, MatProgressBarModule, NgbModule,RouterLink, CommonModule],
  templateUrl: './personalizzazione-cover.component.html',
  styleUrl: './personalizzazione-cover.component.scss'
})
export class PersonalizzazioneCoverComponent {

  displayedColumns: string[] = ['name','logo', 'delete'];

  UserLogos: UserLogos[] = [];

  user: Users | null  = null;

  constructor(private router: Router, private userLogosService: UserLogosService, private dialog: MatDialog) {}

  infoBtnDelete = infoBtnDelete;
      
  dataSource = new MatTableDataSource<UserLogos>();

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

  ngOnInit(): void {
    const user = localStorage.getItem('user');
    if (!user) {
      this.router.navigate(['/']);
      return;
    }

    this.user! = JSON.parse(user!);

    this.getUserLogos();
  }

  getUserLogos(){
    this.userLogosService.getUserLogos(this.user!.id!)
    .subscribe((data: UserLogos[]) => {
      if (!data || data.length === 0) {
        console.log('Nessun dato disponibile');
      } else {
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    });
  }


    onDelete(element: any): void {
      const dialogRef = this.dialog.open(DeleteDialogComponent, {
        width: '400px',
        data: { 
          name: element.name,
          type: 'userLogos',
          id: element.id
          }
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
            this.getUserLogos();
        }
      });
  
    }
  
        
}

const USER_DATA = [
  { name:'Easyway Technology' },
];



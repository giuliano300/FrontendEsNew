import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { Router } from '@angular/router';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { infoBtnEdit, infoBtnDelete } from '../../../enviroments/enviroments';
import { RouterLink } from '@angular/router';
import { UsersService } from '../../../services/users.service';
import { Users } from '../../../interfaces/Users';
import { UserTypes } from '../../../interfaces/EnumTypes';
import { CommonModule } from '@angular/common';
import { DeleteDialogComponent } from '../../../component/delete-dialog/delete-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-utenti',
  imports: [MatTableModule, MatPaginatorModule, MatSortModule, MatIconModule, MatProgressBarModule, NgbModule,RouterLink, CommonModule],
  templateUrl: './utenti.component.html',
  styleUrl: './utenti.component.scss'
})
export class UtentiComponent {

  constructor(private router: Router, private userService: UsersService, private dialog: MatDialog) {}

  infoBtnEdit = infoBtnEdit;
  infoBtnDelete = infoBtnDelete;
  user: Users | null = null;
        
  displayedColumns: string[] = ['userTypes','businessName', 'email', 'mobile', 'edit', 'delete'];
  dataSource = new MatTableDataSource<any>([]);
  
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
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      this.router.navigate(['/']);
      return;
    }

    this.user = JSON.parse(userStr);

    this.getChildern();
  }

  getChildern(){
    this.userService.getChildren(this.user!.id!)
    .subscribe((data: Users[]) => {
      if (!data || data.length === 0) {
        this.dataSource.data = [];
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
        name: element.businessName,
        type: 'users',
        id: element.id
       }  // Passa i dati dell'elemento da eliminare
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
          this.getChildern();
      }
    });
  
  }


  getUserTypeName(value: number): string {
    return UserTypes[value];
  }

}

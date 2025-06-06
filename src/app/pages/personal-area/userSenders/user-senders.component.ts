import { Component, ViewChild, ViewEncapsulation } from '@angular/core';import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { UserSenders } from '../../../interfaces/UserSenders';
import { UserSendersService } from '../../../services/user-senders.service';
import { Users } from '../../../interfaces/Users';
import { Router } from '@angular/router';
import { DeleteDialogComponent } from '../../../component/delete-dialog/delete-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { RouterLink } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { infoBtnDelete, infoBtnEdit } from '../../../enviroments/enviroments';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-senders',
  imports: [MatTableModule, MatPaginatorModule, MatSortModule, MatIconModule,RouterLink, NgbModule, CommonModule],
  templateUrl: './user-senders.component.html',
  styleUrl: './user-senders.component.scss',
  encapsulation: ViewEncapsulation.None
})

export class UserSendersComponent {

  userSenders: UserSenders[] = [];

  user: Users | null  = null;

  infoBtnDelete=infoBtnDelete
  infoBtnEdit=infoBtnEdit

  constructor(private userSenderService: UserSendersService, private router: Router, private dialog: MatDialog) {}

  displayedColumns: string[] = ['businessName', 'address', 'zipCode', 'city', 'province', 'state', 'modifica','elimina'];
  dataSource = new MatTableDataSource<UserSenders>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    const user = localStorage.getItem('user');
    if (!user) {
      this.router.navigate(['/']);
      return;
    }

    this.user! = JSON.parse(user!);

    this.getUserSenders();
  }

  getUserSenders(){
    this.userSenderService.getUserSenders(this.user!.id!)
    .subscribe((data: UserSenders[]) => {
      if (!data || data.length === 0) {
        console.log('Nessun dato disponibile');
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

  
  onDelete(element: any): void {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '400px',
      data: { 
        name: element.businessName,
        type: 'userSender',
        id: element.id
       }  // Passa i dati dell'elemento da eliminare
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
          this.getUserSenders();
      }
    });
  }
}

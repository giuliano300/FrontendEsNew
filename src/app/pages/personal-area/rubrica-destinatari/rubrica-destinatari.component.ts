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
import { UserRecipients } from '../../../interfaces/UserRecipients';
import { Users } from '../../../interfaces/Users';
import { UserRecipientsService } from '../../../services/user-recipients.service';
import { DeleteDialogComponent } from '../../../component/delete-dialog/delete-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rubrica-destinatari',
  imports: [MatTableModule, MatPaginatorModule, MatSortModule, MatIconModule, MatProgressBarModule, NgbModule,RouterLink, CommonModule],
  templateUrl: './rubrica-destinatari.component.html',
  styleUrl: './rubrica-destinatari.component.scss'
})
export class RubricaDestinatariComponent {

  constructor(private router: Router, private userRecipientService: UserRecipientsService, private dialog: MatDialog) {}

  infoBtnEdit = infoBtnEdit;
  infoBtnDelete = infoBtnDelete;

    UserRecipients: UserRecipients[] = [];
  
    user: Users | null  = null;
  
          
  displayedColumns: string[] = ['businessName', 'address', 'zipCode', 'city', 'province', 'state', 'modifica','elimina'];
  dataSource = new MatTableDataSource<UserRecipients>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    const user = localStorage.getItem('user');
    if (!user) {
      this.router.navigate(['/']);
      return;
    }

    this.user! = JSON.parse(user!);

    this.getUserRecipients();
  }

  getUserRecipients(){
    this.userRecipientService.getUserRecipients(this.user!.id!)
    .subscribe((data: UserRecipients[]) => {
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
        name: element.businessName,
        type: 'userRecipient',
        id: element.id
       }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
          this.getUserRecipients();
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

}

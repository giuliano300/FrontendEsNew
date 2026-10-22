import { CommonModule } from '@angular/common';
import { Component, ViewChild, inject } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { AppStorageService } from '@app/services/app-storage.service';
import { Recipients } from '../../../classes/Recipients';
import { FncUtils } from '../../../fncUtils/fncUtils';
import { Users } from '../../../interfaces/Users';
import { RecipientService } from '../../../services/recipient.service';
import { UiEmptyStateComponent, UiLoadingStateComponent } from '@app/shared/ui';

@Component({
  selector: 'app-segnalazioni',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatPaginatorModule, MatSortModule, UiEmptyStateComponent, UiLoadingStateComponent],
  templateUrl: './segnalazioni.component.html',
  styleUrl: './segnalazioni.component.scss'
})
export class SegnalazioniComponent {
  private appStorage = inject(AppStorageService);

  displayedColumns = ['insertDate', 'productType', 'businessName', 'address', 'message'];
  dataSource = new MatTableDataSource<Recipients>([]);
  loading = false;
  private user: Users | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private router: Router, private recipientService: RecipientService) {}

  ngOnInit(): void {
    const storedUser = this.appStorage.getItem('user');
    if (!storedUser) {
      this.router.navigate(['/']);
      return;
    }

    this.user = JSON.parse(storedUser);
    this.loadReportedRecipients();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  private loadReportedRecipients(): void {
    if (!this.user?.id) return;

    this.loading = true;
    this.recipientService.getReportedRecipients(this.user.id).subscribe({
      next: recipients => {
        this.dataSource.data = recipients;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.loading = false;
      },
      error: () => {
        this.dataSource.data = [];
        this.loading = false;
      }
    });
  }

  getDate(date: string): string {
    return FncUtils.GetFormattedData(date);
  }

  getProductName(productType: number): string {
    return FncUtils.GetProductName(productType);
  }
}

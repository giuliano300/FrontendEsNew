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
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';



@Component({
  selector: 'app-dettaglio-spedizione',
  imports: [MatTableModule, MatPaginatorModule, MatSortModule, MatIconModule, MatProgressBarModule, NgbModule, ReactiveFormsModule],
  templateUrl: './dettaglio-spedizione.component.html',
  styleUrl: './dettaglio-spedizione.component.scss'
})
export class DettaglioSpedizioneComponent {
  constructor(
    private router: Router, 
    private  route: ActivatedRoute,
    private modalService: NgbModal
  ) {}

  infoBtnDownload = infoBtnDownload;
  currentModalRef: any;


  ngOnInit() {
  const id = this.route.snapshot.paramMap.get('id');
    console.log('ID ricevuto:', id);
  }
    

  form = new FormGroup({
    destinatario: new FormControl(''),
    codice: new FormControl(''),
    sel_esito: new FormControl(''),
  });



  displayedColumns: string[] = ['name', 'address', 'transfer', 'date', 'code', 'status', 'actions', 'actions2', 'actions3'];
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
      this.router.navigate(['/dettaglioSpedizione']);
    }

    // Metodo per aprire il modal e salvare il riferimento
    openModal(content: any) {
      const modalRef = this.modalService.open(content, { centered: true, backdrop: 'static', keyboard: true });
      this.currentModalRef = modalRef;

      // Gestione della chiusura "manuale" o tramite esc/click esterno
      modalRef.result.catch(() => {}); // evita errori non gestiti
    }

    // Metodo per navigare e chiudere il modal
    navigateAndClose(route: string) {
      if (this.currentModalRef) {
        this.currentModalRef.close();
      }
      this.router.navigate([route]);
    }

  

}


const USER_DATA = [
  {name: 'Mario Rossi', address:'Via Toledo, 30 80132 Napoli(NA)', transfer:'Accettato', date: '12/05/2025 - 09:33'},
  {name: 'EWT Srl', address:'Viale Michelangelo, 50 80129 Napoli(NA)', transfer:'Accettato', date: '12/05/2025 - 09:33'}
];


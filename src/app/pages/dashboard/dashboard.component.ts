import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  currentModalRef: any;

  constructor(private modalService: NgbModal, private router: Router) {}

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

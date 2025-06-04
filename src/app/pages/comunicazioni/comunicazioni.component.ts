import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';


@Component({
  selector: 'app-comunicazioni',
  imports: [],
  templateUrl: './comunicazioni.component.html',
  styleUrl: './comunicazioni.component.scss'
})
export class ComunicazioniComponent {

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

import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ShepherdService } from 'angular-shepherd';
import { Placement as PopperPlacement } from '@popperjs/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [RouterLink]
})
export class DashboardComponent {

  currentModalRef: any;

  constructor(private modalService: NgbModal, private router: Router, private shepherdService: ShepherdService) {}


    ngOnInit() {
      //if(!localStorage.getItem("tour")){
        this.startTour();
        //localStorage.setItem("tour", "true");
      //}
    }

    startTour() {
    const steps = [
      {
        id: 'dashboard',
        text: 'Avvia una <strong>nuova spedizione</strong> direttamente da qui.',
        attachTo: {
          element: '.step-1',
          on: 'bottom' as PopperPlacement
        },
        modalOverlayOpeningPadding: 14,
        modalOverlayOpeningRadius: 5,
        classes: 'margin-step-y', 
        buttons: [
          { text: 'Avanti', action: () => this.shepherdService.next() }
        ]
      },
      {
        id: 'dashboard2',
        text: 'Controlla lo <strong>stato degli invii</strong> dei tuoi prodotti postali in tempo reale.',
        attachTo: {
          element: '.step-2',
          on: 'bottom' as PopperPlacement
        },
        modalOverlayOpeningPadding: 14,
        modalOverlayOpeningRadius: 5,
        classes: 'margin-step-y', 
        buttons: [
          { text: 'Avanti', action: () => this.shepherdService.next() }
        ]
      },
      {
        id: 'dashboard3',
        text: 'Consulta lo <strong>storico delle spedizioni</strong> effettuate.',
        attachTo: {
          element: '.step-3',
          on: 'bottom' as PopperPlacement
        },
        modalOverlayOpeningPadding: 14,
        modalOverlayOpeningRadius: 5,
        classes: 'margin-step-y', 
        buttons: [
          { text: 'Avanti', action: () => this.shepherdService.next() }
        ]
      },
      {
        id: 'dashboard4',
        text: 'Visualizza i <strong>report dettagliati</strong> delle spedizioni effettuate.',
        attachTo: {
          element: '.step-4',
          on: 'bottom' as PopperPlacement
        },
        modalOverlayOpeningPadding: 14,
        modalOverlayOpeningRadius: 5,
        classes: 'margin-step-y', 
        buttons: [
          { text: 'Avanti', action: () => this.shepherdService.next() }
        ]
      },
      {
        id: 'dashboard5',
        text: 'Accedi alla sezione <strong>Utility di Easysender</strong> per sincronizzare Bipiol, unire o comprimere PDF, stampare e scaricare file di esempio. ',
        attachTo: {
          element: '.step-5',
          on: 'bottom' as PopperPlacement
        },
        modalOverlayOpeningPadding: 14,
        modalOverlayOpeningRadius: 5,
        classes: 'margin-step-y', 
        buttons: [
          { text: 'Avanti', action: () => this.shepherdService.next() }
        ]
      },
      {
        id: 'dashboardend',
        text: 'Leggi le comunicazioni ufficiali di <strong>Easysender e Poste Italiane</strong>.',
        attachTo: {
          element: '.step-end',
          on: 'bottom' as PopperPlacement
        },
        modalOverlayOpeningPadding: 14,
        modalOverlayOpeningRadius: 5,
        classes: 'margin-step-y', 
        buttons: [
          { text: 'Fine', action: () => this.shepherdService.complete() }
        ]
      }

    ];

    // Abilita il dark overlay
    this.shepherdService.modal = true;

    // Opzioni di default per tutti gli step
    this.shepherdService.defaultStepOptions = {
      scrollTo: true,
      cancelIcon: { enabled: true },
      classes: 'shepherd-theme-arrows'
    };

    // Carica e avvia il tour
    this.shepherdService.addSteps(steps);

    // Ritarda il primo step
    setTimeout(() => {
      this.shepherdService.start();
    }, 300);

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

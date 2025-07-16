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
        text: 'Questa è la dashboard principale.',
        attachTo: {
          element: '.test',
          on: 'bottom' as PopperPlacement 
        },
        buttons: [
          { text: 'Avanti', action: () => this.shepherdService.next() }
        ]
      },
      {
        id: 'dashboard',
        text: 'Questa è la dashboard principale.',
        attachTo: {
          element: '.test2',
          on: 'top' as PopperPlacement 
        },
        buttons: [
          { text: 'fine', action: () => this.shepherdService.complete() }
        ]
      }

    ];
    this.shepherdService.defaultStepOptions = {
      scrollTo: true,
      cancelIcon: { enabled: true },
      classes: 'shepherd-theme-arrows'
    };

    this.shepherdService.addSteps(steps);
    this.shepherdService.start();
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

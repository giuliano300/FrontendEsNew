import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { Users } from '../../interfaces/Users';
import { NotificationService } from '../../services/notification.service';
import { CommonModule } from '@angular/common';
import { Notifications } from '../../interfaces/Notifications';
import { NotificationType } from '../../interfaces/EnumTypes';


@Component({
  selector: 'app-comunicazioni',
  imports: [CommonModule],
  templateUrl: './comunicazioni.component.html',
  styleUrl: './comunicazioni.component.scss'
})
export class ComunicazioniComponent {

  public NotificationType!: typeof NotificationType;


  constructor(private modalService: NgbModal, private router: Router, private notificationService: NotificationService) {
    this.NotificationType = NotificationType;
  }

  currentModalRef: any;

  selectedNotification: Notifications | null = null;

  user:Users | null = null;

  notifications: Notifications[] = [];

  // Metodo per aprire il modal e salvare il riferimento
  openModal(content: any, notification: Notifications) {
    this.selectedNotification = notification;
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

    ngOnInit(): void {
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        this.router.navigate(['/']);
        return;
      }

      this.user = JSON.parse(userStr);

      this.getNotifications();
    }


  getNotifications(){ 
    this.notificationService.getNotifications()
    .subscribe((data: Notifications[]) => {
      if (!data || data.length === 0) 
        this.notifications = [];
      else 
        this.notifications = data;
    });

  }
}

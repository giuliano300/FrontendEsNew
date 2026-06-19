import { Component, inject } from '@angular/core';
import { AppStorageService } from '@app/services/app-storage.service';
import { sendType } from '@app/config/app-constants';
import { SelectionWithWithoutBulletinComponent } from '../../../component/selection-with-without-bulletin/selection-with-without-bulletin.component';

@Component({
  selector: 'app-invio-singolo-agol',
  imports: [SelectionWithWithoutBulletinComponent],
  templateUrl: './invio-singolo-agol.component.html',
  styleUrl: './invio-singolo-agol.component.scss'
})
export class InvioSingoloAgolComponent {
  private appStorage = inject(AppStorageService);
  tipoInvio = sendType.singolo

  constructor() {}

  ngOnInit(): void{
    this.appStorage.setItem('sendType', this.tipoInvio!.toString());
  }
}

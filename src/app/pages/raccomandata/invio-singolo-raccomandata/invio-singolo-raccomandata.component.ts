import { Component, inject } from '@angular/core';
import { AppStorageService } from '@app/services/app-storage.service';
import { Router } from '@angular/router';
import { sendType } from '@app/config/app-constants';
import { SelectionWithWithoutBulletinComponent } from '../../../component/selection-with-without-bulletin/selection-with-without-bulletin.component';


@Component({
  selector: 'app-invio-singolo-raccomandata',
  imports: [SelectionWithWithoutBulletinComponent],
  templateUrl: './invio-singolo-raccomandata.component.html',
  styleUrl: './invio-singolo-raccomandata.component.scss'
})
export class InvioSingoloRaccomandataComponent {
  private appStorage = inject(AppStorageService);

  tipoInvio = sendType.singolo

  constructor() {}

  ngOnInit(): void{
    this.appStorage.setItem('sendType', this.tipoInvio!.toString());
  }
}

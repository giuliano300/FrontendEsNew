import { Component, inject } from '@angular/core';
import { AppStorageService } from '@app/services/app-storage.service';
import { sendType } from '@app/config/app-constants';
import { SelectionWithWithoutBulletinComponent } from '../../../component/selection-with-without-bulletin/selection-with-without-bulletin.component';

@Component({
  selector: 'app-invio-multiplo-agol',
  imports: [SelectionWithWithoutBulletinComponent],
  templateUrl: './invio-multiplo-agol.component.html',
  styleUrl: './invio-multiplo-agol.component.scss'
})
export class InvioMultiploAgolComponent {
  private appStorage = inject(AppStorageService);
  constructor() {}
  tipoInvio = sendType.mutiplo
  
  ngOnInit(): void{
    this.appStorage.setItem('sendType', this.tipoInvio!.toString());
  }

}

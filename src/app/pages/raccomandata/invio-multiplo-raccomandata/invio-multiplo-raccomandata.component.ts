import { Component, inject } from '@angular/core';
import { AppStorageService } from '@app/services/app-storage.service';
import { sendType } from '@app/config/app-constants';
import { SelectionWithWithoutBulletinComponent } from '../../../component/selection-with-without-bulletin/selection-with-without-bulletin.component';

@Component({
  selector: 'app-invio-multiplo-raccomandata',
  imports: [SelectionWithWithoutBulletinComponent],
  templateUrl: './invio-multiplo-raccomandata.component.html',
  styleUrl: './invio-multiplo-raccomandata.component.scss'
})
export class InvioMultiploRaccomandataComponent {
  private appStorage = inject(AppStorageService);
  constructor() {}
  tipoInvio = sendType.mutiplo
  
  ngOnInit(): void{
    this.appStorage.setItem('sendType', this.tipoInvio!.toString());
  }

}

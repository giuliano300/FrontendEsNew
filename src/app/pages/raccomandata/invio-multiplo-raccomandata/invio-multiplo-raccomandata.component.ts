import { Component } from '@angular/core';
import { sendType } from '../../../../main';
import { SelectionWithWithoutBulletinComponent } from '../../../component/selection-with-without-bulletin/selection-with-without-bulletin.component';

@Component({
  selector: 'app-invio-multiplo-raccomandata',
  imports: [SelectionWithWithoutBulletinComponent],
  templateUrl: './invio-multiplo-raccomandata.component.html',
  styleUrl: './invio-multiplo-raccomandata.component.scss'
})
export class InvioMultiploRaccomandataComponent {
  constructor() {}
  tipoInvio = sendType.mutiplo
  
  ngOnInit(): void{
    localStorage.setItem('sendType', this.tipoInvio!.toString());
  }

}

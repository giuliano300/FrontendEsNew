import { Component } from '@angular/core';
import { sendType } from '../../../../main';
import { SelectionWithWithoutBulletinComponent } from '../../../component/selection-with-without-bulletin/selection-with-without-bulletin.component';

@Component({
  selector: 'app-invio-multiplo-agol',
  imports: [SelectionWithWithoutBulletinComponent],
  templateUrl: './invio-multiplo-agol.component.html',
  styleUrl: './invio-multiplo-agol.component.scss'
})
export class InvioMultiploAgolComponent {
  constructor() {}
  tipoInvio = sendType.mutiplo
  
  ngOnInit(): void{
    localStorage.setItem('sendType', this.tipoInvio!.toString());
  }

}

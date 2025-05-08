import { Component } from '@angular/core';
import { sendType } from '../../../../main';
import { SelectionWithWithoutBulletinComponent } from '../../../component/selection-with-without-bulletin/selection-with-without-bulletin.component';

@Component({
  selector: 'app-invio-singolo-agol',
  imports: [SelectionWithWithoutBulletinComponent],
  templateUrl: './invio-singolo-agol.component.html',
  styleUrl: './invio-singolo-agol.component.scss'
})
export class InvioSingoloAgolComponent {
  tipoInvio = sendType.singolo

  constructor() {}

  ngOnInit(): void{
    localStorage.setItem('sendType', this.tipoInvio!.toString());
  }
}

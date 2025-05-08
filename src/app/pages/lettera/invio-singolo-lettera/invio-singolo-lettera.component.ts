import { Component } from '@angular/core';
import { sendType } from '../../../../main';
import { SelectionWithWithoutBulletinComponent } from '../../../component/selection-with-without-bulletin/selection-with-without-bulletin.component';

@Component({
  selector: 'app-invio-singolo-lettera',
  imports: [SelectionWithWithoutBulletinComponent],
  templateUrl: './invio-singolo-lettera.component.html',
  styleUrl: './invio-singolo-lettera.component.scss'
})
export class InvioSingoloLetteraComponent {
  tipoInvio = sendType.singolo

  constructor() {}

  ngOnInit(): void{
    localStorage.setItem('sendType', this.tipoInvio!.toString());
  }
}

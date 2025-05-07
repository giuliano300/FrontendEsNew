import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { sendType } from '../../../../main';
import { SelectionWithWithoutBulletinComponent } from '../../../component/selection-with-without-bulletin/selection-with-without-bulletin.component';


@Component({
  selector: 'app-invio-singolo-raccomandata',
  imports: [SelectionWithWithoutBulletinComponent],
  templateUrl: './invio-singolo-raccomandata.component.html',
  styleUrl: './invio-singolo-raccomandata.component.scss'
})
export class InvioSingoloRaccomandataComponent {

  tipoInvio = sendType.singolo

  constructor() {}

  ngOnInit(): void{
    localStorage.setItem('sendType', this.tipoInvio!.toString());
  }
}

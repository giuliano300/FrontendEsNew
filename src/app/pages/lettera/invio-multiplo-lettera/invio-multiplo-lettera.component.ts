import { Component } from '@angular/core';
import { sendType } from '../../../../main';
import { SelectionWithWithoutBulletinComponent } from '../../../component/selection-with-without-bulletin/selection-with-without-bulletin.component';

@Component({
  selector: 'app-invio-multiplo-lettera',
  imports: [SelectionWithWithoutBulletinComponent],
  templateUrl: './invio-multiplo-lettera.component.html',
  styleUrl: './invio-multiplo-lettera.component.scss'
})
export class InvioMultiploLetteraComponent {
  constructor() {}
  tipoInvio = sendType.mutiplo
  
  ngOnInit(): void{
    localStorage.setItem('sendType', this.tipoInvio!.toString());
  }
}

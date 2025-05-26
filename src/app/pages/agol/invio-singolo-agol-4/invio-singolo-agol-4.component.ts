import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { bulletin } from '../../../../main';
import { SelectRecipientComponent } from "../../../component/select-recipient/select-recipient/select-recipient.component";


@Component({
  selector: 'app-invio-singolo-agol-4',
  imports: [SelectRecipientComponent],
  templateUrl: './invio-singolo-agol-4.component.html',
  styleUrl: './invio-singolo-agol-4.component.scss'
})
export class InvioSingoloAgol4Component {

  bulletin: string | null = "senza bollettino";

  constructor() {}

  ngOnInit(): void {

    const bul = localStorage.getItem('bulletin')!;
    if(parseInt(bul) == bulletin.si)
      this.bulletin = "con bollettino";
    
  }
}

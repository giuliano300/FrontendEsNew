import { Component, inject } from '@angular/core';
import { AppStorageService } from '@app/services/app-storage.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { bulletin } from '@app/config/app-constants';
import { SelectRecipientComponent } from "../../../component/select-recipient/select-recipient/select-recipient.component";


@Component({
  selector: 'app-invio-singolo-agol-4',
  imports: [SelectRecipientComponent],
  templateUrl: './invio-singolo-agol-4.component.html',
  styleUrl: './invio-singolo-agol-4.component.scss'
})
export class InvioSingoloAgol4Component {
  private appStorage = inject(AppStorageService);

  bulletin: string | null = "senza bollettino";

  constructor() {}

  ngOnInit(): void {

    const bul = this.appStorage.getItem('bulletin')!;
    if(parseInt(bul) == bulletin.si)
      this.bulletin = "con bollettino";
    
  }
}

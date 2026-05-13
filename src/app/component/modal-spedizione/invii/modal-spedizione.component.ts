import { Component, Input } from '@angular/core';
import { GetDettaglioDestinatario } from '../../../interfaces/GetDettaglioDestinatario';
import { FncUtils } from '../../../fncUtils/fncUtils';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-spedizione',
  imports: [CommonModule],
  templateUrl: './modal-spedizione.component.html',
  styleUrl: './modal-spedizione.component.scss'
})
export class ModalSpedizioneComponent  {
  currentModalRef: any;
  @Input() modalData!: GetDettaglioDestinatario;

  constructor(public activeModal: NgbActiveModal) {
  }
  
  ngOnInit(): void {
    this.modalData.historicRecipientStatuses.sort((a, b) => {
      return new Date(b.outcomeDate).getTime() - new Date(a.outcomeDate).getTime();
    });
  }

   getDate(date:string): string{
     return FncUtils.GetFormattedData(date);
   }
  
   closeModal() {
    this.activeModal.dismiss('Cross click');
   }
}

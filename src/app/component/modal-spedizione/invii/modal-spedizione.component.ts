import { Component, Input } from '@angular/core';
import { GetDettaglioDestinatario } from '../../../interfaces/GetDettaglioDestinatario';
import { FncUtils } from '../../../fncUtils/fncUtils';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { RecipientService } from '../../../services/recipient.service';
import { CurrentStateOptions, ProductTypeDescriptions, ProductTypes } from '../../../interfaces/EnumTypes';

@Component({
  selector: 'app-modal-spedizione',
  imports: [CommonModule],
  templateUrl: './modal-spedizione.component.html',
  styleUrl: './modal-spedizione.component.scss'
})
export class ModalSpedizioneComponent  {
  currentModalRef: any;
  @Input() modalData: GetDettaglioDestinatario = {
    sender: { businessName: '' },
    recipient: {
      businessName: '',
      code: '',
      insertDate: FncUtils.GetAdjustedNowIso()
    },
    historicRecipientStatuses: []
  } as unknown as GetDettaglioDestinatario;

  downloadingDocument: string | null = null;
  documentError = '';

  constructor(
    public activeModal: NgbActiveModal,
    private recipientService: RecipientService
  ) {
  }
  
  ngOnInit(): void {
    this.modalData.historicRecipientStatuses.sort((a, b) => {
      return new Date(b.outcomeDate).getTime() - new Date(a.outcomeDate).getTime();
    });
  }

  isTelegram(): boolean {
    return this.modalData.recipient.productType === ProductTypes.TOL;
  }

  get productName(): string {
    return ProductTypeDescriptions[this.modalData.recipient.productType as ProductTypes] || 'Spedizione';
  }

  get currentStateLabel(): string {
    return CurrentStateOptions.find(state => state.value === this.modalData.recipient.currentState)?.label
      || this.modalData.recipient.message
      || 'Stato non disponibile';
  }

  get hasReturnReceipt(): boolean {
    return this.modalData.recipient.returnReceipt === true;
  }

  get hasSentDocument(): boolean {
    return !!this.modalData.recipient.attachedFileRAName;
  }

  get sentDocumentName(): string {
    return this.modalData.recipient.attachedFileRAName || 'documento-inviato.pdf';
  }

  get hasAcceptanceReceipt(): boolean {
    return this.modalData.recipient.productType === ProductTypes.ROL
      && !!this.modalData.recipient.attachedFileRicevutaAccettazioneName;
  }

  get isAgol(): boolean {
    return this.modalData.recipient.productType === ProductTypes.AGOL;
  }

  downloadFile(type: 'attachedFile' | 'rr' | 'ra' | 'acceptanceReceipt', fileName: string): void {
    const recipientId = this.modalData.recipient.id;
    if (!recipientId) return;

    this.documentError = '';
    this.downloadingDocument = type;
    this.recipientService.getFile(type, recipientId).subscribe({
      next: response => {
        if (!response) {
          this.documentError = 'Il documento non è ancora disponibile.';
          return;
        }

        const blob = FncUtils.getFileFromBase64(response);
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
        window.URL.revokeObjectURL(link.href);
      },
      error: () => this.documentError = 'Il documento non è ancora disponibile.',
      complete: () => this.downloadingDocument = null
    });
  }

   getDate(date:string): string{
     return FncUtils.GetFormattedData(date);
   }
  
   closeModal() {
    this.activeModal.dismiss('Cross click');
   }
}

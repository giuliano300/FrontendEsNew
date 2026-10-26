import { UiAlertComponent } from '@app/shared/ui';
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserSendersService } from '../../../services/user-senders.service';

@Component({
  selector: 'app-add-sender-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, UiAlertComponent],
  templateUrl: './add-sender-modal.component.html',
  styleUrl: './add-sender-modal.component.scss'
})
export class AddSenderModalComponent {
  @Input() userId!: number;
  @Input() userParentId = 0;

  alertMessage = false;
  alertText = '';
  saving = false;

  form = new FormGroup({
    businessName: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(44)] }),
    complementNames: new FormControl('', { nonNullable: true }),
    address: new FormControl('', { nonNullable: true, validators: Validators.required }),
    complementAddress: new FormControl('', { nonNullable: true }),
    zipCode: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(5)] }),
    city: new FormControl('', { nonNullable: true, validators: Validators.required }),
    province: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(2)] }),
    state: new FormControl('ITALIA', { nonNullable: true, validators: Validators.required }),
    mobile: new FormControl('', { nonNullable: true }),
    email: new FormControl('', { nonNullable: true, validators: Validators.email })
  });

  constructor(
    private userSendersService: UserSendersService,
    public activeModal: NgbActiveModal
  ) {}

  dismiss(): void {
    this.activeModal.dismiss();
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.alertMessage = true;
      this.alertText = 'Compila tutti i campi obbligatori correttamente.';
      return;
    }

    this.saving = true;
    this.userSendersService.setUserSender({
      ...this.form.getRawValue(),
      userId: this.userId,
      userParentId: this.userParentId
    }).subscribe({
      next: (sender) => {
        this.saving = false;
        if (!sender?.id) {
          this.alertMessage = true;
          this.alertText = 'Il mittente è stato salvato, ma non è stato possibile selezionarlo. Riprova.';
          return;
        }
        this.activeModal.close(sender);
      },
      error: () => {
        this.saving = false;
        this.alertMessage = true;
        this.alertText = 'Errore durante il salvataggio del mittente. Riprova.';
      }
    });
  }
}

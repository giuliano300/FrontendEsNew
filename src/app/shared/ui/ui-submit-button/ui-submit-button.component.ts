import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-ui-submit-button',
  imports: [CommonModule],
  templateUrl: './ui-submit-button.component.html',
  styleUrl: './ui-submit-button.component.scss'
})
export class UiSubmitButtonComponent {
  @Input() loading = false;
  @Input() label = 'Conferma';
  @Input() loadingLabel = '';
  @Input() buttonClass = '';
  @Input() disabled = false;
}

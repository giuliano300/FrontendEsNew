import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-ui-alert',
  imports: [CommonModule],
  templateUrl: './ui-alert.component.html',
  styleUrl: './ui-alert.component.scss'
})
export class UiAlertComponent {
  @Input() visible = true;
  @Input() message = '';
  @Input() strongMessage = '';
  @Input() prefix = '';
  @Input() icon = 'bx bxs-error';
  @Input() iconClass = 'color-orange';
  @Input() messageClass = '';
}

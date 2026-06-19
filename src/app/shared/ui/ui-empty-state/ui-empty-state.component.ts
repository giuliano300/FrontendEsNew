import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-ui-empty-state',
  imports: [CommonModule],
  templateUrl: './ui-empty-state.component.html',
  styleUrl: './ui-empty-state.component.scss'
})
export class UiEmptyStateComponent {
  @Input() visible = true;
  @Input() message = 'Nessun dato disponibile.';
}

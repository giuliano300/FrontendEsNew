import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-ui-loading-state',
  imports: [CommonModule],
  templateUrl: './ui-loading-state.component.html',
  styleUrl: './ui-loading-state.component.scss'
})
export class UiLoadingStateComponent {
  @Input() visible = false;
  @Input() label = '';
}

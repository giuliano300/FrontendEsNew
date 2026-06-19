import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-ui-tour-restart',
  templateUrl: './ui-tour-restart.component.html',
  styleUrl: './ui-tour-restart.component.scss'
})
export class UiTourRestartComponent {
  @Input() label = 'RIPRENDI IL TOUR ';
  @Output() restart = new EventEmitter<void>();
}

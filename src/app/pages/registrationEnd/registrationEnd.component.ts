import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AppStorageService } from '../../services/app-storage.service';

@Component({
  selector: 'app-registration-end',
  imports: [RouterLink],
  templateUrl: './registrationEnd.component.html',
  styleUrl: './registrationEnd.component.scss'
})
export class RegistrationEndComponent {
  constructor(private storage: AppStorageService) {}

  ngOnInit(): void {
    this.storage.clearRegistrationUserId();
  }
}

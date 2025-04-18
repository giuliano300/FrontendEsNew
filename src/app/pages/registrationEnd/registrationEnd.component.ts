import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-registration-end',
  imports: [RouterLink],
  templateUrl: './registrationEnd.component.html',
  styleUrl: './registrationEnd.component.scss'
})
export class RegistrationEndComponent {
  ngOnInit(): void {
    localStorage.removeItem('userId'); 
  }
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-template',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.scss']
})
export class TemplateComponent {
  constructor(private router: Router) {}
  logout(){
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    this.router.navigate(['/']);
  }

  OpenMenu(){
    document.querySelector('.side-menu')!.classList.add('open');
  }

  CloseMenu(){
    document.querySelector('.side-menu')!.classList.remove('open');
  }

}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { Users } from '../interfaces/Users';
import { UsersService } from '../services/users.service';

@Component({
  selector: 'app-template',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.scss']
})
export class TemplateComponent {
  constructor(private router: Router, private userService: UsersService) {}

  user: Users | null  = null;

  userName: string | null = null;
  
  logout(){
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');

    //ELIMINAZIONE DEI VALORI RELATIVI 
    //ALLE SELEZIONI DEI PRODOTTI 
    localStorage.removeItem('productType');    
    localStorage.removeItem('sendType');    
    localStorage.removeItem('bulletin');    

    this.router.navigate(['/']);
  }

  ngOnInit() {
    const user = localStorage.getItem('user');
      if (!user) {
        this.router.navigate(['/']);
        return;
      }
  
    this.user! = JSON.parse(user!);

    this.userService.setUserName(this.user!.businessName);

    this.userService.userName$.subscribe(name => {
      this.userName = name
    });
  }

  OpenMenu(){
    document.querySelector('.side-menu')!.classList.add('open');
    document.querySelector('.menu-overlay')!.classList.add('visible');
    document.querySelector('.menu-overlay')!.classList.remove('hidden');
  }

  CloseMenu(){
    document.querySelector('.side-menu')!.classList.remove('open');
    document.querySelector('.menu-overlay')!.classList.remove('visible');
    document.querySelector('.menu-overlay')!.classList.add('hidden');
  }

}

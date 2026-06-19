import { Component } from '@angular/core';
import { decryptToken } from '@app/config/app-constants';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UsersService } from '../../services/users.service';

interface LegacyAccessTokenPayload {
  guid: string;
  pwd: string;
}

@Component({
  selector: 'app-access',
  imports: [],
  templateUrl: './access.component.html',
  styleUrl: './access.component.scss'
})
export class AccessComponent {

  constructor(private router: Router,  private userService: UsersService, private authService: AuthService) { }

  ngOnInit(): void {

    const params = new URLSearchParams(
      window.location.search
    );

    const token = params.get('t');

    if (!token) {
      return;
    }

    const data = decryptToken(token) as LegacyAccessTokenPayload | null;

    if(data?.guid && data?.pwd){
      const loginData = {
        email: data.guid,
        pwd: data.pwd
      }
      this.userService.loginOldPlatform(loginData).subscribe({
        next: (user: any) => {
            this.authService.saveLocalStorage(user);
            
            this.router.navigate(['/dashboard']);
        }
      });
    }

  }

}

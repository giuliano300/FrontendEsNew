import { Component, inject } from '@angular/core';
import { AppStorageService } from '@app/services/app-storage.service';
import { SelectSenderComponent } from '../../../component/select-sender/select-sender/select-sender.component';
import { Router } from '@angular/router';
import { bulletin } from '@app/config/app-constants';
import { Users } from '../../../interfaces/Users';


@Component({
  selector: 'app-invio-singolo-lettera-3',
  imports: [SelectSenderComponent],
  templateUrl: './invio-singolo-lettera-3.component.html',
  styleUrl: './invio-singolo-lettera-3.component.scss'
})
export class InvioSingoloLettera3Component {
  private appStorage = inject(AppStorageService);
  constructor(private router: Router) {}  
  bulletin: string | null = "senza bollettino";

  user: Users | null  = null;
  
   getThisUser(){
    const user = this.appStorage.getItem('user');
      if (!user) {
        this.router.navigate(['/']);
        return;
      }
  
      this.user! = JSON.parse(user!);
    }
  
  
    ngOnInit(): void {
      this.getThisUser();
  
        const bul = this.appStorage.getItem('bulletin')!;
        if(parseInt(bul) == bulletin.si)
          this.bulletin = "con bollettino";
      
    }

}

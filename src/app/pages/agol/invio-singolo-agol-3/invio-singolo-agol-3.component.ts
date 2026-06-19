import { Component, inject } from '@angular/core';
import { AppStorageService } from '@app/services/app-storage.service';
import { Router } from '@angular/router';
import { Users } from '../../../interfaces/Users';
import { SelectSenderComponent } from '../../../component/select-sender/select-sender/select-sender.component';
import { bulletin } from '@app/config/app-constants';


@Component({
  selector: 'app-invio-singolo-agol-3',
  imports: [SelectSenderComponent],
  templateUrl: './invio-singolo-agol-3.component.html',
  styleUrl: './invio-singolo-agol-3.component.scss'
})
export class InvioSingoloAgol3Component {
  private appStorage = inject(AppStorageService);

  constructor(private router: Router) {}  
  user: Users | null  = null;
  
  bulletin: string | null = "senza bollettino";

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

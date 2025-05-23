import { Component } from '@angular/core';
import { SelectSenderComponent } from '../../../component/select-sender/select-sender/select-sender.component';
import { Router } from '@angular/router';
import { bulletin } from '../../../../main';
import { Users } from '../../../interfaces/Users';


@Component({
  selector: 'app-invio-singolo-lettera-3',
  imports: [SelectSenderComponent],
  templateUrl: './invio-singolo-lettera-3.component.html',
  styleUrl: './invio-singolo-lettera-3.component.scss'
})
export class InvioSingoloLettera3Component {
  constructor(private router: Router) {}  
  bulletin: string | null = "senza bollettino";

  user: Users | null  = null;
  
   getThisUser(){
    const user = localStorage.getItem('user');
      if (!user) {
        this.router.navigate(['/']);
        return;
      }
  
      this.user! = JSON.parse(user!);
    }
  
  
    ngOnInit(): void {
      this.getThisUser();
  
        const bul = localStorage.getItem('bulletin')!;
        if(parseInt(bul) == bulletin.si)
          this.bulletin = "con bollettino";
      
    }

}

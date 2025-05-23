import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Users } from '../../../interfaces/Users';
import { SelectSenderComponent } from '../../../component/select-sender/select-sender/select-sender.component';
import { bulletin } from '../../../../main';


@Component({
  selector: 'app-invio-singolo-raccomandata-3',
  imports: [SelectSenderComponent],
  templateUrl: './invio-singolo-raccomandata-3.component.html',
  styleUrl: './invio-singolo-raccomandata-3.component.scss'
})
export class InvioSingoloRaccomandata3Component {

  constructor(private router: Router) {}  
  user: Users | null  = null;
  
  bulletin: string | null = "senza bollettino";

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

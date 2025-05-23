import { Router } from '@angular/router';
import { Users } from '../../../interfaces/Users';

import { bulletin } from '../../../../main';
import { Component } from '@angular/core';
import { SelectRecipientComponent } from '../../../component/select-recipient/select-recipient/select-recipient.component';

@Component({
  selector: 'app-invio-singolo-raccomandata-4',
  imports: [SelectRecipientComponent],
  templateUrl: './invio-singolo-raccomandata-4.component.html',
  styleUrl: './invio-singolo-raccomandata-4.component.scss'
})
export class InvioSingoloRaccomandata4Component {

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

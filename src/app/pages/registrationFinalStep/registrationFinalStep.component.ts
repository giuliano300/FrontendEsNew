import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { Users } from '../../interfaces/Users';
import { UserProducts } from '../../interfaces/UserProducts';
import { UsersProductsService } from '../../services/userProducts.service';
import { ProductTypes } from '../../interfaces/ProductTypes';


@Component({
  selector: 'app-registration-final-step',
  imports: [CommonModule, ReactiveFormsModule, NgbModalModule, RouterLink],
  templateUrl: './registrationFinalStep.component.html',
  styleUrl: './registrationFinalStep.component.scss'
})
export class RegistrationFinalStepComponent {
  constructor(private userProductService: UsersProductsService, private router: Router) {}
 
  @ViewChild('content') content: TemplateRef<any> | undefined;

  errorMessage: string | null = null;
  form = new FormGroup({
    agolCode: new FormControl(''),
    volCode: new FormControl(''),
  });

  ngOnInit(): void {
    const token = localStorage.getItem('authToken');
    const userId = localStorage.getItem('userId');
    if (token) 
      this.router.navigate(['/dashboard']);
    if (!userId) 
      this.router.navigate(['/registration']);
  }

  onSubmit() {
    if (this.form.valid) 
    {      
      const userId = localStorage.getItem('userId');

      //AGOL
      if(this.form.value.agolCode != null && this.form.value.agolCode != "")
      {
          const userProductsAgol: UserProducts = 
        {
          userId: parseInt(userId!),
          code: this.form.value.agolCode!,
          type: ProductTypes.AGOL,
          enabled: true
        };

        this.userProductService.setUserProducts(userProductsAgol)
          .subscribe((data:UserProducts) => {
            if(data == null)
              this.errorMessage = "Errore nel salvataggio dei dati.";
        })
      }

      //VOL
      if(this.form.value.volCode != null && this.form.value.volCode != "")
      {
        const userProductsVol: UserProducts = 
        {
          userId: parseInt(userId!),
          code: this.form.value.volCode!,
          type: ProductTypes.VOL,
          enabled: true
        };

        this.userProductService.setUserProducts(userProductsVol)
          .subscribe((data:UserProducts) => {
            if(data == null)
              this.errorMessage = "Errore nel salvataggio dei dati.";
          })
      }

      if(!this.errorMessage)
        this.router.navigate(['/registrationEnd']);

    }
    else
    {
      this.errorMessage = "Errore nel salvataggio dei dati.";
    }
  }

  allowOnlyNumbers(event: KeyboardEvent) {
    const charCode = event.key.charCodeAt(0);
    // Blocca tutto ciò che non è tra 0 e 9
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }

}

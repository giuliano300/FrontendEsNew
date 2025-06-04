import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { alertLogo } from '../../../enviroments/enviroments';
import { UserLogosService } from '../../../services/user-logos.service';
import { UserLogos } from '../../../interfaces/UserLogos';
import { Users } from '../../../interfaces/Users';


@Component({
  selector: 'app-add-logo',
  imports: [ReactiveFormsModule, CommonModule, NgbModule],
  templateUrl: './add-logo.component.html',
  styleUrl: './add-logo.component.scss'
})
export class AddLogoComponent {
    constructor(private router: Router, private userLogosService: UserLogosService) {}
    alertMessage = false;
    alertText = '';

    alertLogo = alertLogo;

    user: Users | null = null;

    @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
    
    form = new FormGroup({
      name: new FormControl('', [Validators.required]),
      logo: new FormControl('', [Validators.required]),
    });

    ngOnInit(): void {
      const user = localStorage.getItem('user');
      if (!user) {
        this.router.navigate(['/']);
        return;
      }
  
      this.user! = JSON.parse(user!);
    }


    onSubmit(): void {

      this.alertMessage = false;
      
      const file = this.fileInput.nativeElement.files?.[0];

      if (!file) {
        this.alertMessage = true;
        this.alertText = 'Seleziona un logo prima di inviare.';
        return;
      }

      const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        this.alertMessage = true;
        this.alertText = 'Formato file non supportato.';
        return;
      }

      const reader = new FileReader();
        reader.onload = () => {
          const logoBase64 = reader.result as string;

          const formValues = this.form.value;

          const dataToSend: UserLogos = {
            name: formValues.name!,
            logo: logoBase64,
            userId: this.user!.id!,
            parentUserId: this.user!.parentId!
          };


          this.userLogosService.setUserLogos(dataToSend)
            .subscribe((data: UserLogos) => {
            if (!data) {
              console.log('Nessun dato disponibile');
            } 
            this.router.navigate(['/personalizzazioneCover']);
          });
          
      };

      reader.readAsDataURL(file);
    }
}

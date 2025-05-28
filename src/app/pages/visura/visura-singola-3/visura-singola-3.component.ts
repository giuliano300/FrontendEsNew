import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { FncUtils } from '../../../fncUtils/fncUtils';
import { secretKey } from '../../../../main';
import { FormStorageService } from '../../../services/form-storage.service';
import { Users } from '../../../interfaces/Users';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-visura-singola-3',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './visura-singola-3.component.html',
  styleUrl: './visura-singola-3.component.scss'
})
export class VisuraSingola3Component {

    constructor(private router: Router, private formStorage: FormStorageService) {}
    alertMessage = false;
    alertText = '';

  user: Users | null = null;

  form = new FormGroup({
    piva: new FormControl('', [Validators.required]),
    nominativo: new FormControl('', [Validators.required]),
    cciaa: new FormControl('', [Validators.required]),
    numero_rea: new FormControl('', [Validators.required]),
  });

  ngOnInit(): void {
    const navigationState = history.state;
    const tipoDestinatario = navigationState.tipoDestinatario;

    const user = localStorage.getItem('user');
    if (!user) {
      this.router.navigate(['/']);
      return;
    }

    this.user! = JSON.parse(user!);
  }

  onSubmit(): void {
    if (this.form.valid) {

      const destinatario = {
        businessName: this.form.value.nominativo!,
        vat: this.form.value.piva,
        cciaa: this.form.value.cciaa,
        reaNumber: this.form.value.numero_rea,
        address: "-",
        zipCode: "0000",
        city: "-",
        province: "-",
        state: "-",
        email: "-",
        fileName: null,
        tempGuid: FncUtils.generateGuid(),
        userId: this.user!.id!,
        userParentId: this.user!.parentId!,
      };
  
      const destinatari = [];
      destinatari.push(destinatario);
    
      const encrypted = CryptoJS.AES.encrypt(JSON.stringify(destinatari), secretKey).toString();
      this.formStorage.saveForm('destinatari', encrypted);

      let Inviitotali = {
        numeroInvii: 1,
        numeroPagineTotali: 0
      };

      const encryptedInvii = CryptoJS.AES.encrypt(JSON.stringify(Inviitotali), secretKey).toString();
      this.formStorage.saveForm("invii-totali", encryptedInvii);
      
        
      this.router.navigate(['/calcoloPreventivo']);
    } 
    else 
    {
      this.alertMessage = true;
      this.alertText = 'Compila tutti i campi obbligatori correttamente.';
    }
  }



}

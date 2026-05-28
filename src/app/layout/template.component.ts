import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { Users } from '../interfaces/Users';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmailService } from '../services/email.service';
import { expiredDate, loginIV, loginSecretKey, loginUrl } from '../../main';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-template',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, ReactiveFormsModule],
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.scss']
})
export class TemplateComponent {

  form!: FormGroup;

  constructor(
    private router: Router, 
    private modalService: NgbModal,
    private fb: FormBuilder,
    private emailService: EmailService
    ) {
    this.form = this.fb.group({
      sel_assistenza: ['', [Validators.required]],
      name: ['', [Validators.required, Validators.maxLength(44)]],
      telephone: ['', [Validators.required]],
      message: ['', [Validators.required]]
    });
  }


  screenTooSmall = false;
  user: Users | null  = null;
  userName: string | null = null;
  currentModalRef: any;

  date: string = expiredDate;

  isOldUser: boolean = false;
  
  logout(){
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');

    //ELIMINAZIONE DEI VALORI RELATIVI 
    //ALLE SELEZIONI DEI PRODOTTI 
    localStorage.removeItem('productType');    
    localStorage.removeItem('sendType');    
    localStorage.removeItem('bulletin');    
    localStorage.removeItem('userTourPage');    

    this.router.navigate(['/']);
  }

  ngOnInit() {
    const user = localStorage.getItem('user');
      if (!user) {
        this.router.navigate(['/']);
        return;
      }
  
    this.user! = JSON.parse(user!);    
    this.userName = this.user!.businessName;
    if(this.user!.pwdOldSite && this.user!.guidUserOldSite)
      this.isOldUser = true;

    // Controllo risoluzione iniziale
    this.checkScreenSize();

    // Listener per resize
    window.addEventListener('resize', this.checkScreenSize.bind(this));
  }

  openOldSite(): void {

    const key = CryptoJS.enc.Utf8.parse(
      loginSecretKey
    );

    const iv = CryptoJS.enc.Utf8.parse(
      loginIV
    );

    const payload = {
      guid: this.user?.guidUserOldSite,
      pwd: this.user?.pwdOldSite,
      ts: new Date().getTime()
    };

    const encrypted = CryptoJS.AES.encrypt(
      JSON.stringify(payload),
      key,
      {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      }
    );

    const token = encrypted.ciphertext.toString(
      CryptoJS.enc.Base64
    );

    const url =
      `${loginUrl}Accesso?t=${encodeURIComponent(token)}`;

    const newWindow = window.open(url, '_blank');

    if (newWindow) {
      window.open('', '_self');
      window.close();
    }
  }
  onSubmit(){
    if(this.form.valid){
      const dataToSend = this.form.value;
      this.emailService.setAssistenceRequest(dataToSend)
        .subscribe((data: boolean) => {
        if (!data) {
          console.log('Nessun dato disponibile');
        } 
        if (this.currentModalRef) {
          this.currentModalRef.close();
        }
        this.form.reset();
      });    
    }
  }

  checkScreenSize() {
    this.screenTooSmall = window.innerWidth < 1200;
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


    // Metodo per aprire il modal e salvare il riferimento
    openModal(content: any) {
      const modalRef = this.modalService.open(content, { centered: true, backdrop: 'static', keyboard: true });
      this.currentModalRef = modalRef;

      // Gestione della chiusura "manuale" o tramite esc/click esterno
      modalRef.result.catch(() => {}); // evita errori non gestiti
    }

    // Metodo per navigare e chiudere il modal
    navigateAndClose(route: string) {
      if (this.currentModalRef) {
        this.currentModalRef.close();
      }
      this.router.navigate([route]);
    }

}

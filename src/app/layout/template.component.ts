import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { Users } from '../interfaces/Users';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmailService } from '../services/email.service';
import { expiredDate, loginIV, loginSecretKey, loginUrl } from '@app/config/app-constants';
import { CryptoJS } from '@app/utils/crypto';
import { filter, Subscription } from 'rxjs';
import { NavigationItem, NavigationSearchItem } from '@app/navigation/navigation.model';
import { NavigationService } from '../navigation/navigation.service';
import { AppStorageService } from '../services/app-storage.service';

@Component({
  selector: 'app-template',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, ReactiveFormsModule],
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.scss']
})
export class TemplateComponent implements OnInit, OnDestroy {

  form!: FormGroup;

  constructor(
    private router: Router, 
    private modalService: NgbModal,
    private fb: FormBuilder,
    private emailService: EmailService,
    private navigationService: NavigationService,
    private storage: AppStorageService
    ) {
    this.form = this.fb.group({
      sel_assistenza: ['', [Validators.required]],
      name: ['', [Validators.required, Validators.maxLength(44)]],
      telephone: ['', [Validators.required]],
      message: ['', [Validators.required]]
    });
    this.mainNavigation = this.navigationService.mainNavigation;
    this.userNavigation = this.navigationService.userNavigation;
  }


  screenTooSmall = false;
  user: Users | null  = null;
  userName: string | null = null;
  currentModalRef: any;

  date: string = expiredDate;

  isOldUser: boolean = false;
  isMenuOpen = false;
  navSearch = '';
  searchResults: NavigationSearchItem[] = [];
  mainNavigation: NavigationItem[] = [];
  userNavigation: NavigationItem[] = [];

  private routerSubscription?: Subscription;
  private readonly resizeHandler = () => this.checkScreenSize();
  
  logout(){
    this.storage.clearAuthSession();
    this.router.navigate(['/']);
  }

  ngOnInit(): void {
    this.user = this.storage.getUser();
      if (!this.user) {
        this.router.navigate(['/']);
        return;
      }
  
    this.userName = this.user!.businessName;
    if(this.user!.passwordOldSite && this.user!.usernameOldSite)
      this.isOldUser = true;

    // Controllo risoluzione iniziale
    this.checkScreenSize();

    // Listener per resize
    window.addEventListener('resize', this.resizeHandler);

    this.routerSubscription = this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(() => {
        this.clearNavigationSearch();
        this.CloseMenu()
      });
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.resizeHandler);
    this.routerSubscription?.unsubscribe();
  }

  openOldSite(): void {

    const key = CryptoJS.enc.Utf8.parse(
      loginSecretKey
    );

    const iv = CryptoJS.enc.Utf8.parse(
      loginIV
    );

    const payload = {
      email: this.user?.usernameOldSite,
      pwd: this.user?.passwordOldSite,
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

    const token = encrypted.ciphertext!.toString(
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
    this.isMenuOpen = true;
  }

  CloseMenu(){
    this.isMenuOpen = false;
  }

  isActive(item: NavigationItem): boolean {
    return this.navigationService.isActive(item, this.router.url);
  }

  onNavigationSearch(event: Event): void {
    this.navSearch = (event.target as HTMLInputElement).value;
    this.searchResults = this.navigationService.search(this.navSearch);
  }

  clearNavigationSearch(): void {
    this.navSearch = '';
    this.searchResults = [];
  }

  trackByLabel(_: number, item: { label: string }): string {
    return item.label;
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

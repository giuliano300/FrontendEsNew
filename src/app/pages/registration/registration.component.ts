import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UsersService } from '../../services/users.service';
import { Responses } from '../../interfaces/Responses';
import { OpenApiVatReponses } from '../../interfaces/OpenApiResponse/OpenApiVatReponses';
import { Data } from '../../interfaces/OpenApiResponse/Data';

import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { italianVatValidator } from '../../fncUtils/italian-vat.validator';
import { FncUtils } from '../../fncUtils/fncUtils';
import { Users } from '../../interfaces/Users';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-registration',
  imports: [CommonModule, ReactiveFormsModule, RouterLink, NgbModalModule],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss'
})
export class RegistrationComponent {
  constructor(private userService: UsersService, private router: Router, private modalService: NgbModal) {}
 
  @ViewChild('content') content: TemplateRef<any> | undefined;

  errorMessage: string | null = null;
  errorMessageExistVatNumber: string | null = null;
  checkVatNumberValid: string | null = null;
  openApiResponsesData: Data[] = [];
  password = '';
  usrPoste: string | null = '';
  pwdPoste: string | null = '';
  showStrength = true;
  FncUtils = FncUtils;

  businessName: string | null = null;
  address: string | null = null;
  zipCode: string | null = null;
  city: string | null = null;
  pec: string | null = null;

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
    vatNumber: new FormControl('', [Validators.required, italianVatValidator]),
    usernamePoste: new FormControl('', Validators.required),
    passwordPoste: new FormControl('', Validators.required)
  });

  vatNumber: string | undefined;
  checkingVat: boolean = false;
  ctrlVat: boolean = false;
  ctrlPosteaccesses: boolean = false;
  accessNotValid: boolean = false;
  accessValid: boolean = false;

  ngOnInit(): void {
    const token = localStorage.getItem('authToken');
    if (token) 
      this.router.navigate(['/dashboard']);
  }

  onSubmit() {
    if (this.form.valid) 
    {      
      const user: Users = 
      {
        businessName: this.openApiResponsesData[0].companyName,
        address: this.openApiResponsesData[0].address.registeredOffice.streetName,
        city: this.openApiResponsesData[0].address.registeredOffice.town,
        zipCode: this.openApiResponsesData[0].address.registeredOffice.zipCode,
        pec: this.openApiResponsesData[0].pec,
        vatNumber : this.form.value.vatNumber!,
        email: this.form.value.email!,
        password: this.form.value.password!,
        usernamePoste: this.usrPoste!,
        passwordPoste: this.pwdPoste!,
        parentId: 0,
        guid: uuidv4(),
        enabled: true,
        deleted: false
      };

      this.userService.setUser(user)
        .subscribe((data:Users) => {
          if(data == null)
            this.errorMessage = "Errore nel salvataggio dei dati.";
          else
          {
            localStorage.setItem('userId', data?.id!.toString());
            this.router.navigate(['/registrationFinalStep']);
          }
        })
    }
    else
    {
      this.errorMessage = "Errore nel salvataggio dei dati.";
    }
  }

  checkVatNumber(){
    const vatCtrl = this.form.get('vatNumber');
    
    if (!vatCtrl || vatCtrl.invalid) {
      vatCtrl!.markAsTouched(); 
      return;
    }

    this.vatNumber = vatCtrl.value!;
    if (this.vatNumber === "") return;

    this.ctrlVat = true;
    this.checkVatNumberValid = null;
    this.errorMessage = null;
    this.errorMessageExistVatNumber = null;
    this.userService.existUser(this.vatNumber)
      .subscribe((data: Responses) => {
        this.checkingVat = false;
        if(!data.valid){
          //SE NON E' GIA' REGISTRATO
          this.userService.checkVat(this.vatNumber!)
          .subscribe((data: OpenApiVatReponses) => {
            this.ctrlVat = false;
            if(data.success){
              this.checkVatNumberValid = "Partita iva correttamente inserita.";
              this.openApiResponsesData = data.data;
              this.checkingVat = true;
              this.businessName = this.openApiResponsesData[0].companyName;
              this.address = this.openApiResponsesData[0].address.registeredOffice.streetName;
              this.zipCode = this.openApiResponsesData[0].address.registeredOffice.zipCode;
              this.city = this.openApiResponsesData[0].address.registeredOffice.town;
              this.pec = this.openApiResponsesData[0].pec;
              this.openPopUp();
            }      
            else
            {
              this.ctrlVat = false;
              this.errorMessageExistVatNumber = data.message;
            }  
          });
        }      
        else
        {
          this.ctrlVat = false;
          this.errorMessageExistVatNumber = "Partita iva già presente nei nostri archivi.";
        }  
      });
  }

  checkPosteAccesses(){
    this.accessNotValid = false;
    this.accessValid = false;
    const usernamePoste = this.form.get('usernamePoste');
    const passwordPoste = this.form.get('passwordPoste');

    if (!usernamePoste || usernamePoste.invalid) {
      usernamePoste!.markAsTouched(); 
      return;
    }

    if (!passwordPoste || passwordPoste.invalid) {
      passwordPoste!.markAsTouched(); 
      return;
    }

    this.ctrlPosteaccesses = true;

    this.userService.checkPosteAccess(usernamePoste!.value!, passwordPoste!.value!)
      .subscribe((data: boolean) => {
        this.ctrlPosteaccesses = false;
        if(!data){
          this.accessNotValid = true;
        }
        else
        {
          this.accessValid = true;
          this.usrPoste = usernamePoste!.value!;
          this.pwdPoste = passwordPoste!.value!;
          usernamePoste.disable();
          passwordPoste.disable();
        }
    })
  }

  openPopUp() {
    if (this.content) {
      this.modalService.open(this.content);
    }
  }

  closeModal(modalRef: any) {
    this.form.get('vatNumber')?.reset();
    this.checkVatNumberValid = null;
    this.checkingVat = false;
    modalRef.close();  
  }

  allowOnlyNumbers(event: KeyboardEvent) {
    const charCode = event.key.charCodeAt(0);
    // Blocca tutto ciò che non è tra 0 e 9
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }


  getPasswordClass(): string {
    const strength = FncUtils.checkPasswordStrength(this.password);
    return `pwd pwd-${strength}`;
  }
  
  get passwordStrength(): 'debole' | 'media' | 'forte' {
    return FncUtils.checkPasswordStrength(this.password);
  }
}

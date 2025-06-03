import { Routes } from '@angular/router';
import { LoginComponent } from './pages/Login/login.component';
import { TemplateComponent } from './layout/template.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { AuthGuard } from './guards/auth.guard';
import { PasswordRecoveryComponent } from './pages/passwordRecovery/password-recovery.component';
import { PasswordChangeComponent } from './pages/passwordChange/password-change.component';
import { RegistrationComponent } from './pages/registration/registration.component';
import { RegistrationFinalStepComponent } from './pages/registrationFinalStep/registrationFinalStep.component';
import { RegistrationEndComponent } from './pages/registrationEnd/registrationEnd.component';
import { NuovaSpedizioneComponent } from './pages/nuova-spedizione/nuova-spedizione.component';
import { TipoSpedizioneRaccomandataComponent } from './pages/raccomandata/tipo-spedizione/tipo-spedizione.component';
import { InvioSingoloRaccomandataComponent } from './pages/raccomandata/invio-singolo-raccomandata/invio-singolo-raccomandata.component';
import { InvioMultiploRaccomandataComponent } from './pages/raccomandata/invio-multiplo-raccomandata/invio-multiplo-raccomandata.component';
import { InvioSingoloRaccomandata2Component } from './pages/raccomandata/invio-singolo-raccomandata-2/invio-singolo-raccomandata-2.component';
import { InvioSingoloRaccomandata3Component } from './pages/raccomandata/invio-singolo-raccomandata-3/invio-singolo-raccomandata-3.component';
import { InvioSingoloRaccomandata4Component } from './pages/raccomandata/invio-singolo-raccomandata-4/invio-singolo-raccomandata-4.component';
import { InvioSingoloRaccomandata5Component } from './pages/raccomandata/invio-singolo-raccomandata-5/invio-singolo-raccomandata-5.component';
import { CompilaBollettinoComponent } from './pages/compila-bollettino/compila-bollettino.component';
import { CalcoloPreventivoComponent } from './pages/calcolo-preventivo/calcolo-preventivo.component';
import { RiepilogoSpedizioneComponent } from './pages/riepilogo-spedizione/riepilogo-spedizione.component';
import { InvioMultiploRaccomandata2Component } from './pages/raccomandata/invio-multiplo-raccomandata-2/invio-multiplo-raccomandata-2.component';
import { InvioMultiploRaccomandata3Component } from './pages/raccomandata/invio-multiplo-raccomandata-3/invio-multiplo-raccomandata-3.component';
import { InvioMultiploRaccomandata4Component } from './pages/raccomandata/invio-multiplo-raccomandata-4/invio-multiplo-raccomandata-4.component';
import { InvioSingoloLetteraComponent } from './pages/lettera/invio-singolo-lettera/invio-singolo-lettera.component';
import { InvioMultiploLetteraComponent } from './pages/lettera/invio-multiplo-lettera/invio-multiplo-lettera.component';
import { TipoSpedizioneLetteraComponent } from './pages/lettera/tipo-spedizione-lettera/tipo-spedizione-lettera.component';
import { InvioSingoloLettera2Component } from './pages/lettera/invio-singolo-lettera-2/invio-singolo-lettera-2.component';
import { InvioSingoloLettera3Component } from './pages/lettera/invio-singolo-lettera-3/invio-singolo-lettera-3.component';
import { InvioSingoloLettera4Component } from './pages/lettera/invio-singolo-lettera-4/invio-singolo-lettera-4.component';
import { InvioSingoloLettera5Component } from './pages/lettera/invio-singolo-lettera-5/invio-singolo-lettera-5.component';
import { InvioMultiploLettera2Component } from './pages/lettera/invio-multiplo-lettera-2/invio-multiplo-lettera-2.component';
import { InvioMultiploLettera3Component } from './pages/lettera/invio-multiplo-lettera-3/invio-multiplo-lettera-3.component';
import { InvioMultiploLettera4Component } from './pages/lettera/invio-multiplo-lettera-4/invio-multiplo-lettera-4.component';
import { TipoSpedizioneAgolComponent } from './pages/agol/tipo-spedizione-agol/tipo-spedizione-agol.component';
import { InvioSingoloAgolComponent } from './pages/agol/invio-singolo-agol/invio-singolo-agol.component';
import { InvioSingoloAgol2Component } from './pages/agol/invio-singolo-agol-2/invio-singolo-agol-2.component';
import { InvioSingoloAgol3Component } from './pages/agol/invio-singolo-agol-3/invio-singolo-agol-3.component';
import { InvioSingoloAgol4Component } from './pages/agol/invio-singolo-agol-4/invio-singolo-agol-4.component';
import { InvioSingoloAgol5Component } from './pages/agol/invio-singolo-agol-5/invio-singolo-agol-5.component';
import { InvioMultiploAgolComponent } from './pages/agol/invio-multiplo-agol/invio-multiplo-agol.component';
import { InvioMultiploAgol2Component } from './pages/agol/invio-multiplo-agol-2/invio-multiplo-agol-2.component';
import { InvioMultiploAgol3Component } from './pages/agol/invio-multiplo-agol-3/invio-multiplo-agol-3.component';
import { InvioMultiploAgol4Component } from './pages/agol/invio-multiplo-agol-4/invio-multiplo-agol-4.component';
import { InvioTelegrammaComponent } from './pages/telegramma/invio-telegramma/invio-telegramma.component';
import { InvioTelegramma2Component } from './pages/telegramma/invio-telegramma-2/invio-telegramma-2.component';
import { InvioTelegramma3Component } from './pages/telegramma/invio-telegramma-3/invio-telegramma-3.component';
import { InvioTelegramma4Component } from './pages/telegramma/invio-telegramma-4/invio-telegramma-4.component';
import { TipoVisuraComponent } from './pages/visura/tipo-visura/tipo-visura.component';
import { VisuraSingolaComponent } from './pages/visura/visura-singola/visura-singola.component';
import { VisuraSingola2Component } from './pages/visura/visura-singola-2/visura-singola-2.component';
import { VisuraSingola3Component } from './pages/visura/visura-singola-3/visura-singola-3.component';
import { InvioPaccoComponent } from './pages/pacchi/invio-pacco/invio-pacco.component';
import { InvioPacco2Component } from './pages/pacchi/invio-pacco-2/invio-pacco-2.component';
import { AddSenderComponent } from './pages/personal-area/add-sender/add-sender.component';
import { Errore500Component } from './pages/errore500/errore500.component';
import { ReportSpedizioniComponent } from './pages/report/report-spedizioni/report-spedizioni.component';
import { ReportSpedizioniBollettiniComponent } from './pages/report/report-spedizioni-bollettini/report-spedizioni-bollettini.component';
import { DatiPersonaliComponent } from './pages/personal-area/dati-personali/dati-personali.component';
import { ErroriNotificatiComponent } from './pages/personal-area/errori-notificati/errori-notificati.component';
import { PersonalizzazioneCoverComponent } from './pages/personal-area/personalizzazione-cover/personalizzazione-cover.component';
import { RubricaDestinatariComponent } from './pages/personal-area/rubrica-destinatari/rubrica-destinatari.component';
import { UtentiComponent } from './pages/personal-area/utenti/utenti.component';
import { ArchivioSpedizioniComponent } from './pages/archivio/archivio-spedizioni/archivio-spedizioni.component';
import { ArchivioVisureComponent } from './pages/archivio/archivio-visure/archivio-visure.component';
import { AddReceiverComponent } from './pages/personal-area/add-receiver/add-receiver.component';
import { StatoInviiComponent } from './pages/stato-invii/stato-invii/stato-invii.component';
import { DettaglioSpedizioneComponent } from './pages/archivio/dettaglio-spedizione/dettaglio-spedizione.component';
import { AddLogoComponent } from './pages/personal-area/add-logo/add-logo.component';
import { AddUserComponent } from './pages/personal-area/add-user/add-user.component';
import { UserSendersComponent } from './pages/personal-area/userSenders/user-senders.component';

export const routes: Routes = [
  {
    path: '',
    component: LoginComponent
  },
  {
    path: 'passwordRecovery',
    component: PasswordRecoveryComponent
  },
  {
    path: 'passwordChange',
    component: PasswordChangeComponent
  },
  {
    path: 'registration',
    component: RegistrationComponent
  },
  {
    path: 'registrationFinalStep',
    component: RegistrationFinalStepComponent
  },
  {
    path: 'registrationEnd',
    component: RegistrationEndComponent
  },
  {
    path: '',
    component: TemplateComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'nuovaSpedizione',
        component: NuovaSpedizioneComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'userSenders',
        component: UserSendersComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'tipoSpedizioneRaccomandata',
        component: TipoSpedizioneRaccomandataComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'invioSingoloRaccomandata',
        component: InvioSingoloRaccomandataComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'invioMultiploRaccomandata',
        component: InvioMultiploRaccomandataComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'invioSingoloRaccomandata2',
        component: InvioSingoloRaccomandata2Component,
        canActivate: [AuthGuard]
      },
      {
        path: 'invioSingoloRaccomandata3',
        component: InvioSingoloRaccomandata3Component,
        canActivate: [AuthGuard]
      },
      {
        path: 'invioSingoloRaccomandata4',
        component: InvioSingoloRaccomandata4Component,
        canActivate: [AuthGuard]
      },
      {
        path: 'invioSingoloRaccomandata5',
        component: InvioSingoloRaccomandata5Component,
        canActivate: [AuthGuard]
      },
      {
        path: 'compilaBollettino',
        component: CompilaBollettinoComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'calcoloPreventivo',
        component: CalcoloPreventivoComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'riepilogoSpedizione',
        component: RiepilogoSpedizioneComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'invioMultiploRaccomandata2',
        component: InvioMultiploRaccomandata2Component,
        canActivate: [AuthGuard]
      },
      {
        path: 'invioMultiploRaccomandata3',
        component: InvioMultiploRaccomandata3Component,
        canActivate: [AuthGuard]
      },
      {
        path: 'invioMultiploRaccomandata4',
        component: InvioMultiploRaccomandata4Component,
        canActivate: [AuthGuard]
      },
      {
        path: 'tipoSpedizioneLettera',
        component: TipoSpedizioneLetteraComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'invioSingoloLettera',
        component: InvioSingoloLetteraComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'invioSingoloLettera2',
        component: InvioSingoloLettera2Component,
        canActivate: [AuthGuard]
      },
      {
        path: 'invioSingoloLettera3',
        component: InvioSingoloLettera3Component,
        canActivate: [AuthGuard]
      },
      {
        path: 'invioSingoloLettera4',
        component: InvioSingoloLettera4Component,
        canActivate: [AuthGuard]
      },
      {
        path: 'invioSingoloLettera5',
        component: InvioSingoloLettera5Component,
        canActivate: [AuthGuard]
      },
      {
        path: 'invioMultiploLettera',
        component: InvioMultiploLetteraComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'invioMultiploLettera2',
        component: InvioMultiploLettera2Component,
        canActivate: [AuthGuard]
      },
      {
        path: 'invioMultiploLettera3',
        component: InvioMultiploLettera3Component,
        canActivate: [AuthGuard]
      },
      {
        path: 'invioMultiploLettera4',
        component: InvioMultiploLettera4Component,
        canActivate: [AuthGuard]
      },
      {
        path: 'tipoSpedizioneAgol',
        component: TipoSpedizioneAgolComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'invioSingoloAgol',
        component: InvioSingoloAgolComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'invioSingoloAgol2',
        component: InvioSingoloAgol2Component,
        canActivate: [AuthGuard]
      },
      {
        path: 'invioSingoloAgol3',
        component: InvioSingoloAgol3Component,
        canActivate: [AuthGuard]
      },
      {
        path: 'invioSingoloAgol4',
        component: InvioSingoloAgol4Component,
        canActivate: [AuthGuard]
      },
      {
        path: 'invioSingoloAgol5',
        component: InvioSingoloAgol5Component,
        canActivate: [AuthGuard]
      },
      {
        path: 'invioMultiploAgol',
        component: InvioMultiploAgolComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'invioMultiploAgol2',
        component: InvioMultiploAgol2Component,
        canActivate: [AuthGuard]
      },
      {
        path: 'invioMultiploAgol3',
        component: InvioMultiploAgol3Component,
        canActivate: [AuthGuard]
      },
      {
        path: 'invioMultiploAgol4',
        component: InvioMultiploAgol4Component,
        canActivate: [AuthGuard]
      },
      {
        path: 'invioTelegramma',
        component: InvioTelegrammaComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'invioTelegramma2',
        component: InvioTelegramma2Component,
        canActivate: [AuthGuard]
      },
      {
        path: 'invioTelegramma3',
        component: InvioTelegramma3Component,
        canActivate: [AuthGuard]
      },
      {
        path: 'invioTelegramma4',
        component: InvioTelegramma4Component,
        canActivate: [AuthGuard]
      },
      {
        path: 'tipoVisura',
        component: TipoVisuraComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'visuraSingola',
        component: VisuraSingolaComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'visuraSingola2',
        component: VisuraSingola2Component,
        canActivate: [AuthGuard]
      },
      {
        path: 'visuraSingola3',
        component: VisuraSingola3Component,
        canActivate: [AuthGuard]
      },
      {
        path: 'invioPacco',
        component: InvioPaccoComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'invioPacco2',
        component: InvioPacco2Component,
        canActivate: [AuthGuard]
      },
      {
        path: 'addSender',
        component: AddSenderComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'statoInvii/:id',
        component: StatoInviiComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'errore500',
        component: Errore500Component,
      },
      {
        path: 'reportSpedizioni',
        component: ReportSpedizioniComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'reportSpedizioniBollettini',
        component: ReportSpedizioniBollettiniComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'datiPersonali',
        component: DatiPersonaliComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'erroriNotificati',
        component: ErroriNotificatiComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'personalizzazioneCover',
        component: PersonalizzazioneCoverComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'rubricaDestinatari',
        component: RubricaDestinatariComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'utentiList',
        component: UtentiComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'archivioSpedizioni',
        component: ArchivioSpedizioniComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'archivioVisure',
        component: ArchivioVisureComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'addReceiver',
        component: AddReceiverComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'dettaglioSpedizione/:id',
        component: DettaglioSpedizioneComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'addLogo',
        component: AddLogoComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'addUser',
        component: AddUserComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'modUser/:id',
        component: AddUserComponent,
        canActivate: [AuthGuard]
      },
      {
        path: '**',
        component: NotFoundComponent
      }
    ]
  }
];

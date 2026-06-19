import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/Login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'two-factor',
    loadComponent: () => import('./pages/two-factor/two-factor.component').then(m => m.TwoFactorComponent)
  },
  {
    path: 'passwordRecovery',
    loadComponent: () => import('./pages/passwordRecovery/password-recovery.component').then(m => m.PasswordRecoveryComponent)
  },
  {
    path: 'passwordChange',
    loadComponent: () => import('./pages/passwordChange/password-change.component').then(m => m.PasswordChangeComponent)
  },
  {
    path: 'registration',
    loadComponent: () => import('./pages/registration/registration.component').then(m => m.RegistrationComponent)
  },
  {
    path: 'registrationFinalStep',
    loadComponent: () => import('./pages/registrationFinalStep/registrationFinalStep.component').then(m => m.RegistrationFinalStepComponent)
  },
  {
    path: 'registrationEnd',
    loadComponent: () => import('./pages/registrationEnd/registrationEnd.component').then(m => m.RegistrationEndComponent)
  },
  {
    path: '',
    loadComponent: () => import('./layout/template.component').then(m => m.TemplateComponent),
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
        canActivate: [AuthGuard]
      },
      {
        path: 'nuovaSpedizione',
        loadComponent: () => import('./pages/nuova-spedizione/nuova-spedizione.component').then(m => m.NuovaSpedizioneComponent),
        canActivate: [AuthGuard]
      },
      {
        path: 'userSenders',
        loadComponent: () => import('./pages/personal-area/userSenders/user-senders.component').then(m => m.UserSendersComponent),
        canActivate: [AuthGuard]
      },
      {
        path: 'modSender/:id',
        loadComponent: () => import('./pages/personal-area/add-sender/add-sender.component').then(m => m.AddSenderComponent),
        canActivate: [AuthGuard]
      },
      {
        path: 'tipoSpedizioneRaccomandata',
        loadComponent: () => import('./pages/raccomandata/tipo-spedizione/tipo-spedizione.component').then(m => m.TipoSpedizioneRaccomandataComponent),
        canActivate: [AuthGuard]
      },
      {
        path: 'invioSingoloRaccomandata',
        loadComponent: () => import('./pages/raccomandata/invio-singolo-raccomandata/invio-singolo-raccomandata.component').then(m => m.InvioSingoloRaccomandataComponent),
        canActivate: [AuthGuard]
      },
      {
        path: 'invioMultiploRaccomandata',
        loadComponent: () => import('./pages/raccomandata/invio-multiplo-raccomandata/invio-multiplo-raccomandata.component').then(m => m.InvioMultiploRaccomandataComponent),
        canActivate: [AuthGuard]
      },
      {
        path: 'invioSingoloRaccomandata2',
        loadComponent: () => import('./pages/raccomandata/invio-singolo-raccomandata-2/invio-singolo-raccomandata-2.component').then(m => m.InvioSingoloRaccomandata2Component),
        canActivate: [AuthGuard]
      },
      {
        path: 'invioSingoloRaccomandata3',
        loadComponent: () => import('./pages/raccomandata/invio-singolo-raccomandata-3/invio-singolo-raccomandata-3.component').then(m => m.InvioSingoloRaccomandata3Component),
        canActivate: [AuthGuard]
      },
      {
        path: 'invioSingoloRaccomandata4',
        loadComponent: () => import('./pages/raccomandata/invio-singolo-raccomandata-4/invio-singolo-raccomandata-4.component').then(m => m.InvioSingoloRaccomandata4Component),
        canActivate: [AuthGuard]
      },
      {
        path: 'invioSingoloRaccomandata5',
        loadComponent: () => import('./pages/raccomandata/invio-singolo-raccomandata-5/invio-singolo-raccomandata-5.component').then(m => m.InvioSingoloRaccomandata5Component),
        canActivate: [AuthGuard]
      },
      {
        path: 'compilaBollettino',
        loadComponent: () => import('./pages/compila-bollettino/compila-bollettino.component').then(m => m.CompilaBollettinoComponent),
        canActivate: [AuthGuard]
      },
      {
        path: 'calcoloPreventivo',
        loadComponent: () => import('./pages/calcolo-preventivo/calcolo-preventivo.component').then(m => m.CalcoloPreventivoComponent),
        canActivate: [AuthGuard]
      },
      {
        path: 'riepilogoSpedizione',
        loadComponent: () => import('./pages/riepilogo-spedizione/riepilogo-spedizione.component').then(m => m.RiepilogoSpedizioneComponent),
        canActivate: [AuthGuard]
      },
      {
        path: 'invioMultiploRaccomandata2',
        loadComponent: () => import('./pages/raccomandata/invio-multiplo-raccomandata-2/invio-multiplo-raccomandata-2.component').then(m => m.InvioMultiploRaccomandata2Component),
        canActivate: [AuthGuard]
      },
      {
        path: 'invioMultiploRaccomandata3',
        loadComponent: () => import('./pages/raccomandata/invio-multiplo-raccomandata-3/invio-multiplo-raccomandata-3.component').then(m => m.InvioMultiploRaccomandata3Component),
        canActivate: [AuthGuard]
      },
      {
        path: 'invioMultiploRaccomandata4',
        loadComponent: () => import('./pages/raccomandata/invio-multiplo-raccomandata-4/invio-multiplo-raccomandata-4.component').then(m => m.InvioMultiploRaccomandata4Component),
        canActivate: [AuthGuard]
      },
      {
        path: 'tipoSpedizioneLettera',
        loadComponent: () => import('./pages/lettera/tipo-spedizione-lettera/tipo-spedizione-lettera.component').then(m => m.TipoSpedizioneLetteraComponent),
        canActivate: [AuthGuard]
      },
      {
        path: 'invioSingoloLettera',
        loadComponent: () => import('./pages/lettera/invio-singolo-lettera/invio-singolo-lettera.component').then(m => m.InvioSingoloLetteraComponent),
        canActivate: [AuthGuard]
      },
      {
        path: 'invioSingoloLettera2',
        loadComponent: () => import('./pages/lettera/invio-singolo-lettera-2/invio-singolo-lettera-2.component').then(m => m.InvioSingoloLettera2Component),
        canActivate: [AuthGuard]
      },
      {
        path: 'invioSingoloLettera3',
        loadComponent: () => import('./pages/lettera/invio-singolo-lettera-3/invio-singolo-lettera-3.component').then(m => m.InvioSingoloLettera3Component),
        canActivate: [AuthGuard]
      },
      {
        path: 'invioSingoloLettera4',
        loadComponent: () => import('./pages/lettera/invio-singolo-lettera-4/invio-singolo-lettera-4.component').then(m => m.InvioSingoloLettera4Component),
        canActivate: [AuthGuard]
      },
      {
        path: 'invioSingoloLettera5',
        loadComponent: () => import('./pages/lettera/invio-singolo-lettera-5/invio-singolo-lettera-5.component').then(m => m.InvioSingoloLettera5Component),
        canActivate: [AuthGuard]
      },
      {
        path: 'invioMultiploLettera',
        loadComponent: () => import('./pages/lettera/invio-multiplo-lettera/invio-multiplo-lettera.component').then(m => m.InvioMultiploLetteraComponent),
        canActivate: [AuthGuard]
      },
      {
        path: 'invioMultiploLettera2',
        loadComponent: () => import('./pages/lettera/invio-multiplo-lettera-2/invio-multiplo-lettera-2.component').then(m => m.InvioMultiploLettera2Component),
        canActivate: [AuthGuard]
      },
      {
        path: 'invioMultiploLettera3',
        loadComponent: () => import('./pages/lettera/invio-multiplo-lettera-3/invio-multiplo-lettera-3.component').then(m => m.InvioMultiploLettera3Component),
        canActivate: [AuthGuard]
      },
      {
        path: 'invioMultiploLettera4',
        loadComponent: () => import('./pages/lettera/invio-multiplo-lettera-4/invio-multiplo-lettera-4.component').then(m => m.InvioMultiploLettera4Component),
        canActivate: [AuthGuard]
      },
      {
        path: 'tipoSpedizioneAgol',
        loadComponent: () => import('./pages/agol/tipo-spedizione-agol/tipo-spedizione-agol.component').then(m => m.TipoSpedizioneAgolComponent),
        canActivate: [AuthGuard]
      },
      {
        path: 'invioSingoloAgol',
        loadComponent: () => import('./pages/agol/invio-singolo-agol/invio-singolo-agol.component').then(m => m.InvioSingoloAgolComponent),
        canActivate: [AuthGuard]
      },
      {
        path: 'invioSingoloAgol2',
        loadComponent: () => import('./pages/agol/invio-singolo-agol-2/invio-singolo-agol-2.component').then(m => m.InvioSingoloAgol2Component),
        canActivate: [AuthGuard]
      },
      {
        path: 'invioSingoloAgol3',
        loadComponent: () => import('./pages/agol/invio-singolo-agol-3/invio-singolo-agol-3.component').then(m => m.InvioSingoloAgol3Component),
        canActivate: [AuthGuard]
      },
      {
        path: 'invioSingoloAgol4',
        loadComponent: () => import('./pages/agol/invio-singolo-agol-4/invio-singolo-agol-4.component').then(m => m.InvioSingoloAgol4Component),
        canActivate: [AuthGuard]
      },
      {
        path: 'invioSingoloAgol5',
        loadComponent: () => import('./pages/agol/invio-singolo-agol-5/invio-singolo-agol-5.component').then(m => m.InvioSingoloAgol5Component),
        canActivate: [AuthGuard]
      },
      {
        path: 'invioMultiploAgol',
        loadComponent: () => import('./pages/agol/invio-multiplo-agol/invio-multiplo-agol.component').then(m => m.InvioMultiploAgolComponent),
        canActivate: [AuthGuard]
      },
      {
        path: 'invioMultiploAgol2',
        loadComponent: () => import('./pages/agol/invio-multiplo-agol-2/invio-multiplo-agol-2.component').then(m => m.InvioMultiploAgol2Component),
        canActivate: [AuthGuard]
      },
      {
        path: 'invioMultiploAgol3',
        loadComponent: () => import('./pages/agol/invio-multiplo-agol-3/invio-multiplo-agol-3.component').then(m => m.InvioMultiploAgol3Component),
        canActivate: [AuthGuard]
      },
      {
        path: 'invioMultiploAgol4',
        loadComponent: () => import('./pages/agol/invio-multiplo-agol-4/invio-multiplo-agol-4.component').then(m => m.InvioMultiploAgol4Component),
        canActivate: [AuthGuard]
      },
      {
        path: 'invioTelegramma',
        loadComponent: () => import('./pages/telegramma/invio-telegramma/invio-telegramma.component').then(m => m.InvioTelegrammaComponent),
        canActivate: [AuthGuard]
      },
      {
        path: 'invioTelegramma2',
        loadComponent: () => import('./pages/telegramma/invio-telegramma-2/invio-telegramma-2.component').then(m => m.InvioTelegramma2Component),
        canActivate: [AuthGuard]
      },
      {
        path: 'invioTelegramma3',
        loadComponent: () => import('./pages/telegramma/invio-telegramma-3/invio-telegramma-3.component').then(m => m.InvioTelegramma3Component),
        canActivate: [AuthGuard]
      },
      {
        path: 'invioTelegramma4',
        loadComponent: () => import('./pages/telegramma/invio-telegramma-4/invio-telegramma-4.component').then(m => m.InvioTelegramma4Component),
        canActivate: [AuthGuard]
      },
      {
        path: 'tipoVisura',
        loadComponent: () => import('./pages/visura/tipo-visura/tipo-visura.component').then(m => m.TipoVisuraComponent),
        canActivate: [AuthGuard]
      },
      {
        path: 'visuraSingola',
        loadComponent: () => import('./pages/visura/visura-singola/visura-singola.component').then(m => m.VisuraSingolaComponent),
        canActivate: [AuthGuard]
      },
      {
        path: 'visuraSingola2',
        loadComponent: () => import('./pages/visura/visura-singola-2/visura-singola-2.component').then(m => m.VisuraSingola2Component),
        canActivate: [AuthGuard]
      },
      {
        path: 'visuraSingola3',
        loadComponent: () => import('./pages/visura/visura-singola-3/visura-singola-3.component').then(m => m.VisuraSingola3Component),
        canActivate: [AuthGuard]
      },
      {
        path: 'invioPacco',
        loadComponent: () => import('./pages/pacchi/invio-pacco/invio-pacco.component').then(m => m.InvioPaccoComponent),
        canActivate: [AuthGuard]
      },
      {
        path: 'invioPacco2',
        loadComponent: () => import('./pages/pacchi/invio-pacco-2/invio-pacco-2.component').then(m => m.InvioPacco2Component),
        canActivate: [AuthGuard]
      },
      {
        path: 'addSender',
        loadComponent: () => import('./pages/personal-area/add-sender/add-sender.component').then(m => m.AddSenderComponent),
        canActivate: [AuthGuard]
      },
      {
        path: 'statoInvii/:id',
        loadComponent: () => import('./pages/stato-invii/stato-invii/stato-invii.component').then(m => m.StatoInviiComponent),
        canActivate: [AuthGuard]
      },
      {
        path: 'errore500',
        loadComponent: () => import('./pages/errore500/errore500.component').then(m => m.Errore500Component),
      },
      {
        path: 'reportSpedizioni',
        loadComponent: () => import('./pages/report/report-spedizioni/report-spedizioni.component').then(m => m.ReportSpedizioniComponent),
        canActivate: [AuthGuard]
      },
      {
        path: 'reportSpedizioniBollettini',
        loadComponent: () => import('./pages/report/report-spedizioni-bollettini/report-spedizioni-bollettini.component').then(m => m.ReportSpedizioniBollettiniComponent),
        canActivate: [AuthGuard]
      },
      {
        path: 'datiPersonali',
        loadComponent: () => import('./pages/personal-area/dati-personali/dati-personali.component').then(m => m.DatiPersonaliComponent),
        canActivate: [AuthGuard]
      },
      {
        path: 'erroriNotificati',
        loadComponent: () => import('./pages/personal-area/errori-notificati/errori-notificati.component').then(m => m.ErroriNotificatiComponent),
        canActivate: [AuthGuard]
      },
      {
        path: 'personalizzazioneCover',
        loadComponent: () => import('./pages/personal-area/personalizzazione-cover/personalizzazione-cover.component').then(m => m.PersonalizzazioneCoverComponent),
        canActivate: [AuthGuard]
      },
      {
        path: 'rubricaDestinatari',
        loadComponent: () => import('./pages/personal-area/rubrica-destinatari/rubrica-destinatari.component').then(m => m.RubricaDestinatariComponent),
        canActivate: [AuthGuard]
      },
      {
        path: 'utentiList',
        loadComponent: () => import('./pages/personal-area/utenti/utenti.component').then(m => m.UtentiComponent),
        canActivate: [AuthGuard]
      },
      {
        path: 'archivioSpedizioni',
        loadComponent: () => import('./pages/archivio/archivio-spedizioni/archivio-spedizioni.component').then(m => m.ArchivioSpedizioniComponent),
        canActivate: [AuthGuard]
      },
      {
        path: 'archivioVisure',
        loadComponent: () => import('./pages/archivio/archivio-visure/archivio-visure.component').then(m => m.ArchivioVisureComponent),
        canActivate: [AuthGuard]
      },
      {
        path: 'addRecipient',
        loadComponent: () => import('./pages/personal-area/add-recipient/add-recipient.component').then(m => m.AddRecipientComponent),
        canActivate: [AuthGuard]
      },
      {
        path: 'modRecipient/:id',
        loadComponent: () => import('./pages/personal-area/add-recipient/add-recipient.component').then(m => m.AddRecipientComponent),
        canActivate: [AuthGuard]
      },
      {
        path: 'dettaglioSpedizione/:id',
        loadComponent: () => import('./pages/archivio/dettaglio-spedizione/dettaglio-spedizione.component').then(m => m.DettaglioSpedizioneComponent),
        canActivate: [AuthGuard]
      },
      {
        path: 'addLogo',
        loadComponent: () => import('./pages/personal-area/add-logo/add-logo.component').then(m => m.AddLogoComponent),
        canActivate: [AuthGuard]
      },
      {
        path: 'addUser',
        loadComponent: () => import('./pages/personal-area/add-user/add-user.component').then(m => m.AddUserComponent),
        canActivate: [AuthGuard]
      },
      {
        path: 'modUser/:id',
        loadComponent: () => import('./pages/personal-area/add-user/add-user.component').then(m => m.AddUserComponent),
        canActivate: [AuthGuard]
      },
{
        path: 'comprimiPdf',
        loadComponent: () => import('./pages/utility/comprimi-pdf/comprimi-pdf.component').then(m => m.ComprimiPdfComponent),
        canActivate: [AuthGuard]
      },
      {
        path: 'fileEsempio',
        loadComponent: () => import('./pages/utility/file-esempio/file-esempio.component').then(m => m.FileEsempioComponent),
        canActivate: [AuthGuard]
      },
      {
        path: 'rendicontazioneFatture',
        loadComponent: () => import('./pages/utility/rendicontazione-fatture/rendicontazione-fatture.component').then(m => m.RendicontazioneFattureComponent),
        canActivate: [AuthGuard]
      },
      {
        path: 'sincBipiol',
        loadComponent: () => import('./pages/utility/sinc-bipiol/sinc-bipiol.component').then(m => m.SincBipiolComponent),
        canActivate: [AuthGuard]
      },
      {
        path: 'stampaUnione',
        loadComponent: () => import('./pages/utility/stampa-unione/stampa-unione.component').then(m => m.StampaUnioneComponent),
        canActivate: [AuthGuard]
      },
      {
        path: 'unionePdf',
        loadComponent: () => import('./pages/utility/unione-pdf/unione-pdf.component').then(m => m.UnionePdfComponent),
        canActivate: [AuthGuard]
      },
      {
        path: 'videoTutorial',
        loadComponent: () => import('./pages/utility/video-tutorial/video-tutorial.component').then(m => m.VideoTutorialComponent),
        canActivate: [AuthGuard]
      },
      {
        path: 'comunicazioni',
        loadComponent: () => import('./pages/comunicazioni/comunicazioni.component').then(m => m.ComunicazioniComponent),
        canActivate: [AuthGuard]
      },
      {
        path: 'access',
        loadComponent: () => import('./pages/access/access.component').then(m => m.AccessComponent)
      },      
      {
        path: '**',
        loadComponent: () => import('./pages/not-found/not-found.component').then(m => m.NotFoundComponent)
      }
    ]
  }
];

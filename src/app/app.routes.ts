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
import { UserSendersComponent } from './pages/userSenders/user-senders.component';
import { NuovaSpedizioneComponent } from './pages/nuova-spedizione/nuova-spedizione.component';
import { TipoSpedizioneRaccomandataComponent } from './pages/raccomandata/tipo-spedizione/tipo-spedizione.component';
import { InvioSingoloRaccomandataComponent } from './pages/raccomandata/invio-singolo-raccomandata/invio-singolo-raccomandata.component';
import { InvioMultiploRaccomandataComponent } from './pages/raccomandata/invio-multiplo-raccomandata/invio-multiplo-raccomandata.component';
import { InvioSingoloRaccomandata2Component } from './pages/raccomandata/invio-singolo-raccomandata-2/invio-singolo-raccomandata-2.component';
import { InvioSingoloRaccomandata3Component } from './pages/raccomandata/invio-singolo-raccomandata-3/invio-singolo-raccomandata-3.component';
import { InvioSingoloRaccomandata4Component } from './pages/raccomandata/invio-singolo-raccomandata-4/invio-singolo-raccomandata-4.component';
import { InvioSingoloRaccomandata5Component } from './pages/raccomandata/invio-singolo-raccomandata-5/invio-singolo-raccomandata-5.component';
import { CompilaBollettinoComponent } from './pages/raccomandata/compila-bollettino/compila-bollettino.component';
import { CalcoloPreventivoComponent } from './pages/calcolo-preventivo/calcolo-preventivo.component';
import { RiepilogoSpedizioneComponent } from './pages/riepilogo-spedizione/riepilogo-spedizione.component';
import { InvioMultiploRaccomandata2Component } from './pages/raccomandata/invio-multiplo-raccomandata-2/invio-multiplo-raccomandata-2.component';
import { InvioMultiploRaccomandata3Component } from './pages/raccomandata/invio-multiplo-raccomandata-3/invio-multiplo-raccomandata-3.component';
import { InvioMultiploRaccomandata4Component } from './pages/raccomandata/invio-multiplo-raccomandata-4/invio-multiplo-raccomandata-4.component';

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
        path: '**',
        component: NotFoundComponent
      }
    ]
  }
];

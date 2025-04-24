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
        path: 'userSenders',
        component: UserSendersComponent,
        canActivate: [AuthGuard]
      },
      {
        path: '**',
        component: NotFoundComponent
      }
    ]
  }
];

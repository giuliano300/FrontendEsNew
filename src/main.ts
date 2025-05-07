import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { provideHttpClient } from '@angular/common/http';
import { NgxFileDropModule } from 'ngx-file-drop';
import { importProvidersFrom } from '@angular/core';


export const API_URL = "http://localhost:5105/Api/";

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    importProvidersFrom(NgxFileDropModule)
  ]

});
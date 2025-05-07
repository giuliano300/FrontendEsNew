import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { provideHttpClient } from '@angular/common/http';
import { NgxFileDropModule } from 'ngx-file-drop';
import { importProvidersFrom } from '@angular/core';


export const API_URL = "http://localhost:5105/Api/";

export enum productType{
  raccomandata = 1,
  lettera = 2,
  telegramma = 3,
  agol = 4,
  visura = 5
}

export enum sendType{
  singolo = 1,
  mutiplo = 2
}

export enum bulletin{
  si = 1,
  no = 2
}

export enum format{
  a4 = 0,
  formatoSpeciale = 1
}

export enum printType{
  biancoNero = 0,
  colori = 1
}

export enum returnReceipt{
  si = 0,
  no = 1
}

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    importProvidersFrom(NgxFileDropModule)
  ]

});
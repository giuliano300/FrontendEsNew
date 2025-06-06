import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { provideHttpClient } from '@angular/common/http';
import { NgxFileDropModule } from 'ngx-file-drop';
import { importProvidersFrom } from '@angular/core';


export const API_URL = "http://localhost:5105/Api/";
export const secretKey = 'easysender2025!EWT';
export const maxUploadLimit = 1200;

export const bulletinFields = [
  'numerocontocorrente', 'intestatoa', 'codicecliente', 'importoeuro',
  'eseguitodanominativo', 'eseguitodaindirizzo', 'eseguitodacap', 'eseguitodalocalita',
  'causale', 'anno', 'iban'
];

export const constPageIndex = 0;
export const constPageSize = 20;


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
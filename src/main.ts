import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { provideHttpClient } from '@angular/common/http';
import { NgxFileDropModule } from 'ngx-file-drop';
import {importProvidersFrom } from '@angular/core';
import * as CryptoJS from 'crypto-js';

// export const API_URL= 'https://backendnew.easysender.it/Api/';
export const API_URL = 'http://localhost:5105/Api/';
export const secretKey = 'easysender2025!EWT';
export const maxUploadLimit = 5000;

export const bulletinFields = [
  'numerocontocorrente', 'intestatoa', 'codicecliente', 'importoeuro',
  'eseguitodanominativo', 'eseguitodaindirizzo', 'eseguitodacap', 'eseguitodalocalita',
  'causale', 'anno', 'iban'
];

export const constPageIndex = 0;
export const constPageSize = 20;

export const expiredDate = new Date(2026, 8, 30).toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric' });
export const loginSecretKey = '12345678901234567890123456789012';
export const loginIV = '1234567890123456';
export const loginUrl = 'http://localhost/WasySender/';


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

export function decryptToken(token: string): any {

  const key = CryptoJS.enc.Utf8.parse(
    loginSecretKey
  );

  const iv = CryptoJS.enc.Utf8.parse(
    loginIV
  );

  const decrypted = CryptoJS.AES.decrypt(
    {
      ciphertext: CryptoJS.enc.Base64.parse(token)
    } as any,
    key,
    {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    }
  );

  const json =
    decrypted.toString(CryptoJS.enc.Utf8);

  return JSON.parse(json);
}

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    importProvidersFrom(NgxFileDropModule)
  ]

});
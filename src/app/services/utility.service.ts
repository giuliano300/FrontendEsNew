import { Injectable } from '@angular/core';
import { API_URL } from '../../main';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ZipStampaUnioneRequest } from '../interfaces/ZipStampaUnioneRequest';
import { ZipResponse } from '../interfaces/ZipResponse';
import { PdfUnioneRequest } from '../interfaces/PdfUnioneRequest';
import { PdfUnioneResponse } from '../interfaces/PdfUnioneResponse';
import { ComuniItaliani } from '../interfaces/ComuniItaliani';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {

   private apiUrl = API_URL;
    
  constructor(private http: HttpClient) {}

  SignBullettinPaidAndReturnCSV(txtBase64: string): Observable<string> {
    return this.http.post(this.apiUrl + "Bulletins/SignBullettinPaidAndReturnCSV", 
      JSON.stringify(txtBase64),  // invia la stringa come JSON
      { headers: { 'Content-Type': 'application/json' }, responseType: 'text' }
    );
  }

  GetStampaEunione(zipStampaUnioneRequest: ZipStampaUnioneRequest): Observable<ZipResponse> {
    return this.http.post<ZipResponse>(this.apiUrl + "StampaUnione/Process", zipStampaUnioneRequest);
  }

  GetUnisciPdf(pdfUnioneRequest: PdfUnioneRequest): Observable<PdfUnioneResponse> {
    return this.http.post<PdfUnioneResponse>(
      this.apiUrl + "StampaUnione/UnisciPdf",
      pdfUnioneRequest
    );
  }

  GetComprimiPdf(zipStampaUnioneRequest: ZipStampaUnioneRequest): Observable<ZipResponse> {
    return this.http.post<ZipResponse>(this.apiUrl + "StampaUnione/ComprimiPdf", zipStampaUnioneRequest);
  }


  getCodiceClienteBollettino(
    anno: string,
    cap: string,
    comuni: ComuniItaliani[]
  ): string {

    const comune = this.getComuneItalianoFromCap(cap, comuni);

    if (!comune) return '';

    const divisore = 93;
    const y = anno.substring(3, 4);

    const code = this.getCodiceCatastale(comune.codiceCatastale!);
    const numbersCode = this.getCodiceCatastaleNumeri(comune.codiceCatastale!);

    let c = '';

    do {
      const randomCode = this.randomCode(10);

      c = y + code + numbersCode + randomCode;

      const cc = Number(c);

      const d = cc % divisore;

      c += d.toString();

    } while (c.length !== 18);

    return c;
  }

  // ==============================
  // CERCA COMUNE DA CAP
  // ==============================
  getComuneItalianoFromCap(
    cap: string,
    comuni: ComuniItaliani[]
  ): ComuniItaliani | null {

    cap = cap.replace(/\s/g, '');

    const found = comuni.filter(x =>
      x.cap.toString().includes(cap)
    );

    if (found.length === 0) return null;

    return {
      cap: cap,
      provincia: null,
      sigla: found[0].sigla,
      codiceCatastale: found[0].codiceCatastale,
      nome: found[0].nome
    };
  }

  // ==============================
  // LETTERA CATASTALE -> CODICE
  // ==============================
  getCodiceCatastale(letters: string): string {

    const letter = letters.substring(0, 1).toUpperCase();

    switch (letter) {
      case 'A': return '01';
      case 'B': return '02';
      case 'C': return '03';
      case 'D': return '04';
      case 'E': return '05';
      case 'F': return '06';
      case 'G': return '07';
      case 'H': return '08';
      case 'I': return '09';
      case 'L': return '10';
      case 'M': return '11';
      default: return '01';
    }
  }

  // ==============================
  // NUMERI CATASTALI
  // ==============================
  getCodiceCatastaleNumeri(letters: string): string {
    return letters.substring(1, 4);
  }

  // ==============================
  // RANDOM NUMERICO
  // ==============================
  randomCode(length: number): string {

    let result = '';

    for (let i = 0; i < length; i++) {
      result += Math.floor(Math.random() * 10).toString();
    }

    return result;
  }
}

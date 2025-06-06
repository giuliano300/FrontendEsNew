import { Injectable } from '@angular/core';
import { API_URL } from '../../main';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ZipStampaUnioneRequest } from '../interfaces/ZipStampaUnioneRequest';
import { ZipResponse } from '../interfaces/ZipResponse';
import { PdfUnioneRequest } from '../interfaces/PdfUnioneRequest';
import { PdfUnioneResponse } from '../interfaces/PdfUnioneResponse';

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
}

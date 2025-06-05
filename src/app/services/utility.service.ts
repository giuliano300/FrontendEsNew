import { Injectable } from '@angular/core';
import { API_URL } from '../../main';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ZipStampaUnioneRequest } from '../interfaces/ZipStampaUnioneRequest';

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

  GetStampaEunione(zipStampaUnioneRequest: ZipStampaUnioneRequest): Observable<string> {
    return this.http.post(this.apiUrl + "StampaUnione/process", 
      JSON.stringify(zipStampaUnioneRequest),  // invia la stringa come JSON
      { headers: { 'Content-Type': 'application/json' }, responseType: 'text' }
    );
  }
}

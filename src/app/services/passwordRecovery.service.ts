import { Injectable } from '@angular/core';
import { API_URL } from '../../main';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PasswordRecoveryService {

    private apiUrl = API_URL + "PasswordRecovery";
    
    constructor(private http: HttpClient) {}

     // Metodo per ottenere l'utente tramite email
    getLinkToRecovery(email?: string): Observable<boolean> {
      return this.http.get<boolean>(this.apiUrl + "?email=" + email);
    }
}

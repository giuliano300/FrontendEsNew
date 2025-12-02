import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { FrontendLogEntry } from '../interfaces/FrontendLogEntry';
import { API_URL } from '../../main';

@Injectable({
  providedIn: 'root'
})
export class LoggingService {

  private apiUrl = `${API_URL}logs`; 

  constructor(private http: HttpClient) {
  }

  private getOrCreateCorrelationId(): string {
    const existing = sessionStorage.getItem('correlationId');
    if (existing) return existing;
    const newId = crypto.randomUUID();
    sessionStorage.setItem('correlationId', newId);
    return newId;
  }

  log(entry: Partial<FrontendLogEntry>) {
    // Aggiunge automaticamente userId da localStorage
    let userId = 'anonymous';
    const user = localStorage.getItem('user');
    if(user)
        userId = JSON.parse(user!).id;

    entry.userId =  userId.toString()

    this.http.post(this.apiUrl, entry)
      .pipe(catchError(err => { console.error('Errore invio log', err); return of(null); }))
      .subscribe();
  }
}

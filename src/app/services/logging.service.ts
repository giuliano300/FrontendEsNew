import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { FrontendLogEntry } from '../interfaces/FrontendLogEntry';
import { API_URL } from '@app/config/app-constants';
import { AppStorageService } from './app-storage.service';

@Injectable({
  providedIn: 'root'
})
export class LoggingService {

  private apiUrl = `${API_URL}logs`; 

  constructor(private http: HttpClient, private storage: AppStorageService) {
  }

  private getOrCreateCorrelationId(): string {
    const existing = sessionStorage.getItem('correlationId');
    if (existing) return existing;
    const newId = crypto.randomUUID();
    sessionStorage.setItem('correlationId', newId);
    return newId;
  }

  log(entry: Partial<FrontendLogEntry>) {
    let userId = 'anonymous';
    const user = this.getStoredUser();

    if (user?.id) {
      userId = user.id.toString();
    }

    entry.userId = userId;
    entry.correlationId = this.getOrCreateCorrelationId();
    entry.browser = navigator.userAgent;
    entry.clientTime ??= new Date().toISOString();

    this.http.post(this.apiUrl, entry)
      .pipe(catchError(err => { console.error('Errore invio log', err); return of(null); }))
      .subscribe();
  }

  private getStoredUser(): { id?: number } | null {
    return this.storage.getUser();
  }
}

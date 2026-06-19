import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Login } from '../interfaces/Login';
import { HttpLoggingService } from '../wrapper/http-logging.service';
import { Verify2FaRequest } from '../interfaces/Verify2FaRequest';
import { API_URL } from '@app/config/app-constants';
import { AppStorageService } from './app-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

    private apiUrl = API_URL + "Auth";
    
    constructor(private http: HttpLoggingService, private storage: AppStorageService) {}

    login(login:Login): Observable<any>{
      return this.http.post<any>(this.apiUrl + "/login", login);
    }

    verifyCode(verifyCode:Verify2FaRequest): Observable<any>{
      return this.http.post<any>(this.apiUrl + "/verify-2fa-code", verifyCode);
    }

    saveLocalStorage(data: any) {
      this.storage.saveAuthSession(data);
    }

    clearLocalStorage() {
      this.storage.clearAuthSession();
    }

    isAuthenticated(): boolean {
      const token = this.storage.getAuthToken();
      if (!token) {
        return false;
      }

      if (this.isJwtExpired(token)) {
        this.clearLocalStorage();
        return false;
      }

      return true;
    }

    private isJwtExpired(token: string): boolean {
      const payload = this.decodeJwtPayload(token);
      if (!payload || typeof payload.exp !== 'number') {
        return false;
      }

      return Date.now() >= payload.exp * 1000;
    }

    private decodeJwtPayload(token: string): { exp?: number } | null {
      const [, payload] = token.split('.');
      if (!payload) {
        return null;
      }

      try {
        const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
        const padded = normalized.padEnd(normalized.length + (4 - normalized.length % 4) % 4, '=');
        const decoded = atob(padded);
        return JSON.parse(decoded) as { exp?: number };
      } catch {
        return null;
      }
    }
}

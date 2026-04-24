import { Injectable } from '@angular/core';
import { API_URL } from '../../main';
import { Observable } from 'rxjs';
import { Login } from '../interfaces/Login';
import { HttpLoggingService } from '../wrapper/http-logging.service';
import { Verify2FaRequest } from '../interfaces/Verify2FaRequest';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

    private apiUrl = API_URL + "Auth";
    
    constructor(private http: HttpLoggingService) {}

    login(login:Login): Observable<any>{
      return this.http.post<any>(this.apiUrl + "/login", login);
    }

    verifyCode(verifyCode:Verify2FaRequest): Observable<any>{
      return this.http.post<any>(this.apiUrl + "/verify-2fa-code", verifyCode);
    }

    saveLocalStorage(data: any) {
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('userOptions', JSON.stringify(data.options));
      localStorage.setItem('userProducts', JSON.stringify(data.products));
      localStorage.setItem('userTourPage', JSON.stringify(data.tour));
    }
}

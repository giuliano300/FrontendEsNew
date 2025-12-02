import { Injectable } from '@angular/core';
import { API_URL } from '../../main';
import { Observable } from 'rxjs';
import { Login } from '../interfaces/Login';
import { HttpLoggingService } from '../wrapper/http-logging.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

    private apiUrl = API_URL + "Auth";
    
    constructor(private http: HttpLoggingService) {}

    login(login:Login): Observable<any>{
      return this.http.post<any>(this.apiUrl + "/login", login);
    }
}

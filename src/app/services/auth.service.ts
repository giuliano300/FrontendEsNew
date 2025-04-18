import { Injectable } from '@angular/core';
import { API_URL } from '../../main';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Login } from '../interfaces/Login';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

    private apiUrl = API_URL + "Auth";
    
    constructor(private http: HttpClient) {}

    login(login:Login): Observable<any>{
      return this.http.post<any>(this.apiUrl + "/login", login);
    }
}

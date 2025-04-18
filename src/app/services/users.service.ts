import { Injectable } from '@angular/core';
import { API_URL } from '../../main';
import { HttpClient } from '@angular/common/http';
import { Users } from '../interfaces/Users';
import { Observable } from 'rxjs';
import { ChangePassword } from '../interfaces/ChangePassword';
import { Responses } from '../interfaces/Responses';
import { OpenApiVatReponses } from '../interfaces/OpenApiResponse/OpenApiVatReponses';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

    private apiUrl = API_URL + "Users";
    
    constructor(private http: HttpClient) {}

     // Metodo per ottenere l'utente tramite email
    getUser(email?: string): Observable<Users> {
      return this.http.get<Users>(this.apiUrl + "?email=" + email);
    }

    setUser(user:Users): Observable<Users>{
      return this.http.post<Users>(this.apiUrl, user);
    }

    changePassword(changePassword:ChangePassword): Observable<Responses>{
      return this.http.post<Responses>(this.apiUrl + "/ChangePassword", changePassword);
    }

    existUser(vatNumber:string):Observable<Responses>{
      return this.http.get<Responses>(this.apiUrl + "/Exist?vatNumber=" + vatNumber);
    }

    checkVat(vatNumber:string):Observable<OpenApiVatReponses>{
      return this.http.get<OpenApiVatReponses>(this.apiUrl + "/CheckVat?vatNumber=" + vatNumber);
    }

    checkPosteAccess(usernamePoste:string, passwordPoste:string):Observable<boolean>{
      return this.http.get<boolean>(this.apiUrl + "/CheckPosteAccess?userName=" + usernamePoste + "&password=" + passwordPoste);
    }
}

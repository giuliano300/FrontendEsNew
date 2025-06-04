import { Injectable } from '@angular/core';
import { API_URL } from '../../main';
import { HttpClient } from '@angular/common/http';
import { Users } from '../interfaces/Users';
import { BehaviorSubject, catchError, Observable } from 'rxjs';
import { ChangePassword } from '../interfaces/ChangePassword';
import { Responses } from '../interfaces/Responses';
import { OpenApiVatReponses } from '../interfaces/OpenApiResponse/OpenApiVatReponses';
import { ChangePasswordFromSite } from '../interfaces/ChangePasswordFromSite';
import { CheckPwd } from '../interfaces/CheckPwd';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

    private apiUrl = API_URL + "Users";
    
    constructor(private http: HttpClient) {}
    private userNameSubject = new BehaviorSubject<string>(''); // iniziale vuoto o preset
    userName$ = this.userNameSubject.asObservable();

    setUserName(name: string) {
      this.userNameSubject.next(name);
    }

    getCurrentUserName(): string {
      return this.userNameSubject.getValue();
    }

     // Metodo per ottenere l'utente tramite email
    getUser(email?: string): Observable<Users> {
      return this.http.get<Users>(this.apiUrl + "?email=" + email);
    }

    getUserById(id?: number): Observable<Users> {
      return this.http.get<Users>(this.apiUrl + "/" + id);
    }

     // Metodo per ottenere l'utente tramite email
    getChildren(id: number): Observable<Users[]> {
      return this.http.get<Users[]>(this.apiUrl + "/GetChildren/" + id);
    }

    setUser(user:Users): Observable<Users>{
      return this.http.post<Users>(this.apiUrl, user);
    }

    updateUser(user:Users): Observable<Users>{
      return this.http.put<Users>(this.apiUrl + "/" + user.id, user);
    }

    deleteUser(id: number): Observable<any> {
      return this.http.delete(this.apiUrl + "/" + id)
        .pipe(
          catchError(error => {
            console.error('Errore durante l\'eliminazione:', error);
            throw error;  // Rilancia l'errore
          })
        );
    }

    updatePassword(c:ChangePasswordFromSite): Observable<CheckPwd>{
      return this.http.post<CheckPwd>(this.apiUrl + "/ChangePasswordFromSite", c);
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

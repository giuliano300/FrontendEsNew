import { Injectable } from '@angular/core';
import { API_URL } from '../../main';
import { HttpClient } from '@angular/common/http';
import { UserLogos } from '../interfaces/UserLogos';
import { catchError, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserLogosService {
  private apiUrl = API_URL + "UserLogos";
    
  constructor(private http: HttpClient) {}

   getUserLogos(userId: number): Observable<UserLogos[]> {
    return this.http.get<UserLogos[]>(this.apiUrl + "?userId=" + userId);
  }

  getUserSender(id: number): Observable<UserLogos> {
    return this.http.get<UserLogos>(this.apiUrl + "/" + id);
  }

  setUserSender(userSender:UserLogos): Observable<UserLogos>{
    return this.http.post<UserLogos>(this.apiUrl, userSender);
  }

  deleteUserSender(id: number): Observable<any> {
    return this.http.delete(this.apiUrl + "/" + id)
      .pipe(
        catchError(error => {
          console.error('Errore durante l\'eliminazione:', error);
          throw error;  // Rilancia l'errore
        })
      );
  }
}

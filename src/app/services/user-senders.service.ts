import { Injectable } from '@angular/core';
import { API_URL } from '../../main';
import { HttpClient } from '@angular/common/http';
import { UserSenders } from '../interfaces/UserSenders';
import { catchError, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserSendersService {
  private apiUrl = API_URL + "UserSenders";
    
  constructor(private http: HttpClient) {}

   getUserSenders(userId: number): Observable<UserSenders[]> {
    return this.http.get<UserSenders[]>(this.apiUrl + "?userId=" + userId);
  }

  getUserSender(id: number): Observable<UserSenders> {
    return this.http.get<UserSenders>(this.apiUrl + "/" + id);
  }

  setUserSender(userSender:UserSenders): Observable<UserSenders>{
    return this.http.post<UserSenders>(this.apiUrl, userSender);
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

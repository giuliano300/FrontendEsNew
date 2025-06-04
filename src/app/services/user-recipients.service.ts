import { Injectable } from '@angular/core';
import { UserRecipients } from '../interfaces/UserRecipients';
import { catchError, Observable } from 'rxjs';
import { API_URL } from '../../main';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserRecipientsService {

   constructor(private http: HttpClient) {}
   
   private apiUrl = API_URL + "UserRecipients";

   getUserRecipients(userId: number): Observable<UserRecipients[]> {
      return this.http.get<UserRecipients[]>(this.apiUrl + "?userId=" + userId);
    }
  
    getUserRecipient(id: number): Observable<UserRecipients> {
      return this.http.get<UserRecipients>(this.apiUrl + "/" + id);
    }
  
    setUserRecipient(userRecipients:UserRecipients): Observable<UserRecipients>{
      return this.http.post<UserRecipients>(this.apiUrl, userRecipients);
    }

    updateUserRecipient(userRecipients:UserRecipients): Observable<UserRecipients>{
      return this.http.put<UserRecipients>(this.apiUrl + "/" + userRecipients.id, userRecipients);
    }

  
    deleteUserRecipient(id: number): Observable<any> {
      return this.http.delete(this.apiUrl + "/" + id)
        .pipe(
          catchError(error => {
            console.error('Errore durante l\'eliminazione:', error);
            throw error;  // Rilancia l'errore
          })
        );
    }
}

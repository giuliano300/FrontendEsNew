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
}

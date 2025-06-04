import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../../main';
import { HttpClient } from '@angular/common/http';
import { Notifications } from '../interfaces/Notifications';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private http: HttpClient) { }

   private apiUrl = API_URL + "Notifications";
 
   getNotifications(): Observable<Notifications[]>
    {
      return this.http.get<Notifications[]>(`${this.apiUrl}`);
    }
  
}

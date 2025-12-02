import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../../main';
import { Notifications } from '../interfaces/Notifications';
import { HttpLoggingService } from '../wrapper/http-logging.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private http: HttpLoggingService) { }

   private apiUrl = API_URL + "Notifications";
 
   getNotifications(): Observable<Notifications[]>
    {
      return this.http.get<Notifications[]>(`${this.apiUrl}`);
    }
  
}

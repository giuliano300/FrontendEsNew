import { Injectable } from '@angular/core';
import { API_URL } from '../../main';
import { Observable } from 'rxjs';
import { AssistenceRequest } from '../interfaces/AssistenceRequest';
import { HttpLoggingService } from '../wrapper/http-logging.service';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor(private http: HttpLoggingService) { }

   private apiUrl = API_URL + "Email";
 
   setAssistenceRequest(a: AssistenceRequest): Observable<boolean>
   {
      return this.http.post<boolean>(this.apiUrl + "/SendAssistence", a);
   }
}

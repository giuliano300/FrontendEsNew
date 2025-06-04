import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from '../../main';
import { Observable } from 'rxjs';
import { AssistenceRequest } from '../interfaces/AssistenceRequest';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor(private http: HttpClient) { }

   private apiUrl = API_URL + "Email";
 
   setAssistenceRequest(a: AssistenceRequest): Observable<boolean>
   {
      return this.http.post<boolean>(this.apiUrl + "/SendAssistence", a);
   }
}

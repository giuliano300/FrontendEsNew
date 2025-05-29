import { Injectable } from '@angular/core';
import { API_URL } from '../../main';
import { Observable } from 'rxjs';
import { GetDettaglioDestinatario } from '../interfaces/GetDettaglioDestinatario';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RecipientService {

 constructor(private http: HttpClient) {}
  
  private apiUrl = API_URL + "Recipients";

    getDettaglioDestinatario(
        id:number
      ): Observable<GetDettaglioDestinatario>
      {
        const params = new URLSearchParams({
          id: id.toString()
        })
        return this.http.get<GetDettaglioDestinatario>(`${this.apiUrl}/GetDettaglioDestinatario?${params.toString()}`);
      }

}

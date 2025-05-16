import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Comune } from '../interfaces/Comune';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GlobalServicesService {

  private jsonUrl = '/assets/comuni.json';

  constructor(private http: HttpClient) {}

  getComuni(): Observable<Comune[]> {
    return this.http.get<Comune[]>(this.jsonUrl);
  }

}

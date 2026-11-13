import { Injectable } from '@angular/core';
import { Comune } from '../interfaces/Comune';
import { Observable } from 'rxjs';
import { HttpLoggingService } from '../wrapper/http-logging.service';

@Injectable({
  providedIn: 'root'
})
export class GlobalServicesService {

  private jsonUrl = '/assets/json/gi_comuni_cap.json';

  constructor(private http: HttpLoggingService) {}

  getComuni(): Observable<Comune[]> {
    return this.http.get<Comune[]>(this.jsonUrl);
  }

}

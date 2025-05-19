import { Injectable } from '@angular/core';
import { API_URL } from '../../main';
import { HttpClient } from '@angular/common/http';
import { CompleteOperation } from '../interfaces/ViewModel/CompleteOperation';
import { Observable } from 'rxjs';
import { Operations } from '../interfaces/Operations';

@Injectable({
  providedIn: 'root'
})
export class OperationService {

 private apiUrl = API_URL + "Operations";

 constructor(private http: HttpClient) {}

    setOperation(o:CompleteOperation): Observable<Operations>{
      return this.http.post<Operations>(this.apiUrl + "/OperationsComplete", o);
    }
}

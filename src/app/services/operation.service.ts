import { Injectable } from '@angular/core';
import { API_URL } from '../../main';
import { HttpClient } from '@angular/common/http';
import { CompleteOperation } from '../ViewModel/CompleteOperation';
import { Observable } from 'rxjs';
import { Operations } from '../classes/Operations';
import { GetStatoInvii } from '../interfaces/GetStatoInvii';

@Injectable({
  providedIn: 'root'
})
export class OperationService {

 private apiUrl = API_URL + "Operations";

 constructor(private http: HttpClient) {}

    setOperation(o:CompleteOperation): Observable<Operations>{
      return this.http.post<Operations>(this.apiUrl + "/OperationsComplete", o);
    }

    getStatoInvii(userId:number, operationType: number): Observable<GetStatoInvii[]>{
      return this.http.get<GetStatoInvii[]>(this.apiUrl + "/GetStatoInvii?UserId=" + userId + "&OperationType=" + operationType);
    }
}

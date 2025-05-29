import { Injectable } from '@angular/core';
import { API_URL } from '../../main';
import { HttpClient } from '@angular/common/http';
import { CompleteOperation } from '../ViewModel/CompleteOperation';
import { Observable } from 'rxjs';
import { Operations } from '../classes/Operations';
import { GetStatoInvii } from '../interfaces/GetStatoInvii';
import { GetArchivioSpedizioniResponse } from '../interfaces/GetArchivioSpedizioniResponse';
import { GetArchivioVisureResponse } from '../interfaces/GetArchivioVisureResponse';
import { GetDettaglioSpedizioneResponse } from '../interfaces/GetDettaglioSpedizioneResponse';

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

    getDettaglioSpedizione(
        id:number,
        businessName?: string | null,
        code?: string | null, 
        valid?: string | null
      ): Observable<GetDettaglioSpedizioneResponse>
      {
        const params = new URLSearchParams({
          id: id.toString(),
          businessName: businessName ?? '',
          code: code ?? '',
          valid: valid ?? ''
        })
        return this.http.get<GetDettaglioSpedizioneResponse>(`${this.apiUrl}/GetDettaglioSpedizione?${params.toString()}`);
      }

    getArchivioSpedizioni(
        userId: number,
        startDate?: string | null,
        endDate?: string | null,
        pageIndex: number = 0,
        pageSize: number = 20
      ): Observable<GetArchivioSpedizioniResponse> {
        const params = new URLSearchParams({
        UserId: userId.toString(),
        startDate: startDate ?? '',
        endDate: endDate ?? '',
        pageIndex: pageIndex.toString(),
        pageSize: pageSize.toString()
      });

      return this.http.get<GetArchivioSpedizioniResponse>(`${this.apiUrl}/GetArchivioSpedizioni?${params.toString()}`);
    }

    getArchivioVisure(
      userId: number,
      startDate?: string | null,
      endDate?: string | null,
      businessName?: string | null,
      vat?: string | null,
      pageIndex: number = 0,
      pageSize: number = 20
    ): Observable<GetArchivioVisureResponse> {
      const params = new URLSearchParams({
        UserId: userId.toString(),
        startDate: startDate ?? '',
        endDate: endDate ?? '',
        businessName: businessName ?? '',
        vat: vat ?? '',
        pageIndex: pageIndex.toString(),
        pageSize: pageSize.toString()
      });

      return this.http.get<GetArchivioVisureResponse>(`${this.apiUrl}/GetArchivioVisure?${params.toString()}`);
    }
}

import { Injectable } from '@angular/core';
import { API_URL } from '../../main';
import { Observable } from 'rxjs';
import { GetDettaglioDestinatario } from '../interfaces/GetDettaglioDestinatario';
import { HttpClient } from '@angular/common/http';
import { GetReportSpedizioniResponse } from '../interfaces/GetReportSpedizioniResponse';
import { Recipients } from '../classes/Recipients';

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


    getErroriNotificati(
        userId: number,
        notify: boolean
      ): Observable<Recipients[]>
      {
        const params = new URLSearchParams({
          userId: userId.toString(),
          notify: notify.toString()
        })
        return this.http.get<Recipients[]>(`${this.apiUrl}?${params.toString()}`);
      }


    getReportSpedizioni(
        userId:number,
        haveBulletins: boolean,
        startDate?: string | null,
        endDate?: string | null,
        pageIndex: number = 0,
        pageSize: number = 20,
        productType: number = 0,
        businessName?: string | null,
        code?: string | null, 
        valid?: string | null,
        paymentDateS?: string | null,
        paymentDateE?: string | null,
        paid?: string | null
      ): Observable<GetReportSpedizioniResponse>
      {
        const params = new URLSearchParams({
          userId: userId.toString(),
          haveBulletins: haveBulletins.toString(),
          businessName: businessName ?? '',
          productType: productType != null ? productType.toString() : '0',
          code: code ?? '',
          valid: valid ?? '',
          startDate: startDate ?? '',
          endDate: endDate ?? '',
          pageIndex: pageIndex.toString(),
          pageSize: pageSize.toString(),
          paymentDateS: paymentDateS ?? '',
          paymentDateE: paymentDateE ?? '',
          paid: paid ?? ''
        })
        return this.http.get<GetReportSpedizioniResponse>(`${this.apiUrl}/GetReportSpedizioni?${params.toString()}`);
      }

}

import { Injectable } from '@angular/core';
import { API_URL } from '../../main';
import { HttpClient } from '@angular/common/http';
import { Users } from '../interfaces/Users';
import { Observable } from 'rxjs';
import { ChangePassword } from '../interfaces/ChangePassword';
import { Responses } from '../interfaces/Responses';
import { OpenApiVatReponses } from '../interfaces/OpenApiResponse/OpenApiVatReponses';
import { UserProducts } from '../interfaces/UserProducts';

@Injectable({
  providedIn: 'root'
})
export class UsersProductsService {

    private apiUrl = API_URL + "UserProducts";
    
    constructor(private http: HttpClient) {}

    setUserProducts(userProduct:UserProducts): Observable<UserProducts>{
      return this.http.post<UserProducts>(this.apiUrl, userProduct);
    }

}

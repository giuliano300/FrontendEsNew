import { Injectable } from '@angular/core';
import { API_URL } from '../../main';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { TourSeen } from '../interfaces/TourSeen';
import { Users } from '../interfaces/Users';
import { TourPage } from '../interfaces/EnumTypes';

@Injectable({
  providedIn: 'root'
})
export class TourSeenService {

   private apiUrl = API_URL + "TourSeen";
    
  constructor(private http: HttpClient) {}

   getTourSeen(): Observable<TourSeen[]> {
    let u: Users = JSON.parse(localStorage.getItem('user')!);
    return this.http.get<TourSeen[]>(this.apiUrl + "?userId=" + u.id);
  }

  setTourSeen(page: number): Observable<TourSeen | null>{
    let u: Users = JSON.parse(localStorage.getItem('user')!);
    let t: TourSeen = {
      userId: u.id!,
      id: 0,
      page: page
    };

    let userTourPage: TourSeen[] = JSON.parse(localStorage.getItem("userTourPage")?.toString() || "[]");
    if(userTourPage.some(tour => tour.page === page))
      return of(null);
    
    userTourPage.push(t);

    // Salva la lista aggiornata nel localStorage
    localStorage.setItem("userTourPage", JSON.stringify(userTourPage));

    return this.http.post<TourSeen>(this.apiUrl, t);
  }

}

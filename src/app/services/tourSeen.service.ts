import { Injectable } from '@angular/core';
import { API_URL } from '@app/config/app-constants';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { TourSeen } from '../interfaces/TourSeen';
import { Users } from '../interfaces/Users';
import { TourPage } from '../interfaces/EnumTypes';
import { AppStorageService } from './app-storage.service';

@Injectable({
  providedIn: 'root'
})
export class TourSeenService {

   private apiUrl = API_URL + "TourSeen";
    
  constructor(private http: HttpClient, private storage: AppStorageService) {}

  hasSeen(page: number): boolean {
    return this.storage.getTourPages().some(tour => tour.page === page);
  }

   getTourSeen(): Observable<TourSeen[]> {
    let u: Users = this.storage.getUser()!;
    return this.http.get<TourSeen[]>(this.apiUrl + "?userId=" + u.id);
  }

  setTourSeen(page: number): Observable<TourSeen | null>{
    let u: Users = this.storage.getUser()!;
    let t: TourSeen = {
      userId: u.id!,
      id: 0,
      page: page
    };

    let userTourPage: TourSeen[] = this.storage.getTourPages();
    if(userTourPage.some(tour => tour.page === page))
      return of(null);
    
    userTourPage.push(t);

    this.storage.setTourPages(userTourPage);

    return this.http.post<TourSeen>(this.apiUrl, t);
  }

  markSeen(page: number): void {
    this.setTourSeen(page).subscribe();
  }

}

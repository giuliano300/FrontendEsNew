import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoggingService } from '../services/logging.service';

@Injectable({ providedIn: 'root' })
export class HttpLoggingService {
  constructor(private http: HttpClient, private logger: LoggingService) {}

  getBlob(url: string, options?: { headers?: HttpHeaders; params?: HttpParams }): Observable<Blob> {

    return this.http.get(url, {
      ...options,
      responseType: 'blob'
    }).pipe(
      tap({
        next: () => this.logger.log({
          level: 'Information',
          message: `HTTP GET ${url} - SUCCESS`,
          sourceContext: 'HttpLoggingService',
          clientTime: new Date().toISOString()
        }),
        error: (err) => this.logger.log({
          level: 'Error',
          message: `HTTP GET ${url} - ERROR: ${err.message}`,
          sourceContext: 'HttpLoggingService',
          clientTime: new Date().toISOString(),
          exception: err.message
        })
      })
    );
  }

  get<T>(url: string, options?: { headers?: HttpHeaders; params?: HttpParams }): Observable<T> {
    return this.http.get<T>(url, options).pipe(
      tap({
        next: () => this.logger.log({
          level: 'Information',
          message: `HTTP GET ${url} - SUCCESS`,
          sourceContext: 'HttpLoggingService',
          clientTime: new Date().toISOString()
        }),
        error: (err) => this.logger.log({
          level: 'Error',
          message: `HTTP GET ${url} - ERROR: ${err.message}`,
          sourceContext: 'HttpLoggingService',
          clientTime: new Date().toISOString(),
          exception: err.message
        })
      })
    );
  }

  post<T>(url: string, body: any, options?: { headers?: HttpHeaders; params?: HttpParams }): Observable<T> {
    return this.http.post<T>(url, body, options).pipe(
      tap({
        next: () => this.logger.log({
          level: 'Information',
          message: `HTTP POST ${url} - SUCCESS`,
          sourceContext: 'HttpLoggingService',
          clientTime: new Date().toISOString()
        }),
        error: (err) => this.logger.log({
          level: 'Error',
          message: `HTTP POST ${url} - ERROR: ${err.message}`,
          sourceContext: 'HttpLoggingService',
          clientTime: new Date().toISOString(),
          exception: err.message
        })
      })
    );
  }

  put<T>(url: string, body: any, options?: { headers?: HttpHeaders; params?: HttpParams }): Observable<T> {
    return this.http.put<T>(url, body, options).pipe(
      tap({
        next: () => this.logger.log({
          level: 'Information',
          message: `HTTP PUT ${url} - SUCCESS`,
          sourceContext: 'HttpLoggingService',
          clientTime: new Date().toISOString()
        }),
        error: (err) => this.logger.log({
          level: 'Error',
          message: `HTTP PUT ${url} - ERROR: ${err.message}`,
          sourceContext: 'HttpLoggingService',
          clientTime: new Date().toISOString(),
          exception: err.message
        })
      })
    );
  }

  delete<T>(url: string, options?: { headers?: HttpHeaders; params?: HttpParams }): Observable<T> {
    return this.http.delete<T>(url, options).pipe(
      tap({
        next: () => this.logger.log({
          level: 'Information',
          message: `HTTP DELETE ${url} - SUCCESS`,
          sourceContext: 'HttpLoggingService',
          clientTime: new Date().toISOString()
        }),
        error: (err) => this.logger.log({
          level: 'Error',
          message: `HTTP DELETE ${url} - ERROR: ${err.message}`,
          sourceContext: 'HttpLoggingService',
          clientTime: new Date().toISOString(),
          exception: err.message
        })
      })
    );
  }
}

import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { API_URL } from '@app/config/app-constants';
import { AppStorageService } from '@app/services/app-storage.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const storage = inject(AppStorageService);
  const token = storage.getAuthToken();
  const isApiRequest = req.url.startsWith(API_URL);

  const request = token && isApiRequest
    ? req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      })
    : req;

  return next(request).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        storage.clearAuthSession();
        router.navigate(['/']);
      }

      return throwError(() => error);
    })
  );
};

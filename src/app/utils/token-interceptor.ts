import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { Errors } from '../services/errors'; 

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  
  const router = inject(Router);
  const errorsService = inject(Errors);

  const token = localStorage.getItem('token');

  
  let authReq = req;
  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  
  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        console.log('Error 401: Unauthorized. Redirigiendo al login...');
        errorsService.messageError(error); // 
        router.navigate(['/login']);        
      }
      return throwError(() => error);
    })
  );
};

import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { Errors } from '../services/errors'; 

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  // 1. Inyección moderna de servicios usando inject()
  const router = inject(Router);
  const errorsService = inject(Errors);

  // 2. Obtención del token
  const token = localStorage.getItem('token');

  // 3. Adjuntar el encabezado Authorization si existe el token
  let authReq = req;
  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  // 4. Procesar la petición y capturar errores de respuesta (401 Unauthorized)
  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        console.log('Error 401: Unauthorized. Redirigiendo al login...');
        errorsService.messageError(error); // Muestra el mensaje de error
        router.navigate(['/login']);        // Redirige al login
      }
      return throwError(() => error);
    })
  );
};

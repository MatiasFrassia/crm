import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from '../services/login-service';

// 🔒 1. Guard General: Verifica que el usuario haya iniciado sesión (Evita que entren al volver atrás)
export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const toastr = inject(ToastrService);

  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    
    if (token) {
      return true; // ✅ Hay un token activo, acceso concedido
    }
  }

  toastr.error('Debe iniciar sesión para acceder', 'Acceso denegado');
  router.navigate(['/login']);
  return false;
};

// 🔒 2. Guard Estricto: El que ya tenías, verifica que sea Administrador
export const adminGuard: CanActivateFn = (route, state) => {
  const loginService = inject(LoginService);
  const router = inject(Router);
  const toastr = inject(ToastrService);

  const token = localStorage.getItem('token');
  const usuarioActual = loginService.getUsuarioActual();

  if (!token || !usuarioActual) {
    toastr.error('Debe iniciar sesión para acceder', 'Acceso denegado');
    router.navigate(['/login']);
    return false;
  }

  // Convertimos temporalmente a 'any' para evitar la restricción estricta de TypeScript
  const rawAdmin: any = usuarioActual.isAdmin;
  const esAdmin = rawAdmin === true || rawAdmin === 1 || rawAdmin === 'true' || rawAdmin === '1';

  if (esAdmin) {
    return true; // ✅ Es administrador, acceso concedido
  }

  toastr.warning('No posee permisos de administrador para esta sección', 'Acceso restringido');
  router.navigate(['/lista']);
  return false;
};

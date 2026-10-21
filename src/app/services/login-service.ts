import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

import { UsuarioService } from './usuario-service';
import { Usuario } from '../clases/usuario';

@Injectable({
  providedIn: 'root',
})
export class LoginService {

  private router = inject(Router);
  private usuarioService = inject(UsuarioService);
  private toastr = inject(ToastrService);

  private isAdminSubject = new BehaviorSubject<boolean>(false);
  public isAdmin$ = this.isAdminSubject.asObservable();

  private errorSubject = new BehaviorSubject<boolean>(false);
  public error$ = this.errorSubject.asObservable();

  constructor() {
    this.checkAuth();
  }

  /**
   * Evalúa si un valor representa un rol de Administrador (1, '1', true, 'true')
   */
  public esAdminValido(valor: any): boolean {
    return valor === true || valor === 1 || valor === 'true' || valor === '1';
  }

  /**
   * Autentica credenciales contra el servidor Node.js/Express
   */
  login(email: string, password: string): Observable<any> {
    return this.usuarioService.logIn({ email, password }).pipe(
      tap({
        next: (response: any) => {
          if (response?.token) {
            localStorage.setItem('token', response.token);
          }

          if (response?.usuario) {
            localStorage.setItem('usuarioActual', JSON.stringify(response.usuario));
            const esAdmin = this.esAdminValido(response.usuario.isAdmin);
            localStorage.setItem('isAdmin', esAdmin.toString());
            this.isAdminSubject.next(esAdmin);
          } else {
            this.checkAuth();
          }

          this.errorSubject.next(false);
          this.toastr.success('Sesión iniciada correctamente', 'Éxito');
          this.router.navigate(['/lista']);
        },
        error: () => {
          this.isAdminSubject.next(false);
          this.errorSubject.next(true);
        }
      })
    );
  }

  establecerSesion(token: string, usuario: Usuario): void {
    const esAdmin = this.esAdminValido(usuario.isAdmin);

    localStorage.setItem('token', token);
    localStorage.setItem('usuarioActual', JSON.stringify(usuario));
    localStorage.setItem('isAdmin', esAdmin.toString());
    
    this.isAdminSubject.next(esAdmin);
    this.errorSubject.next(false);
  }

  logout(): void {
    this.isAdminSubject.next(false);
    this.errorSubject.next(false);

    localStorage.removeItem('token');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('usuarioActual');

    this.router.navigate(['/login']);
  }

  getIsAdmin(): boolean {
    if (typeof window !== 'undefined') {
      const usuario = this.getUsuarioActual();
      const rawIsAdmin = localStorage.getItem('isAdmin');
      return usuario ? this.esAdminValido(usuario.isAdmin) : this.esAdminValido(rawIsAdmin);
    }
    return false;
  }

  getUsuarioActual(): any | null {
    if (typeof window !== 'undefined') {
      const usuario = localStorage.getItem('usuarioActual');
      return usuario ? JSON.parse(usuario) : null;
    }
    return null;
  }

  checkAuth(): void {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      const usuario = this.getUsuarioActual();
      const rawIsAdmin = localStorage.getItem('isAdmin');

      if (token && usuario) {
        const esAdmin = this.esAdminValido(usuario.isAdmin) || this.esAdminValido(rawIsAdmin);
        this.isAdminSubject.next(esAdmin);
      } else {
        this.isAdminSubject.next(false);
      }
    }
  }

  getError(): Observable<boolean> {
    return this.error$;
  }
}

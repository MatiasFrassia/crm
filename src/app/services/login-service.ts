import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { BehaviorSubject, Observable } from 'rxjs';
import { UsuarioService } from './usuario-service';
import { Usuario } from '../clases/usuario';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class LoginService {

  

  private isAdminSubject = new BehaviorSubject<boolean>(false);
  public isAdmin$ = this.isAdminSubject.asObservable();
  
  private errorSubject = new BehaviorSubject<boolean>(false);
  public error$ = this.errorSubject.asObservable();
  
  private toastr = inject(ToastrService);

  constructor(private router: Router,
              private usuarioService: UsuarioService,
              private http: HttpClient) {
    if (typeof window !== 'undefined') {

      const isAdmin =
        localStorage.getItem('isAdmin') === 'true';
        console.log('LOCALSTORAGE AUTH:', isAdmin);

      this.isAdminSubject.next(isAdmin);

    }
  };

  getIsAdmin(): boolean {

  return (
    localStorage.getItem('isAdmin')
    === 'true'
  );

}

  getError(): Observable<boolean> {
    return this.error$;
  }

  login(email: string, password: string) {

  const usuarios = this.usuarioService.getUsuarios();

  const usuario = usuarios.find(
    usuario =>
      usuario.email === email &&
      usuario.password === password
  );

  if (usuario) {

    this.isAdminSubject.next(usuario.isAdmin);

    localStorage.setItem(
      'isAdmin',
      usuario.isAdmin.toString()
    );

    localStorage.setItem(
      'usuarioActual',
      JSON.stringify(usuario)
    );

    this.errorSubject.next(false);

    this.router.navigate(['/lista']);

  } else {

    this.isAdminSubject.next(false);

    this.errorSubject.next(true);

    this.toastr.error('Credenciales incorrectas', 'Error');

  }

}

  logout() {

  this.isAdminSubject.next(false);

  this.errorSubject.next(false);

  localStorage.removeItem('isAdmin');

  localStorage.removeItem('usuarioActual');

  this.router.navigate(['/login']);

}

getUsuarioActual(): Usuario | null {

  const usuario =
    localStorage.getItem('usuarioActual');

  return usuario
    ? JSON.parse(usuario)
    : null;

}

  checkAuth() {
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    this.isAdminSubject.next(isAdmin);
  }
}

import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { UsuarioService } from './usuario-service';
import { Usuario } from '../clases/usuario';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../../environments/firebase';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private router = inject(Router);
  private usuarioService = inject(UsuarioService);
  private toastr = inject(ToastrService);
  private http = inject(HttpClient);

  private isAdminSubject = new BehaviorSubject<boolean>(false);
  public isAdmin$ = this.isAdminSubject.asObservable();

  // 👈 NUEVO: Control para saber si es Cliente
  private isClienteSubject = new BehaviorSubject<boolean>(false);
  public isCliente$ = this.isClienteSubject.asObservable();

  private errorSubject = new BehaviorSubject<boolean>(false);
  public error$ = this.errorSubject.asObservable();

  constructor() {
    this.checkAuth();
  }

  public esAdminValido(valor: any): boolean {
    return valor === true || valor === 1 || valor === 'true' || valor === '1';
  }

  login(email: string, password: string): Observable<any> {
    return this.usuarioService.logIn({ email, password }).pipe(
      tap({
        next: (response: any) => {
          if (response?.token) localStorage.setItem('token', response.token);
          
          if (response?.usuario) {
            localStorage.setItem('usuarioActual', JSON.stringify(response.usuario));
            const esAdmin = this.esAdminValido(response.usuario.isAdmin);
            localStorage.setItem('isAdmin', esAdmin.toString());
            
            this.isAdminSubject.next(esAdmin);
            this.isClienteSubject.next(false); // Un usuario de DB no es cliente de Google
          } else {
            this.checkAuth();
          }

          this.errorSubject.next(false);
          this.toastr.success('Sesión iniciada correctamente', 'Éxito');
          this.router.navigate(['/lista']);
        },
        error: () => {
          this.isAdminSubject.next(false);
          this.isClienteSubject.next(false);
          this.errorSubject.next(true);
        }
      })
    );
  }

  loginConGoogle(): void {
    signInWithPopup(auth, googleProvider)
      .then((resultado) => {
        const user = resultado.user;
        const datosClienteFirebase = {
          email: user.email,
          nombre: user.displayName,
          uid: user.uid,
          telefono: user.phoneNumber || ''
        };

        this.http.post('http://localhost:3016/login-cliente-google', datosClienteFirebase).subscribe({
          next: (response: any) => {
            if (response?.token) {
              localStorage.setItem('token', response.token);
              localStorage.setItem('usuarioActual', JSON.stringify({ ...response.cliente, isCliente: true }));
              localStorage.setItem('isAdmin', 'false');
              
              this.isAdminSubject.next(false);
              this.isClienteSubject.next(true); // 👈 Activamos el modo cliente
              
              this.toastr.success('Bienvenido a sus Pedidos', 'Éxito');
              this.router.navigate(['/portal-cliente']);
            }
          },
          error: (err) => this.toastr.error('Error de servidor', 'Error')
        });
      })
      .catch((err) => this.toastr.error('Autenticación fallida', 'Error'));
  }

  establecerSesion(token: string, usuario: Usuario): void {
    const esAdmin = this.esAdminValido(usuario.isAdmin);
    localStorage.setItem('token', token);
    localStorage.setItem('usuarioActual', JSON.stringify(usuario));
    localStorage.setItem('isAdmin', esAdmin.toString());
    
    this.isAdminSubject.next(esAdmin);
    this.isClienteSubject.next((usuario as any).isCliente === true);
    this.errorSubject.next(false);
  }

  logout(): void {
    this.isAdminSubject.next(false);
    this.isClienteSubject.next(false);
    this.errorSubject.next(false);

    localStorage.removeItem('token');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('usuarioActual');

    this.router.navigate(['/login']);
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
        this.isClienteSubject.next(usuario.isCliente === true); // 👈 Mantiene el estado al recargar
      } else {
        this.isAdminSubject.next(false);
        this.isClienteSubject.next(false);
      }
    }
  }

  getIsAdmin(): boolean { return this.isAdminSubject.value; }
  getError(): Observable<boolean> { return this.error$; }
}

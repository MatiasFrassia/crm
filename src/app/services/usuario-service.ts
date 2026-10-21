import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../clases/usuario';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  // Inyección moderna de HttpClient
  private http = inject(HttpClient);

  // Normalizamos la URL base para asegurar que nunca se generen barras dobles (//)
  private AppUrl: string = environment.apiUrl.endsWith('/')
    ? environment.apiUrl.slice(0, -1)
    : environment.apiUrl;

  /**
   * Obtiene la lista completa de usuarios desde MySQL (Petición GET)
   */
  getAllUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.AppUrl}/getAllUsuarios`);
  }

  /**
   * Registra un nuevo usuario en la base de datos (Petición POST)
   */
  signIn(usuario: Usuario): Observable<any> {
    return this.http.post<any>(`${this.AppUrl}/register`, usuario);
  }

  /**
   * Autentica credenciales y devuelve el token JWT (Petición POST)
   */
  logIn(usuario: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.AppUrl}/login`, usuario);
  }

  /**
 * Edita la información de un usuario existente en la base de datos (Petición PUT)
 */
  editarUsuarioAPI(id: number, usuario: Usuario): Observable<any> {
    return this.http.put<any>(`${this.AppUrl}/updateUser/${id}`, usuario);
  }

  /**
   * Elimina un usuario por su ID de la base de datos (Petición DELETE)
   */
  eliminarUsuarioAPI(id: number): Observable<any> {
    return this.http.delete<any>(`${this.AppUrl}/deleteUser/${id}`);
  }
}

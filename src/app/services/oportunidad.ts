import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OportunidadService {
  private http = inject(HttpClient);

  // Normalizamos la URL base de la API
  private AppUrl: string = environment.apiUrl.endsWith('/')
    ? environment.apiUrl.slice(0, -1)
    : environment.apiUrl;

  /**
   * Obtiene todas las oportunidades registradas en MySQL (Petición GET)
   */
  getOportunidades(): Observable<any[]> {
    return this.http.get<any[]>(`${this.AppUrl}/oportunidades`);
  }

  /**
   * Obtiene las oportunidades filtradas por el usuario asignado (Petición GET)
   */
  getOportunidadesPorUsuario(idUsuario: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.AppUrl}/oportunidades/usuario/${idUsuario}`);
  }

  /**
   * Obtiene el detalle de una oportunidad específica por su ID (Petición GET)
   */
  getOportunidadPorId(id: number): Observable<any> {
    return this.http.get<any>(`${this.AppUrl}/oportunidades/${id}`);
  }

  /**
   * Registra una nueva oportunidad en MySQL (Petición POST)
   * Devuelve el objeto creado incluyendo el id_oportunidad generado por autoincremento.
   */
  crearOportunidad(oportunidad: any): Observable<any> {
    return this.http.post<any>(`${this.AppUrl}/oportunidades`, oportunidad);
  }

  /**
   * Actualiza una oportunidad existente en la base de datos (Petición PUT)
   */
  actualizarOportunidad(id: number, oportunidad: any): Observable<any> {
    return this.http.put<any>(`${this.AppUrl}/oportunidades/${id}`, oportunidad);
  }

  /**
   * Elimina una oportunidad por su ID (Petición DELETE)
   */
  eliminarOportunidad(id: number): Observable<any> {
    return this.http.delete<any>(`${this.AppUrl}/oportunidades/${id}`);
  }

  /**
   * Agrega un comentario o actualización de chat/historial a la oportunidad (Petición POST)
   */
  agregarComentario(idOportunidad: number, texto: string, idUsuario: number, archivo?: File): Observable<any> {
    const formData = new FormData();
    
    // 📄 Campos de texto primero
    formData.append('id_usuario', idUsuario.toString());
    formData.append('texto', texto || '');

    // 📄 Archivo físico opcional al final
    if (archivo) {
      formData.append('archivo', archivo);
    }

    return this.http.post(`${this.AppUrl}/oportunidades/${idOportunidad}/comentarios`, formData);
  }

}


import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3016'; 

  actualizarPerfil(id: number, datos: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/cliente/${id}`, datos);
  }

  getClientes(): Observable<any> {
    return this.http.get(`${this.apiUrl}/clientes`);
  }

  crearCliente(datos: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/cliente`, datos);
  }
}
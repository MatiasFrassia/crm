import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface CotizacionDolarResponse {
  oficial: { compra: number; venta: number };
  blue: { compra: number; venta: number };
}

@Injectable({
  providedIn: 'root'
})
export class DolarService {
  private http = inject(HttpClient);

  private AppUrl: string = environment.apiUrl.endsWith('/')
    ? environment.apiUrl.slice(0, -1)
    : environment.apiUrl;

  /**
   * Obtiene las cotizaciones del dólar desde nuestro backend Node.js
   */
  getCotizaciones(): Observable<CotizacionDolarResponse> {
    return this.http.get<CotizacionDolarResponse>(`${this.AppUrl}/dolarApi`);
  }
}

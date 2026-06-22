import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Dolar {
  private apiUrl =
    'https://dolarapi.com/v1/dolares/oficial';

  constructor(private http: HttpClient) {}
  
  obtenerDolarOficial(): Observable<Dolar> {
    return this.http.get<Dolar>(
      'https://dolarapi.com/v1/dolares/oficial'
    );
  }

  obtenerDolarBlue(): Observable<Dolar> {
    return this.http.get<Dolar>(
      'https://dolarapi.com/v1/dolares/blue'
    );
  }
  
}

export interface Dolar {
  moneda: string;
  casa: string;
  nombre: string;
  compra: number;
  venta: number;
  fechaActualizacion: string;
}

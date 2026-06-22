import { Injectable } from '@angular/core';
import { Oportunidad, Comentario } from '../clases/oportunidad';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OportunidadService {
  public oportunidades: Oportunidad[] = [];
  public comentarios: Object[] = [];
  //Se crea array de oportunidades

  

  getOportunidades(): Observable<Oportunidad[]> {
  return new Observable(observer => {

    setTimeout(() => {
      const data = localStorage.getItem('oportunidades');
      this.oportunidades = data ? JSON.parse(data) : [];

      observer.next(this.oportunidades);
      observer.complete();
    }, 3000); // ⏱️ 3 segundos de delay

  });
}

  //Se muestra contenido de Array de oportunidades

  agregarOportunidades(oportunidad: Oportunidad){
    const data = localStorage.getItem('oportunidades');

  this.oportunidades = data
    ? JSON.parse(data)
    : [];

  this.oportunidades.push(oportunidad);

  localStorage.setItem(
    'oportunidades',
    JSON.stringify(this.oportunidades)
  );
  }
  //Agrega Oportunidades al Array
  

  

}
export { Oportunidad };


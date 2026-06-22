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
     const data =
    localStorage.getItem('oportunidades');

  this.oportunidades =
    data ? JSON.parse(data) : [];

  oportunidad.id_oportunidad =
    this.generarNuevoId();

  this.oportunidades.push(oportunidad);

  localStorage.setItem(
    'oportunidades',
    JSON.stringify(this.oportunidades)
  );
  }
  //Agrega Oportunidades al Array
  

  //Genera un nuevo ID para cada oportunidad creada
  private generarNuevoId(): number {

  const data =
    localStorage.getItem('oportunidades');

  const oportunidades: Oportunidad[] =
    data ? JSON.parse(data) : [];

  if (oportunidades.length === 0) {
    return 1;
  }

  const ultimoId = Math.max(
    ...oportunidades.map(
      o => o.id_oportunidad
    )
  );

  return ultimoId + 1;
}

actualizarOportunidad(oportunidadActualizada: Oportunidad) {

  const data =
    localStorage.getItem('oportunidades');

  this.oportunidades =
    data ? JSON.parse(data) : [];

  const index =
    this.oportunidades.findIndex(
      o =>
        o.id_oportunidad ===
        oportunidadActualizada.id_oportunidad
    );

  if (index !== -1) {

    this.oportunidades[index] =
      oportunidadActualizada;

    localStorage.setItem(
      'oportunidades',
      JSON.stringify(this.oportunidades)
    );
  }
}

guardarCambios() {

  localStorage.setItem(
    'oportunidades',
    JSON.stringify(this.oportunidades)
  );

}

  

}
export { Oportunidad };


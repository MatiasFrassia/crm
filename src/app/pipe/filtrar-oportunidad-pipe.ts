import { Pipe, PipeTransform } from '@angular/core';
import { Oportunidad } from '../clases/oportunidad';

@Pipe({
  name: 'filtrarOportunidad',
})
export class FiltrarOportunidadPipe implements PipeTransform {
  transform(value: Array<Oportunidad>, filtro: string): Array<Oportunidad> {
    return value.filter((oportunidad) =>
      oportunidad.titulo_oportunidad.toLowerCase().includes(filtro.toLowerCase()) ||
      (oportunidad.producto??'').toLowerCase().includes(filtro.toLowerCase()) ||
      (oportunidad.cliente??'').toLowerCase().includes(filtro.toLowerCase()) ||
      (oportunidad.proveedor??'').toLowerCase().includes(filtro.toLowerCase()) ||
      (oportunidad.marca??'').toLowerCase().includes(filtro.toLowerCase())
    );
  }
    
  
}

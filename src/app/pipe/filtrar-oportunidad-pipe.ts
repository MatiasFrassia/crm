import { Pipe, PipeTransform } from '@angular/core';
import { Oportunidad } from '../clases/oportunidad';

@Pipe({
  name: 'filtrarOportunidad',
  standalone: true
})
export class FiltrarOportunidadPipe implements PipeTransform {

  transform(oportunidades: Oportunidad[], filtro: string): Oportunidad[] {
    if (!oportunidades || !filtro) {
      return oportunidades;
    }

    const textoFiltro = filtro.toLowerCase().trim();

    return oportunidades.filter(op => {
      const titulo = op.titulo_oportunidad?.toLowerCase() || '';
      const razonSocial = op.datosCliente?.razon_social?.toLowerCase() || '';
      const producto = op.producto?.toLowerCase() || '';
      const id = op.id_oportunidad?.toString() || op.id?.toString() || '';

      return titulo.includes(textoFiltro) ||
             razonSocial.includes(textoFiltro) ||
             producto.includes(textoFiltro) ||
             id.includes(textoFiltro);
    });
  }
}

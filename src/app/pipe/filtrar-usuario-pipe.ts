import { Pipe, PipeTransform } from '@angular/core';
import { Usuario } from '../clases/usuario';

@Pipe({
  name: 'filtrarUsuario',
})
export class FiltrarUsuarioPipe implements PipeTransform {
  transform(usuarios: Usuario[],
    filtro: string): Usuario[] {
     if (!filtro) {
      return usuarios;
    }

    filtro = filtro.toLowerCase();

    return usuarios.filter(usuario =>

      usuario.nombre.toLowerCase().includes(filtro) ||

      usuario.apellido.toLowerCase().includes(filtro) ||

      usuario.email.toLowerCase().includes(filtro) ||

      (usuario.isAdmin
        ? 'administrador'
        : 'usuario'
      ).includes(filtro)

    );
  }
}

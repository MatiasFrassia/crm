import { Pipe, PipeTransform } from '@angular/core';
import { Usuario } from '../clases/usuario';

@Pipe({
  name: 'filtrarUsuario',
  standalone: true // 1. Permite usarlo directamente en componentes Standalone
})
export class FiltrarUsuarioPipe implements PipeTransform {
  transform(usuarios: Usuario[] | null | undefined, filtro: string): Usuario[] {
    // 2. Control de asincronía: Si los datos de MySQL aún no llegaron, retornamos un arreglo vacío
    if (!usuarios || !Array.isArray(usuarios)) {
      return [];
    }

    // 3. Si no hay texto en el buscador, devolvemos la lista completa de la BD
    if (!filtro || !filtro.trim()) {
      return usuarios;
    }

    const texto = filtro.toLowerCase().trim();

    return usuarios.filter(usuario => {
      // 4. Control de valores nulos o indefinidos en columnas de la base de datos
      const nombre = usuario.nombre ? usuario.nombre.toLowerCase() : '';
      const apellido = usuario.apellido ? usuario.apellido.toLowerCase() : '';
      const email = usuario.email ? usuario.email.toLowerCase() : '';
      const rol = usuario.isAdmin ? 'administrador' : 'usuario';

      return (
        nombre.includes(texto) ||
        apellido.includes(texto) ||
        email.includes(texto) ||
        rol.includes(texto)
      );
    });
  }
}

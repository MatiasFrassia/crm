import { Pipe, PipeTransform } from '@angular/core';
import { Usuario } from '../clases/usuario';

@Pipe({
  name: 'filtrarUsuario',
  standalone: true 
})
export class FiltrarUsuarioPipe implements PipeTransform {
  transform(usuarios: Usuario[] | null | undefined, filtro: string): Usuario[] {
    
    if (!usuarios || !Array.isArray(usuarios)) {
      return [];
    }

    
    if (!filtro || !filtro.trim()) {
      return usuarios;
    }

    const texto = filtro.toLowerCase().trim();

    return usuarios.filter(usuario => {
      
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

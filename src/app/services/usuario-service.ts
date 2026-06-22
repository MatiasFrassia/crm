import { Injectable } from '@angular/core';
import { Usuario } from '../clases/usuario';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private STORAGE_KEY = 'usuarios';
  

  constructor() {

    // Si es la primera vez que corre el sistema
    // se crea un administrador por defecto

    const usuarios = localStorage.getItem(this.STORAGE_KEY);
    

    if (!usuarios) {
      

      const admin = new Usuario(
        1,
        'Administrador',
        'Sistema',
        'admin@admin.com',
        '1234',
        true
      );

      localStorage.setItem(
        this.STORAGE_KEY,
        JSON.stringify([admin])
      );
    }
  }

  /**
   * Obtiene todos los usuarios
   */
  getUsuarios(): Usuario[] {

    const data = localStorage.getItem(this.STORAGE_KEY);

    return data
      ? JSON.parse(data)
      : [];

  }

  /**
   * Obtiene un usuario por ID
   */
  getUsuarioById(id: number): Usuario | undefined {

    return this.getUsuarios().find(
      usuario => usuario.id_usuario === id
    );

  }

  /**
   * Obtiene un usuario por email
   */
  getUsuarioByEmail(email: string): Usuario | undefined {

    return this.getUsuarios().find(
      usuario => usuario.email === email
    );

  }

  /**
   * Genera el siguiente ID disponible
   */
  private generarNuevoId(): number {

    const usuarios = this.getUsuarios();

    if (usuarios.length === 0) {
      return 1;
    }

    const maxId = Math.max(
      ...usuarios.map(
        usuario => usuario.id_usuario
      )
    );

    return maxId + 1;
  }

  /**
   * Agrega un usuario
   */
  agregarUsuario(usuario: Usuario): void {

    const usuarios = this.getUsuarios();

    usuario.id_usuario =
      this.generarNuevoId();

    usuarios.push(usuario);

    localStorage.setItem(
      this.STORAGE_KEY,
      JSON.stringify(usuarios)
    );

  }

  /**
   * Edita un usuario
   */
  editarUsuario(usuarioEditado: Usuario): void {

    const usuarios = this.getUsuarios();

    const indice = usuarios.findIndex(
      usuario =>
        usuario.id_usuario === usuarioEditado.id_usuario
    );

    if (indice !== -1) {

      usuarios[indice] = usuarioEditado;

      localStorage.setItem(
        this.STORAGE_KEY,
        JSON.stringify(usuarios)
      );
    }
  }

  /**
   * Elimina un usuario
   */
  eliminarUsuario(id: number): void {

    const usuariosFiltrados =
      this.getUsuarios().filter(
        usuario =>
          usuario.id_usuario !== id
      );

    localStorage.setItem(
      this.STORAGE_KEY,
      JSON.stringify(usuariosFiltrados)
    );

  }
}

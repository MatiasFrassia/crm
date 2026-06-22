import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Usuario } from '../../clases/usuario';
import { UsuarioService } from '../../services/usuario-service';

@Component({
  selector: 'app-administrar-usuarios',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './administrar-usuarios.html',
  styleUrl: './administrar-usuarios.css'
})
export class AdministrarUsuariosComponent implements OnInit {

  usuarios: Usuario[] = [];

  modoEdicion = false;

  usuarioSeleccionadoId = 0;

  form = {
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    isAdmin: false
  };

  constructor(
    private usuarioService: UsuarioService
  ) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.usuarios = this.usuarioService.getUsuarios();
  }

  guardarUsuario(): void {

    if (this.modoEdicion) {

      const usuarioEditado = new Usuario(
        this.usuarioSeleccionadoId,
        this.form.nombre,
        this.form.apellido,
        this.form.email,
        this.form.password,
        this.form.isAdmin
      );

      this.usuarioService.editarUsuario(
        usuarioEditado
      );

    } else {

      const nuevoUsuario = new Usuario(
        0,
        this.form.nombre,
        this.form.apellido,
        this.form.email,
        this.form.password,
        this.form.isAdmin
      );

      this.usuarioService.agregarUsuario(
        nuevoUsuario
      );

    }

    this.limpiarFormulario();

    this.cargarUsuarios();
  }

  editar(usuario: Usuario): void {

    this.modoEdicion = true;

    this.usuarioSeleccionadoId =
      usuario.id_usuario;

    this.form.nombre =
      usuario.nombre;

    this.form.apellido =
      usuario.apellido;

    this.form.email =
      usuario.email;

    this.form.password =
      usuario.password;

    this.form.isAdmin =
      usuario.isAdmin;
  }

  eliminar(id: number): void {

    if (
      confirm(
        '¿Está seguro de eliminar este usuario?'
      )
    ) {

      this.usuarioService.eliminarUsuario(id);

      this.cargarUsuarios();

    }
  }

  cancelarEdicion(): void {

    this.limpiarFormulario();

  }

  limpiarFormulario(): void {

    this.form = {
      nombre: '',
      apellido: '',
      email: '',
      password: '',
      isAdmin: false
    };

    this.usuarioSeleccionadoId = 0;

    this.modoEdicion = false;

  }

}
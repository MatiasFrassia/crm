import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Usuario } from '../../clases/usuario';
import { UsuarioService } from '../../services/usuario-service';
import { FiltrarUsuarioPipe } from '../../pipe/filtrar-usuario-pipe';
import {ToastrService} from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-administrar-usuarios',
  standalone: true,
  imports: [FormsModule, FiltrarUsuarioPipe],
  templateUrl: './administrar-usuarios.html',
  styleUrl: './administrar-usuarios.css'
})
export class AdministrarUsuariosComponent implements OnInit {

  public usuarios: Usuario[] = [];
  public filtro: string = '';
  public modoEdicion = false;
  public usuarioSeleccionadoId = 0;

  private toastr = inject(ToastrService);

  
  form = {
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    isAdmin: false
  };

  constructor(
    private usuarioService: UsuarioService,
    private router: Router
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
      this.toastr.success('Usuario actualizado correctamente', 'Éxito');

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
      this.toastr.success('Usuario agregado correctamente', 'Éxito');
    }

    const user : Usuario = new Usuario(
      0,
      this.form.nombre,
      this.form.apellido,
      this.form.email,
      this.form.password,
      this.form.isAdmin
    );

    console.log('Usuario a guardar:', user);

    this.usuarioService.signIn(user).subscribe(data => {
      this.toastr.success('Usuario registrado en la API correctamente', 'Éxito');
    });
    

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
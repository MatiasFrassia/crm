import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Usuario } from '../../clases/usuario';
import { UsuarioService } from '../../services/usuario-service';
import { FiltrarUsuarioPipe } from '../../pipe/filtrar-usuario-pipe';
import { ToastrService } from 'ngx-toastr';
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
  public loading = false;

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
    // Al iniciar el componente, consultamos la base de datos
    this.cargarUsuarios();
  }

  /**
   * Obtiene la lista actualizada de usuarios desde la base de datos MySQL a través de la API.
   */
  cargarUsuarios(): void {
    this.loading = true;
    this.usuarioService.getAllUsuarios().subscribe({
      next: (data: Usuario[]) => {
        this.usuarios = data; // Guardamos los datos de la BD en la variable de la vista
        this.loading = false;
      },
      error: (e) => {
        this.toastr.error('Error al obtener la lista de usuarios desde la API', 'Error');
        console.error('Error al cargar usuarios:', e);
        this.loading = false;
      }
    });
  }

  /**
   * Envía la información del formulario a la API para crear o editar un usuario.
   */
  guardarUsuario(): void {
  if (
    !this.form.nombre.trim() || 
    !this.form.apellido.trim() || 
    !this.form.email.trim() || 
    (!this.modoEdicion && !this.form.password.trim())
  ) {
    this.toastr.warning('Por favor complete todos los campos requeridos', 'Campos vacíos');
    return;
  }

  this.loading = true;

  const userObj = new Usuario(
    this.usuarioSeleccionadoId,
    this.form.nombre,
    this.form.apellido,
    this.form.email,
    this.form.password,
    this.form.isAdmin
  );

  if (this.modoEdicion) {
    // 🟢 MODO EDICIÓN: Enviamos el ID guardado y el objeto
    this.usuarioService.editarUsuarioAPI(this.usuarioSeleccionadoId, userObj).subscribe({
      next: () => {
        this.toastr.success('Usuario actualizado correctamente', 'Éxito');
        this.limpiarFormulario();
        this.cargarUsuarios();
      },
      error: (e) => {
        this.toastr.error('Error al actualizar el usuario', 'Error');
        console.error(e);
        this.loading = false;
      }
    });
  } else {
    // 🔵 MODO CREACIÓN
    this.usuarioService.signIn(userObj).subscribe({
      next: () => {
        this.toastr.success('Usuario registrado correctamente', 'Éxito');
        this.limpiarFormulario();
        this.cargarUsuarios();
      },
      error: (e) => {
        this.toastr.error('Error al registrar el usuario', 'Error');
        console.error(e);
        this.loading = false;
      }
    });
  }
}

  editar(usuario: Usuario): void {
  this.modoEdicion = true;
  
  // Capturamos el ID asegurando compatibilidad con la clave primaria de MySQL
  this.usuarioSeleccionadoId = usuario.id_usuario || (usuario as any).id;

  this.form.nombre = usuario.nombre;
  this.form.apellido = usuario.apellido;
  this.form.email = usuario.email;
  this.form.password = ''; // Se deja limpia para no forzar cambio de clave
  this.form.isAdmin = usuario.isAdmin;
}

  eliminar(id: number): void {
    if (confirm('¿Está seguro de eliminar este usuario?')) {
      this.loading = true;
      this.usuarioService.eliminarUsuarioAPI(id).subscribe({
        next: () => {
          this.toastr.success('Usuario eliminado correctamente de la BD', 'Éxito');
          this.cargarUsuarios();
        },
        error: (e) => {
          this.toastr.error('Error al eliminar el usuario', 'Error');
          this.loading = false;
        }
      });
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
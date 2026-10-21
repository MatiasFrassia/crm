import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Usuario } from '../../clases/usuario';
import { UsuarioService } from '../../services/usuario-service';

@Component({
  selector: 'app-selector-usuario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './selector-usuario.html',
  styleUrl: './selector-usuario.css',
})
export class SelectorUsuario implements OnInit {

  public usuarios: Usuario[] = [];
  public usuariosFiltrados: Usuario[] = [];
  public textoBusqueda = '';

  @Output() usuarioSeleccionado = new EventEmitter<Usuario>();
  @Input() usuarioActual?: Usuario;

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    // 1. Carga asíncrona de usuarios desde la API MySQL
    this.usuarioService.getAllUsuarios().subscribe({
      next: (data: Usuario[]) => {
        this.usuarios = data;
      },
      error: (err) => console.error('Error al obtener usuarios:', err)
    });

    // 2. Inicialización del texto de búsqueda si ya hay un usuario asignado
    if (this.usuarioActual) {
      this.textoBusqueda = `${this.usuarioActual.nombre}${this.usuarioActual.apellido}`;
    }
  }

  /**
   * Filtra la lista de usuarios en tiempo real según el texto ingresado
   */
  filtrar(): void {
    const texto = this.textoBusqueda.trim().toLowerCase();

    if (!texto) {
      this.usuariosFiltrados = [];
      return;
    }

    this.usuariosFiltrados = this.usuarios.filter(usuario =>
      usuario.nombre.toLowerCase().includes(texto) ||
      usuario.apellido.toLowerCase().includes(texto) ||
      usuario.email.toLowerCase().includes(texto)
    );
  }

  /**
   * Selecciona un usuario del listado desplegable y emite el evento al padre
   */
  seleccionar(usuario: Usuario): void {
    this.textoBusqueda = `${usuario.nombre}${usuario.apellido}`;
    this.usuarioSeleccionado.emit(usuario);
    this.usuariosFiltrados = []; // Oculta el menú desplegable tras la selección
  }
}

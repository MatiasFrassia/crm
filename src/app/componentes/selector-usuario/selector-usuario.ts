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
    
    this.usuarioService.getAllUsuarios().subscribe({
      next: (data: Usuario[]) => {
        this.usuarios = data;
      },
      error: (err) => console.error('Error al obtener usuarios:', err)
    });

    
    if (this.usuarioActual) {
      this.textoBusqueda = `${this.usuarioActual.nombre}${this.usuarioActual.apellido}`;
    }
  }

  
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

  
  seleccionar(usuario: Usuario): void {
    this.textoBusqueda = `${usuario.nombre}${usuario.apellido}`;
    this.usuarioSeleccionado.emit(usuario);
    this.usuariosFiltrados = []; 
  }
}

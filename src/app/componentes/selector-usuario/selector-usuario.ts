import {
  Component,
  EventEmitter,
  Output,
  Input,
  OnInit
} from '@angular/core';

import { FormsModule } from '@angular/forms';

import { Usuario } from '../../clases/usuario';
import { UsuarioService } from '../../services/usuario-service';

@Component({
  selector: 'app-selector-usuario',
  imports: [FormsModule],
  templateUrl: './selector-usuario.html',
  styleUrl: './selector-usuario.css',
})
export class SelectorUsuario implements OnInit {
  public usuarios: Usuario[] = [];
  public usuariosFiltrados: Usuario[] = [];
  public textoBusqueda = '';

  @Output()
  usuarioSeleccionado = new EventEmitter<Usuario>();

  @Input()
  usuarioActual?: Usuario;

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit() {
     this.usuarios =
      this.usuarioService.getUsuarios();

    if (this.usuarioActual) {

      this.textoBusqueda =
        `${this.usuarioActual.nombre}
         ${this.usuarioActual.apellido}`;

    }
  }

  filtrar() {

    const texto =
      this.textoBusqueda.toLowerCase();

    this.usuariosFiltrados =
      this.usuarios.filter(usuario =>

        usuario.nombre
          .toLowerCase()
          .includes(texto)

        ||

        usuario.apellido
          .toLowerCase()
          .includes(texto)

        ||

        usuario.email
          .toLowerCase()
          .includes(texto)

      );

  }

  seleccionar(usuario: Usuario) {

    this.textoBusqueda =
      `${usuario.nombre}
       ${usuario.apellido}`;

    this.usuarioSeleccionado.emit(usuario);

    this.usuariosFiltrados = [];

  }
}

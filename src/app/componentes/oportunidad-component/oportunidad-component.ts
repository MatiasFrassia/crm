import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Oportunidad } from '../../clases/oportunidad';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OportunidadService } from '../../services/oportunidad';
import { take } from 'rxjs';
import { LoginService } from '../../services/login-service';
import { UsuarioService } from '../../services/usuario-service';
import { Usuario } from '../../clases/usuario';





@Component({
  selector: 'app-oportunidad-component',
  imports: [DatePipe, FormsModule],
  templateUrl: './oportunidad-component.html',
  styleUrl: './oportunidad-component.css',
})
export class OportunidadComponent {
  @Input() oportunidad!: Oportunidad;
  @Output() cerrar = new EventEmitter<void>();

  constructor(public oportunidadServices: OportunidadService,
              public usuarioService: UsuarioService,
              public loginService: LoginService
  ){}

  usuarios: Usuario[] = [];
  usuariosFiltrados: Usuario[] = [];
  nuevoComentario: string = '';

  ngOnInit() {

    this.usuarios = this.usuarioService.getUsuarios();

  }

  agregarComentario() {

  if (!this.nuevoComentario.trim()) {
    return;
  }

  this.oportunidad.comentarios.push({

    texto: this.nuevoComentario,

    fecha: new Date()

  });

  this.oportunidad.fecha_actualizacion =
    new Date();

  this.oportunidadServices.actualizarOportunidad(
    this.oportunidad
  );

  this.nuevoComentario = '';

}

  guardar() {

  this.oportunidad.fecha_actualizacion =
    new Date();

  this.oportunidadServices.actualizarOportunidad(
    this.oportunidad
  );

}
}

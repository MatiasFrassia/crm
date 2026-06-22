import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Comentario, Oportunidad } from '../../clases/oportunidad';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OportunidadService } from '../../services/oportunidad';
import { take } from 'rxjs';





@Component({
  selector: 'app-oportunidad-component',
  imports: [DatePipe, FormsModule],
  templateUrl: './oportunidad-component.html',
  styleUrl: './oportunidad-component.css',
})
export class OportunidadComponent {
  @Input() oportunidad!: Oportunidad;
  @Output() cerrar = new EventEmitter<void>();

  constructor(public oportunidadServices: OportunidadService){}

 
  nuevoComentario: string = '';

  

  agregarComentario() {
  if (this.nuevoComentario.trim() === '') return;

  this.oportunidad.comentarios.push({
    texto: this.nuevoComentario,
    fecha: new Date()
  });

  this.oportunidadServices.getOportunidades().subscribe(oportunidades => {

    const index = oportunidades.findIndex(
      (o: Oportunidad) => o.titulo_oportunidad === this.oportunidad.titulo_oportunidad
    );

    if (index !== -1) {
      oportunidades[index] = this.oportunidad;
    }

    localStorage.setItem('oportunidades', JSON.stringify(oportunidades));
  });

  this.nuevoComentario = '';
  }

  guardar() {

  // actualizar fecha
  this.oportunidad.fecha_actualizacion = new Date();

  this.oportunidadServices.getOportunidades()
    .pipe(take(1))
    .subscribe(oportunidades => {

      const index = oportunidades.findIndex(
        o => o.titulo_oportunidad === this.oportunidad.titulo_oportunidad
      );

      if (index !== -1) {
        oportunidades[index] = this.oportunidad;
      }

      localStorage.setItem('oportunidades', JSON.stringify(oportunidades));
    });
}
}

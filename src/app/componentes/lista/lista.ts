import { Component, OnInit, inject } from '@angular/core';
import { DatePipe, CommonModule } from '@angular/common';
import { RouterLink } from "@angular/router";
import { FormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';

import { OportunidadService } from '../../services/oportunidad';
import { Oportunidad } from '../../clases/oportunidad';
import { OportunidadComponent } from '../oportunidad-component/oportunidad-component';
import { FiltrarOportunidadPipe } from "../../pipe/filtrar-oportunidad-pipe";
import { LoginService } from '../../services/login-service';

@Component({
  selector: 'app-lista',
  standalone: true,
  imports: [
    DatePipe, 
    CommonModule, 
    RouterLink, 
    OportunidadComponent, 
    FiltrarOportunidadPipe, 
    FormsModule
  ],
  templateUrl: './lista.html',
  styleUrl: './lista.css',
})
export class Lista implements OnInit {

  public oportunidades$!: Observable<Oportunidad[]>;
  public oportunidadSeleccionada: any | null = null;
  public filtro: string = '';
  public esAdmin: boolean = false;

  private oportunidadServices = inject(OportunidadService);
  private loginService = inject(LoginService);

  ngOnInit(): void {
    this.cargarOportunidades();
  }

  cargarOportunidades(): void {
    const usuarioActual = this.loginService.getUsuarioActual();
    this.esAdmin = this.loginService.getIsAdmin();

    if (!usuarioActual) {
      this.oportunidades$ = of([]);
      return;
    }

    if (this.esAdmin) {
      // 👑 Administrador: Obtiene la totalidad de oportunidades desde la BD
      this.oportunidades$ = this.oportunidadServices.getOportunidades();
    } else {
      // 👤 Usuario Estándar: Obtiene únicamente las oportunidades asignadas
      const idUsuario = usuarioActual.id_usuario || usuarioActual.id;
      
      if (idUsuario) {
        this.oportunidades$ = this.oportunidadServices.getOportunidadesPorUsuario(idUsuario);
      } else {
        this.oportunidades$ = of([]);
      }
    }
  }

  abrirOportunidad(op: any): void {
    this.oportunidadSeleccionada = op;
  }

  cerrar(): void {
    this.oportunidadSeleccionada = null;
    this.cargarOportunidades(); // Refresca la lista tras cerrar el popup por si hubo ediciones
  }
}

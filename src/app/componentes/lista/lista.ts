import { DatePipe } from '@angular/common';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from "@angular/router";
import { OportunidadService } from '../../services/oportunidad';
import { Oportunidad } from '../../clases/oportunidad';
import { OportunidadComponent } from '../oportunidad-component/oportunidad-component';
import { map, Observable} from 'rxjs';
import { FiltrarOportunidadPipe } from "../../pipe/filtrar-oportunidad-pipe";
import { FormsModule } from '@angular/forms';
import { LoginService } from '../../services/login-service';


@Component({
  selector: 'app-lista',
  imports: [DatePipe, CommonModule, RouterLink, OportunidadComponent, FiltrarOportunidadPipe, FormsModule],
  templateUrl: './lista.html',
  styleUrl: './lista.css',
})
export class Lista implements OnInit{

  oportunidades$!: Observable<Oportunidad[]>;
  
  oportunidadSeleccionada: Oportunidad | null = null;
  public filtro: string | undefined;
  

  constructor(public oportunidadServices: OportunidadService,
              private loginService: LoginService
  ){}

  ngOnInit(): void {
    this.oportunidades$ = this.oportunidadServices.getOportunidades();
    console.log(this.oportunidades$);

    const usuarioActual =
    this.loginService.getUsuarioActual();

  if (!usuarioActual) {
    return;
  }

  if (usuarioActual.isAdmin) {

    this.oportunidades$ =
      this.oportunidadServices.getOportunidades();

  } else {

    this.oportunidades$ =
      this.oportunidadServices
        .getOportunidades()
        .pipe(

          map(oportunidades =>

            oportunidades.filter(op =>

              op.usuario_asignado.id_usuario ===
              usuarioActual.id_usuario

            )

          )

        );

  }
  }

  abrirOportunidad(op: Oportunidad) {
    this.oportunidadSeleccionada = op;
    console.log(this.oportunidadSeleccionada);
  }

  cerrar() {
  this.oportunidadSeleccionada = null;
  }
}

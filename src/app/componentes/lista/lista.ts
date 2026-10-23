import { Component, OnInit, inject } from '@angular/core';
import { DatePipe, CommonModule } from '@angular/common';
import { RouterLink } from "@angular/router";
import { FormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { take } from 'rxjs/operators';

import { OportunidadService } from '../../services/oportunidad';
import { Oportunidad } from '../../clases/oportunidad';
import { OportunidadComponent } from '../oportunidad-component/oportunidad-component';
import { FiltrarOportunidadPipe } from "../../pipe/filtrar-oportunidad-pipe";
import { LoginService } from '../../services/login-service';
import { ToastrService } from 'ngx-toastr';

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
  private toastr = inject(ToastrService);
  
  private pipeFiltro = new FiltrarOportunidadPipe(); 

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
      this.oportunidades$ = this.oportunidadServices.getOportunidades();
    } else {
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
    this.cargarOportunidades(); 
  }

  /**
   * 🌟 Exporta la vista actual a un archivo CSV (Formato Excel Español)
   */
  exportarCSV(): void {
    this.oportunidades$.pipe(take(1)).subscribe({
      next: (oportunidades) => {
        const datos = oportunidades || [];
        
        // 1. Aplicamos el mismo filtro visualizado en pantalla
        const datosFiltrados = this.pipeFiltro.transform(datos, this.filtro);

        if (datosFiltrados.length === 0) {
          this.toastr.warning('No hay datos visibles para exportar', 'Atención');
          return;
        }

        // 2. Definir cabeceras del CSV
        const cabeceras = ['ID', 'Título', 'Marca', 'Cliente', 'Producto', 'Última Actualización'];

        // 3. Formatear y escapar las filas para evitar roturas
        const filas = datosFiltrados.map((op: any) => {
          const id = op.id_oportunidad || op.id || '';
          const titulo = op.titulo_oportunidad || '';
          const marca = op.marca || '';
          const cliente = op.cliente || '';
          const producto = op.producto || '';
          
          const fechaRaw = op.updatedAt || op.fecha_actualizacion;
          const fecha = fechaRaw ? new Date(fechaRaw).toLocaleString() : '';

          // Escapar comillas dobles internamente y envolver la celda en comillas
          return [
            `"${id}"`,
            `"${titulo.toString().replace(/"/g, '""')}"`,
            `"${marca.toString().replace(/"/g, '""')}"`,
            `"${cliente.toString().replace(/"/g, '""')}"`,
            `"${producto.toString().replace(/"/g, '""')}"`,
            `"${fecha}"`
          ].join(';'); // 👈 Se cambia ',' por ';' para que Excel lo separe en columnas
        });

        // 4. Construir contenido (Añadimos \ufeff para compatibilidad de tildes en Excel)
        const csvContent = '\ufeff' + cabeceras.join(';') + '\n' + filas.join('\n'); // 👈 Se cambia ',' por ';'
        
        // 5. Crear blob interactivo y forzar descarga
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const enlaceDescarga = document.createElement('a');
        
        enlaceDescarga.href = url;
        enlaceDescarga.download = `Oportunidades_Exportadas_${new Date().getTime()}.csv`;
        enlaceDescarga.click();
        
        window.URL.revokeObjectURL(url); // Liberar memoria
        this.toastr.success('Archivo exportado correctamente', 'Éxito');
      },
      error: () => {
        this.toastr.error('Error al preparar los datos para exportar', 'Error');
      }
    });
  }
}
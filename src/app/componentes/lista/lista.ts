import { Component, OnInit, inject } from '@angular/core';
import { DatePipe, CommonModule } from '@angular/common';
import { RouterLink } from "@angular/router";
import { FormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, take } from 'rxjs/operators';
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

    
    const request = this.esAdmin 
      ? this.oportunidadServices.getOportunidades() 
      : this.oportunidadServices.getOportunidadesPorUsuario(usuarioActual.id_usuario || usuarioActual.id);

    
    this.oportunidades$ = request.pipe(
      map((ops: any[]) => ops.filter(op => Number(op.avance_proyecto) !== 0 && Number(op.avance_proyecto) !== 100))
    );
  }

  abrirOportunidad(op: any): void {
    this.oportunidadSeleccionada = op;
  }

  cerrar(): void {
    this.oportunidadSeleccionada = null;
    this.cargarOportunidades(); 
  }

  
  getAvanceTexto(avance: number | undefined): string {
    
    const val = avance !== undefined && avance !== null ? Number(avance) : 1;
    switch(val) {
      case 1: return 'Inicial';
      case 30: return 'En progreso';
      case 60: return 'Best case';
      case 90: return 'Compromiso';
      case 100: return 'Ganado';
      case 0: return 'Perdida';
      default: return 'Desconocido';
    }
  }

  getBadgeClass(avance: number | undefined): string {
    const val = avance !== undefined && avance !== null ? Number(avance) : 1;
    switch(val) {
      case 1: return 'badge-inicial';
      case 30: return 'badge-progreso';
      case 60: return 'badge-bestcase';
      case 90: return 'badge-compromiso';
      case 100: return 'badge-ganado';
      case 0: return 'badge-perdida';
      default: return 'badge-default';
    }
  }

  exportarCSV(): void {
    this.oportunidades$.pipe(take(1)).subscribe({
      next: (oportunidades) => {
        const datos = oportunidades || [];
        const datosFiltrados = this.pipeFiltro.transform(datos, this.filtro);

        if (datosFiltrados.length === 0) {
          this.toastr.warning('No hay datos visibles para exportar', 'Atención');
          return;
        }

        
        const cabeceras = ['ID', 'Título', 'Marca', 'Cliente', 'Producto', 'Estado', 'Última Actualización', 'Asignado a'];

        const filas = datosFiltrados.map((op: any) => {
          const id = op.id_oportunidad || op.id || '';
          const titulo = op.titulo_oportunidad || '';
          const marca = op.marca || '';
          const cliente = op.datosCliente?.razon_social || ''; // 👈 Ahora lee el cliente relacional
          const producto = op.producto || '';
          const estado = this.getAvanceTexto(op.avance_proyecto);
          
          const fechaRaw = op.updatedAt; // 👈 Sequelize usa updatedAt
          const fecha = fechaRaw ? new Date(fechaRaw).toLocaleString() : '';
          
          const asignado = op.usuarioAsignado ? `${op.usuarioAsignado.nombre} ${op.usuarioAsignado.apellido}`.trim() : '';

          return [
            `"${id}"`,
            `"${titulo.toString().replace(/"/g, '""')}"`,
            `"${marca.toString().replace(/"/g, '""')}"`,
            `"${cliente.toString().replace(/"/g, '""')}"`,
            `"${producto.toString().replace(/"/g, '""')}"`,
            `"${estado}"`,
            `"${fecha}"`,
            `"${asignado}"`
          ].join(';'); 
        });

        const csvContent = '\ufeff' + cabeceras.join(';') + '\n' + filas.join('\n'); 
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const enlaceDescarga = document.createElement('a');
        
        enlaceDescarga.href = url;
        enlaceDescarga.download = `Oportunidades_Exportadas_${new Date().getTime()}.csv`;
        enlaceDescarga.click();
        
        window.URL.revokeObjectURL(url); 
        this.toastr.success('Archivo exportado correctamente', 'Éxito');
      },
      error: () => {
        this.toastr.error('Error al preparar los datos para exportar', 'Error');
      }
    });
  }
}
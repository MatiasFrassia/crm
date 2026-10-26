import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OportunidadService } from '../../services/oportunidad';
import { LoginService } from '../../services/login-service';
import { OportunidadComponent } from '../oportunidad-component/oportunidad-component';

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [CommonModule, DatePipe, FormsModule, OportunidadComponent],
  templateUrl: './historial-oportunidades.html',
  styleUrl: './historial-oportunidades.css'
})
export class HistorialComponent implements OnInit {
  public oportunidadesHistorial: any[] = [];
  public listaFiltrada: any[] = [];
  public oportunidadSeleccionada: any | null = null;
  public filtro: string = '';
  public esAdmin: boolean = false;

  private oportunidadService = inject(OportunidadService);
  private loginService = inject(LoginService);

  ngOnInit(): void {
    this.esAdmin = this.loginService.getIsAdmin();
    this.cargarHistorial();
  }

  cargarHistorial(): void {
    const usuarioActual = this.loginService.getUsuarioActual();
    const idUsuario = usuarioActual?.id_usuario || usuarioActual?.id;

    
    const request = this.esAdmin 
      ? this.oportunidadService.getOportunidades() 
      : this.oportunidadService.getOportunidadesPorUsuario(idUsuario);

    request.subscribe({
      next: (data) => {
        
        this.oportunidadesHistorial = data.filter(op => Number(op.avance_proyecto) === 0 || Number(op.avance_proyecto) === 100);
        this.listaFiltrada = this.oportunidadesHistorial;
      },
      error: (err) => console.error('Error al cargar historial:', err)
    });
  }

  filtrar(): void {
    const texto = this.filtro.toLowerCase().trim();
    if (!texto) {
      this.listaFiltrada = this.oportunidadesHistorial;
      return;
    }
    this.listaFiltrada = this.oportunidadesHistorial.filter(op => 
      op.titulo_oportunidad?.toLowerCase().includes(texto) ||
      op.datosCliente?.razon_social?.toLowerCase().includes(texto) ||
      op.producto?.toLowerCase().includes(texto) ||
      op.id_oportunidad?.toString().includes(texto)
    );
  }

  abrirOportunidad(op: any): void {
    this.oportunidadSeleccionada = op;
  }

  cerrar(): void {
    this.oportunidadSeleccionada = null;
    this.cargarHistorial();
  }

  getAvanceTexto(avance: number): string {
    return Number(avance) === 100 ? 'Ganado' : 'Perdida';
  }

  getBadgeClass(avance: number): string {
    return Number(avance) === 100 ? 'badge-ganado' : 'badge-perdida';
  }
}
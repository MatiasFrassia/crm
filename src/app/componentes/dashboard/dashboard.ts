import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';

import { OportunidadService } from '../../services/oportunidad';
import { LoginService } from '../../services/login-service';
import { UsuarioService } from '../../services/usuario-service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {
  private oportunidadService = inject(OportunidadService);
  private loginService = inject(LoginService);
  private usuarioService = inject(UsuarioService);

  public esAdmin = false;
  public cargando = true;

  // 📊 GRÁFICO 1: Estados (Para TODOS)
  public chartEstadoType: ChartType = 'doughnut';
  public chartEstadoData: ChartData<'doughnut'> = {
    labels: ['Perdida', 'Inicial', 'En Progreso', 'Best Case', 'Compromiso', 'Ganado'],
    datasets: [{ data: [0, 0, 0, 0, 0, 0], backgroundColor: ['#ef4444', '#94a3b8', '#3b82f6', '#8b5cf6', '#eab308', '#10b981'] }]
  };

  // 📊 GRÁFICO 2: Oportunidades por Usuario (Solo ADMIN)
  public chartUsuarioType: ChartType = 'bar';
  public chartUsuarioData: ChartData<'bar'> = {
    labels: [],
    datasets: [{ data: [], label: 'Oportunidades Asignadas', backgroundColor: '#3b82f6' }]
  };

  // 📊 GRÁFICO 3: Productos más solicitados (Solo ADMIN)
  public chartProductoType: ChartType = 'pie';
  public chartProductoData: ChartData<'pie'> = {
    labels: [],
    datasets: [{ data: [] }]
  };

  public chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
  };

  ngOnInit(): void {
    this.esAdmin = this.loginService.getIsAdmin();
    const usuarioActual = this.loginService.getUsuarioActual();
    const idUsuario = Number(usuarioActual?.id_usuario || usuarioActual?.id);

    if (this.esAdmin) {
      // Admin: Trae Oportunidades y Usuarios en paralelo
      forkJoin({
        oportunidades: this.oportunidadService.getOportunidades(),
        usuarios: this.usuarioService.getAllUsuarios()
      }).subscribe({
        next: (res) => {
          this.procesarEstados(res.oportunidades);
          this.procesarUsuarios(res.oportunidades, res.usuarios);
          this.procesarProductos(res.oportunidades);
          this.cargando = false;
        }
      });
    } else {
      // Normal: Trae solo sus oportunidades
      this.oportunidadService.getOportunidadesPorUsuario(idUsuario).subscribe({
        next: (oportunidades) => {
          this.procesarEstados(oportunidades);
          this.cargando = false;
        }
      });
    }
  }

  private procesarEstados(ops: any[]): void {
    let conteo = [0, 0, 0, 0, 0, 0];
    ops.forEach(op => {
      const av = Number(op.avance_proyecto);
      if (av === 0) conteo[0]++;
      else if (av === 1) conteo[1]++;
      else if (av === 30) conteo[2]++;
      else if (av === 60) conteo[3]++;
      else if (av === 90) conteo[4]++;
      else if (av === 100) conteo[5]++;
    });
    this.chartEstadoData.datasets[0].data = conteo;
    this.chartEstadoData = { ...this.chartEstadoData };
  }

  private procesarUsuarios(ops: any[], usuarios: any[]): void {
    const mapaUsr: Record<string, number> = {};
    ops.forEach(op => {
      const idAsignado = op.id_usuario_asignado;
      if (idAsignado) {
        const usr = usuarios.find(u => u.id_usuario === idAsignado);
        const nombre = usr ? `${usr.nombre} ${usr.apellido}` : `ID ${idAsignado}`;
        mapaUsr[nombre] = (mapaUsr[nombre] || 0) + 1;
      }
    });
    this.chartUsuarioData.labels = Object.keys(mapaUsr);
    this.chartUsuarioData.datasets[0].data = Object.values(mapaUsr);
    this.chartUsuarioData = { ...this.chartUsuarioData };
  }

  private procesarProductos(ops: any[]): void {
    const mapaProd: Record<string, number> = {};
    ops.forEach(op => {
      const prod = op.producto?.trim().toUpperCase() || 'SIN ESPECIFICAR';
      mapaProd[prod] = (mapaProd[prod] || 0) + 1;
    });
    this.chartProductoData.labels = Object.keys(mapaProd);
    this.chartProductoData.datasets[0].data = Object.values(mapaProd);
    this.chartProductoData = { ...this.chartProductoData };
  }
}
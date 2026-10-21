import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DolarService, CotizacionDolarResponse } from '../../services/dolar';

@Component({
  selector: 'app-cotizacion-dolar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cotizacion-dolar.html',
  styleUrl: './cotizacion-dolar.css'
})
export class CotizacionDolar implements OnInit {
  public cotizacion: CotizacionDolarResponse | null = null;
  public loading: boolean = true;
  public error: boolean = false;

  private dolarService = inject(DolarService);

  ngOnInit(): void {
    this.obtenerCotizaciones();
  }

  obtenerCotizaciones(): void {
    this.loading = true;
    this.error = false;

    this.dolarService.getCotizaciones().subscribe({
      next: (data) => {
        this.cotizacion = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al obtener la cotización:', err);
        this.loading = false;
        this.error = true;
      }
    });
  }
}
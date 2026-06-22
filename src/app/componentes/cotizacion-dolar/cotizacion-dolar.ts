import { Component, OnInit } from '@angular/core';
import { Dolar } from '../../services/dolar';

@Component({
  selector: 'app-cotizacion-dolar',
  imports: [],
  templateUrl: './cotizacion-dolar.html',
  styleUrl: './cotizacion-dolar.css',
})
export class CotizacionDolar implements OnInit {
  dolarOficial?: Dolar;
  dolarBlue?: Dolar;

  constructor(
    private dolarService: Dolar
  ) {}

  ngOnInit(): void {

    this.dolarService.obtenerDolarOficial().subscribe({
      next: (dolar) => {
        this.dolarOficial = dolar;
      }
    });

    this.dolarService.obtenerDolarBlue().subscribe({
      next: (dolar) => {
        this.dolarBlue = dolar;
      }
    });

  }
}

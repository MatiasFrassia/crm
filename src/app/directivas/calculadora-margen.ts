import { Directive, ElementRef, EventEmitter, HostListener, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[appCalculadoraMargen]',
  standalone: true
})
export class CalculadoraMargenDirective implements OnChanges {
  
  @Input() montoEstimado: any;
  @Output() precioCalculado = new EventEmitter<number>();

  constructor(private el: ElementRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['montoEstimado']) {
      this.calcular();
    }
  }

  @HostListener('input')
  calcular() {
    const margenTexto = this.el.nativeElement.value;
    const margen = parseFloat(margenTexto);
    
    const montoLimpio = String(this.montoEstimado || '0')
      .replace(/\./g, '') 
      .replace(',', '.')  
      .replace(/[^0-9.-]+/g, ''); 
      
    const monto = parseFloat(montoLimpio) || 0;

    if (!isNaN(margen) && !isNaN(monto)) {
      const precioFinal = monto + (monto * (margen / 100));
      
      setTimeout(() => {
        this.precioCalculado.emit(Number(precioFinal.toFixed(2)));
      });
    } else if (isNaN(margen) && !isNaN(monto)) {
      
      setTimeout(() => {
        this.precioCalculado.emit(monto);
      });
    }
  }
}
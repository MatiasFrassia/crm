import { Directive, ElementRef, HostListener, OnInit } from '@angular/core';

@Directive({
  selector: '[appInputMoneda]',
  standalone: true
})
export class InputMonedaDirective implements OnInit {

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    // Le damos un respiro a Angular para que cargue el valor inicial de la base de datos
    setTimeout(() => this.formatear(), 100);
  }

  // 🖱️ Al hacer clic (Focus): Quitamos el formato para facilitar la edición
  @HostListener('focus')
  onFocus(): void {
    let valor = this.el.nativeElement.value;
    if (valor && valor.includes('$')) {
      // Convertimos "$ 1.500,50" a "1500.50" para que sea editable
      valor = valor.replace(/\./g, '').replace(',', '.').replace(/[^0-9.-]+/g, '');
      this.el.nativeElement.value = valor;
    }
  }

  // 🚪 Al salir del input (Blur): Aplicamos el formato visual
  @HostListener('blur')
  onBlur(): void {
    this.formatear();
  }

  private formatear(): void {
    let valor = this.el.nativeElement.value;
    if (!valor || valor.includes('$')) return; // Evita formatear dos veces

    const numero = parseFloat(valor);
    if (!isNaN(numero)) {
      // API nativa de JavaScript para formatear moneda local
      this.el.nativeElement.value = new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS'
      }).format(numero);
    }
  }
}
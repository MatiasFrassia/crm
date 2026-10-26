import { Directive, ElementRef, HostListener, OnInit } from '@angular/core';

@Directive({
  selector: '[appInputMoneda]',
  standalone: true
})
export class InputMonedaDirective implements OnInit {

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    
    setTimeout(() => this.formatear(), 100);
  }

  
  @HostListener('focus')
  onFocus(): void {
    let valor = this.el.nativeElement.value;
    if (valor && valor.includes('$')) {
      
      valor = valor.replace(/\./g, '').replace(',', '.').replace(/[^0-9.-]+/g, '');
      this.el.nativeElement.value = valor;
    }
  }

  
  @HostListener('blur')
  onBlur(): void {
    this.formatear();
  }

  private formatear(): void {
    let valor = this.el.nativeElement.value;
    if (!valor || valor.includes('$')) return; 

    const numero = parseFloat(valor);
    if (!isNaN(numero)) {
      
      this.el.nativeElement.value = new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS'
      }).format(numero);
    }
  }
}
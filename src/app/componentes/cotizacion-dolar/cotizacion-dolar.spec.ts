import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CotizacionDolar } from './cotizacion-dolar';

describe('CotizacionDolar', () => {
  let component: CotizacionDolar;
  let fixture: ComponentFixture<CotizacionDolar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CotizacionDolar],
    }).compileComponents();

    fixture = TestBed.createComponent(CotizacionDolar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

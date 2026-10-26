import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorialOportunidades } from './historial-oportunidades';

describe('HistorialOportunidades', () => {
  let component: HistorialOportunidades;
  let fixture: ComponentFixture<HistorialOportunidades>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistorialOportunidades],
    }).compileComponents();

    fixture = TestBed.createComponent(HistorialOportunidades);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

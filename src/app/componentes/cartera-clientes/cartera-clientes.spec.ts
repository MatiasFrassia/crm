import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarteraClientes } from './cartera-clientes';

describe('CarteraClientes', () => {
  let component: CarteraClientes;
  let fixture: ComponentFixture<CarteraClientes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarteraClientes],
    }).compileComponents();

    fixture = TestBed.createComponent(CarteraClientes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

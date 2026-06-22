import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevaOportunidad } from './nueva-oportunidad';

describe('NuevaOportunidad', () => {
  let component: NuevaOportunidad;
  let fixture: ComponentFixture<NuevaOportunidad>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NuevaOportunidad],
    }).compileComponents();

    fixture = TestBed.createComponent(NuevaOportunidad);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

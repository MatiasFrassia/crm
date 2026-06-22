import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OportunidadComponent } from './oportunidad-component';

describe('OportunidadComponent', () => {
  let component: OportunidadComponent;
  let fixture: ComponentFixture<OportunidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OportunidadComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OportunidadComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectorUsuario } from './selector-usuario';

describe('SelectorUsuario', () => {
  let component: SelectorUsuario;
  let fixture: ComponentFixture<SelectorUsuario>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectorUsuario],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectorUsuario);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

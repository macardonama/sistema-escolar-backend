import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignacionesAcademicas } from './asignaciones-academicas';

describe('AsignacionesAcademicas', () => {
  let component: AsignacionesAcademicas;
  let fixture: ComponentFixture<AsignacionesAcademicas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsignacionesAcademicas],
    }).compileComponents();

    fixture = TestBed.createComponent(AsignacionesAcademicas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

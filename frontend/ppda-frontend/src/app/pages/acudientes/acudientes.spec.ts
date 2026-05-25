import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcudientesComponent } from './acudientes';

describe('Acudientes', () => {
  let component: AcudientesComponent;
  let fixture: ComponentFixture<AcudientesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcudientesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AcudientesComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

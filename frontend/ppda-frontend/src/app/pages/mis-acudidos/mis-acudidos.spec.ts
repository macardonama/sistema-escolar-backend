import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MisAcudidos } from './mis-acudidos';

describe('MisAcudidos', () => {
  let component: MisAcudidos;
  let fixture: ComponentFixture<MisAcudidos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MisAcudidos],
    }).compileComponents();

    fixture = TestBed.createComponent(MisAcudidos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { Observaciones } from './observaciones';

describe('Observaciones', () => {
  let service: Observaciones;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Observaciones);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { AcudientesService } from './acudientes';

describe('Acudientes', () => {
  let service: AcudientesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AcudientesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

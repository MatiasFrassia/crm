import { TestBed } from '@angular/core/testing';

import { Errors } from './errors';

describe('Errors', () => {
  let service: Errors;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Errors);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

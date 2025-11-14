import { TestBed } from '@angular/core/testing';

import { PaymenthMethods } from './paymenth-methods';

describe('PaymenthMethods', () => {
  let service: PaymenthMethods;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaymenthMethods);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

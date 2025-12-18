import { TestBed } from '@angular/core/testing';

import { Returns } from './returns';

describe('Returns', () => {
  let service: Returns;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Returns);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

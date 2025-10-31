import { TestBed } from '@angular/core/testing';

import { BoxRegister } from './box-register';

describe('BoxRegister', () => {
  let service: BoxRegister;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BoxRegister);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

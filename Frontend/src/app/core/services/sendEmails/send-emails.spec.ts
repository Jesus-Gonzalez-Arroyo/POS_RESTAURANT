import { TestBed } from '@angular/core/testing';

import { SendEmails } from './send-emails';

describe('SendEmails', () => {
  let service: SendEmails;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SendEmails);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { authRolesGuard } from './auth-roles-guard';

describe('authRolesGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => authRolesGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});

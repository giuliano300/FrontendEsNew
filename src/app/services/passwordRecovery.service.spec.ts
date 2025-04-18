import { TestBed } from '@angular/core/testing';

import { PasswordRecoveryService } from './passwordRecovery.service';

describe('PasswordRecoveryService', () => {
  let service: PasswordRecoveryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PasswordRecoveryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

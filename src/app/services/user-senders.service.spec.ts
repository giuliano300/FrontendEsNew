import { TestBed } from '@angular/core/testing';

import { UserSendersService } from './user-senders.service';

describe('UserSendersService', () => {
  let service: UserSendersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserSendersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

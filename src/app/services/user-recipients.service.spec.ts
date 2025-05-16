import { TestBed } from '@angular/core/testing';

import { UserRecipientsService } from './user-recipients.service';

describe('UserRecipientsService', () => {
  let service: UserRecipientsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserRecipientsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

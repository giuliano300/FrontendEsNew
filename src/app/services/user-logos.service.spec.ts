import { TestBed } from '@angular/core/testing';

import { UserLogosService } from './user-logos.service';

describe('UserLogosService', () => {
  let service: UserLogosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserLogosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

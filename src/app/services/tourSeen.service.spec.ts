import { TestBed } from '@angular/core/testing';

import { TourSeenService } from './tourSeen.service';

describe('TourSeenService', () => {
  let service: TourSeenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TourSeenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

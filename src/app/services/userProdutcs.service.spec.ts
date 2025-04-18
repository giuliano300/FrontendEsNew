import { TestBed } from '@angular/core/testing';

import { UsersProductsService } from './userProducts.service';

describe('UsersProductsService', () => {
  let service: UsersProductsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsersProductsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

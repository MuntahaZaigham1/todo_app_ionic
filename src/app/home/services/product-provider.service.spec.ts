import { TestBed } from '@angular/core/testing';

import { ProductProviderService } from './product-provider.service';

describe('ProductProviderService', () => {
  let service: ProductProviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductProviderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed, inject } from '@angular/core/testing';

import { BrandingServiceService } from './branding-service.service';

describe('BrandingServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BrandingServiceService]
    });
  });

  it('should be created', inject([BrandingServiceService], (service: BrandingServiceService) => {
    expect(service).toBeTruthy();
  }));
});

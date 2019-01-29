import { TestBed, inject } from '@angular/core/testing';

import { LandingPageServiceService } from './landing-page-service.service';

describe('LandingPageServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LandingPageServiceService]
    });
  });

  it('should be created', inject([LandingPageServiceService], (service: LandingPageServiceService) => {
    expect(service).toBeTruthy();
  }));
});

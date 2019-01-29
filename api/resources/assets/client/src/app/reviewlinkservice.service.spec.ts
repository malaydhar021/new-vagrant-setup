import { TestBed, inject } from '@angular/core/testing';

import { ReviewlinkserviceService } from './reviewlinkservice.service';

describe('ReviewlinkserviceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ReviewlinkserviceService]
    });
  });

  it('should be created', inject([ReviewlinkserviceService], (service: ReviewlinkserviceService) => {
    expect(service).toBeTruthy();
  }));
});

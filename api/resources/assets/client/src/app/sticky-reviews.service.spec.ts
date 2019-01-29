import { TestBed, inject } from '@angular/core/testing';

import { StickyReviewsService } from './sticky-reviews.service';

describe('StickyReviewsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StickyReviewsService]
    });
  });

  it('should be created', inject([StickyReviewsService], (service: StickyReviewsService) => {
    expect(service).toBeTruthy();
  }));
});

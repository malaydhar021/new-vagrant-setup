import { TestBed, inject } from '@angular/core/testing';

import { CampaignServiceService } from './campaign-service.service';

describe('CampaignServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CampaignServiceService]
    });
  });

  it('should be created', inject([CampaignServiceService], (service: CampaignServiceService) => {
    expect(service).toBeTruthy();
  }));
});

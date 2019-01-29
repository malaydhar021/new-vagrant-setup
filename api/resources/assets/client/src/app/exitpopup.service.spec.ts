import { TestBed, inject } from '@angular/core/testing';

import { ExitpopupService } from './exitpopup.service';

describe('ExitpopupService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ExitpopupService]
    });
  });

  it('should be created', inject([ExitpopupService], (service: ExitpopupService) => {
    expect(service).toBeTruthy();
  }));
});

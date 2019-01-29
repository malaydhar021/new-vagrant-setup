import { TestBed, inject } from '@angular/core/testing';

import { AuthenticateserviceService } from './authenticateservice.service';

describe('AuthenticateserviceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthenticateserviceService]
    });
  });

  it('should be created', inject([AuthenticateserviceService], (service: AuthenticateserviceService) => {
    expect(service).toBeTruthy();
  }));
});

import { TestBed, inject } from '@angular/core/testing';

import { SettingserviceService } from './settingservice.service';

describe('SettingserviceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SettingserviceService]
    });
  });

  it('should be created', inject([SettingserviceService], (service: SettingserviceService) => {
    expect(service).toBeTruthy();
  }));
});

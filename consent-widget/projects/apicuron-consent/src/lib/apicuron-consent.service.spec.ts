import { TestBed } from '@angular/core/testing';

import { ApicuronConsentService } from './apicuron-consent.service';

describe('ApicuronConsentService', () => {
  let service: ApicuronConsentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApicuronConsentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

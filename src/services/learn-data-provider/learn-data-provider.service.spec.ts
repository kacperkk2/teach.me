import { TestBed } from '@angular/core/testing';

import { LearnDataProviderService } from './learn-data-provider.service';

describe('LearnDataProviderService', () => {
  let service: LearnDataProviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LearnDataProviderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

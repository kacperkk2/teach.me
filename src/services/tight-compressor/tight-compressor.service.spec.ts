import { TestBed } from '@angular/core/testing';

import { TightCompressorService } from './tight-compressor.service';

describe('TightCompressorService', () => {
  let service: TightCompressorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TightCompressorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

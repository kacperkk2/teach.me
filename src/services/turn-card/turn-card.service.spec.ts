import { TestBed } from '@angular/core/testing';

import { TurnCardService } from './turn-card.service';

describe('TurnCardService', () => {
  let service: TurnCardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TurnCardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

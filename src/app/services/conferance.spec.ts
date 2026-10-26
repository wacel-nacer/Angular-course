import { TestBed } from '@angular/core/testing';

import { ConferanceService } from './conferance';

describe('ConferanceService', () => {
  let service: ConferanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConferanceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

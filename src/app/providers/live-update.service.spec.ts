import { TestBed } from '@angular/core/testing';

import { LiveUpdateService } from './live-update.service';

describe('LiveUpdateService', () => {
  let service: LiveUpdateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LiveUpdateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

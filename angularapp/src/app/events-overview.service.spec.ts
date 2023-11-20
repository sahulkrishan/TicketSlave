import { TestBed } from '@angular/core/testing';

import { EventsOverviewService } from './events-overview.service';

describe('EventsOverviewService', () => {
  let service: EventsOverviewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventsOverviewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

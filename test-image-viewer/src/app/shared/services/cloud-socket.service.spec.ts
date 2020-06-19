import { TestBed } from '@angular/core/testing';

import { CloudSocketService } from './cloud-socket.service';

describe('CloudSocketService', () => {
  let service: CloudSocketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CloudSocketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

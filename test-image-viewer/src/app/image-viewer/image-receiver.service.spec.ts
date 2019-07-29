import { TestBed } from '@angular/core/testing';

import { ImageReceiverService } from './image-receiver.service';

describe('ImageReceiverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ImageReceiverService = TestBed.get(ImageReceiverService);
    expect(service).toBeTruthy();
  });
});

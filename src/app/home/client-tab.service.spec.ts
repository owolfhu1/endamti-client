import { TestBed } from '@angular/core/testing';

import { ClientTabService } from './client-tab.service';

describe('ClientTabService', () => {
  let service: ClientTabService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClientTabService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

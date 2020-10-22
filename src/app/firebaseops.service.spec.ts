import { TestBed } from '@angular/core/testing';

import { FirebaseopsService } from './firebaseops.service';

describe('FirebaseopsService', () => {
  let service: FirebaseopsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FirebaseopsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { SubAdminsService } from './sub-admins.service';

describe('SubAdminsService', () => {
  let service: SubAdminsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubAdminsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

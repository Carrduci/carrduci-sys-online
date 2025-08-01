import { TestBed } from '@angular/core/testing';

import { FoliosBotonesService } from './folios-botones.service';

describe('FoliosBotonesService', () => {
  let service: FoliosBotonesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FoliosBotonesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

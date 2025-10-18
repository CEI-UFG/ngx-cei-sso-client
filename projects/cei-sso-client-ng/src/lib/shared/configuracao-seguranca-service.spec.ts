import { TestBed } from '@angular/core/testing';

import { ConfiguracaoSegurancaService } from './configuracao-seguranca-service';

describe('ConfiguracaoSegurancaService', () => {
  let service: ConfiguracaoSegurancaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConfiguracaoSegurancaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

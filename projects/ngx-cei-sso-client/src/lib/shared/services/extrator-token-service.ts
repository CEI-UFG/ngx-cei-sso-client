// ARQUIVO: jwt-token-extractor.service.ts (Revisado)

import { Injectable, Inject } from '@angular/core';
import { ACCESS_TOKEN_MODEL_INJECTION_TOKEN } from '../constants/access-token-injection-token';

export interface IExtratorTokenService {
  extrairToken(response: any): string | null;
}

@Injectable()
export class ExtratorTokenService implements IExtratorTokenService {
  // A chave agora é definida pela injeção
  private readonly tokenKey: string; 

  constructor(
    // Injete o valor da chave que será fornecido pelo módulo do cliente
    @Inject(ACCESS_TOKEN_MODEL_INJECTION_TOKEN) tokenKey: string
  ) {
    this.tokenKey = tokenKey;
  }

  extrairToken(response: any): string | null {
    if (!response) {
      return null;
    }
    
    // O Extractor agora usa a chave fornecida na configuração
    const token = response[this.tokenKey];

    if (token && typeof token === 'string') {
        return token;
    }
    
    return null;
  }
}
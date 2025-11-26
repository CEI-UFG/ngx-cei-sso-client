import { Injectable, Inject, inject, PLATFORM_ID } from '@angular/core';
import { ACCESS_TOKEN_MODEL_INJECTION_TOKEN } from '../constants/access-token-injection-token';
import { isPlatformBrowser } from '@angular/common';

export interface TokenService {
  extrairToken(response: any): string | null;
  hasToken(): boolean;
  getToken(): string | null;
  setToken(token: any): void;
  removeToken(): void;
}

@Injectable()
export class TokenServiceImpl implements TokenService {
  // A chave agora é definida pela injeção
  private readonly tokenKey: string; 

   private readonly platformId = inject(PLATFORM_ID);
  
  // Variável para checar se estamos no navegador (resultado cacheado)
  private readonly isBrowser = isPlatformBrowser(this.platformId);

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

  hasToken(): boolean {
    if (this.isBrowser) {
      // Acessa localStorage APENAS se estiver no navegador
      return localStorage?.getItem('cei_apps_auth_token') !== null;
    }
    // No servidor (SSR), o token nunca existe
    return false;
  }

  getToken(): string | null {
    if (this.isBrowser) {
      return localStorage?.getItem('cei_apps_auth_token');
    }
    return null;
  }

  setToken(token: any): void {
    if (this.isBrowser) {
      localStorage?.setItem('cei_apps_auth_token', token);
    }
  }

   removeToken(): void {
    if (this.isBrowser) {
      localStorage?.removeItem('cei_apps_auth_token');
    }
  }

}
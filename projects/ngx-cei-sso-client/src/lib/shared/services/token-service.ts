import { Injectable, Inject, inject, PLATFORM_ID } from '@angular/core';
import { ACCESS_TOKEN_MODEL_INJECTION_TOKEN } from '../constants/access-token-injection-token';
import { isPlatformBrowser } from '@angular/common';

export interface TokenService {
  // extrairToken(response: any): string | null;
  hasToken(): boolean;
  // getToken(): string | null;
  // setToken(token: any): void;
  setDeslogado(): void;
  setLogado(): void;
}

@Injectable()
export class TokenServiceImpl implements TokenService {
  // A chave agora é definida pela injeção
  private readonly tokenKey: string; 

   private readonly platformId = inject(PLATFORM_ID);
  
  // Variável para checar se estamos no navegador (resultado cacheado)
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  private readonly cookieLogado = 'cei_apps_logado'; // Cookie de flag (não HttpOnly)

  constructor(
    // Injete o valor da chave que será fornecido pelo módulo do cliente
    @Inject(ACCESS_TOKEN_MODEL_INJECTION_TOKEN) tokenKey: string
  ) {
    this.tokenKey = tokenKey;
  }

  // extrairToken(response: any): string | null {
  //   if (!response) {
  //     return null;
  //   }
    
  //   // O Extractor agora usa a chave fornecida na configuração
  //   const token = response[this.tokenKey];

  //   if (token && typeof token === 'string') {
  //       return token;
  //   }
    
  //   return null;
  // }

  // hasToken(): boolean {
  //   if (this.isBrowser) {
  //     // Acessa localStorage APENAS se estiver no navegador
  //     return localStorage?.getItem('cei_apps_auth_token') !== null;
  //   }
  //   // No servidor (SSR), o token nunca existe
  //   return false;
  // }

  hasToken(): boolean {
    if (!this.isBrowser) return false;

    // Regex para encontrar o cookie exato ignorando espaços e outros cookies
    const match = document.cookie.match(new RegExp('(^| )' + this.cookieLogado + '=([^;]+)'));
    return !!match;
  }

  setLogado(): void {
    if (this.isBrowser) {
      // Define uma flag simples que o JS pode ler. Expira junto com a sessão.
      document.cookie = `${this.cookieLogado}=true; path=/; SameSite=Lax`;
    }
  }

  // getToken(): string | null {
  //   if (this.isBrowser) {
  //     return localStorage?.getItem('cei_apps_auth_token');
  //   }
  //   return null;
  // }

  // setToken(token: any): void {
  //   if (this.isBrowser) {
  //     localStorage?.setItem('cei_apps_auth_token', token);
  //   }
  // }

  setDeslogado(): void {
    if (this.isBrowser) {
      document.cookie = `${this.cookieLogado}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }
  }

  //  removeToken(): void {
  //   if (this.isBrowser) {
  //     localStorage?.removeItem('cei_apps_auth_token');
  //   }
  // }

}
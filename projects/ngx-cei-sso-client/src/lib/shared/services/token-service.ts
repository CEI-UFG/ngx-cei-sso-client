import { Injectable, Inject, inject, PLATFORM_ID, Optional } from '@angular/core';
import { ACCESS_TOKEN_MODEL_INJECTION_TOKEN } from '../constants/access-token-injection-token';
import { isPlatformBrowser } from '@angular/common';
import { REQUEST } from '../constants/requisicao-ssr-token';
import type { Request } from 'express';

export interface TokenService {
  hasToken(): boolean;
  setDeslogado(): void;
  setLogado(): void;
}

@Injectable()
export class TokenServiceImpl implements TokenService {
  private readonly tokenKey: string; 
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private readonly cookieLogado = 'cei_apps_logado';

  // Injetamos o objeto REQUEST do Express (SSR)
  private readonly request = inject(REQUEST, { optional: true });

  constructor(
    @Inject(ACCESS_TOKEN_MODEL_INJECTION_TOKEN) tokenKey: string
  ) {
    this.tokenKey = tokenKey;
  }

  hasToken(): boolean {
    // LÓGICA PARA NAVEGADOR
    if (this.isBrowser) {
      const match = document.cookie.match(new RegExp('(^| )' + this.cookieLogado + '=([^;]+)'));
      const existe = !!match;
      console.log(`TokenService [Browser]: Verificando cookie ${this.cookieLogado}. Encontrado: ${existe}`);
      return existe;
    }

    // LÓGICA PARA SERVIDOR (SSR)
    // No servidor, precisamos ler o cabeçalho 'cookie' da requisição HTTP que chegou no Node.js
    if (this.request && this.request.headers.cookie) {
      const cookies = this.request.headers.cookie;
      const existeNoServer = cookies.includes(this.cookieLogado);
      console.log(`TokenService [Server]: Verificando cookie no cabeçalho. Encontrado: ${existeNoServer}`);
      return existeNoServer;
    }

    console.log('TokenService [Server]: Nenhum cookie encontrado na requisição.');
    return false;
  }

  setLogado(): void {
    if (this.isBrowser) {
      document.cookie = `${this.cookieLogado}=true; path=/; SameSite=Lax`;
    }
  }

  setDeslogado(): void {
    if (this.isBrowser) {
      document.cookie = `${this.cookieLogado}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }
  }
}
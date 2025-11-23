import { Injectable, inject, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common'; // Importe a função essencial
import { CONFIGURACAO_SSO_INJECTION_TOKEN } from '../constants/configuracao-sso-injection-token';
import { ConfiguracaoSSO } from '../models/configuracao-sso-model';

@Injectable({
  providedIn: 'root'
})
export class AutenticacaoService {
  // Use 'inject()' para obter as dependências de plataforma e serviços
  private readonly platformId = inject(PLATFORM_ID);
  private readonly http = inject(HttpClient);
  // private readonly configuracaoSegurancaService = inject(ConfiguracaoSegurancaService); // Novo serviço injetado
  
  // Variável para checar se estamos no navegador (resultado cacheado)
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  
  // Use 'window.localStorage' diretamente, mas APENAS APÓS verificar 'isBrowser'
  // (Note que 'localStorage' é uma global no navegador e não precisa ser injetada se
  // o acesso for sempre protegido pela verificação de plataforma)

  private isAutenticadoSubject = new BehaviorSubject<boolean>(this.hasToken());
  public isAutenticado$ = this.isAutenticadoSubject.asObservable();

  constructor(
    // Injeta o Token que receberá o objeto de configuração
    @Inject(CONFIGURACAO_SSO_INJECTION_TOKEN) private configuracaoSeguranca: ConfiguracaoSSO 
  ) { }
  // ----------------------
  // Métodos de LocalStorage
  // ----------------------

  private hasToken(): boolean {
    if (this.isBrowser) {
      // Acessa localStorage APENAS se estiver no navegador
      return localStorage?.getItem('auth_token') !== null;
    }
    // No servidor (SSR), o token nunca existe
    return false;
  }

  getToken(): string | null {
    if (this.isBrowser) {
      return localStorage?.getItem('auth_token');
    }
    return null;
  }

  private setToken(token: string): void {
    if (this.isBrowser) {
      localStorage?.setItem('auth_token', token);
    }
  }

  private removeToken(): void {
    if (this.isBrowser) {
      localStorage?.removeItem('auth_token');
    }
  }

  // ----------------------
  // Métodos de Autenticação
  // ----------------------

  login(credentials: any): Observable<any> {
    const url = `${this.configuracaoSeguranca?.urlBase}${this.configuracaoSeguranca?.urlLogin}`; // Acesso direto às propriedades
    
    return this.http.post<{ token: string }>(url, credentials).pipe(
        tap(response => {
            const token = response.token; 
            if (token) {
                // Chama o método seguro
                this.setToken(token); 
                this.isAutenticadoSubject.next(true);
            } else {
                throw new Error('Token não recebido');
            }
        }),
        catchError(error => {
            return throwError(() => new Error('Login falhou. Credenciais inválidas ou erro no servidor.'));
        })
    );
  }

  logout(): Observable<any> {
    const url = `${this.configuracaoSeguranca?.urlBase}${this.configuracaoSeguranca?.urlLogout}`; // Acesso direto às propriedades
    const redirectUri = this.configuracaoSeguranca?.redirectUriPosLogout; // Acesso direto às propriedades

    return this.http.post(url, {}).pipe(
      catchError(() => of(null)), 
      tap(() => {
        // Chama o método seguro
        this.removeToken(); 
        this.isAutenticadoSubject.next(false);
        
        // O redirecionamento TAMBÉM é uma operação de navegador!
        if (this.isBrowser) { 
          window.location.href = redirectUri;
        }
      })
    );
  }
}
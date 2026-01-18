import { Injectable, inject, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of, throwError } from 'rxjs';
import { tap, catchError, finalize } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common'; 
import { CONFIGURACAO_SSO_INJECTION_TOKEN } from '../constants/configuracao-sso-injection-token';
import { ConfiguracaoSSO } from '../models/configuracao-sso-model';
import { TOKEN_SERVICE_INJECTION_TOKEN } from '../constants/token-service-injection-token';
import { CREDENCIAIS_PAYLOAD_INJECTION_TOKEN } from '../constants/credenciais-payload-injection-token';
import { CredenciaisPayLoad } from '../types/credenciais-payload';

@Injectable({
  providedIn: 'root'
})
export class AutenticacaoService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly http = inject(HttpClient);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private readonly tokenService = inject(TOKEN_SERVICE_INJECTION_TOKEN);
  
  private isAutenticadoSubject = new BehaviorSubject<boolean>(this.tokenService.hasToken());
  public isAutenticado$ = this.isAutenticadoSubject.asObservable();

  constructor(
    @Inject(CONFIGURACAO_SSO_INJECTION_TOKEN) private configuracaoSeguranca: ConfiguracaoSSO,
    @Inject(CREDENCIAIS_PAYLOAD_INJECTION_TOKEN) private mapearPayloadCredenciais: CredenciaisPayLoad
  ) { 
    console.log('AutenticacaoService: Inicializado. Estado inicial autenticado:', this.tokenService.hasToken());
  }

  login(credenciais: any): Observable<any> {
    console.log('AutenticacaoService: Tentando realizar login...');
    const payloadCredenciais = this.mapearPayloadCredenciais(credenciais);
    const url = `${this.configuracaoSeguranca?.urlBaseServicoSSO}${this.configuracaoSeguranca?.pathLogin}`; 
    
    return this.http.post<any>(url, payloadCredenciais, { withCredentials: true }).pipe(
        tap(() => {
            const logado = this.tokenService.hasToken();
            console.log('AutenticacaoService: Login bem-sucedido. Cookie de flag presente:', logado);
            this.isAutenticadoSubject.next(logado);
        }),
        catchError(error => {
            console.error('AutenticacaoService: Erro na requisição de login:', error);
            return throwError(() => new Error('Login falhou. Verifique suas credenciais.'));
        })
    );
  }

  logout(): Observable<any> {
    console.log('AutenticacaoService: Iniciando logout...');
    const url = `${this.configuracaoSeguranca?.urlBaseServicoSSO}${this.configuracaoSeguranca?.pathLogout}`;
    const redirectUri = this.configuracaoSeguranca?.redirectUriPosLogout;

    return this.http.post(url, {}, { withCredentials: true }).pipe(
      finalize(() => {
        console.log('AutenticacaoService: Limpando estado de autenticação local.');
        this.tokenService.setDeslogado();
        this.isAutenticadoSubject.next(false);
        
        if (typeof window !== 'undefined') {
          console.log('AutenticacaoService: Redirecionando após logout para:', redirectUri);
          window.location.href = redirectUri;
        }
      }),
      catchError(error => {
        console.error('AutenticacaoService: Erro durante o logout, procedendo com limpeza local.', error);
        return of(null);
      })
    );
  }

  /**
   * Constrói o URL completo de redirecionamento para o SSO externo.
   */
  getUrlLoginSSO(urlDeRetorno: string): string | null {
    if (this.configuracaoSeguranca?.urlBaseServicoSSO && this.configuracaoSeguranca?.pathLogin) {
      const ssoBaseUrl = `${this.configuracaoSeguranca.urlBaseServicoSSO}${this.configuracaoSeguranca.pathLogin}`;
      
      // IMPORTANTE: encodeURIComponent garante que caracteres como ':' e '/' na URL de retorno 
      // não sejam interpretados como parte da URL do SSO.
      const encodedRedirectUrl = encodeURIComponent(urlDeRetorno); 

      const finalUrl = `${ssoBaseUrl}?redirect_url=${encodedRedirectUrl}`;
      console.log('AutenticacaoService: URL de SSO gerada:', finalUrl);
      return finalUrl;
    }
    
    console.warn('AutenticacaoService: Configuração de SSO incompleta para gerar URL de login.');
    return null; 
  }
}
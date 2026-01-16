import { Injectable, inject, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of, throwError } from 'rxjs';
import { tap, catchError, finalize } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common'; // Importe a função essencial
import { CONFIGURACAO_SSO_INJECTION_TOKEN } from '../constants/configuracao-sso-injection-token';
import { ConfiguracaoSSO } from '../models/configuracao-sso-model';
import { TOKEN_SERVICE_INJECTION_TOKEN } from '../constants/token-service-injection-token';
import { CREDENCIAIS_PAYLOAD_INJECTION_TOKEN } from '../constants/credenciais-payload-injection-token';
import { CredenciaisPayLoad } from '../types/credenciais-payload';

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

  private readonly tokenService = inject(TOKEN_SERVICE_INJECTION_TOKEN);
  private isAutenticadoSubject = new BehaviorSubject<boolean>(this.tokenService.hasToken());
  public isAutenticado$ = this.isAutenticadoSubject.asObservable();

  constructor(
    // Injeta o Token que receberá o objeto de configuração
    @Inject(CONFIGURACAO_SSO_INJECTION_TOKEN) private configuracaoSeguranca: ConfiguracaoSSO,
    // @Inject(EXTRATOR_TOKEN_INJECTION_TOKEN) private tokenService: TokenService // <-- Injeção via Interface 
    @Inject(CREDENCIAIS_PAYLOAD_INJECTION_TOKEN) private mapearPayloadCredenciais: CredenciaisPayLoad
  ) { }
  

  // ----------------------
  // Métodos de Autenticação
  // ----------------------

  login(credenciais: any): Observable<any> {

    const payloadCredenciais = this.mapearPayloadCredenciais(credenciais);

    const url = `${this.configuracaoSeguranca?.urlBaseServicoSSO}${this.configuracaoSeguranca?.pathLogin}`; // Acesso direto às propriedades
    
    return this.http.post<any>(url, payloadCredenciais, { withCredentials: true }).pipe(
        tap(() => {
            // Ignoramos o corpo da resposta (token não é mais manipulado aqui).
            // Apenas atualizamos o BehaviorSubject baseado na existência da Flag/Cookie.
            const logado = this.tokenService.hasToken();
            this.isAutenticadoSubject.next(logado);
            
            if (!logado) {
              console.warn('Resposta http 200 encontrada no login, mas o cookie de sessão não foi encontrado.');
            }
        }),
        catchError(error => {
            return throwError(() => new Error('Login falhou. Verifique suas credenciais.'));
        })
    );
  }



  // ----------------------
  // Métodos de Autenticação
  // ----------------------

  // login(credenciais: any): Observable<any> {

  //   const payloadCredenciais = this.mapearPayloadCredenciais(credenciais);

  //   const url = `${this.configuracaoSeguranca?.urlBaseServicoSSO}${this.configuracaoSeguranca?.pathLogin}`; // Acesso direto às propriedades
    
  //   return this.http.post<any>(url, payloadCredenciais).pipe(
  //       tap(resposta => {
  //           const token = this.tokenService.extrairToken(resposta); 
  //           if (token) {
  //               // Chama o método seguro
  //               this.tokenService.setToken(token); 
  //               this.isAutenticadoSubject.next(true);
  //           } else {
  //               throw new Error('Token não recebido');
  //           }
  //       }),
  //       catchError(error => {
  //           return throwError(() => new Error('Login falhou. Credenciais inválidas ou erro no servidor.'));
  //       })
  //   );
  // }


  // logout(): Observable<any> {
  //   const url = `${this.configuracaoSeguranca?.urlBaseServicoSSO}${this.configuracaoSeguranca?.pathLogout}`; // Acesso direto às propriedades
  //   const redirectUri = this.configuracaoSeguranca?.redirectUriPosLogout; // Acesso direto às propriedades

  //   return this.http.post(url, {}).pipe(
  //     catchError(() => of(null)), 
  //     tap(() => {
  //       // Chama o método seguro
  //       this.tokenService.removeToken(); 
  //       this.isAutenticadoSubject.next(false);
        
  //       // O redirecionamento TAMBÉM é uma operação de navegador!
  //       if (this.isBrowser) { 
  //         window.location.href = redirectUri;
  //       }
  //     })
  //   );
  // }

  logout(): Observable<any> {
    const url = `${this.configuracaoSeguranca?.urlBaseServicoSSO}${this.configuracaoSeguranca?.pathLogout}`;
    const redirectUri = this.configuracaoSeguranca?.redirectUriPosLogout;

    return this.http.post(url, {}, { withCredentials: true }).pipe(
      finalize(() => {
        // Limpa a flag e atualiza o estado
        this.tokenService.setDeslogado();
        this.isAutenticadoSubject.next(false);
        
        if (typeof window !== 'undefined') {
          window.location.href = redirectUri;
        }
      }),
      catchError(() => of(null))
    );
  }

  /**
   * Constrói o URL completo de redirecionamento para o SSO externo.
   * @param redirectPath O caminho interno para o qual o usuário deve retornar (state.url do Guard).
   * @returns A URL completa do SSO (ex: http://localhost:8000/login/?redirect_url=...) ou null se não configurado.
   */
  getUrlLoginSSO(redirectPath: string): string | null {
    // Verifica se os componentes necessários para construir a URL externa estão configurados
    if (this.configuracaoSeguranca?.urlBaseServicoSSO && this.configuracaoSeguranca?.pathLogin) {
      // 1. Constrói a URL base do SSO
      const ssoBaseUrl = `${this.configuracaoSeguranca.urlBaseServicoSSO}${this.configuracaoSeguranca.pathLogin}`;
      
      // 2. Codifica o URL de retorno
      const encodedRedirectUrl = encodeURIComponent(redirectPath); 

      // 3. Retorna a URL completa para redirecionamento externo
      return `${ssoBaseUrl}?redirect_url=${encodedRedirectUrl}`;
    }
    
    return null; // Retorna null se não houver configuração para SSO externo
  }
}

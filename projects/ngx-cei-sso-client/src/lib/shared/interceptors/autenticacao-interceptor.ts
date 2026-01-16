// auth.interceptor.ts
import { Inject, Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AutenticacaoService } from '../services/autenticacao-service';
import { TokenService } from '../services/token-service';
import { TOKEN_SERVICE_INJECTION_TOKEN } from '../constants/token-service-injection-token';

@Injectable()
export class AutenticacaoInterceptor implements HttpInterceptor {
  constructor(
    private autenticacaoService: AutenticacaoService,
    @Inject(TOKEN_SERVICE_INJECTION_TOKEN) private tokenService: TokenService) {}

  // intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  //   const token = this.tokenService.getToken();
    
  //   let authRequest = request;

  //   // 1. Adicionar o Token de Autorização se ele existir
  //   if (token) {
  //     authRequest = request.clone({
  //       setHeaders: {
  //         Authorization: `Bearer ${token}` 
  //       }
  //     });
  //   }
    
  //   // 2. Enviar a requisição e monitorar a resposta
  //   return next.handle(authRequest).pipe(
  //     catchError((error: HttpErrorResponse) => {
  //       if (error.status === 401) {
  //         // A requisição falhou por falta/expiração de token.
  //         console.warn('Requisição não autorizada (401). Forçando logout.');
          
  //         // Chama o logout que irá remover o token e redirecionar
  //         this.autenticacaoService.logout().subscribe(); 
          
  //         // Impede que a aplicação continue processando o erro
  //         return throwError(() => new Error('Sessão expirada. Redirecionando para login.'));
  //       }
        
  //       // Propagar outros erros (400, 404, 500, etc.)
  //       return throwError(() => error);
  //     })
  //   );
  // }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    // 1. CLONAGEM COM CREDENCIAIS:
    // Habilita o envio de cookies (HttpOnly e Session Flags) para o backend.
    // Sem isso, as requisições Cross-Origin (ex: porta 4200 -> 8000) não levarão os cookies.
    const authRequest = request.clone({
      withCredentials: true 
    });

    // 2. TRATAMENTO DE ERROS DE SESSÃO:
    return next.handle(authRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        // Se o backend retornar 401, significa que o Cookie HttpOnly expirou ou é inválido.
        if (error.status === 401) {
          console.warn('Sessão inválida detectada pelo servidor. Limpando estado local.');
          
          // O logout limpa a flag 'cei_logged_in' e redireciona para o SSO.
          this.autenticacaoService.logout().subscribe(); 
          
          return throwError(() => new Error('Sessão expirada. Redirecionando...'));
        }
        
        return throwError(() => error);
      })
    );
  }
}
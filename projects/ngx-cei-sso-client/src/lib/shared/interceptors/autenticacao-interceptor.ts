// auth.interceptor.ts
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AutenticacaoService } from '../services/autenticacao-service';

@Injectable()
export class AutenticacaoInterceptor implements HttpInterceptor {
  constructor(private autenticacaoService: AutenticacaoService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.autenticacaoService.getToken();
    
    let authRequest = request;

    // 1. Adicionar o Token de Autorização se ele existir
    if (token) {
      authRequest = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}` 
        }
      });
    }
    
    // 2. Enviar a requisição e monitorar a resposta
    return next.handle(authRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // A requisição falhou por falta/expiração de token.
          console.warn('Requisição não autorizada (401). Forçando logout.');
          
          // Chama o logout que irá remover o token e redirecionar
          this.autenticacaoService.logout().subscribe(); 
          
          // Impede que a aplicação continue processando o erro
          return throwError(() => new Error('Sessão expirada. Redirecionando para login.'));
        }
        
        // Propagar outros erros (400, 404, 500, etc.)
        return throwError(() => error);
      })
    );
  }
}
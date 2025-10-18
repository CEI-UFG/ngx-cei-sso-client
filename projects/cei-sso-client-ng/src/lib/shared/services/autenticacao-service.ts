// auth.service.ts
import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { ConfiguracaoSegurancaService } from '../configuracao-seguranca-service';

@Injectable({
  providedIn: 'root'
})
export class AutenticacaoService {
  private isAutenticadoSubject = new BehaviorSubject<boolean>(this.hasToken());
  public isAutenticado$ = this.isAutenticadoSubject.asObservable();

  constructor(
    private http: HttpClient,
    private configuracaoSegurancaService: ConfiguracaoSegurancaService // Injetando o novo serviço
  ) { }

  private hasToken(): boolean {
    // Verifica se o token existe no armazenamento
    return !!localStorage.getItem('auth_token');
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  login(credentials: any): Observable<any> {
    // Usando as URLs do ConfigService (que simula o ambiente)
    const url = `${this.configuracaoSegurancaService.getUrlBase()}${this.configuracaoSegurancaService.getUrlLogin()}`;

    // ... [Resto da lógica de login permanece a mesma] ...
    return this.http.post<{ token: string }>(url, credentials).pipe(
        tap(response => {
            const token = response.token; 
            if (token) {
                localStorage.setItem('auth_token', token);
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
    // Usando as URLs do ConfigService
    const url = `${this.configuracaoSegurancaService.getUrlBase()}${this.configuracaoSegurancaService.getUrlLogout()}`;
    const redirectUri = this.configuracaoSegurancaService.getRedirectUriPosLogout();
    
    return this.http.post(url, {}).pipe(
      catchError(error => of(null)), 
      tap(() => {
        localStorage.removeItem('auth_token');
        this.isAutenticadoSubject.next(false);
        
        // Redireciona para a URI de logout global
        window.location.href = redirectUri;
      })
    );
  }
}
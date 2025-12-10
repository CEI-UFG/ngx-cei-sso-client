// src/lib/services/token-refresh.service.ts

import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { timer, Subscription, Subject } from 'rxjs';
import { switchMap, catchError, tap } from 'rxjs/operators';
import { CONFIGURACAO_SOLICITACAO_REFRESH_TOKEN_INJECTION_TOKEN } from '../constants/solicitacao-refresh-token-injection-token';
import { ConfiguracaoSolicitacaoRefreshToken as ConfiguracaoSolicitacaoRefreshToken } from '../models/solicitacao-refresh-token-model';

@Injectable({
  providedIn: 'root'
})
export class RefreshTokenService {
  private timerSubscription: Subscription | null = null;
  private readonly DEFAULT_REFRESH_INTERVAL = 300000; // 5 minutos

  private refreshTokenFailedSource = new Subject<void>();
  refreshTokenFailed$ = this.refreshTokenFailedSource.asObservable();

  constructor(
    @Inject(CONFIGURACAO_SOLICITACAO_REFRESH_TOKEN_INJECTION_TOKEN) private config: ConfiguracaoSolicitacaoRefreshToken,
    private http: HttpClient
  ) {}

  /**
   * @description
   * Inicia o processo de refresh de token em background.
   */
  start(): void {
    if (this.timerSubscription) {
      return;
    }

    const interval = this.config.intervaloSolicitacoes || this.DEFAULT_REFRESH_INTERVAL;

    this.timerSubscription = timer(0, interval)
      .pipe(
        switchMap(() => this.refreshToken()),
        tap(newToken => {
          console.log('Token atualizado com sucesso:', newToken);
          // Exemplo: localStorage.setItem('auth_token', newToken.accessToken);
        })
      )
      .subscribe();
  }

  /**
   * @description
   * Para o processo de refresh de token.
   */
  stop(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
      this.timerSubscription = null;
    }
  }

  private refreshToken() {
    return this.http.post<any>(this.config.url, {}).pipe(
      catchError(error => {
        console.error('Falha ao atualizar o token', error);
        this.refreshTokenFailedSource.next();
        this.stop();
        throw new Error('Falha no refresh do token.');
      })
    );
  }
}

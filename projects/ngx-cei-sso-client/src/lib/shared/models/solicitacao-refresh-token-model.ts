// src/lib/config/sso-client-config.ts

import { InjectionToken } from '@angular/core';

/**
 * @description
 * Interface para a configuração do cliente SSO.
 * Define as propriedades necessárias para o funcionamento do serviço de refresh de token.
 */
export interface ConfiguracaoSolicitacaoRefreshToken {
  /**
   * @description
   * Endpoint para realizar a solicitação de refresh do token.
   */
  url: string;

  /**
   * @description
   * Intervalo em milissegundos para solicitar o refresh do token.
   * O valor padrão é de 5 minutos (300000 ms).
   */
  intervaloSolicitacoes: number;
}

/**
 * @description
 * InjectionToken que pode ser usado para fornecer a configuração do NgxSsoClient.
 * É utilizado para injetar a configuração da aplicação no TokenRefreshService.
 */
export const NGX_SSO_CLIENT_CONFIG = new InjectionToken<ConfiguracaoSolicitacaoRefreshToken>('solicitacao-refresh-token-config');

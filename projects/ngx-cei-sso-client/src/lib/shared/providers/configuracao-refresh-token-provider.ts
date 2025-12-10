// src/lib/sso-client.providers.ts

import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { ConfiguracaoSolicitacaoRefreshToken } from '../models/solicitacao-refresh-token-model';
import { CONFIGURACAO_SOLICITACAO_REFRESH_TOKEN_INJECTION_TOKEN } from '../constants/solicitacao-refresh-token-injection-token';

/**
 * @description
 * Configura os providers para o ngx-sso-client em uma aplicação standalone.
 * Esta função deve ser chamada na configuração de providers da sua aplicação.
 *
 * @param config A configuração necessária para o cliente SSO.
 * @returns Um EnvironmentProviders para ser usado na inicialização da aplicação.
 */
export function provideConfiguracaoRefreshToken(config: ConfiguracaoSolicitacaoRefreshToken): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: CONFIGURACAO_SOLICITACAO_REFRESH_TOKEN_INJECTION_TOKEN,
      useValue: config,
    },
    // O TokenRefreshService já é 'providedIn: root', então não é estritamente
    // necessário aqui, mas o deixamos para maior clareza.
  ]);
}

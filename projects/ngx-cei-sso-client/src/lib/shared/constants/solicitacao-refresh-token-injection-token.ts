import { InjectionToken } from "@angular/core";
import { ConfiguracaoSolicitacaoRefreshToken } from "../models/solicitacao-refresh-token-model";

/**
 * @description
 * InjectionToken que pode ser usado para fornecer a configuração de refresh token.
 */
export const CONFIGURACAO_SOLICITACAO_REFRESH_TOKEN_INJECTION_TOKEN = new InjectionToken<ConfiguracaoSolicitacaoRefreshToken>('solicitacao-refresh-token-injection-token');

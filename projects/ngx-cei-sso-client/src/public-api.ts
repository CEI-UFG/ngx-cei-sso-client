/*
 * Public API Surface of cei-sso-client-ng
 */

export * from './lib/cei-sso-client-ng';

export {AutenticacaoService} from './lib/shared/services/autenticacao-service';
export {autenticacaoGuard} from './lib/shared/guards/autenticacao-guard';
export {CONFIGURACAO_SSO_INJECTION_TOKEN} from './lib/shared/constants/configuracao-sso-injection-token';
export type {ConfiguracaoSSO} from './lib/shared/models/configuracao-sso-model';
export {provideConfiguracaoSSO} from './lib/shared/providers/configuracao-sso-provider';
export {AutenticacaoInterceptor} from './lib/shared/interceptors/autenticacao-interceptor';
export {provideNomeChaveAcessTokenRespostaAPI} from './lib/shared/providers/nome-chave-access-token-resposta-api-provider';
export {TOKEN_SERVICE_INJECTION_TOKEN} from './lib/shared/constants/token-service-injection-token';
export type {TokenService} from './lib/shared/services/token-service';
export {TokenServiceImpl} from './lib/shared/services/token-service';
export {ACCESS_TOKEN_MODEL_INJECTION_TOKEN} from './lib/shared/constants/access-token-injection-token';
export {CREDENCIAIS_PAYLOAD_INJECTION_TOKEN} from './lib/shared/constants/credenciais-payload-injection-token';
export type {CredenciaisPayLoad} from './lib/shared/types/credenciais-payload';
export {provideCredenciaisPayload} from './lib/shared/providers/credenciais-payload-provider';
export {provideAccessTokenService} from './lib/shared/providers/access-token-provider';
export {provideConfiguracaoRefreshToken} from './lib/shared/providers/configuracao-refresh-token-provider';
export {CONFIGURACAO_SOLICITACAO_REFRESH_TOKEN_INJECTION_TOKEN} from './lib/shared/constants/solicitacao-refresh-token-injection-token';
export type {ConfiguracaoSolicitacaoRefreshToken} from './lib/shared/models/solicitacao-refresh-token-model';
export {RefreshTokenService} from './lib/shared/services/refresh-token.service';

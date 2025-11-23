/*
 * Public API Surface of cei-sso-client-ng
 */

export * from './lib/cei-sso-client-ng';

//export * from './lib/cei-sso-client-ng';

export {AutenticacaoService} from './lib/shared/services/autenticacao-service';
export {autenticacaoGuard} from './lib/shared/guards/autenticacao-guard';
export {CONFIGURACAO_SSO_INJECTION_TOKEN} from './lib/shared/constants/configuracao-sso-injection-token';
export type {ConfiguracaoSSO} from './lib/shared/models/configuracao-sso-model';
export {provideSecurity} from './lib/shared/providers/sso-provider';
export {AutenticacaoInterceptor} from './lib/shared/interceptors/autenticacao-interceptor';
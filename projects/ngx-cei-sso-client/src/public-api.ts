/*
 * Public API Surface of cei-sso-client-ng
 */

export * from './lib/cei-sso-client-ng';

//export * from './lib/cei-sso-client-ng';

export {AutenticacaoService} from './lib/shared/services/autenticacao-service';
export {ConfiguracaoSegurancaService} from './lib/shared/configuracao-seguranca-service';
export {autenticacaoGuard} from './lib/shared/guards/autenticacao-guard';
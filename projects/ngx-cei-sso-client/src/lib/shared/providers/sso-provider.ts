import { Provider } from "@angular/core";
import { ConfiguracaoSSO } from "../models/configuracao-sso-model";
import { AutenticacaoService } from "../services/autenticacao-service";
import { CONFIGURACAO_SSO_INJECTION_TOKEN } from "../constants/configuracao-sso-injection-token";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { AutenticacaoInterceptor } from "../interceptors/autenticacao-interceptor";

/**
 * Função de provedor para configurar e fornecer os serviços de segurança.
 *
 * @param config Os parâmetros de configuração de SSO lidos do environment.ts do cliente.
 * @returns Um array de Providers do Angular.
 */
export function provideSecurity(config: ConfiguracaoSSO): Provider[] {
  return [
    AutenticacaoService,
    
    // 1. Prover a configuração usando o InjectionToken
    {
      provide: CONFIGURACAO_SSO_INJECTION_TOKEN,
      useValue: config
    },

    // 2. Prover o Interceptor HTTP para injetar o Token Bearer
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AutenticacaoInterceptor,
      multi: true
    }
  ];
}
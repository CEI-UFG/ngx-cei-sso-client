import { Provider } from "@angular/core";
import { CredenciaisPayLoad } from "../types/credenciais-payload";
import { CREDENCIAIS_PAYLOAD_INJECTION_TOKEN } from "../constants/credenciais-payload-injection-token";

/**
 * Função de provedor para configurar e fornecer os serviços de segurança.
 *
 * @param config Os parâmetros de configuração de SSO lidos do environment.ts do cliente.
 * @returns Um array de Providers do Angular.
 */
export function provideCredenciaisPayload(credenciaisPayload: CredenciaisPayLoad): Provider[] {
  return [
    {
      provide: CREDENCIAIS_PAYLOAD_INJECTION_TOKEN,
      useValue: credenciaisPayload
    }

  ];
}
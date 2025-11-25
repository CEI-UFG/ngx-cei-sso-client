import { EnvironmentProviders, makeEnvironmentProviders } from "@angular/core";
import { ACCESS_TOKEN_MODEL_INJECTION_TOKEN } from "../constants/access-token-injection-token";
import { ExtratorTokenService } from "../services/extrator-token-service";
import { EXTRATOR_TOKEN_INJECTION_TOKEN } from "../constants/extrator-token-injection-token";

/**
 * Função de configuração que fornece todos os serviços e a chave de configuração
 * para o service de extracao de token no novo modelo de providers.
 */
export function provideAccessTokenModel(key: string): EnvironmentProviders {
  return makeEnvironmentProviders([
    // 1. Fornece o valor (a chave de configuração)
    { provide: ACCESS_TOKEN_MODEL_INJECTION_TOKEN, useValue: key },

    // 2. Fornece a implementação concreta para a interface IExtratorTokenService
    { provide: EXTRATOR_TOKEN_INJECTION_TOKEN, useClass: ExtratorTokenService },

    // 3. O AutenticacaoService (e outras dependências internas)
    //    Não precisa estar aqui se ele usar providedIn: 'root'
    //    Mas se precisar ser listado: AutenticacaoService 
  ]);
}
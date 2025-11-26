import { EnvironmentProviders, makeEnvironmentProviders } from "@angular/core";
import { TOKEN_SERVICE_INJECTION_TOKEN } from "../constants/token-service-injection-token";
import { TokenServiceImpl } from "../services/token-service";

export function provideAccessTokenService(): EnvironmentProviders {
  return makeEnvironmentProviders([
    // 2. Fornece a implementação concreta para a interface IExtratorTokenService
    { provide: TOKEN_SERVICE_INJECTION_TOKEN, useClass: TokenServiceImpl },

  ]);
}
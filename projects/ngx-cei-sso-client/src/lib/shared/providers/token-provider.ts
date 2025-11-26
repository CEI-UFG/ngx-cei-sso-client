import { EnvironmentProviders, makeEnvironmentProviders } from "@angular/core";
import { ACCESS_TOKEN_MODEL_INJECTION_TOKEN } from "../constants/access-token-injection-token";
import { ExtratorTokenService } from "../services/extrator-token-service";
import { EXTRATOR_TOKEN_INJECTION_TOKEN } from "../constants/extrator-token-injection-token";

/**
 * Provider para que o sistema cliente possa definir o nome da chave 
 * que retorna o Access Token na resposta da API.
 * 
 * Este provider também configura o serviço ExtratorTokenService para usar essa chave.
 * @param chave O nome da chave na resposta da API que contém o Access Token.
 * @returns Um EnvironmentProviders configurado com os providers necessários.
 */
export function provideNomeChaveAcessTokenRespostaAPI(chave: string): EnvironmentProviders {
  return makeEnvironmentProviders([
    // 1. Fornece o valor (a chave de configuração)
    { provide: ACCESS_TOKEN_MODEL_INJECTION_TOKEN, useValue: chave },
    // 2. Fornece a implementação concreta para a interface IExtratorTokenService
    { provide: EXTRATOR_TOKEN_INJECTION_TOKEN, useClass: ExtratorTokenService },

  ]);
}
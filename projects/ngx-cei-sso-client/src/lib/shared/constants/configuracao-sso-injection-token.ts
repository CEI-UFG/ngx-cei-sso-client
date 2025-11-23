import { InjectionToken } from "@angular/core";
import { ConfiguracaoSSO } from "../models/configuracao-sso-model";

export const CONFIGURACAO_SSO_INJECTION_TOKEN = new InjectionToken<ConfiguracaoSSO>('Injection_Token_SSO');
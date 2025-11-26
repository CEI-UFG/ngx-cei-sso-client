import { InjectionToken } from "@angular/core";
import { TokenService } from "../services/token-service";

export const TOKEN_SERVICE_INJECTION_TOKEN = new InjectionToken<TokenService>('TokenServiceInjectionToken');
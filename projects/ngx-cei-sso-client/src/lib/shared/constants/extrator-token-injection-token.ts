import { InjectionToken } from "@angular/core";
import { IExtratorTokenService } from "../services/extrator-token-service";

export const EXTRATOR_TOKEN_INJECTION_TOKEN = new InjectionToken<IExtratorTokenService>('ExtratorTokenInjectionToken');
import { InjectionToken } from '@angular/core';
import { CredenciaisPayLoad } from '../types/credenciais-payload';



/**
 * Token usado para fornecer a função que mapeia o modelo customizado do cliente 
 * para o modelo de payload de login da API.
 */
export const CREDENCIAIS_PAYLOAD_INJECTION_TOKEN = new InjectionToken<CredenciaisPayLoad>('CredenciaisPayloadInjectionToken');
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export abstract class ConfiguracaoSegurancaService {

  /**
   * Retorna a URL base do servidor de Single Sign-On (SSO).
   * Ex: 'https://api.meusistema.com'
   */
  abstract getUrlBase(): string;
  
  /**
   * Retorna o caminho do endpoint de Login.
   * Ex: '/auth/login'
   */
  abstract getUrlLogin(): string;
  
  /**
   * Retorna o caminho do endpoint de Logout.
   * Ex: '/auth/logout'
   */
  abstract getUrlLogout(): string;
  
  /**
   * Retorna o URL completa para onde o usuário deve ser redirecionado após o logout.
   * Ex: 'http://localhost:4200/login'
   */
  abstract getRedirectUriPosLogout(): string;
}


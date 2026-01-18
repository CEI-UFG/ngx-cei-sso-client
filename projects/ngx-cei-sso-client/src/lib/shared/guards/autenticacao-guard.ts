import { inject, PLATFORM_ID, Optional } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AutenticacaoService } from '../services/autenticacao-service';
import { map } from 'rxjs';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { Response } from 'express';
import { RESPONSE } from '../constants/requisicao-ssr-token';
import { CONFIGURACAO_SSO_INJECTION_TOKEN } from '../constants/configuracao-sso-injection-token';


export const autenticacaoGuard: CanActivateFn = (route, state) => {

  // Injeção de dependências
  const autenticacaoService = inject(AutenticacaoService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);
  const response: Response | null = inject(RESPONSE, { optional: true });
  const configuracaoSSO = inject(CONFIGURACAO_SSO_INJECTION_TOKEN);

  console.log('autenticacaoGuard: Verificando acesso para a rota:', state.url);

  return autenticacaoService.isAutenticado$.pipe(
    map((isAutenticado) => {
      if (isAutenticado) {
        console.log('autenticacaoGuard: Usuário autenticado. Acesso permitido.');
        return true;
      }

      // Constrói a URL de redirecionamento completa para onde o usuário deve voltar.
      let urlDeRetorno: string;
      if (isPlatformBrowser(platformId)) {
        // No navegador: Usa a origem atual + a URL que o usuário tentou acessar
        urlDeRetorno = window.location.origin + state.url;
      } else {
        // No servidor: Usa a URL base configurada no environment
        urlDeRetorno = (configuracaoSSO.urlBaseAplicacaoCliente || '') + state.url;
      }
      
      console.log('autenticacaoGuard: URL de retorno preparada:', urlDeRetorno);

      // Obtém a URL do serviço de SSO externo passando a nossa URL de retorno como parâmetro
      const ssoLoginUrl = autenticacaoService.getUrlLoginSSO(urlDeRetorno);

      if (ssoLoginUrl) {
        console.log('autenticacaoGuard: Redirecionando para SSO Externo:', ssoLoginUrl);
        
        if (isPlatformBrowser(platformId)) {
          console.log('autenticacaoGuard [Browser]: window.location.href =', ssoLoginUrl);
          window.location.href = ssoLoginUrl;
          return false; 
        } else {
          if (response) {
            console.log('autenticacaoGuard [Server]: Redirecionando via Express 302');
            response.redirect(302, ssoLoginUrl);
            response.end();
          } else {
            console.warn('autenticacaoGuard [Server]: Objeto RESPONSE não encontrado no SSR.');
          }
          return false;
        }
      } else {
        // Fallback para login interno caso o SSO não esteja configurado
        console.log('autenticacaoGuard: SSO não configurado. Redirecionando para login interno.');
        return router.createUrlTree(['/login'], {
          queryParams: {
            redirect_url: urlDeRetorno,
          },
          queryParamsHandling: 'merge' // Mantém outros parâmetros existentes
        });
      }
    })
  );
};
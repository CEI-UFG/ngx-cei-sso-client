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
  // O token RESPONSE é injetado opcionalmente. Ele só existirá no servidor.
  // A importação real virá de 'express', mas o token é fornecido no app.config.server.ts
  const response: Response | null = inject(RESPONSE, { optional: true });
  const configuracaoSSO = inject(CONFIGURACAO_SSO_INJECTION_TOKEN);

  

  return autenticacaoService.isAutenticado$.pipe(
    map((isAutenticado) => {
      if (isAutenticado) {
        console.log('Usuário autenticado. Acesso permitido.');
        return true;
      }

      // Constrói a URL de redirecionamento completa.
      let redirectUrl: string;
      if (isPlatformBrowser(platformId)) {
        // No navegador, a origem (protocolo, host, porta) está disponível em window.location.
        redirectUrl = window.location.origin + state.url;
      } else {
        // No servidor, não temos window.location.
        // A melhor prática é configurar a URL base da aplicação como uma variável de ambiente.
        // Por enquanto, vamos usar um placeholder ou uma URL base fixa.
        redirectUrl = configuracaoSSO.urlBaseAplicacaoCliente + state.url; // Ou uma URL base do environment: `environment.baseUrl + state.url`
      }
      // Lógica para usuário não autenticado
      const ssoLoginUrl = autenticacaoService.getUrlLoginSSO(redirectUrl);

      if (ssoLoginUrl) {
        console.log('URL de redirecionamento identificada: ' + redirectUrl);
        console.log('Usuário não autenticado. Redirecionando para SSO.');
        console.log(`URL de login SSO: ${ssoLoginUrl}`);
        // FLUXO DE REDIRECIONAMENTO PARA SSO
        if (isPlatformBrowser(platformId)) {
          // No navegador: redireciona usando window.location
          console.log('Client-side: Redirecionando para SSO.');
          window.location.href = ssoLoginUrl;
          return false; // Interrompe a navegação do Angular
        } else {
          // No servidor: usa o objeto de resposta do Express para enviar um status 302
          if (response) {
            console.log('Server-side: Redirecionando para SSO com status 302.');
            response.redirect(302, ssoLoginUrl);
          } else {
            // Fallback caso o 'response' não seja injetado corretamente
            console.warn('Server-side: Objeto RESPONSE não encontrado. O redirecionamento SSR não ocorrerá.');
          }
          return false; // Interrompe a navegação do Angular
        }
      } else {
        // FLUXO DE FALLBACK (sem ssoLoginUrl)
        // Redireciona para a página de login interna da aplicação
        console.log('Fallback: Redirecionando para a página de login interna.');
        return router.createUrlTree(['/login'], {
          queryParams: {
            redirect_url: state.url,
          },
        });
      }
    })
  );
};
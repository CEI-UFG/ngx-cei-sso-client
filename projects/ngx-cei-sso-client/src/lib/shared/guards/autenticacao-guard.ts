import { inject, PLATFORM_ID, Optional } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AutenticacaoService } from '../services/autenticacao-service';
import { map } from 'rxjs';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { Response } from 'express';
import { RESPONSE } from '../constants/requisicao-ssr-token';


export const autenticacaoGuard: CanActivateFn = (route, state) => {

  // Injeção de dependências
  const autenticacaoService = inject(AutenticacaoService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);
  // O token RESPONSE é injetado opcionalmente. Ele só existirá no servidor.
  // A importação real virá de 'express', mas o token é fornecido no app.config.server.ts
  const response: Response | null = inject(RESPONSE, { optional: true });

  return autenticacaoService.isAutenticado$.pipe(
    map((isAutenticado) => {
      if (isAutenticado) {
        console.log('Usuário autenticado. Acesso permitido.');
        return true;
      }

      // Lógica para usuário não autenticado
      const ssoLoginUrl = autenticacaoService.getUrlLoginSSO(state.url);

      if (ssoLoginUrl) {
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
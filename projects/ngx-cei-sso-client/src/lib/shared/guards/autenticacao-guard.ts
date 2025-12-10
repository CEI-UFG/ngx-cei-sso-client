import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AutenticacaoService } from '../services/autenticacao-service';
import { map } from 'rxjs';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';


export const autenticacaoGuard: CanActivateFn = (route, state) => {
  const platformId = inject(PLATFORM_ID);

  const autenticacaoService = inject(AutenticacaoService);
  const router = inject(Router);
  const isBrowser = isPlatformBrowser(platformId);

  return autenticacaoService?.isAutenticado$.pipe(
    map(isAutenticado => {
      if (isAutenticado) {
        // 1. USUÁRIO AUTENTICADO
        return true; 
      } else {
        // 2. USUÁRIO NÃO AUTENTICADO: LÓGICA HÍBRIDA
        let urlDeRetorno = state.url; 
        
        if (isBrowser) {
            // Garante que o URL de retorno é absoluto para o servidor de SSO
            urlDeRetorno = window.location.origin + urlDeRetorno;          
        }

        // Tenta construir a URL de login do SSO externo
        const ssoLoginUrl = autenticacaoService.getUrlLoginSSO(urlDeRetorno);

        if(ssoLoginUrl) {
          // FLUXO EXTERNO (SSO)
          console.log('Tentando redirecionar para:', ssoLoginUrl);
          if (isBrowser) {
              window.location.href = ssoLoginUrl; // Redireciona o navegador
          }

          console.log('A navegação foi interrompida');

          
          return false; // Interrompe a navegação interna do Angular

        }else{
          // FLUXO INTERNO (Fallback)
          return router.createUrlTree(['/login'], {
            queryParams: { 
              redirect_url: state.url 
            }
          });
        }
      }
    })
  );
};
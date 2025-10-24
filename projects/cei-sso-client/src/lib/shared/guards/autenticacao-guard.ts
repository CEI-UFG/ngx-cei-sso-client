import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AutenticacaoService } from '../services/autenticacao-service';
import { map } from 'rxjs';
import { Router } from '@angular/router';


export const autenticacaoGuard: CanActivateFn = (route, state) => {
  const autenticacaoService = inject(AutenticacaoService);
  const router = inject(Router);
// Verifica o estado de autenticação do serviço (baseado na presença do token)

// O AuthGuard usa o estado de autenticação reativo (Observable) do AuthService
  return autenticacaoService?.isAutenticado$.pipe(
    map(isAutenticado => {
      if (isAutenticado) {
        // 1. USUÁRIO AUTENTICADO: Permite o acesso à rota
        return true; 
      } else {
        // 2. USUÁRIO NÃO AUTENTICADO: Redireciona para a tela de login
        
        // Captura a URL que o usuário estava tentando acessar ('/dashboard', '/perfil/123', etc.)
        const originalUrl = state.url; 
        
        // Cria um UrlTree que representa o redirecionamento para /login
        // e anexa a URL original como um query parameter 'redirect_url'.
        return router.createUrlTree(['/login'], {
          queryParams: { 
            redirect_url: originalUrl 
          }
        });
      }
    })
  );
};

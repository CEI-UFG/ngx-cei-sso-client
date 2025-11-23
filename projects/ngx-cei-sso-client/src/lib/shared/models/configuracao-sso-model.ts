export interface ConfiguracaoSSO {

    /**
    * Retorna a URL base do servidor de Single Sign-On (SSO).
    * Ex: 'https://api.meusistema.com'
    */
    urlBase: string;
  
    /**
    * Retorna o caminho do endpoint de Login.
    * Ex: '/auth/login'
    */
    urlLogin: string;
  
  /**
   * Retorna o caminho do endpoint de Logout.
   * Ex: '/auth/logout'
   */
    urlLogout: string;
  
  /**
   * Retorna o URL completa para onde o usuário deve ser redirecionado após o logout.
   * Ex: 'http://localhost:4200/login'
   */
    redirectUriPosLogout: string;
    
}
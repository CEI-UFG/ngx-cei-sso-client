export interface ConfiguracaoSSO {

    /**
    * Retorna a URL base do servidor de Single Sign-On (SSO).
    * Ex: 'https://api.meusistema.com'
    */
    urlBaseServicoSSO: string;
  
    /**
    * Retorna o caminho do endpoint de Login.
    * Ex: '/auth/login'
    */
    pathLogin: string;
  
  /**
   * Retorna o caminho do endpoint de Logout.
   * Ex: '/auth/logout'
   */
    pathLogout: string;
  
  /**
   * Retorna o URL completa para onde o usuário deve ser redirecionado após o logout.
   * Ex: 'http://localhost:4200/login'
   */
    redirectUriPosLogout: string;

    /**
     * Retorna a URL base da aplicação cliente que utiliza o SSO.
     * Ex: 'http://localhost:4200'
     */
    urlBaseAplicacaoCliente?: string;
    
}
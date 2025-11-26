// Define o tipo da função de mapeamento que aceita um objeto genérico e retorna 
// o objeto esperado pelo backend (ex: {login, password}).
export type CredenciaisPayLoad = (credenciaisPayload: any) => any;
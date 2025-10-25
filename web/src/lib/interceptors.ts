import { api } from './api';
import { authService } from './auth';

// Interceptador de requisição
api.interceptors.request.use(
  (config) => {
    const token = authService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptador de resposta
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response) {
      // Erro 401: Token inválido ou expirado
      if (error.response.status === 401) {
        authService.logout();
        window.location.href = '/';
        return Promise.reject(new Error('Sessão expirada. Por favor, faça login novamente.'));
      }

      // Erro 403: Sem permissão
      if (error.response.status === 403) {
        return Promise.reject(new Error('Você não tem permissão para acessar este recurso.'));
      }

      // Erro 404: Não encontrado
      if (error.response.status === 404) {
        return Promise.reject(new Error('Recurso não encontrado.'));
      }

      // Erro 422: Validação
      if (error.response.status === 422) {
        return Promise.reject(new Error('Dados inválidos. Por favor, verifique os campos.'));
      }

      // Erro 500: Erro interno do servidor
      if (error.response.status === 500) {
        return Promise.reject(new Error('Erro interno do servidor. Tente novamente mais tarde.'));
      }
    }

    // Erro de rede ou outro erro não tratado
    return Promise.reject(new Error('Erro de conexão. Verifique sua internet.'));
  }
);

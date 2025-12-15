import axios from "axios";
import { getToken, removeToken } from './services/authStorage';
import { authEmitter } from './services/authEmitter'; // IMPORTANTE

// URL base da API.
export const API_URL = "http://10.175.28.105:8000";

// Instância axios pronta para uso
export const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar o token a cada requisição
api.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete config.headers.Authorization;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para tratar erros (ex: token expirado)
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    if (error.response && error.response.status === 401) {
      console.error("Token inválido ou expirado (401 Unauthorized). Forçando logout...");

      // Remove token automaticamente
      await removeToken();

      // Emite evento de logout para o AuthProvider
      authEmitter.emit("logout");
    }

    return Promise.reject(error);
  }
);

export default api;

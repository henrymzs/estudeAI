// mobile/src/api.js
import axios from "axios";

/**
 * URL base da API.
 * - Em desenvolvimento local com expo no celular/emulador, ajuste conforme necessário:
 *   - Expo (LAN): usar o IP da sua máquina: ex: "http://192.168.0.100:8000"
 *   - Android emulator (AVD): "http://10.0.2.2:8000"
 *   - iOS simulator: "http://127.0.0.1:8000" geralmente funciona
 */
// mobile/src/api.js
export const API_URL = "http://10.105.187.105:8000";

// instância axios pronta para uso (opcional — você pode continuar usando axios diretamente)
export const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// helper para setar token de autorização quando fizer login
export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
}

export default api;

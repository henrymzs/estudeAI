import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'user_token';

// Salva o token após o login
export const setToken = async (token) => {
    try {
        await AsyncStorage.setItem(TOKEN_KEY, token);
    } catch (e) {
        console.error("Erro ao salvar token:", e);
    }
};

// Obtém o token para usar em requisições
export const getToken = async () => {
    try {
        return await AsyncStorage.getItem(TOKEN_KEY);
    } catch (e) {
        console.error("Erro ao ler token:", e);
        return null;
    }
};

// Remove o token no logout
export const removeToken = async () => {
    try {
        await AsyncStorage.removeItem(TOKEN_KEY);
    } catch (e) {
        console.error("Erro ao remover token:", e);
    }
};
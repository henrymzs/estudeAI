import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = '@MyApp:userToken';

export async function setToken(token) {
    try {
        await AsyncStorage.setItem(TOKEN_KEY, token);
        console.log('Token salvo com sucesso.');
    } catch (error) {
        console.error('Erro ao salvar token:', error);
    }
}

export async function getToken() {
    try {
        const token = await AsyncStorage.getItem(TOKEN_KEY);
        return token;
    } catch (error) {
        console.error('Erro ao buscar token:', error);
        return null;
    }
}

export async function removeToken() {
    try {
        await AsyncStorage.removeItem(TOKEN_KEY);
        console.log('Token removido com sucesso.');
    } catch (error) {
        console.error('Erro ao remover token:', error);
    }
}

export default { getToken, setToken, removeToken };

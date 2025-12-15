import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

// Importa o hook de autenticação (Ajuste o caminho se necessário)
import { useAuth } from '../contexts/auth';

// --- IMPORTAÇÕES DE NAVEGADORES E TELAS (AJUSTADAS CONFORME SUAS PASTAS) ---
// 1. Importa o seu navegador de Autenticação
import AuthNavigator from './AuthNavigator'; 
// 2. Importa as telas da Aplicação
import Home from '../screens/main/Home'; 
import CreateDecks from '../screens/main/CreateDecks'; 
import CreateManualFlashCards from '../screens/main/CreateManualFlashCards'; 

// Criando Navegadores
const AppStack = createStackNavigator();

// Navegação da Aplicação (Após o Login)
const AppRoutes = () => (
    <AppStack.Navigator 
        screenOptions={{ headerShown: false }}
    >
        {/* Usando os componentes importados corretamente */}
        <AppStack.Screen name="Home" component={Home} />
        <AppStack.Screen name="CreateDeck" component={CreateDecks} />
        <AppStack.Screen name="CreateManualFlashCards" component={CreateManualFlashCards} />
        {/* Adicione outras rotas da aplicação aqui, se houver */}
    </AppStack.Navigator>
);

// Componente de Rota Principal
export default function Routes() {
    const { signed, loading } = useAuth();
    
    // Mostra um indicador de carregamento enquanto verifica o token no AsyncStorage
    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#667eea" />
            </View>
        );
    }
    
    // Renderização Condicional: A SOLUÇÃO PARA O ERRO DE NAVEGAÇÃO
    return (
        <NavigationContainer>
            {/* Se signed=true, renderiza o AppRoutes (telas logadas). 
                Se signed=false, renderiza o AuthNavigator (telas de Login/Welcome). */}
            {signed ? <AppRoutes /> : <AuthNavigator />}
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
    },
});
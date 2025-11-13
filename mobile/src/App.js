import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
// IMPORTANTE: Importamos o provider da nova biblioteca para resolver o aviso de depreciação
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './navigation/AppNavigator';

// Importações do Firebase para garantir a configuração da aplicação
import { initializeApp } from 'firebase/app';
// Variáveis globais MANDATÓRIAS (fornecidas pelo ambiente Canvas)
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const firebaseConfig = JSON.parse(typeof __firebase_config !== 'undefined' ? __firebase_config : '{}');

// Inicializa o Firebase APENAS UMA VEZ
if (Object.keys(firebaseConfig).length > 0) {
    initializeApp(firebaseConfig);
} else {
    console.warn("Firebase config not found. App running without backend services.");
}


export default function App() {
    return (
        // O SafeAreaProvider deve envolver o componente de navegação
        // Colocando o NavigationContainer dentro do Provider, garantindo que toda a navegação
        // tenha acesso às margens de área segura.
        <SafeAreaProvider> 
            <NavigationContainer> 
                <AppNavigator />
            </NavigationContainer>
        </SafeAreaProvider>
    );
}
import React, { createContext, useState, useEffect, useContext } from 'react';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';

// Variáveis globais (disponíveis no ambiente Canvas)
const firebaseConfig = JSON.parse(typeof __firebase_config !== 'undefined' ? __firebase_config : '{}');
let firebaseApp, auth, db;

// Inicializa o Firebase e serviços - Bloco crítico que precisa ser seguro
if (Object.keys(firebaseConfig).length > 0) {
    try {
        // Inicializa o App
        firebaseApp = initializeApp(firebaseConfig);
        // Inicializa o Auth e Firestore a partir do App
        auth = getAuth(firebaseApp);
        db = getFirestore(firebaseApp);
        console.log("Firebase services initialized successfully.");
    } catch (e) {
        // Se houver um erro de dependência ou o app já estiver inicializado, capturamos aqui
        console.error("ERRO CRÍTICO NA INICIALIZAÇÃO DO FIREBASE (Global):", e.message);
        // Fallback para objetos mockados para evitar o crash do aplicativo
        auth = { currentUser: null, signOut: async () => {}, onAuthStateChanged: (app, callback) => callback(null) }; 
        db = {};
    }
} else {
    console.warn("Firebase config not found. Auth and Firestore will be MOCKED.");
    // Cria objetos mockados se não houver configuração
    auth = { currentUser: null, signOut: async () => {}, onAuthStateChanged: (app, callback) => callback(null) }; 
    db = {};
}

// Chave para armazenar o token 
const AUTH_TOKEN_KEY = '@EstudeAI:token';

// 1. Cria o Contexto
const AuthContext = createContext({});

// 2. Cria o Provider (Componente que irá envolver a aplicação)
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Efeito para autenticar na inicialização 
    useEffect(() => {
        // Verifica se o objeto 'auth' é funcional (não é o mock simples)
        if (!auth || typeof auth.signOut !== 'function') {
            console.log("Auth is MOCKED or UNINITIALIZED, skipping real sign-in attempt.");
            setLoading(false);
            return;
        }

        const initialAuth = async () => {
            const token = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;
            try {
                if (token) {
                    await signInWithCustomToken(auth, token);
                } else {
                    // Loga anonimamente, pois é o padrão no ambiente Canvas
                    await signInAnonymously(auth);
                }
            } catch (error) {
                // Captura erros de login (ex: token inválido, regras de segurança)
                console.error("Firebase Auth initial sign-in failed:", error.message);
            } finally {
                // Este é o observador de estado do Firebase, deve ser executado por último
                const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
                    if (authUser) {
                        setUser({ uid: authUser.uid, email: authUser.email || 'anonymous' });
                    } else {
                        setUser(null);
                    }
                    setLoading(false);
                });

                // Limpa o observador ao desmontar o componente
                return unsubscribe;
            }
        };

        initialAuth();
        
    }, []); // Executa apenas uma vez na montagem do componente

    // Função de Sign In (simulada para integração inicial)
    async function signIn(email, password) {
        setLoading(true);
        // --- ADICIONE AQUI A LÓGICA REAL DE LOGIN (API/Firebase) ---
        try {
            // Simulação de login bem-sucedido
            const fakeToken = 'some-jwt-token-from-backend';
            await AsyncStorage.setItem(AUTH_TOKEN_KEY, fakeToken);
            setUser({ uid: 'mock-user-123', email: email });
            setLoading(false);
            return { success: true }; 
        } catch (error) {
            setLoading(false);
            console.error("Login failed:", error.message);
            return { success: false, error: error.message };
        }
    }

    // Função de Log Out (CRUCIAL para a sua solução de erro 401)
    async function logOut() {
        console.log("Usuário deslogado: limpando token e estado.");
        await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
        try {
            if (auth.currentUser) {
                await auth.signOut();
            }
        } catch (error) {
            console.error("Firebase SignOut failed:", error.message);
        }
        setUser(null); // Define o estado do usuário como nulo
    }

    // O 'signed' é o que o componente Routes usa para trocar o Navigator.
    return (
        <AuthContext.Provider 
            value={{ 
                signed: !!user, // Transforma o objeto 'user' em booleano
                user, 
                loading, 
                signIn, 
                logOut,
                db, // Exporta o db para uso em outros componentes
                auth // Exporta o auth para uso em outros componentes
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

// 3. Cria um hook para facilitar o uso do Contexto (e.g., const { logOut } = useAuth();)
export function useAuth() {
    return useContext(AuthContext);
}
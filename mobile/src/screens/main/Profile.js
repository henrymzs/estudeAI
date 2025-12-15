import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, StatusBar, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
<<<<<<< HEAD
import { useNavigation, useIsFocused } from '@react-navigation/native';
import axios from 'axios';
import { getToken, removeToken } from '../../services/authStorage'; // Assumindo que você implementou removeToken
import { Card } from '../../components/card'; // Importação do componente Card

// URL BASE DA API (Ajuste se necessário, mesma da Home)
const API_BASE_URL = 'http://10.175.28.105:8000'; 

// Componente Card (mockado, se não tiver o arquivo 'card.js')
/*
const Card = ({ number, label, style, numberStyle }) => (
    <View style={[styles.statCardMock, style]}>
        <Text style={[styles.statNumberMock, numberStyle]}>{number}</Text>
        <Text style={styles.statLabelMock}>{label}</Text>
    </View>
);
*/
=======
import { Card } from '../../components/Card';
>>>>>>> 88dd7657b932da426b5656b1ef71cfe9660122bb

export default function Profile() {
    const navigation = useNavigation();
    const isFocused = useIsFocused(); 

    // --- Estados para Dados e UI ---
    const [userName, setUserName] = useState('...');
    const [userEmail, setUserEmail] = useState('...');
    const [userStats, setUserStats] = useState([
        { number: '0', label: 'Flashcards' },
        { number: '0', label: 'Decks Criados' },
        { number: '0', label: 'Dias Seguidos' }
    ]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- Opções de Configuração/Menu ---
    // Adicionando a função de Sair e usando as funções de navegação
    const configOptions = [
        {
            icon: 'create-outline',
            title: 'Editar Perfil',
            subtitle: 'Nome, foto e informações',
            onPress: () => console.log('Navegar para Editar Perfil') // Implementar navegação real
        },
        {
            icon: 'lock-closed-outline',
            title: 'Alterar Senha',
            subtitle: 'Segurança da conta',
            onPress: () => console.log('Navegar para Alterar Senha') // Implementar navegação real
        },
        {
            icon: 'notifications-outline',
            title: 'Notificações',
            subtitle: 'Lembretes e alertas',
            onPress: () => console.log('Navegar para Configurações de Notificações')
        },
        {
            icon: 'help-circle-outline',
            title: 'Ajuda e Suporte',
            subtitle: 'FAQ e contato',
            onPress: () => console.log('Navegar para Ajuda e Suporte')
        },
        {
            icon: 'log-out-outline',
            title: 'Sair da Conta',
            subtitle: 'Limpar token e finalizar sessão',
            isLogout: true, // Flag para estilização e função de sair
            onPress: async () => {
                await handleLogout();
            }
        },
    ];

    // --- Funções de API ---

    // Função para buscar dados do perfil (Nome, Email) e Stats
    const fetchProfileData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const token = await getToken();
            if (!token) {
                // Se não houver token, navega para o login
                navigation.replace('Login');
                return;
            }

            const config = {
                headers: { 'Authorization': `Bearer ${token}` }
            };

            // 1. Busca os dados do usuário (Nome, Email)
            const userResponse = await axios.get(`${API_BASE_URL}/users/me/`, config);
            const userData = userResponse.data;
            
            // Lógica para extrair nome e email de forma segura
            const fetchedUserName = userData?.nome || userData?.name || userData?.username || 'Usuário';
            const fetchedUserEmail = userData?.email || 'email@exemplo.com';
            setUserName(fetchedUserName);
            setUserEmail(fetchedUserEmail);

            // 2. Busca as Estatísticas (Assumindo um endpoint /users/stats)
            // Se as stats viessem em /users/me, o passo 2 seria opcional.
            try {
                const statsResponse = await axios.get(`${API_BASE_URL}/users/stats/`, config);
                const statsData = statsResponse.data; // Ex: { total_cards: 127, total_decks: 12, streak_days: 7 }

                setUserStats([
                    { number: String(statsData.total_cards || 0), label: 'Flashcards' },
                    { number: String(statsData.total_decks || 0), label: 'Decks Criados' },
                    { number: String(statsData.streak_days || 0), label: 'Dias Seguidos' }
                ]);
            } catch (statsErr) {
                console.warn("Aviso: Falha ao buscar estatísticas. Usando 0 como fallback.", statsErr.message);
                // Mantém o valor '0' inicial para as estatísticas
            }

        } catch (err) {
            console.error("Erro ao buscar dados do perfil:", err);
            setError("Falha ao carregar perfil. Tente novamente.");

            if (axios.isAxiosError(err) && err.response && err.response.status === 401) {
                 await handleLogout(false); // Não mostra o erro se for apenas para ir para o Login
            }
        } finally {
            setLoading(false);
        }
    }, [navigation]);

    // Função de Logout
    const handleLogout = async (showError = true) => {
        if (showError) {
             setLoading(true);
        }
        await removeToken(); // Limpa o token do storage
        setLoading(false);
        navigation.replace('Login'); // Redireciona para a tela de Login
    };

    // Efeito para carregar os dados quando a tela for focada
    useEffect(() => {
        if (isFocused) {
            fetchProfileData();
        }
    }, [isFocused, fetchProfileData]);

    // --- Renderização de Loading e Erro ---

    if (loading && userName === '...') { // Só mostra loading na primeira carga
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color="#667eea" />
                <Text style={{ marginTop: 10, color: '#4a5568' }}>Carregando perfil...</Text>
            </View>
        );
    }
    
    if (error) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <Ionicons name="alert-circle-outline" size={32} color="#f56565" />
                <Text style={{ marginTop: 10, color: '#f56565', textAlign: 'center', paddingHorizontal: 30 }}>{error}</Text>
                <TouchableOpacity style={{ marginTop: 20 }} onPress={fetchProfileData}>
                    <Text style={{ color: '#667eea', fontWeight: 'bold' }}>Tentar Novamente</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ marginTop: 20 }} onPress={() => handleLogout()}>
                    <Text style={{ color: '#f56565', fontWeight: 'bold' }}>Sair</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // --- Renderização Principal ---

    const avatarLetter = userName.charAt(0).toUpperCase();

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            <LinearGradient
                colors={['#667eea', '#764ba2']}
                style={styles.header}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <View style={styles.headerContent}>
                    <Text style={styles.headerTitle}>Perfil</Text>
                    <Text style={styles.headerSubtitle}>Gerencie sua conta e preferências</Text>
                </View>
            </LinearGradient>

            {/* Container do Avatar e Info */}
            <View style={styles.avatarContainer}>
                <LinearGradient
                    colors={['#667eea', '#764ba2']}
                    style={styles.avatar}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    <Text style={styles.avatarText}>{avatarLetter}</Text>
                </LinearGradient>
                <View style={styles.avatarInfo}>
                    <Text style={styles.userName}>{userName}</Text>
                    <Text style={styles.userEmail}>{userEmail}</Text>
                    <TouchableOpacity style={styles.activeButton}>
                        <Text style={styles.activeButtonText}>Conta Ativa</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Container de Estatísticas */}
            <View style={styles.statsContainer}>
                {userStats.map((stat, index) => (
                    <Card
                        key={index}
                        number={stat.number}
                        label={stat.label}
                        style={styles.statCard}
                        numberStyle={{ fontSize: 24 }}
                    />
                ))}
            </View>

            {/* Seção de Configurações */}
            <ScrollView style={styles.section} showsVerticalScrollIndicator={false}>
                <Text style={styles.sectionTitle}>Configurações</Text>
                {configOptions.map((option, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[styles.configItem, option.isLogout && styles.logoutItem]}
                        onPress={option.onPress}
                        activeOpacity={0.7}
                    >
                        <View style={styles.configItemContent}>
                            <View style={[styles.configIcon, option.isLogout && styles.logoutIconBg]}>
                                <Ionicons
                                    name={option.icon}
                                    size={22}
                                    color={option.isLogout ? '#f56565' : '#667eea'}
                                />
                            </View>
                            <View style={styles.configTextContainer}>
                                <Text style={[styles.configTitle, option.isLogout && styles.logoutTitle]}>{option.title}</Text>
                                <Text style={styles.configSubtitle}>{option.subtitle}</Text>
                            </View>
                        </View>
                        {!option.isLogout && (
                            <Ionicons
                                name="chevron-forward"
                                size={20}
                                color="#a0aec0"
                            />
                        )}
                    </TouchableOpacity>
                ))}
                <View style={{ height: 30 }}/> {/* Espaçamento no final da ScrollView */}
            </ScrollView>
        </View>
    );
};

// --- Estilos ---
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    header: {
        paddingTop: 60,
        paddingHorizontal: 20,
    },
    headerContent: {
        marginBottom: 20,
    },
    headerTitle: {
        color: '#fff',
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    headerSubtitle: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 16,
    },
    avatarContainer: {
        paddingHorizontal: 12,
        backgroundColor: '#fff',
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        margin: 12,
        padding: 8,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 10,
        elevation: 8,
    },
    avatarInfo: {
        marginLeft: 12,
    },
    avatar: {
        margin: 12,
        width: 60,
        height: 60,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
    },
    userName: {
        color: '#2d3748', // Cor ajustada para consistência
        fontSize: 22,
        fontWeight: '600',
        marginBottom: 4,
    },
    userEmail: {
        color: '#718096', // Cor ajustada
        fontSize: 14,
        marginBottom: 8,
    },
    activeButton: {
        backgroundColor: '#DBFCE6',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
        alignSelf: 'flex-start',
    },
    activeButtonText: {
        color: '#2c794c',
        fontSize: 12,
        fontWeight: '600',
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 12,
        marginTop: 18,
    },
    statCard: {
        flex: 1, // Usar flex para melhor distribuição
        marginHorizontal: 4, // Espaçamento entre os cards
        padding: 14,
        marginBottom: 8,
    },
    // Estilos de fallback se o Card não for importado
    statCardMock: {
        width: 120,
        padding: 14,
        backgroundColor: '#fff',
        borderRadius: 15,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    statNumberMock: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2d3748',
    },
    statLabelMock: {
        fontSize: 12,
        color: '#718096',
        marginTop: 4,
        textAlign: 'center',
    },
    // Fim dos estilos de fallback
    section: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2d3748',
        marginBottom: 16,
    },
    configItem: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    configItemContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    configIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f7fafc',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    configTextContainer: {
        flex: 1,
    },
    configTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2d3748',
        marginBottom: 2,
    },
    configSubtitle: {
        fontSize: 14,
        color: '#718096',
    },
    // Estilos para o botão de Sair
    logoutItem: {
        borderColor: '#f56565',
        borderWidth: 1,
    },
    logoutIconBg: {
        backgroundColor: '#fee2e2',
    },
    logoutTitle: {
        color: '#f56565',
    }
});
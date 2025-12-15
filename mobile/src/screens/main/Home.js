import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { useState, useEffect, useCallback } from 'react';
// 1. IMPORTAÇÃO CHAVE: Usamos a instância 'api' com o Interceptor configurado
import api from '../../api'; 
// Se precisar do logout, o AuthContext é o local ideal, mas por agora focamos na API

// URL BASE DA API (Esta constante é agora redundante, pois a URL base está no api.js)
// const API_BASE_URL = 'http://10.105.187.105:8000'; 

// Função auxiliar para formatar a data (ajusta o datetime do backend)
const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    // Ex: "25 Nov"
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).replace('.', '');
};

export default function Home() {
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    
    const [userName, setUserName] = useState('');
    const [userDecks, setUserDecks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Função para buscar dados (Decks e nome do usuário)
    const fetchUserData = useCallback(async () => {
        setLoading(true);
        setError(null);
        
        try {
            // *** MUDANÇA 1: A instância 'api' se encarrega da autenticação ***
            
            // --- 1. Busca os Decks do Usuário ---
            // Usamos a URL relativa, o 'api' cuidará do prefixo base e do token
            const decksResponse = await api.get('/decks/'); 

            const decksData = decksResponse.data;
            setUserDecks(decksData);

            // --- 2. Busca os dados do usuário (Nome) ---
            // Usamos a URL relativa
            const userResponse = await api.get('/auth/users/me');
            
            console.log("[DEBUG] Resposta do /users/me:", userResponse.data);

            const userData = userResponse.data;

            // Tenta extrair o nome de campos comuns (nome, name, username)
            const fetchedUserName = userData?.nome || userData?.name || userData?.username || 'Usuário Ativo';
            setUserName(fetchedUserName);


        } catch (err) {
            console.error("Erro ao buscar dados do usuário:", err);
            
            // IMPORTANTE: Não navegamos para 'Login' aqui.
            // O interceptor do `api` já detecta 401, remove o token e emite logout.
            // O AuthProvider (ou sua lógica de rotas) deve reagir a isso e trocar para o AuthStack.
            // Aqui apenas exibimos a mensagem de erro apropriada ao usuário.
            if (err.response) {
                if (err.response.status === 401) {
                    setError("Sessão expirada. Por favor, faça login novamente.");
                    // NÃO execute navigation.reset/navigate/replace('Login') aqui
                    // para evitar warnings quando a tela Login pertence a outro navigator.
                    return;
                }
                setError(`Erro do Servidor: ${err.response.status}.`);
            } else if (err.request) {
                // Erro de rede (servidor offline ou inacessível)
                 setError("Falha na conexão. Verifique o endereço da API e sua rede.");
            } else {
                 setError("Ocorreu um erro inesperado.");
            }
            
        } finally {
            setLoading(false);
        }
    }, [navigation]);

    // Efeito para carregar os dados quando a tela for focada
    useEffect(() => {
        if (isFocused) {
            // Assumimos que o Interceptor fará o trabalho de verificar o token
            fetchUserData();
        }
    }, [isFocused, fetchUserData]);


    // Dados derivados:
    const totalDecks = userDecks.length;
    // Garante que 'flashcards' é um array antes de calcular o length
    const totalCards = userDecks.reduce((sum, deck) => sum + (Array.isArray(deck.flashcards) ? deck.flashcards.length : 0), 0);
    
    const displayUserName = userName || '...';


    // --- Renderização de Loading e Erro ---

    if (loading) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color="#667eea" />
                <Text style={{ marginTop: 10, color: '#4a5568' }}>Carregando seus Decks...</Text>
            </View>
        );
    }
    
    if (error) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <Ionicons name="alert-circle-outline" size={32} color="#f56565" />
                <Text style={{ marginTop: 10, color: '#f56565', textAlign: 'center', paddingHorizontal: 30 }}>{error}</Text>
                <TouchableOpacity style={{ marginTop: 20 }} onPress={fetchUserData}>
                    <Text style={{ color: '#667eea', fontWeight: 'bold' }}>Tentar Novamente</Text>
                </TouchableOpacity>
            </View>
        );
    }
    // --- Fim da Renderização de Loading e Erro ---


    return (
        <View style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <LinearGradient
                    colors={['#667eea', '#764ba2']}
                    style={styles.header}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >

                    <View style={styles.headerContent}>
                        <View>
                            {/* Saudação fixa */}
                            <Text style={styles.greeting}>Bem-vindo(a),</Text> 
                            {/* Nome do Usuário REAL ou '...' se ainda não carregou */}
                            <Text style={styles.username}>{displayUserName} 👋</Text>
                        </View>
                        <TouchableOpacity style={styles.avatarButton}>
                            <Text style={styles.avatarText}>{displayUserName.charAt(0)}</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.statsContainer}>
                        <View style={styles.statCard}>
                            <Text style={styles.statNumber}>{totalCards}</Text>
                            <Text style={styles.statLabel}>Total de Cards</Text>
                        </View>
                        <View style={styles.statCard}>
                            <Text style={styles.statNumber}>{totalDecks}</Text>
                            <Text style={styles.statLabel}>Decks Criados</Text>
                        </View>
                    </View>
                </LinearGradient>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Seus Decks</Text>
                    {totalDecks === 0 ? (
                        <View style={styles.emptyState}>
                            <Ionicons name="folder-open-outline" size={40} color="#718096" />
                            <Text style={styles.emptyText}>Você ainda não tem decks. Crie um agora!</Text>
                            <TouchableOpacity style={{ marginTop: 15 }} onPress={() => navigation.navigate('CreateDeck')}>
                                 <Text style={{ color: '#667eea', fontWeight: 'bold' }}>Começar a Criar</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        userDecks.map((deck) => (
                            <View key={deck.id} style={styles.deckCard}>
                                <View style={styles.deckInfo}>
                                    {/* Usando uma cor aleatória ou baseada no ID */}
                                    <View style={[styles.deckIcon, { backgroundColor: ['#FF6B9D', '#4ECDC4', '#45B7D1'][deck.id % 3] }]}>
                                        <Ionicons name="library" size={20} color="#fff" />
                                    </View>
                                    <View style={styles.deckDetails}>
                                        <Text style={styles.deckTitle}>{deck.titulo}</Text>
                                        <View style={styles.deckMetaContainer}>
                                            <View style={styles.cardCount}>
                                                {/* Adicionando verificação de array antes de usar .length */}
                                                <Text style={styles.cardCountText}>{Array.isArray(deck.flashcards) ? deck.flashcards.length : 0} cards</Text>
                                            </View>
                                            {/* Data de criação real do banco de dados */}
                                            <Text style={styles.deckDate}> • {formatDate(deck.criado_em)}</Text>
                                        </View>
                                    </View>
                                </View>
                                <TouchableOpacity 
                                    style={styles.studyButton}
                                    onPress={() => navigation.navigate('StudyDeck', { deckId: deck.id, deckTitle: deck.titulo })} // Rota de estudo a ser implementada
                                >
                                    <Text style={styles.studyButtonText}>Estudar</Text>
                                </TouchableOpacity>
                            </View>
                        ))
                    )}
                </View>

                {/* Restante da UI (Ações Rápidas) */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Ações Rápidas</Text>
                    <View style={styles.actionsContainer}>
                        <TouchableOpacity style={styles.actionCard}>
                            <View style={styles.actionIcon}>
                                <Ionicons name="document-text" size={24} color="#fff" />
                            </View>
                            <Text style={styles.actionText}>Upload PDF/DOCX</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={styles.actionCard}
                            // Opção de navegar para a criação manual, se desejar.
                            onPress={() => navigation.navigate('CreateManualFlashCards')} 
                        >
                            <View style={[styles.actionIcon, { backgroundColor: '#667eea' }]}>
                                <Ionicons name="create" size={24} color="#fff" />
                            </View>
                            <Text style={styles.actionText}>Criar Manualmente</Text>
                        </TouchableOpacity>
                    </View>
                </View>

            </ScrollView>

<LinearGradient
                colors={['#667eea', '#764ba2']}
                style={styles.fab}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => navigation.navigate('CreateDeck')}
                    style={styles.fabTouchable} // ← Novo style
                >
                    <Ionicons name="add" size={24} color="#fff" />
                </TouchableOpacity>
            </LinearGradient>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    scrollContent: {
        paddingBottom: 100,
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 20,
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    greeting: {
        color: '#fff',
        fontSize: 16,
        opacity: 0.9,
    },
    username: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
    },
    avatarButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    avatarText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    statCard: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.15)',
        padding: 14,
        borderRadius: 20,
        marginHorizontal: 5,
        alignItems: 'center',
    },
    statNumber: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
    },
    statLabel: {
        color: '#fff',
        fontSize: 14,
        opacity: 0.9,
        marginTop: 5,
    },
    section: {
        paddingHorizontal: 20,
        paddingVertical: 12,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2d3748',
        marginBottom: 12,
    },
    deckCard: {
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 16,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    deckInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    deckIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    deckDetails: {
        flex: 1,
    },
    deckTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2d3748',
        marginBottom: 4,
    },
    deckMetaContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    cardCount: {
        backgroundColor: '#e2e8f0',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        marginRight: 4,
    },
    cardCountText: {
        fontSize: 12,
        color: '#4a5568',
        fontWeight: '600',
    },
    deckDate: {
        fontSize: 12,
        color: '#718096',
    },
    studyButton: {
        backgroundColor: '#48bb78',
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 20,
    },
    studyButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    actionCard: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 15,
        alignItems: 'center',
        marginHorizontal: 5,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    actionIcon: {
        width: 50,
        height: 50,
        borderRadius: 14,
        backgroundColor: '#ff6b9d', // Mudança de cor para diferenciar
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    actionText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#2d3748',
        textAlign: 'center',
    },
    fab: {
        position: 'absolute',
        bottom: 30,
        alignSelf: 'center',
        width: 60, // Aumentado um pouco
        height: 60,
        borderRadius: 30,
        backgroundColor: '#667eea',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    emptyState: {
        paddingVertical: 40,
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        marginTop: 10,
    },
    emptyText: {
        marginTop: 10,
        fontSize: 16,
        color: '#718096',
        textAlign: 'center',
    }
});

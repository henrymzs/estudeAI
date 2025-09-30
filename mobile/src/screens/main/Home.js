import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function Home() {
    const navigation = useNavigation();
    // dados mockados
    const userDecks = [
        {
            id: 1,
            title: 'Biologia Celular',
            cards: 5,
            date: '14 de jan',
            color: '#FF6B9D'
        },
        {
            id: 2,
            title: 'História do Brasil - República',
            cards: 4,
            date: '5 de jan',
            color: '#4ECDC4'
        },
        {
            id: 3,
            title: 'Química Orgânica - Aula 1',
            cards: 3,
            date: '11 de jan',
            color: '#45B7D1'
        }
    ];

    const totalCards = userDecks.reduce((sum, deck) => sum + deck.cards, 0);

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Bom dia';
        if (hour < 18) return 'Boa tarde';
        return 'Boa noite';
    };

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
                            <Text style={styles.greeting}>{getGreeting()},</Text>
                            <Text style={styles.username}>Visitante 👋</Text>
                        </View>
                        <TouchableOpacity style={styles.avatarButton}>
                            <Text style={styles.avatarText}>V</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.statsContainer}>
                        <View style={styles.statCard}>
                            <Text style={styles.statNumber}>{totalCards}</Text>
                            <Text style={styles.statLabel}>Total de Cards</Text>
                        </View>
                        <View style={styles.statCard}>
                            <Text style={styles.statNumber}>{userDecks.length}</Text>
                            <Text style={styles.statLabel}>Decks Criados</Text>
                        </View>
                    </View>
                </LinearGradient>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Seus Decks</Text>
                    {userDecks.map((deck) => (
                        <View key={deck.id} style={styles.deckCard}>
                            <View style={styles.deckInfo}>
                                <View style={[styles.deckIcon, { backgroundColor: deck.color }]}>
                                    <Ionicons name="library" size={20} color="#fff" />
                                </View>
                                <View style={styles.deckDetails}>
                                    <Text style={styles.deckTitle}>{deck.title}</Text>
                                    <View style={styles.deckMetaContainer}>
                                        <View style={styles.cardCount}>
                                            <Text style={styles.cardCountText}>{deck.cards} cards</Text>
                                        </View>
                                        <Text style={styles.deckDate}> • {deck.date}</Text>
                                    </View>
                                </View>
                            </View>
                            <TouchableOpacity style={styles.studyButton}>
                                <Text style={styles.studyButtonText}>Estudar</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Ações Rápidas</Text>
                    <View style={styles.actionsContainer}>
                        <TouchableOpacity style={styles.actionCard}>
                            <View style={styles.actionIcon}>
                                <Ionicons name="document-text" size={24} color="#fff" />
                            </View>
                            <Text style={styles.actionText}>Upload PDF/DOCX</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionCard}>
                            <View style={[styles.actionIcon, { backgroundColor: '#667eea' }]}>
                                <Ionicons name="logo-youtube" size={24} color="#fff" />
                            </View>
                            <Text style={styles.actionText}>Link do YouTube</Text>
                        </TouchableOpacity>
                    </View>
                </View>

            </ScrollView>

            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => navigation.navigate('CreateDeck')} 
            >
                <LinearGradient
                    colors={['#667eea', '#764ba2']} 
                    style={styles.fab}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }} 
                >
                    <Ionicons name="add" size={24} color="#fff" />
                </LinearGradient>
            </TouchableOpacity>
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
        backgroundColor: '#667eea',
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
        width: 50,
        height: 50,
        borderRadius: 30,
        backgroundColor: '#667eea',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
});
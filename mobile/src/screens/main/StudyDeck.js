import React, { useState, useEffect, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { 
    View, 
    Text, 
    TouchableOpacity, 
    StyleSheet, 
    StatusBar, 
    ActivityIndicator, 
    ScrollView, 
    Alert 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Progress from 'react-native-progress';
import api from '../../api'; // Cliente API configurado

export default function StudyDeck({ route }) {
    const navigation = useNavigation();
    const { deckId, deckTitle } = route.params || {};

    const [flashcards, setFlashcards] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const totalCards = flashcards.length;
    const currentCard = flashcards[currentIndex];
    const isLastCard = currentIndex === totalCards - 1;
    const progress = totalCards > 0 ? (currentIndex + 1) / totalCards : 0;

    if (!deckId) {
        console.error("Erro de Navegação: ID do Deck não fornecido.");
        navigation.goBack();
        return null;
    }

    const loadFlashcards = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get(`/flashcards/deck/${deckId}`);
            const fetchedCards = response.data;
            if (!Array.isArray(fetchedCards) || fetchedCards.length === 0) {
                setError("Este deck não possui flashcards para estudo.");
            } else {
                setFlashcards(fetchedCards);
                setCurrentIndex(0);
                setShowAnswer(false);
            }
        } catch (err) {
            console.error("Erro ao carregar flashcards:", err);
            const errorMessage = err.response?.data?.detail || "Falha ao conectar ou buscar os cards.";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [deckId]);

    useEffect(() => {
        loadFlashcards();
    }, [loadFlashcards]);

    const handleAnswer = async (difficulty) => {
        console.log(`Card ${currentCard.id} avaliado como: ${difficulty}`);

        if (isLastCard) {
            Alert.alert(
                '🎉 Parabéns!', 
                `Você completou o estudo de ${totalCards} flashcards no deck ${deckTitle}.`,
                [{ text: "Voltar para Home", onPress: () => navigation.popToTop() }]
            );
        } else {
            setCurrentIndex(prev => prev + 1);
            setShowAnswer(false);
        }
    };

    const handleCardFlip = () => {
        setShowAnswer(prev => !prev);
    };
    
    const handleRestart = () => {
        setCurrentIndex(0);
        setShowAnswer(false);
    };

    if (loading) {
        return (
            <View style={[styles.container, styles.center]}>
                <ActivityIndicator size="large" color="#667eea" />
                <Text style={styles.loadingText}>Carregando Flashcards...</Text>
            </View>
        );
    }
    
    if (error) {
        return (
            <View style={[styles.container, styles.center]}>
                <Ionicons name="alert-circle-outline" size={32} color="#f56565" />
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity style={styles.retryButton} onPress={loadFlashcards}>
                    <Text style={styles.retryButtonText}>Tentar Novamente</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.retryButton, { marginTop: 15 }]} onPress={() => navigation.goBack()}>
                    <Text style={styles.retryButtonText}>Voltar</Text>
                </TouchableOpacity>
            </View>
        );
    }
    
    if (!currentCard || totalCards === 0) {
        return (
            <View style={styles.container}>
                <Header 
                    deckTitle={deckTitle} 
                    current={0} 
                    total={0} 
                    onBack={() => navigation.goBack()} 
                    onRestart={handleRestart}
                    progress={0}
                />
                 <View style={[styles.center, {flex: 1, padding: 30}]}>
                    <Ionicons name="sad-outline" size={50} color="#718096" />
                    <Text style={[styles.errorText, { color: '#718096' }]}>
                        Este deck não contém flashcards. 
                        Crie alguns na tela anterior ou tente outro deck.
                    </Text>
                </View>
            </View>
        );
    }

    const CardContent = () => (
        <TouchableOpacity 
            key={currentCard.id} 
            style={styles.flashcard}
            activeOpacity={0.9}
            onPress={handleCardFlip}
        >
            <View style={styles.badgeContainer}>
                <Text style={[styles.badge, { 
                    backgroundColor: showAnswer ? '#48BB78' : '#5B8DEF' 
                }]}>
                    {showAnswer ? 'Resposta' : 'Pergunta'}
                </Text>
            </View>
            
            <ScrollView contentContainerStyle={styles.cardScrollView}>
                <Text style={styles.cardText}>
                    {showAnswer ? currentCard.resposta : currentCard.pergunta}
                </Text>
            </ScrollView>

            {!showAnswer && (
                <View style={styles.flipHint}>
                    <Ionicons name="eye-outline" size={16} color="#718096" />
                    <Text style={styles.flipHintText}>Toque para ver a resposta</Text>
                </View>
            )}
        </TouchableOpacity>
    );
    
    const ActionButtons = () => (
        <View style={actionStyles.actionsContainer}>
            <Text style={actionStyles.actionsPrompt}>
            Como você se saiu com esta pergunta?
            </Text>

            <View style={actionStyles.buttonRow}>
                <ActionButton
                    icon="close-circle-outline"
                    label="Errei"
                    color="#FF6B47"
                    onPress={() => handleAnswer('errei')}
                />
                <ActionButton
                    icon="checkmark-circle-outline"
                    label="Fácil"
                    color="#48BB78"
                    onPress={() => handleAnswer('facil')}
                />
                <ActionButton
                    icon="flash-outline"
                    label="Muito Fácil"
                    color="#5B8DEF"
                    onPress={() => handleAnswer('muito-facil')}
                />
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
            
            <Header 
                deckTitle={deckTitle} 
                current={currentIndex + 1} 
                total={totalCards} 
                onBack={() => navigation.goBack()}
                onRestart={handleRestart}
                progress={progress}
            />

            <View style={styles.content}>
                <CardContent />
                {showAnswer ? <ActionButtons /> : (
                    <TouchableOpacity
                        style={styles.showAnswerButton}
                        onPress={handleCardFlip}
                        activeOpacity={0.9}
                    >
                        <Ionicons name="eye-outline" size={24} color="#FFF" style={{ marginRight: 8 }} />
                        <Text style={styles.showAnswerButtonText}>Mostrar Resposta</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}

const Header = ({ deckTitle, current, total, onBack, onRestart, progress }) => (
    <View style={headerStyles.header}>
        <TouchableOpacity style={headerStyles.backButton} onPress={onBack}>
            <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        
        <View style={headerStyles.titleContainer}>
            <Text style={headerStyles.deckTitle} numberOfLines={1}>{deckTitle}</Text>
            <Text style={headerStyles.cardCount}>{current} de {total}</Text>
        </View>
        
        <TouchableOpacity style={headerStyles.restartButton} onPress={onRestart}>
            <Ionicons name="refresh-circle-outline" size={28} color="#555" />
        </TouchableOpacity>
        
        <View style={headerStyles.progressBarContainer}>
            <Progress.Bar 
                progress={progress} 
                width={null} 
                height={8}
                color="#667eea"
                unfilledColor="#e2e8f0"
                borderWidth={0}
                borderRadius={10}
            />
        </View>
    </View>
);

const ActionButton = ({ icon, label, color, onPress }) => (
    <TouchableOpacity 
        style={[actionStyles.button, { backgroundColor: color, shadowColor: color }]}
        onPress={onPress}
        activeOpacity={0.9}
    >
        <Ionicons name={icon} size={24} color="#fff" />
        <Text style={actionStyles.buttonLabel}>{label}</Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FA',
    },
    content: {
        flex: 1,
        padding: 20,
        justifyContent: 'space-between',
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        color: '#4a5568',
        fontSize: 16,
    },
    errorText: {
        marginTop: 10,
        color: '#f56565', 
        textAlign: 'center', 
        paddingHorizontal: 30,
        fontSize: 16,
    },
    retryButton: {
        marginTop: 20,
        backgroundColor: '#667eea',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 12,
    },
    retryButtonText: {
        color: '#fff', 
        fontWeight: '700'
    },
    flashcard: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 25,
        padding: 30,
        marginBottom: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 15,
        elevation: 10,
        justifyContent: 'space-between',
        minHeight: 320,
        maxHeight: '70%', 
    },
    badgeContainer: {
        alignSelf: 'flex-start',
        marginBottom: 15,
    },
    badge: {
        color: '#FFF',
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 20,
        fontWeight: '700',
        fontSize: 12,
        overflow: 'hidden',
    },
    cardScrollView: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    cardText: {
        fontSize: 24,
        fontWeight: '600',
        color: '#2D3748',
        textAlign: 'center',
        lineHeight: 36,
    },
    flipHint: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 15,
        borderTopWidth: 1,
        borderTopColor: '#E2E8F0',
        marginTop: 10,
    },
    flipHintText: {
        fontSize: 14,
        color: '#718096',
        marginLeft: 5,
    },
    showAnswerButton: {
        backgroundColor: '#667eea',
        paddingVertical: 18,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        shadowColor: '#667eea',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 7,
        marginBottom: 20,
    },
    showAnswerButtonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '700',
    },
});

const headerStyles = StyleSheet.create({
    header: {
        paddingTop: 50,
        paddingHorizontal: 20,
        paddingBottom: 10,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5E5',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    titleContainer: {
        flex: 1,
        alignItems: 'center',
        marginHorizontal: 10,
    },
    deckTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#333',
        maxWidth: '80%',
        textAlign: 'center',
    },
    cardCount: {
        fontSize: 14,
        color: '#718096',
        fontWeight: '500',
        marginTop: 2,
    },
    backButton: { padding: 5 },
    restartButton: { padding: 5 },
    progressBarContainer: { marginTop: 12, width: '100%' }
});

const actionStyles = StyleSheet.create({
    actionsContainer: {
        paddingTop: 10,
        marginBottom: 20,
    },
    actionsPrompt: {
        textAlign: 'center',
        fontSize: 16,
        color: '#4A5568',
        marginBottom: 15,
        fontWeight: '600',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
    },
    button: {
        flex: 1,
        paddingVertical: 16,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 6,
    },
    buttonLabel: {
        color: '#fff',
        fontSize: 13,
        fontWeight: '700',
        marginTop: 4,
        textAlign: 'center',
    }
});

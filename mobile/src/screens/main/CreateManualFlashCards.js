import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Text, View, TouchableOpacity, ScrollView, StyleSheet, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { TextArea } from '../../components/TextArea';

export default function CreateManualFlashCards({ route }) {
    const navigation = useNavigation();

    const { deckName, description } = route.params || {};
    // Verifica com console.log se as informações do card feita na tela anterior chega nesta tela com prop route
    console.log(deckName);
    console.log(description);

    const [flashcards, setFlashcards] = useState([
        { id: 1, front: '', back: '' }
    ]);

    const addFlashcard = () => {
        const newId = flashcards.length + 1;
        setFlashcards([...flashcards, { id: newId, front: '', back: '' }]);
    };

    const updateFlashcard = (id, field, value) => {
        setFlashcards(
            flashcards.map((card) =>
                card.id === id ? { ...card, [field]: value } : card
            )
        );
    };

    const removeFlashcard = (id) => {
        if (flashcards.length > 1) {
            setFlashcards(flashcards.filter((card) => card.id !== id));
        }
    };

    const handleSave = () => {
        const filledCards = flashcards.filter(
            (card) => card.front.trim() && card.back.trim()
        );
        if (filledCards.length === 0) {
            alert('Por favor, preencha pelo menos um flashcard completo');
            return;
        }
        console.log('Salvar flashcards:', { deckName, flashcards: filledCards });
    };

    // Variável de texto informativo utilizando quebra de linha seguindo UI design
    const text = "Crie seus flashcards manualmente. Adicione a pergunta (frente) e a resposta (verso) de cada\ncard.";

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />

            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <View style={styles.headerContent}>
                    <Text style={styles.headerTitle}>Criar Flashcards</Text>
                    <Text style={styles.headerSubtitle}>{deckName}</Text>
                </View>
                <Text style={styles.cardCount}>{flashcards.length} cards</Text>
            </View>

            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <View style={styles.infoBox}>
                    <Ionicons name="information-circle-outline" size={24} color="#5B8DEF" />
                    <Text style={styles.infoText}>
                        {text}
                    </Text>
                </View>

                {flashcards.map((card, index) => (
                    <View key={card.id} style={styles.flashcardContainer}>
                        <View style={styles.flashcardHeader}>
                            <Text style={styles.flashcardTitle}>Flashcard {index + 1}</Text>
                            {flashcards.length > 1 && (
                                <TouchableOpacity
                                    onPress={() => removeFlashcard(card.id)}
                                    style={styles.deleteButton}
                                >
                                    <Ionicons name="trash-outline" size={20} color="#FF6B47" />
                                </TouchableOpacity>
                            )}
                        </View>

                        <Text style={styles.label}>
                            Pergunta (Frente do Card) <Text style={styles.required}>*</Text>
                        </Text>
                        <Input
                            placeholder="Ex: O que é fotossíntese?"
                            value={card.front}
                            onChangeText={(text) => updateFlashcard(card.id, 'front', text)}
                            multiline
                        />

                        <Text style={styles.label}>
                            Resposta (Verso do Card) <Text style={styles.required}>*</Text>
                        </Text>
                        <TextArea
                            placeholder="Ex: Processo pelo qual as plantas convertem luz solar em energia química..."
                            value={card.back}
                            onChangeText={(text) => updateFlashcard(card.id, 'back', text)}

                        />
                    </View>
                ))}

                <TouchableOpacity
                    style={styles.addButton}
                    onPress={addFlashcard}
                    activeOpacity={0.7}
                >
                    <Ionicons name="add" size={20} color="#667eea" />
                    <Text style={styles.addButtonText}>Adicionar Flashcard</Text>
                </TouchableOpacity>
            </ScrollView>

            <View style={styles.bottomContainer}>
                <LinearGradient
                    colors={['#667eea', '#764ba2']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.gradientButton}
                >
                    <Button
                        title={`Salvar ${flashcards.length} Flashcard${flashcards.length > 1 ? 's' : ''}`}
                        leftIcon={<Ionicons name="save-outline" size={20} color="#FFF" />}
                        onPress={handleSave}
                        style={{ backgroundColor: 'transparent' }}
                    />
                </LinearGradient>

            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 50,
        paddingBottom: 16,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5E5',
    },
    backButton: {
        padding: 4,
    },
    headerContent: {
        flex: 1,
        marginLeft: 12,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#666',
        marginTop: 2,
    },
    cardCount: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
    content: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
    },
    infoBox: {
        flexDirection: 'row',
        backgroundColor: '#EBF3FF',
        borderRadius: 12,
        padding: 18,
        marginBottom: 20,
        borderLeftWidth: 4,
        borderLeftColor: '#5B8DEF',
    },
    infoText: {
        flex: 1,
        marginLeft: 12,
        fontSize: 14,
        color: '#333',
        lineHeight: 20,
    },
    flashcardContainer: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },
    flashcardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    flashcardTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    required: {
        color: '#FF6B47',
    },
    deleteButton: {
        padding: 4,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
        marginBottom: 8,
        marginTop: 8,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFF',
        borderRadius: 12,
        paddingVertical: 16,
        borderWidth: 2,
        borderColor: '#667eea',
        borderStyle: 'dashed',
    },
    addButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#667eea',
        marginLeft: 8,
    },
    bottomContainer: {
        padding: 20,
        backgroundColor: '#FFF',
        borderTopWidth: 1,
        borderTopColor: '#E5E5E5',
    },
    gradientButton: {
        paddingVertical: 4,
        borderRadius: 12,
    },
});
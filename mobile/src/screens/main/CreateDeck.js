import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Input } from '../../components/input';
import { Button } from '../../components/button';

export default function CreateDeck() {
  const navigation = useNavigation();
  const [deckName, setDeckName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedOption, setSelectedOption] = useState(null);

  const creationOptions = [
    {
      id: 'pdf',
      icon: 'document-text',
      iconColor: '#FF6B47',
      iconBg: '#FFF1EF',
      title: 'Enviar PDF ou DOCX',
      subtitle: 'A IA analisará o documento e criará flashcards automaticamente'
    },
    {
      id: 'video',
      icon: 'videocam',
      iconColor: '#9C27B0',
      iconBg: '#F3E5F5',
      title: 'Link de Vídeo',
      subtitle: 'YouTube, aulas online ou qualquer vídeo educativo'
    },
    {
      id: 'text',
      icon: 'create',
      iconColor: '#4CAF50',
      iconBg: '#E8F5E8',
      title: 'Digitar Conteúdo',
      subtitle: 'Cole ou digite o texto que você quer transformar em flashcards'
    }
  ];

  const handleCreateWithAI = () => {
    if (!deckName.trim()) {
      alert('Por favor, insira o nome do deck');
      return;
    }

    if (!selectedOption) {
      alert('Por favor, selecione como deseja criar os flashcards');
      return;
    }

    console.log('Criar deck:', { deckName, description, selectedOption });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />

      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Criar Novo Deck</Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações do Deck</Text>

          <Text style={styles.inputLabel}>
            Nome do Deck <Text style={styles.required}>*</Text>
          </Text>
          <Input
            placeholder='Ex: Biologia Celular'
            value={deckName}
            onChangeText={setDeckName}
            placeholderTextColor='#A0A0A0'
          />
          <Text style={styles.inputLabel}>Descrição (opcional)</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Breve descrição do conteúdo..."
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            placeholderTextColor="#A0A0A0"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Como você quer criar os flashcards?</Text>

          {creationOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.optionCard,
                selectedOption === option.id && styles.optionCardSelected
              ]}
              onPress={() => setSelectedOption(option.id)}
            >
              <View style={styles.optionContent}>
                <View style={[styles.optionIcon, { backgroundColor: option.iconBg }]}>
                  <Ionicons
                    name={option.icon}
                    size={24}
                    color={option.iconColor}
                  />
                </View>
                <View style={styles.optionTextContainer}>
                  <Text style={styles.optionTitle}>{option.title}</Text>
                  <Text style={styles.optionSubtitle}>{option.subtitle}</Text>
                </View>
              </View>
              <View style={styles.radioContainer}>
                <View style={[
                  styles.radioOuter,
                  selectedOption === option.id && styles.radioSelected
                ]}>
                  {selectedOption === option.id && (
                    <View style={styles.radioInner} />
                  )}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.bottomContainer}>
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ borderRadius: 16 }}
        >
          <Button
            title="Gerar Flashcards com IA"
            leftIcon={<Ionicons name="sparkles" size={20} color="#FFF" />}
            style={{ backgroundColor: 'transparent' }}
            onPress={handleCreateWithAI}
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
    paddingHorizontal: 10,
    paddingTop: 24,
    paddingBottom: 8,
  },
  backButton: {
    marginRight: 8,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  content: {
    paddingTop: 12,
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
    marginTop: 8,
  },
  required: {
    color: '#FF6B47',
  },
  textArea: {
    backgroundColor: "#F3F3F5",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    color: "#222222",
    height: 100,
    textAlignVertical: "top",
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#F8F9FA',
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionCardSelected: {
    backgroundColor: '#F0F4FF',
    borderColor: '#667eea',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  optionSubtitle: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
  },
  radioContainer: {
    padding: 4,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D0D0D0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: {
    borderColor: '#667eea',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#667eea',
  },
  bottomContainer: {
    padding: 20,
    backgroundColor: '#F8F9FA',
  },
});

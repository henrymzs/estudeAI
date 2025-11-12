import * as DocumentPicker from 'expo-document-picker';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, StatusBar, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Input } from '../../components/input';
import { Button } from '../../components/button';
import { TextArea } from '../../components/TextArea';
import { OptionCard } from '../../components/OptionCard';

export default function CreateDecks() {
  const navigation = useNavigation();
  const [deckName, setDeckName] = useState('');
  const [description, setDescription] = useState('');
  const [deckNameError, setDeckNameError] = useState('');
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [videoLink, setVideoLink] = useState('');
  const [textContent, setTextContent] = useState('');

  const MAX_DECK_NAME_LENGTH = 50;
  const MAX_DESCRIPTION_LENGTH = 200;

  const validateDeckName = (name) => {
    if (!name.trim()) {
      return 'Nome do deck é obrigatório.';
    }
    if (name.length < 3) {
      return 'Nome do deck deve ter pelo menos 3 caracteres.';
    }
    if (name.length > MAX_DECK_NAME_LENGTH) {
      return `Nome do deck não pode exceder ${MAX_DECK_NAME_LENGTH} caracteres.`;
    }
    return '';
  };

  const renderExpandedContent = (optionId) => {
    if (selectedOption !== optionId) return null;
    switch (optionId) {
      case 'video':
        return (
          <View style={styles.expandedContent}>
            <Input
              placeholder='Cole o link do video aqui (ex: https://youtube.com/...)'
              value={videoLink}
              onChangeText={setVideoLink}
              leftIcon={<Ionicons name='link' size={18} color='#666' />}
              autoCapitalize='none'
              keyboardType='url'
            />
          </View>
        );
      case 'text':
        return (
          <View style={styles.expandedContent}>
            <TextArea
              placeholder='Cole ou digite o conteúdo que você deseja transformar em flashcards...'
              value={textContent}
              onChangeText={setTextContent}
              numberOfLines={8}
            />
            <Text style={styles.charCount}>
              {textContent.length} caracteres
            </Text>
          </View>
        );
      case 'pdf':
        if (!selectedDocument) return null;
        return (
          <View style={styles.expandedContent}>
            <View style={styles.documentPreview}>
              <Ionicons name="document" size={24} color="#4285f4" />
              <View style={styles.documentInfo}>
                <Text style={styles.documentName}>{selectedDocument.name}</Text>
                <Text style={styles.documentSize}>
                  {(selectedDocument.size / 1024).toFixed(2)} KB
                </Text>
              </View>
              <TouchableOpacity onPress={() => {
                setSelectedDocument(null);
                pickDocument();
              }}>
                <Ionicons name="refresh" size={20} color="#6b7280" />
              </TouchableOpacity>
            </View>
          </View>
        );
      default:
        return null;
    }
  };

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
      title: 'Digite ou cole Conteúdo',
      subtitle: 'Crie seus flashcards com IA a partir de texto'
    },
    {
      id: 'manual',
      icon: 'pencil',
      iconColor: '#525EFF',
      iconBg: '#dde0fcff',
      title: 'Criar Manualmente',
      subtitle: 'Crie seus próprios flashcards do zero'
    },
  ];

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          'application/pdf',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ],
        copyToCacheDirectory: true,
        multiple: false,
      });
      if (!result.canceled) {
        const document = result.assets[0];
        const documentData = {
          name: document.name,
          size: document.size,
          uri: document.uri,
          mimeType: document.mimeType
        };
        setSelectedDocument(documentData);
        navigation.navigate('ProcessDocument', {
          document: documentData
        });
      } else {
        setSelectedOption(null);
        console.log('Seleção de documento cancelada');
      }
    } catch (error) {
      console.error('Erro ao selecionar documento:', error);
      Alert.alert(
        'Erro',
        'Não foi possível selecionar o documento. Tente novamente.'
      );
      setSelectedOption(null);
    }
  };

  const handleDeckNameChange = (text) => {
    setDeckName(text);
    if (deckNameError) {
      setDescription('');
    }
  };

  const handleOptionPress = async (optionId) => {
    setSelectedOption(optionId);

    if (optionId === 'pdf') {
      setTimeout(() => pickDocument(), 200);
    }
  };

  const handleGenerateFlashcards = () => {
    const nameError = validateDeckName(deckName);
    if (nameError) {
      setDeckNameError(nameError);
      Alert.alert('Atenção', nameError);
      return;
    }
    if (!selectedOption) {
      Alert.alert('Atenção', 'Selecione uma opção de criação antes de continuar');
      return;
    }
    if (selectedOption === 'video' && !videoLink.trim()) {
      Alert.alert('Atenção', 'Insira o link do vídeo');
      return;
    }
    if (selectedOption === 'text' && !textContent.trim()) {
      Alert.alert('Atenção', 'Insira o conteúdo de texto');
      return;
    }
    if (selectedOption === 'pdf' && !selectedDocument) {
      Alert.alert('Atenção', 'Selecione um documento');
      return;
    }
    const commonData = {
      deckName: deckName.trim(),
      description: description.trim(),
    };
    switch (selectedOption) {
      case 'pdf':
        navigation.navigate('ProcessDocument', {
          ...commonData,
          document: selectedDocument
        });
        break;
      case 'video':
        navigation.navigate('ProcessVideo', {
          ...commonData,
          videoLink: videoLink.trim()
        });
        break;
      case 'text':
        navigation.navigate('ProcessText', {
          ...commonData,
          textContent: textContent.trim()
        });
        break;
      case 'manual':
        navigation.navigate('CreateManualFlashCards', {
          ...commonData
        });
        break;
      default:
        Alert.alert('Erro', 'Opção inválida');
    }
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
            onChangeText={handleDeckNameChange}
            placeholderTextColor='#A0A0A0'
            maxLength={MAX_DECK_NAME_LENGTH}
          />
          {deckNameError ? (
            <Text style={styles.errorText}>{deckNameError}</Text>
          ) : null}

          <Text style={styles.inputLabel}>Descrição (opcional)</Text>
          <TextArea
            placeholder="Breve descrição do conteúdo..."
            value={description}
            onChangeText={setDescription}
            maxLength={MAX_DESCRIPTION_LENGTH}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Como você quer criar os flashcards?</Text>
          <View>
            {creationOptions.map((option) => (
              <View key={option.id}>
                <OptionCard
                  option={option}
                  isSelected={selectedOption === option.id}
                  onPress={() => handleOptionPress(option.id)}
                />
                {renderExpandedContent(option.id)}
              </View>
            ))}
          </View>

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
            onPress={handleGenerateFlashcards}
          />
        </LinearGradient>
      </View>
    </View>
  );
};

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
  bottomContainer: {
    padding: 20,
    backgroundColor: '#F8F9FA',
  },
});

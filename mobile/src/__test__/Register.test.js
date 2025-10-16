// __test__/Register.test.js
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Register from '../screens/auth/Register';
import axios from 'axios';

// MOCK do axios
jest.mock('axios');

// MOCK dos ícones do Expo
jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
}));

// variável mock de navegação (prefixo "mock" permitido dentro do factory)
const mockNavigate = jest.fn();

// MOCK do @react-navigation/native
jest.mock('@react-navigation/native', () => {
  return {
    useNavigation: () => ({ navigate: mockNavigate }),
    NavigationContainer: ({ children }) => children,
  };
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('Register Screen', () => {
  it('deve renderizar os elementos essenciais', () => {
    const { getByPlaceholderText, getByText } = render(<Register />);

    expect(getByPlaceholderText('Nome único (ex: joao123)')).toBeTruthy();
    expect(getByPlaceholderText('Digite seu email')).toBeTruthy();
    expect(getByPlaceholderText('Digite sua senha')).toBeTruthy();
    
  });

  it('valida nome corretamente', () => {
    const { getByPlaceholderText, getByText } = render(<Register />);
    const nameInput = getByPlaceholderText('Nome único (ex: joao123)');

    fireEvent.changeText(nameInput, '');
    fireEvent(nameInput, 'blur');
    expect(getByText('Nome é obrigatório')).toBeTruthy();

    fireEvent.changeText(nameInput, 'a');
    fireEvent(nameInput, 'blur');
    expect(getByText('Nome deve ter pelo menos 2 caracteres')).toBeTruthy();

    fireEvent.changeText(nameInput, 'joao123');
    fireEvent(nameInput, 'blur');
    expect(() => getByText('Nome é obrigatório')).toThrow();
    expect(() => getByText('Nome deve ter pelo menos 2 caracteres')).toThrow();
  });

  it('valida email corretamente', () => {
    const { getByPlaceholderText, getByText } = render(<Register />);
    const emailInput = getByPlaceholderText('Digite seu email');

    fireEvent.changeText(emailInput, 'invalido');
    fireEvent(emailInput, 'blur');
    expect(getByText('Email inválido')).toBeTruthy();

    fireEvent.changeText(emailInput, '');
    fireEvent(emailInput, 'blur');
    expect(getByText('Email é obrigatório')).toBeTruthy();

    fireEvent.changeText(emailInput, 'joao@example.com');
    fireEvent(emailInput, 'blur');
    expect(() => getByText('Email inválido')).toThrow();
    expect(() => getByText('Email é obrigatório')).toThrow();
  });

  it('valida senha corretamente', () => {
    const { getByPlaceholderText, getByText } = render(<Register />);
    const passwordInput = getByPlaceholderText('Digite sua senha');

    fireEvent.changeText(passwordInput, '');
    fireEvent(passwordInput, 'blur');
    expect(getByText('Senha é obrigatória')).toBeTruthy();

    fireEvent.changeText(passwordInput, '123');
    fireEvent(passwordInput, 'blur');
    expect(getByText('Senha deve ter pelo menos 6 caracteres')).toBeTruthy();

    fireEvent.changeText(passwordInput, '123456');
    fireEvent(passwordInput, 'blur');
    expect(() => getByText('Senha é obrigatória')).toThrow();
    expect(() => getByText('Senha deve ter pelo menos 6 caracteres')).toThrow();
  });

  it('cria usuário com sucesso e chama a API corretamente', async () => {
    const { getByPlaceholderText, getByTestId } = render(<Register />);

    const nameInput = getByPlaceholderText('Nome único (ex: joao123)');
    const emailInput = getByPlaceholderText('Digite seu email');
    const passwordInput = getByPlaceholderText('Digite sua senha');
    const submitButton = getByTestId('create-button'); // exige testID no componente

    fireEvent.changeText(nameInput, 'joao123');
    fireEvent.changeText(emailInput, 'joao@example.com');
    fireEvent.changeText(passwordInput, '123456');

    axios.post.mockResolvedValueOnce({ data: { id: 1, name: 'joao123' } });

    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining('/auth/register'),
        { name: 'joao123', email: 'joao@example.com', password: '123456' }
      );
    });

    // checagem opcional: navegação para Login
    expect(mockNavigate).toHaveBeenCalledWith('Login');
  });

  it('mostra erro quando criação falha', async () => {
    const { getByPlaceholderText, getByTestId, getByText } = render(<Register />);

    const nameInput = getByPlaceholderText('Nome único (ex: joao123)');
    const emailInput = getByPlaceholderText('Digite seu email');
    const passwordInput = getByPlaceholderText('Digite sua senha');
    const submitButton = getByTestId('create-button');

    fireEvent.changeText(nameInput, 'joao123');
    fireEvent.changeText(emailInput, 'joao@example.com');
    fireEvent.changeText(passwordInput, '123456');

    axios.post.mockRejectedValueOnce({ response: { data: 'exists' } });

    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(getByText('Erro ao criar conta')).toBeTruthy();
    });

    expect(mockNavigate).not.toHaveBeenCalledWith('Login');
  });
});

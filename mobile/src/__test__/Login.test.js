import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Login from '../screens/auth/Login';
import axios from 'axios';
import { NavigationContainer } from '@react-navigation/native';

// MOCK do axios
jest.mock('axios');

// MOCK dos ícones do Expo
jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
}));

// Wrapper para o NavigationContainer
const Wrapper = ({ children }) => (
  <NavigationContainer>{children}</NavigationContainer>
);
// mock navegacao para evitar "navigation hasn't been initialized" e para espiar navigate
const mockNavigate = jest.fn();

jest.mock('@react-navigation/native', () => {
  return {
    useNavigation: () => ({ navigate: mockNavigate }),
    NavigationContainer: ({ children }) => children,
  };
});


describe('Login Screen', () => {

  it('deve renderizar todos os elementos básicos', () => {
    const { getByPlaceholderText, getByText, getByTestId } = render(<Login />, { wrapper: Wrapper });

    expect(getByTestId('login-button')).toBeTruthy();
    expect(getByPlaceholderText('Digite seu email')).toBeTruthy();
    expect(getByPlaceholderText('Digite sua senha')).toBeTruthy();
    expect(getByText('Não tem conta? Criar conta')).toBeTruthy();
    expect(getByText('Entrar como visitante')).toBeTruthy();
  });

  it('valida email corretamente', () => {
    const { getByPlaceholderText, getByText } = render(<Login />, { wrapper: Wrapper });
    const emailInput = getByPlaceholderText('Digite seu email');

    fireEvent.changeText(emailInput, 'emailinvalido');
    fireEvent(emailInput, 'blur');
    expect(getByText('Email inválido')).toBeTruthy();

    fireEvent.changeText(emailInput, '');
    fireEvent(emailInput, 'blur');
    expect(getByText('Email é obrigatório')).toBeTruthy();

    fireEvent.changeText(emailInput, 'teste@teste.com');
    fireEvent(emailInput, 'blur');
    expect(() => getByText('Email inválido')).toThrow();
    expect(() => getByText('Email é obrigatório')).toThrow();
  });

  it('valida senha corretamente', () => {
    const { getByPlaceholderText, getByText } = render(<Login />, { wrapper: Wrapper });
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

  it('faz login com sucesso', async () => {
    const { getByPlaceholderText, getByTestId } = render(<Login />, { wrapper: Wrapper });
    const emailInput = getByPlaceholderText('Digite seu email');
    const passwordInput = getByPlaceholderText('Digite sua senha');
    const loginButton = getByTestId('login-button');

    fireEvent.changeText(emailInput, 'teste@teste.com');
    fireEvent.changeText(passwordInput, '123456');

    axios.post.mockResolvedValueOnce({ data: { access_token: '12345' } });

    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining('/auth/login'),
        { email: 'teste@teste.com', password: '123456' }
      );
    });
  });

  it('mostra erro ao login falhar', async () => {
    const { getByPlaceholderText, getByTestId, getByText } = render(<Login />, { wrapper: Wrapper });
    const emailInput = getByPlaceholderText('Digite seu email');
    const passwordInput = getByPlaceholderText('Digite sua senha');
    const loginButton = getByTestId('login-button');

    fireEvent.changeText(emailInput, 'teste@teste.com');
    fireEvent.changeText(passwordInput, '123456');

    axios.post.mockRejectedValueOnce({ response: { data: 'Erro de login' } });

    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(getByText('Email ou senha incorretos')).toBeTruthy();
    });
  });

  it('botão criar conta e visitante existem', () => {
    const { getByText } = render(<Login />, { wrapper: Wrapper });

    expect(getByText('Criar conta')).toBeTruthy();
    expect(getByText('Entrar como visitante')).toBeTruthy();
  });

});

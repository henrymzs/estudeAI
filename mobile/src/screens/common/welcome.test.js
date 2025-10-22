import { fireEvent, render } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import Welcome from './Welcome';

describe('Welcome Screen', () => {
    it('renders all main elements', () => {
        const { getByText, getByTestId } = render(
            <NavigationContainer>
                <Welcome />
            </NavigationContainer>
        );
        expect(getByTestId('school-icon')).toBeTruthy();
        expect(getByText('EstudeAI')).toBeTruthy();
        expect(getByText('Transforme conteúdos em aprendizado')).toBeTruthy();
        expect(getByText('Primeiro Acesso')).toBeTruthy();
        expect(getByText('Já tenho uma conta')).toBeTruthy();
    });

    it('navigate to register by pressing "Primeiro Acesso"', () => {
        const navigate = jest.fn();
        jest.spyOn(require('@react-navigation/native'), 'useNavigation').mockReturnValue({ navigate });
        const { getByText } = render(
            <NavigationContainer>
                <Welcome />
            </NavigationContainer>
        );
        fireEvent.press(getByText('Primeiro Acesso'));
        expect(navigate).toHaveBeenCalledWith('Register');
    });

    it('navigates to Login when pressing "Já tenho uma conta"', () => {
        const navigate = jest.fn();
        jest.spyOn(require('@react-navigation/native'), 'useNavigation').mockReturnValue({ navigate });
        const { getByText } = render(
            <NavigationContainer>
                <Welcome />
            </NavigationContainer>
        );
        fireEvent.press(getByText('Já tenho uma conta'));
        expect(navigate).toHaveBeenCalledWith('Login');
    });
});

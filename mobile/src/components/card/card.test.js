import { render, fireEvent } from '@testing-library/react-native';
import { Text } from 'react-native';
import { Card } from './index';

describe('Card component', () => {
    it('renders number and label', () => {
        const { getByText } = render(
            <Card
                number={42}
                label='Test Label'
            />
        );
        expect(getByText('42')).toBeTruthy();
        expect(getByText('Test Label')).toBeTruthy();
    });

    it('renders icon and applies color', () => {
        const { getByText, getByTestId } = render(
            <Card
                icon={<Text>Icon</Text>}
                color='blue'
            />
        );
        expect(getByText('Icon')).toBeTruthy();
        expect(getByTestId('card-icon')).toHaveStyle({ backgroundColor: 'blue' });
    });

    it('renders as View when onPress is not provided', () => {
        const { getByTestId } = render(
            <Card
                testID='card-view'
            />
        );
        const cardView = getByTestId('card-view');
        expect(cardView).toBeTruthy();
    });

    it('renders as TouchableOpacity and calls onPress when pressed', () => {
        const onPressMock = jest.fn();
        const { getByTestId } = render(
            <Card
                onPress={onPressMock}
                testID='card-touchable'
            />
        );
        const cardTouchable = getByTestId('card-touchable');
        expect(cardTouchable).toBeTruthy();
        fireEvent.press(cardTouchable);
        expect(onPressMock).toHaveBeenCalled();
    });


    it('applies custom styles', () => {
        const style = { backgroundColor: 'red' };
        const numberStyle = { color: 'green' };
        const { getByTestId, getByText } = render(
            <Card
                number={1}
                style={style}
                numberStyle={numberStyle}
                testID='card-view'
            />
        );
        expect(getByTestId('card-view')).toHaveStyle(style);
        expect(getByText('1')).toHaveStyle(numberStyle);
    });
});

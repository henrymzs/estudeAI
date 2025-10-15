import { render, fireEvent } from '@testing-library/react-native';
import { Text } from 'react-native'
import { Button } from './index';

describe('Button component', () => {
    it('renders whith correct title', () => {
        const { getByText } = render(
            <Button
                title='Press me'
            />
        );
        expect(getByText('Press me')).toBeTruthy();
    });

    it('calls onPress when pressed', () => {
        const onPressMock = jest.fn();
        const { getByTestId } = render(
            <Button
                testID='button-touchable'
                onPress={onPressMock}
            />
        );
        fireEvent.press(getByTestId('button-touchable'));
        expect(onPressMock).toHaveBeenCalled();
    });

    it('renders leftIcon and rightIcon when provided', () => {
        const LeftIcon = <Text>Left</Text>;
        const RightIcon = <Text>Right</Text>;
        const { getByText } = render(
            <Button
                leftIcon={LeftIcon}
                rightIcon={RightIcon}
            />
        );
        expect(getByText('Left')).toBeTruthy();
        expect(getByText('Right')).toBeTruthy();
    });

    it('applies custom styles passed via style and textStyle', () => {
        const buttonStyle = { backgroundColor: 'red' };
        const textStyle = { color: 'yellow' };
        const { getByTestId } = render(
            <Button
                testID='button-touchable'
                style={buttonStyle}
                textStyle={textStyle}
            />
        );
        expect(getByTestId('button-touchable')).toHaveStyle(buttonStyle);
    });

    it('passes other props to TouchableOpacity', () => {
        const { getByTestId } = render(
            <Button
                testID='button-test'
                accessibilityLabel='button-accessibility'
            />
        );
        const touchable = getByTestId('button-test');
        expect(touchable.props.accessibilityLabel).toBe('button-accessibility');
    });
});


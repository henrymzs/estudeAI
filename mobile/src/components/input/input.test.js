import React, { useState } from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Text } from 'react-native';
import { Input } from './index';

describe('Input component', () => {
  it('renders TextInput', () => {
    const { getByTestId } = render(
      <Input
        testID="input-field"
      />
    );
    expect(getByTestId('input-field')).toBeTruthy();
  });

  it('renders leftIcon and rightIcon', () => {
    const LeftIcon = <Text>Left</Text>;
    const RightIcon = <Text>Right</Text>;
    const { getByText } = render(
      <Input
        leftIcon={LeftIcon}
        rightIcon={RightIcon}
      />
    );
    expect(getByText('Left')).toBeTruthy();
    expect(getByText('Right')).toBeTruthy();
  });

  it('toggles password visibility when icon is pressed', () => {
    const { getByTestId } = render(
      <Input
        testID='input-field'
        isPassword
      />
    );
    const toggleButton = getByTestId('password-toggle');
    // O campo começa como senha oculta
    expect(getByTestId('input-field').props.secureTextEntry).toBe(true);
    fireEvent.press(toggleButton);
    // Após clicar, senha deve ficar visível
    expect(getByTestId('input-field').props.secureTextEntry).toBe(false);
  });

  it('applies custom style', () => {
    const style = { backgroundColor: 'red' };
    const { getByTestId } = render(
      <Input
        testID='input-field'
        style={style}
      />
    );
    expect(getByTestId('input-field')).toHaveStyle(style);
  });

  it('shows error text when error prop is provided', () => {
    const { getByText } = render(
      <Input
        error='required field'
      />
    );
    expect(getByText('required field')).toBeTruthy();
  });

  it('change value when typing', () => {
    function Wrapper() {
      const [value, setValue] = useState('');
      return <Input testID='input-field' value={value} onChangeText={setValue} />;
    }
    const { getByTestId } = render(<Wrapper />);
    const input = getByTestId('input-field');
    fireEvent.changeText(input, 'new value');
    expect(input.props.value).toBe('new value');
  });

});

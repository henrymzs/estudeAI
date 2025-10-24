import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import { TextArea } from './index';

describe('TextArea', () => {
    it('renders correctly with basic props', () => {
        render(
            <TextArea
                testID="textarea"
                placeholder="Digite algo"
                value=""
            />
        );

        const textarea = screen.getByTestId('textarea');
        expect(textarea).toBeTruthy();
        expect(textarea.props.multiline).toBe(true);
        expect(textarea.props.numberOfLines).toBe(4);
    });

    it('renders with custom numberOfLines', () => {
        render(
            <TextArea
                testID="textarea"
                numberOfLines={6}
            />
        );

        const textarea = screen.getByTestId('textarea');
        expect(textarea.props.numberOfLines).toBe(6);
    });

    it('applies custom styles', () => {
        const customStyle = { fontSize: 18 };
        
        render(
            <TextArea
                testID="textarea"
                style={customStyle}
            />
        );

        const textarea = screen.getByTestId('textarea');
        expect(textarea.props.style).toContainEqual(customStyle);
    });

    it('calls onChangeText when text changes', () => {
        const handleChange = jest.fn();
        
        render(
            <TextArea
                testID="textarea"
                onChangeText={handleChange}
            />
        );

        const textarea = screen.getByTestId('textarea');
        fireEvent.changeText(textarea, 'new text');

        expect(handleChange).toHaveBeenCalledWith('new text');
        expect(handleChange).toHaveBeenCalledTimes(1);
    });

    it('displays error message when error is present', () => {
        const errorMessage = 'required field';
        
        render(
            <TextArea
                testID="textarea"
                error={errorMessage}
            />
        );

        const errorText = screen.getByText(errorMessage);
        expect(errorText).toBeTruthy();
    });

    it('passes all additional props to TextInput', () => {
        render(
            <TextArea
                testID="textarea"
                placeholder="Digite aqui"
                maxLength={200}
                editable={false}
            />
        );

        const textarea = screen.getByTestId('textarea');
        expect(textarea.props.placeholder).toBe('Digite aqui');
        expect(textarea.props.maxLength).toBe(200);
        expect(textarea.props.editable).toBe(false);
    });

    it('keeps textAlignVertical as top', () => {
        render(
            <TextArea testID="textarea" />
        );

        const textarea = screen.getByTestId('textarea');
        expect(textarea.props.textAlignVertical).toBe('top');
    });
});
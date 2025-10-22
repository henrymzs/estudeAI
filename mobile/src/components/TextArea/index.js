import { View, TextInput, Text } from 'react-native';
import { styles } from './styles';

export function TextArea({ style, error, testID, numberOfLines = 4, ...rest }) {
    return (
        <View style={styles.container}>
            <View style={[
                styles.inputContainer,
                error && styles.inputContainerError
            ]}>
                <TextInput
                    style={[styles.textArea, style]}
                    multiline={true}
                    numberOfLines={numberOfLines}
                    textAlignVertical='top'
                    testID={testID}
                    {...rest}
                    placeholderTextColor='#A0A0A0'
                />
            </View>

            {error && (
                <Text style={styles.errorText}>{error}</Text>
            )}
        </View>
    );
}

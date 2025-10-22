import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    inputContainer: {
        width: '100%',
        minHeight: 100,
        backgroundColor: "#F3F3F5",
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#E5E5E5',
    },
    textArea: {
        minHeight: 100,
        padding: 12,
        paddingTop: 12,
        fontSize: 16,
        color: "#222222",
        textAlignVertical: 'top',
    },
    inputContainerError: {
        borderColor: '#ef4444',
        borderWidth: 2,
        backgroundColor: '#fef2f2',
    },
    errorText: {
        color: '#ef4444',
        fontSize: 12,
        marginTop: 4,
        marginLeft: 4,
        fontWeight: '500',
    },
});

import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    inputContainer: {
        position: 'relative',
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        height: 52,
        backgroundColor: "#F3F3F5",
        borderRadius: 10,
    },
    input: {
        flex: 1,
        height: '100%',
        padding: 12,
        fontSize: 16,
        color: "#222222",
    },
    inputWithLeftIcon: {
        paddingLeft: 45,
    },
    inputWithRightIcon: {
        paddingRight: 45,
    },
    leftIconContainer: {
        position: 'absolute',
        left: 12,
        zIndex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    rightIconContainer: {
        position: 'absolute',
        right: 12,
        zIndex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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

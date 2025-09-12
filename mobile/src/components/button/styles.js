import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    button: {
        width: '100%',
        height: 52,
        backgroundColor: '#165DFB',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row', 
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
    leftIcon: {
        marginRight: 8, 
    },
    rightIcon: {
        marginLeft: 8, 
    },
});

import { StyleSheet, Dimensions } from "react-native"; 

const { width: screenWidth } = Dimensions.get('window');

export const styles = StyleSheet.create({
    statCard: {
        backgroundColor: '#fff',
        width: (screenWidth - 60) / 2, 
        padding: 20,
        borderRadius: 16,
        alignItems: 'center',
        marginBottom: 16,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
    },
    statIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    iconText: {
        fontSize: 20,
    },
    statNumber: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#2d3748',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 14,
        color: '#718096',
        textAlign: 'center',
        lineHeight: 18,
    },
});

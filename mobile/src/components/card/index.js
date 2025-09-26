import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native'; 
import { styles } from "./styles.js";

export function Card({ number, label, color, icon, onPress }) {
    const Component = onPress ? TouchableOpacity : View;

    return (
        <Component
            style={styles.statCard}
            onPress={onPress}
            activeOpacity={onPress ? 0.7 : 1}
        >
            <View style={[styles.statIcon, { backgroundColor: color }]}>
                <Text style={styles.iconText}>{icon}</Text>
            </View>
            <Text style={styles.statNumber}>{number}</Text>
            <Text style={styles.statLabel}>{label}</Text>
        </Component>
    );
}
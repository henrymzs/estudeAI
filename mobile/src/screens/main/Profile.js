import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../../components/Card';

export default function Profile() {
    const userStats = [
        { number: '127', label: 'Flashcards' },
        { number: '12', label: 'Decks Criados' },
        { number: '7', label: 'Dias Seguidos' }
    ];

    const configOptions = [
        {
            icon: 'create-outline',
            title: 'Editar Perfil',
            subtitle: 'Nome, foto e informações',
            onPress: () => console.log('Editar perfil')
        },
        {
            icon: 'lock-closed-outline',
            title: 'Alterar Senha',
            subtitle: 'Segurança da conta',
            onPress: () => console.log('Alterar senha')
        },
        {
            icon: 'notifications-outline',
            title: 'Notificações',
            subtitle: 'Lembretes e alertas',
            onPress: () => console.log('Notificações')
        },
        {
            icon: 'help-circle-outline',
            title: 'Ajuda e Suporte',
            subtitle: 'FAQ e contato',
            onPress: () => console.log('Ajuda')
        }
    ];

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            <LinearGradient
                colors={['#667eea', '#764ba2']}
                style={styles.header}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <View style={styles.headerContent}>
                    <Text style={styles.headerTitle}>Perfil</Text>
                    <Text style={styles.headerSubtitle}>Gerencie sua conta e preferências</Text>
                </View>
            </LinearGradient>

            <View style={styles.avatarContainer}>
                <LinearGradient
                    colors={['#667eea', '#764ba2']}
                    style={styles.avatar}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    <Text style={styles.avatarText}>V</Text>
                </LinearGradient>
                <View style={styles.avatarInfo}>
                    <Text style={styles.userName}>Visitante</Text>
                    <Text style={styles.userEmail}>guest@exemplo.com</Text>
                    <TouchableOpacity style={styles.activeButton}>
                        <Text style={styles.activeButtonText}>Conta Ativa</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.statsContainer}>
                {userStats.map((stat, index) => (
                    <Card
                        key={index}
                        number={stat.number}
                        label={stat.label}
                        style={styles.statCard}
                        numberStyle={{ fontSize: 24 }}
                    />
                ))}
            </View>

            <ScrollView style={styles.section} showsVerticalScrollIndicator={false}>
                <Text style={styles.sectionTitle}>Configurações</Text>
                {configOptions.map((option, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.configItem}
                        onPress={option.onPress}
                        activeOpacity={0.7}
                    >
                        <View style={styles.configItemContent}>
                            <View style={styles.configIcon}>
                                <Ionicons
                                    name={option.icon}
                                    size={22}
                                    color="#667eea"
                                />
                            </View>
                            <View style={styles.configTextContainer}>
                                <Text style={styles.configTitle}>{option.title}</Text>
                                <Text style={styles.configSubtitle}>{option.subtitle}</Text>
                            </View>
                        </View>
                        <Ionicons
                            name="chevron-forward"
                            size={20}
                            color="#a0aec0"
                        />
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    header: {
        paddingTop: 60,
        paddingHorizontal: 20,
    },
    headerContent: {
        marginBottom: 20,
    },
    headerTitle: {
        color: '#fff',
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    headerSubtitle: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 16,
    },
    avatarContainer: {
        paddingHorizontal: 12,
        backgroundColor: '#fff',
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        margin: 12,
        padding: 8,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 10,
        elevation: 8,
    },
    avatarInfo: {
        marginLeft: 12,
    },
    avatar: {
        margin: 12,
        width: 60,
        height: 60,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
    },
    userName: {
        color: '#000000ff',
        fontSize: 22,
        fontWeight: '600',
        marginBottom: 4,
    },
    userEmail: {
        color: 'rgba(0, 0, 0, 0.8)',
        fontSize: 14,
        marginBottom: 8,
    },
    activeButton: {
        backgroundColor: '#DBFCE6',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
        alignSelf: 'flex-start',
    },
    activeButtonText: {
        color: '#2c794c',
        fontSize: 12,
        fontWeight: '600',
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 12,
        marginTop: 18,
    },
    statCard: {
        width: 120,
        padding: 14,
        marginBottom: 8,
    },
    section: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2d3748',
        marginBottom: 16,
    },
    configItem: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    configItemContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    configIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f7fafc',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    configTextContainer: {
        flex: 1,
    },
    configTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2d3748',
        marginBottom: 2,
    },
    configSubtitle: {
        fontSize: 14,
        color: '#718096',
    },
});


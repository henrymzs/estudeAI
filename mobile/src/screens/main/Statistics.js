import React from 'react';
import { View, Text, ScrollView, StyleSheet, StatusBar, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import PieChart from 'react-native-pie-chart';
import { Card } from '../../components/card';

const { width } = Dimensions.get('window');

export default function Statistics() {
    // dados mockados
    const statsData = [
        {
            number: '127',
            label: 'Cards Estudados',
            color: '#48bb78',
            icon: '✓' // utilizar ionicons em producao
        },
        {
            number: '68%',
            label: 'Taxa de Acerto',
            color: '#4299e1',
            icon: '📊'
        },
        {
            number: '7',
            label: 'Dias Seguidos',
            color: '#ed64a6',
            icon: '🔥'
        },
        {
            number: '12',
            label: 'Decks Criados',
            color: '#9f7aea',
            icon: '📚'
        }
    ];

    const chartData = [
        { value: 75, color: '#48bb78' },
        { value: 15, color: '#f6ad55' },
        { value: 10, color: '#f56565' }
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
                <Text style={styles.headerTitle}>Suas Estatísticas</Text>
                <Text style={styles.headerSubtitle}>Acompanhe seu progresso de aprendizado</Text>
            </LinearGradient>

            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <View style={styles.statsGrid}>
                    {statsData.map((stat, index) => (
                        <Card
                            key={index}            
                            number={stat.number}   
                            label={stat.label}     
                            color={stat.color}    
                            icon={stat.icon}       
                            onPress={() => console.log(`Clicou em ${stat.label}`)}
                        />
                    ))}
                </View>

                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <View style={styles.sectionTitleContainer}>
                            <View style={styles.statsIcon}>
                                <Ionicons name="server-outline" size={22} color="#a407e2ff" />
                            </View>
                            <Text style={styles.sectionTitle}>Desempenho Geral</Text>
                        </View>
                    </View>

                    <View style={styles.chartContainer}>
                        <View style={styles.chartWrapper}>
                            <PieChart
                                widthAndHeight={180}
                                series={chartData}
                                cover={{ radius: 0.6, color: '#fff' }}
                            />
                        </View>

                        <View style={styles.chartLegend}>
                            <View style={styles.legendItem}>
                                <View style={[styles.legendDot, { backgroundColor: '#48bb78' }]} />
                                <Text style={styles.legendText}>Acertos</Text>
                            </View>
                            <View style={styles.legendItem}>
                                <View style={[styles.legendDot, { backgroundColor: '#f6ad55' }]} />
                                <Text style={styles.legendText}>Difíceis</Text>
                            </View>
                            <View style={styles.legendItem}>
                                <View style={[styles.legendDot, { backgroundColor: '#f56565' }]} />
                                <Text style={styles.legendText}>Erros</Text>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <View style={styles.sectionTitleContainer}>
                            <View style={styles.statsIcon}>
                                <Ionicons name="calendar" size={22} color="#1266e6ff" />
                            </View>
                            <Text style={styles.sectionTitle}>Atividade da Semana</Text>
                        </View>
                    </View>

                    <View style={styles.weeklyChart}>
                        <View style={styles.weekDays}>
                            {['S', 'T', 'Q', 'Q', 'S', 'S', 'D'].map((day, index) => (
                                <View key={index} style={styles.dayColumn}>
                                    <View
                                        style={[
                                            styles.dayBar,
                                            {
                                                height: [40, 60, 35, 80, 45, 25, 15][index],
                                                backgroundColor: index === 3 ? '#667eea' : '#e2e8f0'
                                            }
                                        ]}
                                    />
                                    <Text style={styles.dayLabel}>{day}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                </View>
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
        paddingTop: 50,
        paddingBottom: 20,
        paddingHorizontal: 20,
    },
    headerTitle: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 6,
    },
    headerSubtitle: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 14,
    },
    content: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    section: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
    },
    sectionHeader: {
        marginBottom: 20,
    },
    sectionTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statsIcon: {
        marginRight: 8,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#2d3748',
    },
    chartContainer: {
        alignItems: 'center',
    },
    chartWrapper: {
        marginBottom: 20,
    },
    chartLegend: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    legendDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: 6,
    },
    legendText: {
        fontSize: 14,
        color: '#718096',
    },
    weeklyChart: {
        alignItems: 'center',
    },
    weekDays: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        width: '100%',
        height: 100,
    },
    dayColumn: {
        alignItems: 'center',
        flex: 1,
    },
    dayBar: {
        width: 20,
        borderRadius: 10,
        marginBottom: 8,
    },
    dayLabel: {
        fontSize: 12,
        color: '#718096',
        fontWeight: '500',
    },
});
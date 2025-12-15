import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, StatusBar, Dimensions, ActivityIndicator, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import axios from 'axios';
import { getToken, removeToken } from '../../services/authStorage'; // Incluído removeToken para tratamento de erro 401
import PieChart from 'react-native-pie-chart'; // Assumindo que este componente está instalado e funciona
import { Card } from '../../components/card'; // Assumindo que o componente Card está disponível

const { width } = Dimensions.get('window');

// URL BASE DA API (Ajuste se necessário)
const API_BASE_URL = 'http://10.175.28.105:8000'; 

// Dados padrões/mockados para serem usados enquanto carrega ou em caso de erro
const DEFAULT_STATS_DATA = [
    { number: '0', label: 'Cards Estudados', color: '#48bb78', icon: 'checkbox-outline' },
    { number: '0%', label: 'Taxa de Acerto', color: '#4299e1', icon: 'stats-chart-outline' },
    { number: '0', label: 'Dias Seguidos', color: '#ed64a6', icon: 'flame-outline' },
    { number: '0', label: 'Decks Criados', color: '#9f7aea', icon: 'library-outline' }
];

const DEFAULT_CHART_DATA = {
    series: [100],
    labels: [
        { value: 100, color: '#e2e8f0', label: 'Sem dados' }
    ],
    isDefault: true, // Adicionado flag para identificar dados de placeholder
};

const DEFAULT_WEEKLY_DATA = [
    { day: 'S', height: 10, isToday: false },
    { day: 'T', height: 10, isToday: false },
    { day: 'Q', height: 10, isToday: false },
    { day: 'Q', height: 10, isToday: true },
    { day: 'S', height: 10, isToday: false },
    { day: 'S', height: 10, isToday: false },
    { day: 'D', height: 10, isToday: false },
];


export default function Statistics() {
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    
    // --- Estados ---
    const [statsData, setStatsData] = useState(DEFAULT_STATS_DATA);
    const [chartData, setChartData] = useState(DEFAULT_CHART_DATA);
    const [weeklyActivity, setWeeklyActivity] = useState(DEFAULT_WEEKLY_DATA);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- Lógica de Busca de Dados ---
    const fetchStatsData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const token = await getToken();
            if (!token) {
                // CORREÇÃO: Se não houver token, força o redirecionamento para o Login
                navigation.replace('Login');
                return;
            }

            const config = {
                headers: { 'Authorization': `Bearer ${token}` }
            };

            // 1. Busca dos dados gerais e detalhados
            // Assumindo um endpoint /users/stats/ que retorna todos os dados necessários
            const response = await axios.get(`${API_BASE_URL}/users/stats`, config);
            const data = response.data;
            
            // --- Mapeamento dos Dados Gerais ---
            const mappedStats = [
                { number: String(data.total_cards_studied || 0), label: 'Cards Estudados', color: '#48bb78', icon: 'checkbox-outline' },
                { number: `${(data.accuracy_rate * 100).toFixed(0) || 0}%`, label: 'Taxa de Acerto', color: '#4299e1', icon: 'stats-chart-outline' },
                { number: String(data.streak_days || 0), label: 'Dias Seguidos', color: '#ed64a6', icon: 'flame-outline' },
                { number: String(data.total_decks_created || 0), label: 'Decks Criados', color: '#9f7aea', icon: 'library-outline' }
            ];
            setStatsData(mappedStats);

            // --- Mapeamento do Gráfico de Desempenho (Pie Chart) ---
            // Assumindo que o backend retorna percentuais (ou valores) para acertos, difíceis e erros
            const total = (data.correct || 0) + (data.needs_review || 0) + (data.wrong || 0);
            
            let newChartData;
            if (total === 0) {
                 // Usa o default se o total for zero
                 newChartData = DEFAULT_CHART_DATA;
            } else {
                newChartData = {
                    // Os valores para PieChart.Series devem ser os números brutos
                    series: [
                        data.correct || 0,
                        data.needs_review || 0,
                        data.wrong || 0,
                    ],
                    labels: [
                        { value: data.correct || 0, color: '#48bb78', label: 'Acertos' },
                        { value: data.needs_review || 0, color: '#f6ad55', label: 'Difíceis' },
                        { value: data.wrong || 0, color: '#f56565', label: 'Erros' }
                    ],
                    isDefault: false, // Adicionado flag para identificar dados reais
                };
            }
            setChartData(newChartData);


            // --- Mapeamento da Atividade Semanal (Weekly Chart) ---
            const maxCount = Math.max(...(data.weekly_activity?.map(a => a.count) || [1])); // Para normalizar a altura
            
            const mappedWeeklyActivity = (data.weekly_activity || []).map(item => ({
                day: item.day,
                // Normaliza a altura da barra (máx 80)
                height: (item.count / maxCount) * 80 + 20, // +20 para altura mínima
                isToday: item.is_today || false,
                count: item.count || 0, // Adiciona o count para tooltip futuro
            }));
            
            // Se os dados semanais vierem apenas em 7 itens com os rótulos S, T, Q...
            if (mappedWeeklyActivity.length === 7) {
                 setWeeklyActivity(mappedWeeklyActivity);
            } else {
                console.warn("Dados semanais incompletos ou no formato incorreto.");
                setWeeklyActivity(DEFAULT_WEEKLY_DATA);
            }


        } catch (err) {
            console.error("Erro ao buscar estatísticas:", err);
            setError("Falha ao carregar estatísticas. Verifique a conexão ou o token.");
            
            // Força o logout se o erro for 401 (token inválido/expirado)
            if (axios.isAxiosError(err) && err.response && err.response.status === 401) {
                 await removeToken(); 
                 navigation.replace('Login');
            }
        } finally {
            setLoading(false);
        }
    }, [navigation]);

    // Efeito para carregar os dados quando a tela for focada
    useEffect(() => {
        if (isFocused) {
            fetchStatsData();
        }
    }, [isFocused, fetchStatsData]);


    // --- Renderização de Loading e Erro ---

    if (loading) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color="#667eea" />
                <Text style={{ marginTop: 10, color: '#4a5568' }}>Buscando suas estatísticas...</Text>
            </View>
        );
    }
    
    if (error) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <Ionicons name="alert-circle-outline" size={32} color="#f56565" />
                <Text style={{ marginTop: 10, color: '#f56565', textAlign: 'center', paddingHorizontal: 30 }}>{error}</Text>
                <TouchableOpacity style={{ marginTop: 20 }} onPress={fetchStatsData}>
                    <Text style={{ color: '#667eea', fontWeight: 'bold' }}>Tentar Novamente</Text>
                </TouchableOpacity>
            </View>
        );
    }
    // --- Fim da Renderização de Loading e Erro ---

    const pieSeries = chartData.labels.map(l => l.value);
    const pieSliceColor = chartData.labels.map(l => l.color);

    // Nova variável de controle: Renderiza PieChart apenas se não for o dado de placeholder.
    const isRealData = !chartData.isDefault;

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
                    {/* Renderiza dados reais/mapeados */}
                    {statsData.map((stat, index) => (
                        <Card
                            key={index}            
                            number={stat.number}   
                            label={stat.label}     
                            color={stat.color}    
                            // Usa Ionicons de forma segura
                            icon={<Ionicons name={stat.icon} size={24} color="#fff" />}
                            onPress={() => console.log(`Clicou em ${stat.label}`)}
                            style={{ width: width / 2 - 30, marginBottom: 15 }} // Ajusta o tamanho do Card
                        />
                    ))}
                </View>

                {/* Seção Desempenho Geral (Gráfico de Pizza) */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <View style={styles.sectionTitleContainer}>
                            <View style={styles.statsIcon}>
                                <Ionicons name="trending-up-outline" size={22} color="#a407e2" />
                            </View>
                            <Text style={styles.sectionTitle}>Desempenho Geral</Text>
                        </View>
                    </View>

                    <View style={styles.chartContainer}>
                        <View style={styles.chartWrapper}>
                            {/* Renderiza PieChart apenas se houver dados reais */}
                            {isRealData ? (
                                <PieChart
                                    widthAndHeight={180}
                                    series={pieSeries}
                                    sliceColor={pieSliceColor}
                                    coverRadius={0.6}
                                    coverFill={'#fff'}
                                />
                            ) : (
                                // Renderiza o placeholder quando for DEFAULT_CHART_DATA
                                <View style={{ width: 180, height: 180, borderRadius: 90, backgroundColor: '#e2e8f0', justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ color: '#718096', fontWeight: '600' }}>Sem dados de estudo</Text>
                                </View>
                            )}
                        </View>

                        <View style={styles.chartLegend}>
                            {chartData.labels.map((item, index) => (
                                <View key={index} style={styles.legendItem}>
                                    <View style={[styles.legendDot, { backgroundColor: item.color }]} />
                                    <Text style={styles.legendText}>{item.label} ({item.value})</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                </View>

                {/* Seção Atividade da Semana (Gráfico de Barras) */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <View style={styles.sectionTitleContainer}>
                            <View style={styles.statsIcon}>
                                <Ionicons name="calendar-outline" size={22} color="#1266e6" />
                            </View>
                            <Text style={styles.sectionTitle}>Atividade da Semana</Text>
                        </View>
                    </View>

                    <View style={styles.weeklyChart}>
                        <View style={styles.weekDays}>
                            {weeklyActivity.map((item, index) => (
                                <View key={index} style={styles.dayColumn}>
                                    <View
                                        style={[
                                            styles.dayBar,
                                            {
                                                height: item.height,
                                                backgroundColor: item.isToday ? '#667eea' : '#e2e8f0'
                                            }
                                        ]}
                                    >
                                        {/* Adiciona o texto da contagem acima da barra */}
                                        <Text style={{ fontSize: 10, color: item.isToday ? '#fff' : '#2d3748', fontWeight: 'bold', position: 'absolute', top: -15 }}>
                                            {item.count}
                                        </Text>
                                    </View>
                                    <Text style={styles.dayLabel}>{item.day}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                </View>
                <View style={{ height: 40 }} />
            </ScrollView>
        </View>
    );
};

// --- Estilos ---
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
        paddingBottom: 40,
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
        flexWrap: 'wrap', // Permite quebra de linha se houver muitos itens
        width: '100%',
        paddingHorizontal: 10,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 8,
        marginVertical: 4,
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
        height: 120, // Altura ajustada para acomodar o texto acima da barra
    },
    dayColumn: {
        alignItems: 'center',
        flex: 1,
        marginHorizontal: 2,
    },
    dayBar: {
        width: '60%',
        borderRadius: 8,
        marginBottom: 8,
        justifyContent: 'flex-end',
        alignItems: 'center',
        position: 'relative',
    },
    dayLabel: {
        fontSize: 12,
        color: '#718096',
        fontWeight: '500',
    },
});
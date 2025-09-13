import { View, Text, StyleSheet, SafeAreaView, StatusBar, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { Button } from '../components/button';
import { Input } from '../components/input';
import { useState } from 'react';

export default function Login({ navigation }) {
    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const validateEmail = (value) => {
        if (!value.trim()) return 'Email é obrigatório';
        if (!EMAIL_REGEX.test(value.trim())) return 'Email inválido';
        return null;
    };

    const validatePassword = (value) => {
        if (!value) return 'Senha é obrigatória';
        if (value.length < 6) return 'Senha deve ter pelo menos 6 caracteres';
        return null;
    };

    const handleEmailChange = (text) => {
        setEmail(text);
        if (errors.email) {
            setErrors(prev => ({ ...prev, email: null }));
        }
    };

    const handlePasswordChange = (text) => {
        setPassword(text);
        if (errors.password) {
            setErrors(prev => ({ ...prev, password: null }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        const emailError = validateEmail(email);
        if (emailError) newErrors.email = emailError;

        const passwordError = validatePassword(password);
        if (passwordError) newErrors.password = passwordError;

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleEmailBlur = () => {
        const error = validateEmail(email);
        setErrors(prev => ({ ...prev, email: error }));
    };

    const handlePasswordBlur = () => {
        const error = validatePassword(password);
        setErrors(prev => ({ ...prev, password: error }));
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />

            <KeyboardAvoidingView
                style={styles.keyboardView}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    bounces={false}
                >
                    <View style={styles.headerSection}>
                        <View style={styles.logoContainer}>
                            <Ionicons name='school' size={32} color='#2563EB' />
                        </View>
                        <Text style={styles.appName}>EstudeAI</Text>
                        <Text style={styles.tagline}>Transforme seus estudos com IA</Text>
                    </View>

                    <View style={styles.formSection}>
                        <Text style={styles.formTitle}>Entrar</Text>
                        <Text style={styles.formSubtitle}>Entre sua conta para continuar</Text>

                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Email</Text>
                            <Input
                                leftIcon={<Ionicons name="mail-outline" size={18} color="#666" />}
                                placeholder="Digite seu email"
                                keyboardType="email-address"
                                onChangeText={handleEmailChange}
                                onBlur={handleEmailBlur}
                                error={errors.email}
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Senha</Text>
                            <Input
                                leftIcon={<Ionicons name="lock-closed-outline" size={18} color="#666" />}
                                placeholder="Digite sua senha"
                                isPassword={true}
                                onChangeText={handlePasswordChange}
                                onBlur={handlePasswordBlur}
                                error={errors.password}
                            />

                            <TouchableOpacity
                                style={styles.forgotPasswordLink}
                            >
                                <Text style={styles.forgotPasswordText}>
                                    Esqueci minha senha
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <Button
                            title={loading ? 'Entrando na sua conta...' : 'Entrar'}
                            style={styles.primaryButton}
                            disable={loading}
                        />

                        <View style={styles.secondaryActions}>
                            <TouchableOpacity
                                style={styles.createAccountLink}
                                onPress={() => navigation.navigate('Register')}
                            >
                                <Text style={styles.createAccountText}>
                                    Não tem conta? <Text style={styles.createAccountLinkText}>Criar conta</Text>
                                </Text>
                            </TouchableOpacity>

                            <View style={styles.dividerContainer}>
                                <View style={styles.divider} />
                                <Text style={styles.dividerText}>ou</Text>
                                <View style={styles.divider} />
                            </View>

                            <Button
                                title="Entrar como visitante"
                                leftIcon={<Ionicons name="person-outline" size={16} color="#6b7280" />}
                                style={styles.guestButton}
                                textStyle={styles.guestButtonText}
                            />
                        </View>
                    </View>

                    <View style={styles.footer}>
                        <TouchableOpacity
                            style={styles.createAccountLink}
                        >
                            <Text style={styles.createAccountText}>
                                Ao continuar, você concorda com nossa{' '}<Text style={styles.createAccountLinkText}>Política de Privacidade</Text>
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    keyboardView: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 20,
        justifyContent: 'space-between',
    },
    headerSection: {
        alignItems: 'center',
        paddingTop: 48,
        paddingBottom: 30,
    },
    logoContainer: {
        marginBottom: 16,
        width: 60,
        height: 60,
        backgroundColor: '#fff',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    appName: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1f2937',
        marginBottom: 4,
    },
    tagline: {
        fontSize: 14,
        color: '#6b7280',
        fontWeight: '400',
    },
    formSection: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 24,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
    },
    formTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#1f2937',
        marginBottom: 4,
        textAlign: 'center',
    },
    formSubtitle: {
        fontSize: 14,
        color: '#6b7280',
        marginBottom: 24,
        textAlign: 'center',
        fontWeight: '400',
    },
    inputContainer: {
        marginBottom: 16,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 6,
    },
    forgotPasswordLink: {
        alignSelf: 'flex-end',
        marginTop: 8,
        paddingVertical: 4,
    },
    forgotPasswordText: {
        fontSize: 14,
        color: '#2563EB',
        fontWeight: '500',
    },
    secondaryActions: {
        alignItems: 'center',
    },
    createAccountLink: {
        paddingVertical: 8,
    },
    createAccountText: {
        fontSize: 14,
        color: '#6b7280',
        textAlign: 'center',
    },
    createAccountLinkText: {
        color: '#2563EB',
        fontWeight: '600',
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 14,
        width: '100%',
    },
    divider: {
        flex: 1,
        height: 1,
        backgroundColor: '#e5e7eb',
    },
    dividerText: {
        fontSize: 12,
        color: '#9ca3af',
        marginHorizontal: 16,
        backgroundColor: '#fff',
        paddingHorizontal: 8,
    },
    guestButton: {
        width: '70%',
        height: 48,
        borderRadius: 8,
        backgroundColor: '#f9fafb',
        borderWidth: 1,
        borderColor: '#e5e7eb',
    },
    guestButtonText: {
        fontSize: 14,
        color: '#6b7280',
        marginLeft: 8,
        fontWeight: '500',
    },
    footer: {
        alignItems: 'center',
        paddingTop: 20,
        paddingBottom: 32,
        backgroundColor: '#f8f9fa',
    },
});


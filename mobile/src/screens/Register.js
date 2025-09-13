import { View, Text, StyleSheet, SafeAreaView, StatusBar, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { Button } from '../components/button';
import { Input } from '../components/input';
import { useState } from 'react';

export default function Register({ navigation }) {
    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const validateName = (value) => {
        if (!value.trim()) return 'Nome é obrigatório';
        if (value.trim().length < 2) return 'Nome deve ter pelo menos 2 caracteres';
        if (value.trim().length > 50) return 'Nome deve ter no máximo 50 caracteres';
        return null;
    };

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

    const handleNameChange = (text) => {
        setName(text);
        if (errors.name) {
            setErrors(prev => ({ ...prev, name: null }));
        }
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

        const nameError = validateName(name);
        if (nameError) newErrors.name = nameError;

        const emailError = validateEmail(email);
        if (emailError) newErrors.email = emailError;

        const passwordError = validatePassword(password);
        if (passwordError) newErrors.password = passwordError;

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNameBlur = () => {
        const error = validateName(name);
        setErrors(prev => ({ ...prev, name: error }));
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
                        <Text style={styles.formTitle}>Criar Conta</Text>
                        <Text style={styles.formSubtitle}>Crie sua conta gratuita</Text>

                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Nome Único</Text>
                            <Input
                                leftIcon={<Ionicons name="person-outline" size={18} color="#666" />}
                                placeholder="Nome único (ex: joao123)"
                                value={name}
                                onChangeText={handleNameChange}
                                onBlur={handleNameBlur}
                                error={errors.name}
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Email</Text>
                            <Input
                                leftIcon={<Ionicons name="mail-outline" size={18} color="#666" />}
                                placeholder="Digite seu email"
                                keyboardType="email-address"
                                value={email}
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
                                value={password}
                                onChangeText={handlePasswordChange}
                                onBlur={handlePasswordBlur}
                                error={errors.password}
                            />

                        </View>

                        <View style={styles.buttonsContainer}>
                            <Button
                                title={loading ? 'Criando conta...' : 'Criar Conta'}
                                style={styles.primaryButton}
                                disable={loading}
                            />

                            <Button
                                title={'Já tem conta? Entrar'}
                                style={styles.secondaryButton}
                                textStyle={styles.secondaryButtonText}
                                onPress={() => navigation.navigate('Login')}
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
        paddingBottom: 20,
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
    buttonsContainer: {
        marginTop: 8,
    },
    primaryButton: {
        marginBottom: 4,
    },
    secondaryButton: {
        backgroundColor: 'transparent',
    },
    secondaryButtonText: {
        color: '#2563EB',
        fontWeight: '600',
    },
    tertiaryButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#d1d5db',
    },
    tertiaryButtonText: {
        color: '#374151',
        fontWeight: '500',
    },
    footer: {
        alignItems: 'center',
        paddingTop: 16,
        paddingBottom: 24,
    }, createAccountLink: {
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
});


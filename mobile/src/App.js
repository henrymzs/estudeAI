import { View, Text, StyleSheet, SafeAreaView, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "./components/button";

export default function App() {
  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.backgroundLayer}>
        <Animated.View style={[styles.circle, styles.circle1]} />
        <Animated.View style={[styles.circle, styles.circle2]} />
        <Animated.View style={[styles.circle, styles.circle3]} />
        <Animated.View style={[styles.circle, styles.circle4]} />
      </View>

      <View style={styles.content}>
        <View style={styles.logoWrapper}>
          <View style={styles.logo}>
            <Ionicons name='school' size={48} color='#2563EB' />
          </View>
        </View>

        <Text style={styles.title}>EstudeAI</Text>

        <Text style={styles.subtitle}>Transforme conteúdos em aprendizado</Text>

        <View style={styles.loadingBar}>
          <Animated.View style={styles.loadingFill} />
        </View>

        <Text style={styles.loadingText}>
          Estamos melhorando sua experiência de aprendizado...
        </Text>
      </View>
      <Button title='Primeiro Acesso' />
      <Button
        title="Já tenho uma conta"
        style={{ backgroundColor: 'transparent' }}
        textStyle={{ color: '#165DFB' }}
      />

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafc',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    gap: 12,
  },
  backgroundLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.1,
  },
  circle: {
    position: 'absolute',
    backgroundColor: '#165DFB',
    borderRadius: 100,
  },
  circle1: {
    top: 80,
    left: 40,
    width: 80,
    height: 80,
  },
  circle2: {
    top: 160,
    right: 40,
    width: 48,
    height: 48,
  },
  circle3: {
    bottom: 120,
    left: 60,
    width: 64,
    height: 64,
  },
  circle4: {
    bottom: 60,
    right: 30,
    width: 32,
    height: 32,
  },
  content: {
    zIndex: 10,
    alignItems: 'center',
  },
  logoWrapper: {
    marginBottom: 32,
  },
  logo: {
    width: 96,
    height: 96,
    backgroundColor: '#fff',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
    position: 'relative',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    color: '#000',
    marginBottom: 24,
    textAlign: 'center',
  },
  loadingBar: {
    width: 192,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  loadingFill: {
    height: '100%',
    width: '100%',
    backgroundColor: '#000',
    borderRadius: 4,
  },
  loadingText: {
    fontSize: 12,
    color: '#000',
    marginTop: 12,
    opacity: 0.7,
  },
});
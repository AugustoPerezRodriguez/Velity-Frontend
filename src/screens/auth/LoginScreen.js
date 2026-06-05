import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { Link, useRouter } from 'expo-router';

import { Button, Input, Screen, Text } from '../../components/ui';
import { useAuth } from '../../hooks/useAuth';
import { colors, spacing } from '../../theme';

export default function LoginScreen() {
  const { signIn } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError('');
    if (!email || !password) {
      setError('Completá email y contraseña');
      return;
    }

    setLoading(true);
    try {
      await signIn(email.trim(), password);
      router.replace('/(app)');
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen contentContainerStyle={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.formWrapper}
      >
        <View style={styles.header}>
          <View style={styles.logo}>
            <Text variant="h2" color={colors.textInverse}>
              V
            </Text>
          </View>
          <Text variant="h2">Bienvenido a Velity</Text>
          <Text variant="bodySmall">Tu información de salud, siempre a mano</Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            placeholder="tu@email.com"
          />
          <Input
            label="Contraseña"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoComplete="password"
            placeholder="••••••••"
          />

          {error ? (
            <Text variant="caption" color={colors.danger} style={styles.error}>
              {error}
            </Text>
          ) : null}

          <Button title="Iniciar sesión" onPress={handleLogin} loading={loading} style={styles.button} />

          <View style={styles.footer}>
            <Text variant="bodySmall">¿No tenés cuenta? </Text>
            <Link href="/(auth)/register">
              <Text variant="bodySmall" color={colors.primary} style={styles.link}>
                Registrate
              </Text>
            </Link>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: spacing[8],
  },
  formWrapper: {
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing[8],
    gap: spacing[2],
  },
  logo: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[2],
  },
  form: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing[6],
    borderWidth: 1,
    borderColor: colors.border,
  },
  error: {
    marginBottom: spacing[3],
  },
  button: {
    marginTop: spacing[2],
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing[6],
  },
  link: {
    fontWeight: '600',
  },
});

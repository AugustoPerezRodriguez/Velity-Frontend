import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { Link } from 'expo-router';

import { Button, Input, Screen, Text } from '../../components/ui';
import { useAuth } from '../../hooks/useAuth';
import { colors, spacing } from '../../theme';

export default function RegisterScreen() {
  const { signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setError('');
    setSuccess('');

    if (!email || !password) {
      setError('Completá email y contraseña');
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);
    try {
      await signUp(email.trim(), password);
      setSuccess('Cuenta creada. Revisá tu email para confirmar o iniciá sesión.');
    } catch (err) {
      setError(err.message || 'Error al registrarse');
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
          <Text variant="h2">Crear cuenta</Text>
          <Text variant="bodySmall">Unite a Velity y gestioná tu salud digital</Text>
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
            placeholder="Mínimo 6 caracteres"
          />
          <Input
            label="Confirmar contraseña"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            placeholder="Repetí tu contraseña"
          />

          {error ? (
            <Text variant="caption" color={colors.danger} style={styles.message}>
              {error}
            </Text>
          ) : null}
          {success ? (
            <Text variant="caption" color={colors.success} style={styles.message}>
              {success}
            </Text>
          ) : null}

          <Button title="Registrarme" onPress={handleRegister} loading={loading} style={styles.button} />

          <View style={styles.footer}>
            <Text variant="bodySmall">¿Ya tenés cuenta? </Text>
            <Link href="/(auth)/login">
              <Text variant="bodySmall" color={colors.primary} style={styles.link}>
                Iniciá sesión
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
  form: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing[6],
    borderWidth: 1,
    borderColor: colors.border,
  },
  message: {
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

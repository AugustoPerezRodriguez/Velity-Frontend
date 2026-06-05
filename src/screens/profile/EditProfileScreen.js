import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import { Button, Input, Screen, Text } from '../../components/ui';
import { getMyProfile, updateMyProfile } from '../../services/profile.service';
import { colors, spacing } from '../../theme';

export default function EditProfileScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    sexo: '',
    peso_kg: '',
    altura_cm: '',
    foto_url: '',
  });

  const loadProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMyProfile();
      const { user } = data;
      setForm({
        nombre: user?.firstName ?? '',
        apellido: user?.lastName ?? '',
        telefono: user?.phone ?? '',
        sexo: user?.gender ?? '',
        peso_kg: user?.weightKg != null ? String(user.weightKg) : '',
        altura_cm: user?.heightCm != null ? String(user.heightCm) : '',
        foto_url: user?.photoUrl ?? '',
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const payload = {
        nombre: form.nombre,
        apellido: form.apellido,
        telefono: form.telefono,
        sexo: form.sexo,
        peso_kg: form.peso_kg ? Number(form.peso_kg) : undefined,
        altura_cm: form.altura_cm ? Number(form.altura_cm) : undefined,
        foto_url: form.foto_url || undefined,
      };
      await updateMyProfile(payload);
      router.back();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Screen loading={loading} error={error && !form.nombre ? error : null} onRetry={loadProfile} contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text variant="h2">Editar perfil</Text>
      </View>

      <View style={styles.form}>
        <Input label="Nombre" value={form.nombre} onChangeText={(v) => updateField('nombre', v)} />
        <Input label="Apellido" value={form.apellido} onChangeText={(v) => updateField('apellido', v)} />
        <Input
          label="Teléfono"
          value={form.telefono}
          onChangeText={(v) => updateField('telefono', v)}
          keyboardType="phone-pad"
        />
        <Input label="Sexo" value={form.sexo} onChangeText={(v) => updateField('sexo', v)} />
        <Input
          label="Peso (kg)"
          value={form.peso_kg}
          onChangeText={(v) => updateField('peso_kg', v)}
          keyboardType="decimal-pad"
        />
        <Input
          label="Altura (cm)"
          value={form.altura_cm}
          onChangeText={(v) => updateField('altura_cm', v)}
          keyboardType="number-pad"
        />
        <Input
          label="URL de foto"
          value={form.foto_url}
          onChangeText={(v) => updateField('foto_url', v)}
          autoCapitalize="none"
        />

        {error && form.nombre ? (
          <Text variant="caption" color={colors.danger} style={styles.error}>
            {error}
          </Text>
        ) : null}

        <View style={styles.actions}>
          <Button title="Cancelar" variant="secondary" onPress={() => router.back()} style={styles.actionBtn} />
          <Button title="Guardar" onPress={handleSave} loading={saving} style={styles.actionBtn} />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing[6],
  },
  header: {
    marginBottom: spacing[6],
  },
  form: {
    maxWidth: 560,
  },
  error: {
    marginBottom: spacing[3],
  },
  actions: {
    flexDirection: 'row',
    gap: spacing[3],
    marginTop: spacing[2],
  },
  actionBtn: {
    flex: 1,
  },
});

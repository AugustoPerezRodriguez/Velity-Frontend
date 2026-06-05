import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { Button, Card, Screen, Text } from '../../components/ui';
import { getFamilyMemberPermissions } from '../../services/family.service';
import { colors, spacing } from '../../theme';

function PermissionRow({ label, enabled, icon }) {
  return (
    <View style={styles.permissionRow}>
      <View style={styles.permissionLabel}>
        <Ionicons name={icon} size={20} color={enabled ? colors.primary : colors.neutral400} />
        <Text variant="body">{label}</Text>
      </View>
      <View style={[styles.permissionStatus, enabled ? styles.enabled : styles.disabled]}>
        <Text variant="caption" style={{ color: enabled ? colors.success : colors.neutral500 }}>
          {enabled ? 'Permitido' : 'No permitido'}
        </Text>
      </View>
    </View>
  );
}

export default function FamilyPermissionsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [permissions, setPermissions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadPermissions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getFamilyMemberPermissions(id);
      setPermissions(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadPermissions();
  }, [loadPermissions]);

  return (
    <Screen loading={loading} error={error} onRetry={loadPermissions} contentContainerStyle={styles.container}>
      <Button title="← Volver" variant="ghost" size="sm" onPress={() => router.back()} style={styles.back} />

      <Text variant="h2" style={styles.title}>
        Permisos compartidos
      </Text>
      <Text variant="bodySmall" style={styles.subtitle}>
        Información a la que este familiar tiene acceso
      </Text>

      {permissions ? (
        <Card>
          <PermissionRow
            label="Historial médico"
            enabled={permissions.medicalHistory}
            icon="document-text-outline"
          />
          <PermissionRow label="Medicamentos" enabled={permissions.medications} icon="medkit-outline" />
          <PermissionRow label="Turnos" enabled={permissions.appointments} icon="calendar-outline" />
        </Card>
      ) : null}

      {/* TODO: conectar cuando el backend esté listo — editar permisos / desvincular familiar */}
      <Card style={styles.todoCard}>
        <Text variant="label">Próximamente</Text>
        <Text variant="bodySmall">
          La edición de permisos y desvinculación de familiares estará disponible cuando el backend lo
          implemente.
        </Text>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing[6],
  },
  back: {
    alignSelf: 'flex-start',
    marginBottom: spacing[4],
  },
  title: {
    marginBottom: spacing[1],
  },
  subtitle: {
    marginBottom: spacing[6],
  },
  permissionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  permissionLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  permissionStatus: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    borderRadius: 999,
  },
  enabled: {
    backgroundColor: colors.successSoft,
  },
  disabled: {
    backgroundColor: colors.neutral100,
  },
  todoCard: {
    marginTop: spacing[4],
    gap: spacing[2],
  },
});

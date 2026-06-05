import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import { Avatar, Badge, Button, Card, Screen, Text } from '../../components/ui';
import { useResponsive } from '../../hooks/useResponsive';
import { getMyProfile } from '../../services/profile.service';
import { colors, spacing } from '../../theme';
import { formatDate } from '../../utils/date';
import { getHealthStatusColor, getHealthStatusSoftColor } from '../../utils/healthStatus';

function HealthStatusBadge({ status }) {
  const color = getHealthStatusColor(status);
  const bg = getHealthStatusSoftColor(status);
  return (
    <View style={[styles.statusBadge, { backgroundColor: bg }]}>
      <View style={[styles.statusDot, { backgroundColor: color }]} />
      <Text variant="label" style={{ color }}>
        {status}
      </Text>
    </View>
  );
}

function InfoRow({ label, value }) {
  return (
    <View style={styles.infoRow}>
      <Text variant="bodySmall">{label}</Text>
      <Text variant="body">{value || '—'}</Text>
    </View>
  );
}

export default function ProfileScreen() {
  const router = useRouter();
  const { isDesktop } = useResponsive();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMyProfile();
      setProfile(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const { user, healthStatus, allergies, conditions, criticalHistory } = profile ?? {};

  return (
    <Screen loading={loading} error={error} onRetry={loadProfile} contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text variant="h2">Mi perfil</Text>
        <Button title="Editar" variant="secondary" size="sm" onPress={() => router.push('/(app)/profile/edit')} />
      </View>

      <View style={[styles.layout, isDesktop && styles.layoutDesktop]}>
        <View style={[styles.column, isDesktop && styles.leftColumn]}>
          <Card style={styles.profileCard}>
            <View style={styles.profileHeader}>
              <Avatar name={user?.fullName} photoUrl={user?.photoUrl} size={80} />
              <View style={styles.profileInfo}>
                <Text variant="h3">{user?.fullName || '—'}</Text>
                <Text variant="bodySmall">{user?.email}</Text>
                {healthStatus?.status ? <HealthStatusBadge status={healthStatus.status} /> : null}
              </View>
            </View>

            <View style={styles.statsRow}>
              <View style={styles.stat}>
                <Text variant="h4">{healthStatus?.activeMedicationsCount ?? 0}</Text>
                <Text variant="caption">Medicamentos</Text>
              </View>
              <View style={styles.stat}>
                <Text variant="h4">{healthStatus?.chronicConditionsCount ?? 0}</Text>
                <Text variant="caption">Condiciones</Text>
              </View>
              <View style={styles.stat}>
                <Text variant="h4">{allergies?.length ?? 0}</Text>
                <Text variant="caption">Alergias</Text>
              </View>
            </View>
          </Card>

          <Card style={styles.section}>
            <Text variant="h4" style={styles.sectionTitle}>
              Datos personales
            </Text>
            <InfoRow label="Teléfono" value={user?.phone} />
            <InfoRow label="Fecha de nacimiento" value={formatDate(user?.birthDate)} />
            <InfoRow label="Edad" value={user?.age ? `${user.age} años` : null} />
            <InfoRow label="Sexo" value={user?.gender} />
            <InfoRow label="Grupo sanguíneo" value={user?.bloodGroup} />
            <InfoRow label="Obra social" value={user?.obraSocial} />
            <InfoRow label="Peso" value={user?.weightKg ? `${user.weightKg} kg` : null} />
            <InfoRow label="Altura" value={user?.heightCm ? `${user.heightCm} cm` : null} />
          </Card>
        </View>

        <View style={[styles.column, isDesktop && styles.rightColumn]}>
          {allergies?.length > 0 ? (
            <Card style={styles.section}>
              <Text variant="h4" style={styles.sectionTitle}>
                Alergias
              </Text>
              <View style={styles.tags}>
                {allergies.map((allergy) => (
                  <Badge key={allergy.id} label={allergy.name} variant="danger" />
                ))}
              </View>
            </Card>
          ) : null}

          {conditions?.length > 0 ? (
            <Card style={styles.section}>
              <Text variant="h4" style={styles.sectionTitle}>
                Condiciones crónicas
              </Text>
              {conditions.map((condition) => (
                <View key={condition.id} style={styles.conditionItem}>
                  <Text variant="body">{condition.name}</Text>
                  {condition.type ? <Badge label={condition.type} variant="warning" /> : null}
                </View>
              ))}
            </Card>
          ) : null}

          {criticalHistory?.length > 0 ? (
            <Card style={styles.section}>
              <Text variant="h4" style={styles.sectionTitle}>
                Historial crítico
              </Text>
              {criticalHistory.map((item) => (
                <View key={item.id} style={styles.criticalItem}>
                  <View style={styles.criticalHeader}>
                    <Text variant="label">{item.title}</Text>
                    <Badge label="Crítico" variant="danger" />
                  </View>
                  <Text variant="bodySmall">{item.description}</Text>
                  <Text variant="caption">{formatDate(item.date)}</Text>
                  {item.diagnosis ? (
                    <Text variant="caption">Diagnóstico: {item.diagnosis}</Text>
                  ) : null}
                  {item.treatment ? (
                    <Text variant="caption">Tratamiento: {item.treatment}</Text>
                  ) : null}
                </View>
              ))}
            </Card>
          ) : null}

          {!allergies?.length && !conditions?.length && !criticalHistory?.length ? (
            <Card style={styles.section}>
              <Text variant="bodySmall">No hay información médica adicional registrada.</Text>
            </Card>
          ) : null}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[6],
  },
  layout: {
    gap: spacing[4],
  },
  layoutDesktop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  column: {
    gap: spacing[4],
  },
  leftColumn: {
    flex: 1,
  },
  rightColumn: {
    flex: 1.2,
  },
  profileCard: {
    gap: spacing[4],
  },
  profileHeader: {
    flexDirection: 'row',
    gap: spacing[4],
    alignItems: 'center',
  },
  profileInfo: {
    flex: 1,
    gap: spacing[1],
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    borderRadius: 999,
    alignSelf: 'flex-start',
    marginTop: spacing[1],
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statsRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing[4],
  },
  stat: {
    flex: 1,
    alignItems: 'center',
    gap: spacing[1],
  },
  section: {
    marginBottom: 0,
  },
  sectionTitle: {
    marginBottom: spacing[4],
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing[2],
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
  },
  conditionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing[2],
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  criticalItem: {
    paddingVertical: spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: spacing[1],
  },
  criticalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

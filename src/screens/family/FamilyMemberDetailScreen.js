import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { Avatar, Button, Card, Screen, Text } from '../../components/ui';
import { useResponsive } from '../../hooks/useResponsive';
import { getFamilyMember } from '../../services/family.service';
import { colors, spacing } from '../../theme';
import { formatDate } from '../../utils/date';
import { getHealthStatusColor, getHealthStatusSoftColor } from '../../utils/healthStatus';

function InfoRow({ label, value }) {
  return (
    <View style={styles.infoRow}>
      <Text variant="bodySmall">{label}</Text>
      <Text variant="body">{value || '—'}</Text>
    </View>
  );
}

export default function FamilyMemberDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { isDesktop } = useResponsive();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadMember = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getFamilyMember(id);
      setMember(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadMember();
  }, [loadMember]);

  const statusColor = member ? getHealthStatusColor(member.healthStatus) : colors.neutral500;
  const statusBg = member ? getHealthStatusSoftColor(member.healthStatus) : colors.neutral100;

  return (
    <Screen loading={loading} error={error} onRetry={loadMember} contentContainerStyle={styles.container}>
      <Button title="← Volver" variant="ghost" size="sm" onPress={() => router.back()} style={styles.back} />

      {member ? (
        <View style={[styles.layout, isDesktop && styles.layoutDesktop]}>
          <Card style={[styles.column, isDesktop && styles.leftColumn]}>
            <View style={styles.profileHeader}>
              <Avatar name={member.fullName} photoUrl={member.photoUrl} size={80} />
              <View style={styles.profileInfo}>
                <Text variant="h3">{member.fullName}</Text>
                <Text variant="bodySmall">{member.relationship}</Text>
                <View style={[styles.statusTag, { backgroundColor: statusBg }]}>
                  <Text variant="label" style={{ color: statusColor }}>
                    {member.healthStatus}
                  </Text>
                </View>
              </View>
            </View>
          </Card>

          <Card style={[styles.column, isDesktop && styles.rightColumn]}>
            <Text variant="h4" style={styles.sectionTitle}>
              Información
            </Text>
            <InfoRow label="Email" value={member.email} />
            <InfoRow label="Teléfono" value={member.phone} />
            <InfoRow label="Edad" value={member.age ? `${member.age} años` : null} />
            <InfoRow label="Nacimiento" value={formatDate(member.birthDate)} />
            <InfoRow label="Peso" value={member.weight ? `${member.weight} kg` : null} />
            <InfoRow label="Altura" value={member.height ? `${member.height} cm` : null} />
            <InfoRow label="Grupo sanguíneo" value={member.bloodType} />

            <Button
              title="Ver permisos"
              variant="secondary"
              onPress={() => router.push(`/(app)/family/${id}/permissions`)}
              style={styles.permissionsBtn}
            />
          </Card>
        </View>
      ) : null}
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
  layout: {
    gap: spacing[4],
  },
  layoutDesktop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  column: {},
  leftColumn: {
    flex: 1,
  },
  rightColumn: {
    flex: 1.5,
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
  statusTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    borderRadius: 999,
    marginTop: spacing[2],
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
  permissionsBtn: {
    marginTop: spacing[6],
  },
});

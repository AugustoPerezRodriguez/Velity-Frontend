import { useCallback, useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import { Avatar, Badge, Card, Screen, Text } from '../../components/ui';
import { useResponsive } from '../../hooks/useResponsive';
import { getFamilyMembers, getFamilySummary } from '../../services/family.service';
import { colors, spacing } from '../../theme';
import { getHealthStatusColor, getHealthStatusSoftColor } from '../../utils/healthStatus';

function SummaryPill({ label, value }) {
  return (
    <View style={styles.pill}>
      <Text variant="h4">{value ?? 0}</Text>
      <Text variant="caption">{label}</Text>
    </View>
  );
}

function FamilyMemberCard({ member, onPress }) {
  const statusColor = getHealthStatusColor(member.healthStatus);
  const statusBg = getHealthStatusSoftColor(member.healthStatus);

  return (
    <Pressable onPress={onPress}>
      <Card style={styles.memberCard}>
        <Avatar name={member.fullName} photoUrl={member.photoUrl} size={56} />
        <View style={styles.memberInfo}>
          <Text variant="label">{member.fullName}</Text>
          <Text variant="caption">{member.relationship}</Text>
          <View style={[styles.statusTag, { backgroundColor: statusBg }]}>
            <Text variant="caption" style={{ color: statusColor }}>
              {member.healthStatus}
            </Text>
          </View>
        </View>
        <View style={styles.permissions}>
          {member.permissions?.medicalHistory ? <Badge label="Historial" variant="info" /> : null}
          {member.permissions?.medications ? <Badge label="Medicamentos" variant="primary" /> : null}
          {member.permissions?.appointments ? <Badge label="Turnos" variant="neutral" /> : null}
        </View>
      </Card>
    </Pressable>
  );
}

export default function FamilyScreen() {
  const router = useRouter();
  const { isDesktop } = useResponsive();
  const [members, setMembers] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadFamily = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [membersData, summaryData] = await Promise.all([getFamilyMembers(), getFamilySummary()]);
      setMembers(membersData);
      setSummary(summaryData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFamily();
  }, [loadFamily]);

  return (
    <Screen loading={loading} error={error} onRetry={loadFamily} contentContainerStyle={styles.container}>
      <Text variant="h2" style={styles.title}>
        Mi familia
      </Text>

      {summary ? (
        <Card style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <SummaryPill label="Total" value={summary.totalFamilyMembers} />
            <SummaryPill label="Hijos" value={summary.children} />
            <SummaryPill label="Padres" value={summary.parents} />
            <SummaryPill label="Hermanos" value={summary.siblings} />
            <SummaryPill label="Otros" value={summary.other} />
          </View>
        </Card>
      ) : null}

      <View style={[styles.grid, isDesktop && styles.gridDesktop]}>
        {members.map((member) => (
          <View key={member.id} style={isDesktop ? styles.gridItem : undefined}>
            <FamilyMemberCard
              member={member}
              onPress={() => router.push(`/(app)/family/${member.id}`)}
            />
          </View>
        ))}
      </View>

      {members.length === 0 && !loading ? (
        <Card>
          <Text variant="bodySmall">No hay familiares vinculados.</Text>
        </Card>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing[6],
  },
  title: {
    marginBottom: spacing[6],
  },
  summaryCard: {
    marginBottom: spacing[4],
  },
  summaryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[4],
    justifyContent: 'space-around',
  },
  pill: {
    alignItems: 'center',
    gap: spacing[1],
  },
  grid: {
    gap: spacing[3],
  },
  gridDesktop: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  gridItem: {
    width: '48%',
  },
  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  memberInfo: {
    flex: 1,
    gap: spacing[1],
  },
  statusTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing[2],
    paddingVertical: 2,
    borderRadius: 999,
    marginTop: spacing[1],
  },
  permissions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[1],
    maxWidth: 120,
    justifyContent: 'flex-end',
  },
});

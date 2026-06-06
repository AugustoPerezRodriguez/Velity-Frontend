import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Avatar, Screen, Text } from '../../components/ui';
import { getFamilyMembers } from '../../services/family.service';
import { colors, radii, spacing } from '../../theme';

function ActionButton({ label, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.actionBtn, pressed && { opacity: 0.75 }]}
    >
      <Text style={styles.actionBtnText}>{label}</Text>
    </Pressable>
  );
}

function FamilyCard({ member, expanded, onToggle, onViewHistory, onViewCalendar, onViewMedications }) {
  const hasAllergies = member.allergies?.length > 0;
  const hasDiseases = member.diseases?.length > 0;
  const showInfoPanel = hasAllergies || hasDiseases;

  return (
    <View style={[styles.card, expanded && styles.cardExpanded]}>
      <Pressable onPress={onToggle} style={styles.cardHeader}>
        <Avatar
          name={member.fullName}
          photoUrl={member.photoUrl}
          size={62}
          style={styles.avatarBorder}
        />
        <View style={styles.cardInfo}>
          <Text style={styles.cardName}>{member.fullName}</Text>
          <View style={styles.statsRow}>
            {member.age != null ? (
              <Text style={styles.statText}>{member.age} años</Text>
            ) : null}
            {member.weight != null ? (
              <Text style={styles.statText}>{member.weight}kg</Text>
            ) : null}
            {member.height != null ? (
              <Text style={styles.statText}>{member.height}cm</Text>
            ) : null}
          </View>
        </View>
        <Ionicons
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size={22}
          color={colors.white}
        />
      </Pressable>

      {expanded && (
        <View style={styles.expandedContent}>
          <View style={styles.expandedDivider} />
          <View style={styles.expandedBody}>
            <View style={styles.actionsColumn}>
              <ActionButton label="Ver historial medico" onPress={onViewHistory} />
              <ActionButton label="Ver calendario" onPress={onViewCalendar} />
              <ActionButton label="Ver medicamentos" onPress={onViewMedications} />
            </View>

            {showInfoPanel && (
              <View style={styles.infoPanel}>
                {hasAllergies && (
                  <View style={styles.infoSection}>
                    <Text style={styles.infoLabel}>Alergias:</Text>
                    {member.allergies.map((a, i) => (
                      <Text key={i} style={styles.infoItem}>{a}</Text>
                    ))}
                  </View>
                )}
                {hasDiseases && (
                  <View style={styles.infoSection}>
                    <Text style={styles.infoLabel}>Enfermedades:</Text>
                    {member.diseases.map((d, i) => (
                      <Text key={i} style={styles.infoItem}>{d}</Text>
                    ))}
                  </View>
                )}
              </View>
            )}
          </View>
        </View>
      )}
    </View>
  );
}

export default function FamilyScreen() {
  const router = useRouter();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  const loadFamily = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getFamilyMembers();
      setMembers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFamily();
  }, [loadFamily]);

  const handleToggle = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <Screen loading={loading} error={error} onRetry={loadFamily} contentContainerStyle={styles.container}>
      <Text style={styles.title}>Familia</Text>
      <Text style={styles.subtitle}>Accede a tus familiares</Text>

      <View style={styles.list}>
        {members.map((member) => (
          <FamilyCard
            key={member.id}
            member={member}
            expanded={expandedId === member.id}
            onToggle={() => handleToggle(member.id)}
            onViewHistory={() => router.push(`/(app)/family/${member.id}/history`)}
            onViewCalendar={() => router.push('/(app)/appointments')}
            onViewMedications={() => router.push('/(app)/medications')}
          />
        ))}
      </View>

      {members.length === 0 && !loading ? (
        <View style={styles.emptyState}>
          <Ionicons name="people-outline" size={52} color={colors.neutral300} />
          <Text style={styles.emptyText}>No hay familiares vinculados.</Text>
        </View>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[6],
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: spacing[1],
  },
  subtitle: {
    fontSize: 14,
    color: colors.neutral500,
    textAlign: 'center',
    marginBottom: spacing[5],
  },
  list: {
    gap: spacing[3],
  },
  card: {
    backgroundColor: colors.primary,
    borderRadius: radii.xl,
    overflow: 'hidden',
  },
  cardExpanded: {
    borderWidth: 2,
    borderColor: colors.primaryDark,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    gap: spacing[3],
  },
  avatarBorder: {
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.6)',
    borderRadius: 999,
  },
  cardInfo: {
    flex: 1,
  },
  cardName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.white,
    marginBottom: spacing[1],
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing[3],
    flexWrap: 'wrap',
  },
  statText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '500',
  },
  expandedContent: {
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[4],
  },
  expandedDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.25)',
    marginBottom: spacing[3],
  },
  expandedBody: {
    flexDirection: 'row',
    gap: spacing[3],
  },
  actionsColumn: {
    gap: spacing[2],
    flex: 1,
  },
  actionBtn: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: radii.lg,
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[3],
    alignItems: 'center',
  },
  actionBtnText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '600',
  },
  infoPanel: {
    flex: 1,
    flexDirection: 'row',
    gap: spacing[2],
  },
  infoSection: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.12)',
    borderRadius: radii.md,
    padding: spacing[2],
  },
  infoLabel: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '700',
    marginBottom: spacing[1],
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoItem: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 12,
    marginBottom: 2,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing[12],
    gap: spacing[3],
  },
  emptyText: {
    color: colors.neutral400,
    fontSize: 16,
  },
});

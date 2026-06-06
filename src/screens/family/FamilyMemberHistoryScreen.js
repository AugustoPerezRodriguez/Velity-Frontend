import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { Screen, Text } from '../../components/ui';
import { getFamilyMemberHistory } from '../../services/family.service';
import { colors, radii, spacing } from '../../theme';
import { formatDate } from '../../utils/date';

const FILTERS = [
  { value: '', label: 'Todo' },
  { value: 'study', label: 'Estudios' },
  { value: 'vaccine', label: 'Vacunas' },
  { value: 'medication', label: 'Medicaciones' },
  { value: 'diagnosis', label: 'Diagnosticos' },
];

const CATEGORY_ICONS = {
  disease: 'heart',
  study: 'document-text',
  vaccine: 'fitness',
  medication: 'medkit',
  diagnosis: 'clipboard',
  consultation: 'person',
  background: 'archive',
};

function RecordItem({ record, onPress }) {
  const iconName = CATEGORY_ICONS[record.category] ?? 'document';
  const subtitle = record.institution?.name ?? formatDate(record.date);

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.recordItem, pressed && { opacity: 0.85 }]}>
      <View style={styles.recordIconBox}>
        <Ionicons name={iconName} size={20} color={colors.white} />
      </View>
      <View style={styles.recordContent}>
        <Text style={styles.recordTitle} numberOfLines={1}>{record.title}</Text>
        {subtitle ? <Text style={styles.recordSub} numberOfLines={1}>{subtitle}</Text> : null}
      </View>
      <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.7)" />
    </Pressable>
  );
}

export default function FamilyMemberHistoryScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('');

  const loadHistory = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getFamilyMemberHistory(id);
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const records = data?.records ?? [];

  const filtered = activeFilter
    ? records.filter((r) => r.category === activeFilter)
    : records;

  const chronicDiseases = filtered.filter((r) => r.category === 'disease');
  const timelineRecords = filtered.filter((r) => r.category !== 'disease');

  const grouped = {};
  timelineRecords.forEach((record) => {
    if (!record.date) return;
    const d = new Date(record.date);
    const year = d.getFullYear().toString();
    const month = d.toLocaleString('es-AR', { month: 'short' });
    if (!grouped[year]) grouped[year] = {};
    if (!grouped[year][month]) grouped[year][month] = [];
    grouped[year][month].push(record);
  });
  const years = Object.keys(grouped).sort((a, b) => Number(b) - Number(a));

  const memberName = data?.memberName ?? 'Familiar';

  return (
    <Screen loading={loading} error={error} onRetry={loadHistory} contentContainerStyle={styles.container}>
      {/* Back button */}
      <Pressable
        onPress={() => router.back()}
        style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.7 }]}
      >
        <Ionicons name="arrow-back" size={20} color={colors.primary} />
        <Text style={styles.backText}>Volver</Text>
      </Pressable>

      {/* Title */}
      <Text style={styles.title}>Historial Médico</Text>
      <Text style={styles.subtitle}>{memberName}</Text>

      {/* Filter tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterScroll}
        contentContainerStyle={styles.filterContent}
      >
        {FILTERS.map((f) => (
          <Pressable
            key={f.value}
            onPress={() => setActiveFilter(f.value)}
            style={[styles.filterTab, activeFilter === f.value && styles.filterTabActive]}
          >
            <Text style={[styles.filterTabText, activeFilter === f.value && styles.filterTabTextActive]}>
              {f.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Chronic diseases */}
      {chronicDiseases.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionLabel}>
            <Ionicons name="pulse" size={16} color={colors.textSecondary} />
            <Text style={styles.sectionLabelText}>Enfermedades crónicas</Text>
          </View>
          {chronicDiseases.map((record) => (
            <RecordItem key={record.id} record={record} onPress={() => {}} />
          ))}
        </View>
      )}

      {/* Timeline */}
      {years.map((year) => (
        <View key={year} style={styles.yearGroup}>
          <Text style={styles.yearLabel}>{year}</Text>
          {Object.entries(grouped[year]).map(([month, monthRecords]) => (
            <View key={month} style={styles.monthGroup}>
              <Text style={styles.monthLabel}>{month}</Text>
              {monthRecords.map((record) => (
                <RecordItem key={record.id} record={record} onPress={() => {}} />
              ))}
            </View>
          ))}
        </View>
      ))}

      {filtered.length === 0 && !loading ? (
        <View style={styles.emptyState}>
          <Ionicons name="document-outline" size={52} color={colors.neutral300} />
          <Text style={styles.emptyText}>No hay registros disponibles.</Text>
          <Text style={styles.emptyHint}>
            El historial médico de este familiar aún no está disponible.
          </Text>
        </View>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[4],
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    marginBottom: spacing[4],
    alignSelf: 'flex-start',
  },
  backText: {
    fontSize: 15,
    color: colors.primary,
    fontWeight: '600',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing[1],
  },
  subtitle: {
    fontSize: 15,
    color: colors.primary,
    fontWeight: '600',
    marginBottom: spacing[4],
  },
  filterScroll: {
    marginBottom: spacing[5],
    marginHorizontal: -spacing[4],
  },
  filterContent: {
    paddingHorizontal: spacing[4],
    gap: spacing[2],
  },
  filterTab: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    borderRadius: radii.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterTabActive: {
    backgroundColor: colors.neutral800,
    borderColor: colors.neutral800,
  },
  filterTabText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  filterTabTextActive: {
    color: colors.white,
    fontWeight: '600',
  },
  section: {
    marginBottom: spacing[4],
    gap: spacing[2],
  },
  sectionLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    marginBottom: spacing[1],
  },
  sectionLabelText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  recordItem: {
    backgroundColor: colors.primary,
    borderRadius: radii.xl,
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing[3],
    gap: spacing[3],
    marginBottom: spacing[2],
  },
  recordIconBox: {
    width: 40,
    height: 40,
    borderRadius: radii.lg,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordContent: {
    flex: 1,
    gap: 2,
  },
  recordTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.white,
  },
  recordSub: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.75)',
  },
  yearGroup: {
    marginBottom: spacing[4],
  },
  yearLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing[2],
  },
  monthGroup: {
    marginBottom: spacing[2],
  },
  monthLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    textTransform: 'capitalize',
    marginBottom: spacing[2],
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing[12],
    gap: spacing[3],
  },
  emptyText: {
    color: colors.neutral500,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  emptyHint: {
    color: colors.neutral400,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
});

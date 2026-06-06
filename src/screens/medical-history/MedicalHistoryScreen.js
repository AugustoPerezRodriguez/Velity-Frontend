import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { Screen, Text } from '../../components/ui';
import { getFilteredMedicalHistory } from '../../services/medicalHistory.service';
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

function StatusCard({ hasCritical }) {
  return (
    <View style={styles.statusCard}>
      <View style={styles.statusRow}>
        <Text style={styles.statusEmoji}>😊</Text>
        <View style={styles.statusTexts}>
          <Text style={styles.statusTitle}>Todo en orden</Text>
          <Text style={styles.statusSub}>Sin alertas críticas</Text>
        </View>
      </View>
      <Text style={styles.statusNote}>Último estudio: hace 5 meses</Text>
    </View>
  );
}

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

function SectionLabel({ text, icon }) {
  return (
    <View style={styles.sectionLabel}>
      {icon ? <Ionicons name={icon} size={16} color={colors.textSecondary} /> : null}
      <Text style={styles.sectionLabelText}>{text}</Text>
    </View>
  );
}

export default function MedicalHistoryScreen() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('');

  const loadHistory = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getFilteredMedicalHistory({ category: activeFilter });
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [activeFilter]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const { records } = data ?? {};

  const chronicDiseases = records?.filter((r) => r.category === 'disease') ?? [];
  const timelineRecords = records?.filter((r) => r.category !== 'disease') ?? [];

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

  return (
    <View style={styles.root}>
      <Screen loading={loading} error={error} onRetry={loadHistory} contentContainerStyle={styles.container}>
        <Text style={styles.title}>Historial Médico</Text>

        <StatusCard />

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

        {/* Enfermedades crónicas */}
        {chronicDiseases.length > 0 && (
          <View style={styles.section}>
            <SectionLabel text="Enfermedades crónicas" icon="pulse" />
            {chronicDiseases.map((record) => (
              <RecordItem
                key={record.id}
                record={record}
                onPress={() => router.push(`/(app)/medical-history/${record.id}`)}
              />
            ))}
          </View>
        )}

        {/* Timeline by year/month */}
        {years.map((year) => (
          <View key={year} style={styles.yearGroup}>
            <Text style={styles.yearLabel}>{year}</Text>
            {Object.entries(grouped[year]).map(([month, monthRecords]) => (
              <View key={month} style={styles.monthGroup}>
                <Text style={styles.monthLabel}>{month}</Text>
                {monthRecords.map((record) => (
                  <RecordItem
                    key={record.id}
                    record={record}
                    onPress={() => router.push(`/(app)/medical-history/${record.id}`)}
                  />
                ))}
              </View>
            ))}
          </View>
        ))}

        {records?.length === 0 && !loading ? (
          <View style={styles.emptyState}>
            <Ionicons name="document-outline" size={52} color={colors.neutral300} />
            <Text style={styles.emptyText}>No hay registros con los filtros seleccionados.</Text>
          </View>
        ) : null}

        <View style={styles.fabSpacer} />
      </Screen>

      <Pressable
        style={({ pressed }) => [styles.fab, pressed && { opacity: 0.85 }]}
        onPress={() => router.push('/(app)/appointments/add')}
      >
        <Ionicons name="add" size={30} color={colors.white} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  container: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[5],
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing[4],
  },
  statusCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    padding: spacing[4],
    marginBottom: spacing[4],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    gap: spacing[2],
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  statusEmoji: {
    fontSize: 32,
  },
  statusTexts: {
    gap: 2,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  statusSub: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  statusNote: {
    fontSize: 12,
    color: colors.neutral400,
    marginTop: spacing[1],
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
    color: colors.neutral400,
    fontSize: 15,
    textAlign: 'center',
  },
  fabSpacer: {
    height: 80,
  },
  fab: {
    position: 'absolute',
    bottom: spacing[6],
    right: spacing[5],
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 8,
  },
});

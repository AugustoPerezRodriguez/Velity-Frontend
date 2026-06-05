import { useCallback, useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import { Badge, Card, Screen, Text } from '../../components/ui';
import { CATEGORY_LABELS, MEDICAL_CATEGORIES } from '../../constants/medicalHistory';
import { useResponsive } from '../../hooks/useResponsive';
import { getFilteredMedicalHistory } from '../../services/medicalHistory.service';
import { colors, spacing } from '../../theme';
import { formatDate } from '../../utils/date';

function SummaryCard({ label, value }) {
  return (
    <Card style={styles.summaryCard} padding={spacing[3]}>
      <Text variant="h3">{value ?? 0}</Text>
      <Text variant="caption">{label}</Text>
    </Card>
  );
}

function RecordCard({ record, onPress, compact }) {
  return (
    <Pressable onPress={onPress}>
      <Card style={[styles.recordCard, compact && styles.recordCardCompact]}>
        <View style={styles.recordHeader}>
          <Badge label={CATEGORY_LABELS[record.category] || record.category} variant="info" />
          {record.critical ? <Badge label="Crítico" variant="danger" /> : null}
        </View>
        <Text variant="label">{record.title}</Text>
        {record.description ? (
          <Text variant="bodySmall" numberOfLines={compact ? 2 : 3}>
            {record.description}
          </Text>
        ) : null}
        <Text variant="caption">{formatDate(record.date)}</Text>
      </Card>
    </Pressable>
  );
}

export default function MedicalHistoryScreen() {
  const router = useRouter();
  const { isDesktop } = useResponsive();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ category: '', year: '', critical: '' });

  const loadHistory = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getFilteredMedicalHistory(filters);
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const { summary, records } = data ?? {};

  return (
    <Screen loading={loading} error={error} onRetry={loadHistory} contentContainerStyle={styles.container}>
      <Text variant="h2" style={styles.title}>
        Historial médico
      </Text>

      <View style={styles.summaryRow}>
        <SummaryCard label="Registros" value={summary?.totalRecords} />
        <SummaryCard label="Vacunas" value={summary?.totalVaccines} />
        <SummaryCard label="Estudios" value={summary?.totalStudies} />
        <SummaryCard label="Diagnósticos" value={summary?.totalDiagnoses} />
      </View>

      <Card style={styles.filters}>
        <Text variant="label" style={styles.filterTitle}>
          Filtros
        </Text>
        <View style={styles.filterRow}>
          {MEDICAL_CATEGORIES.map((cat) => (
            <Pressable
              key={cat.value}
              onPress={() => setFilters((f) => ({ ...f, category: cat.value }))}
              style={[styles.filterChip, filters.category === cat.value && styles.filterChipActive]}
            >
              <Text
                variant="caption"
                style={filters.category === cat.value ? styles.filterChipTextActive : undefined}
              >
                {cat.label}
              </Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.filterRow}>
          <Pressable
            onPress={() => setFilters((f) => ({ ...f, critical: f.critical === 'true' ? '' : 'true' }))}
            style={[styles.filterChip, filters.critical === 'true' && styles.filterChipActive]}
          >
            <Text variant="caption" style={filters.critical === 'true' ? styles.filterChipTextActive : undefined}>
              Solo críticos
            </Text>
          </Pressable>
        </View>
      </Card>

      {records?.length === 0 ? (
        <Card>
          <Text variant="bodySmall">No se encontraron registros con los filtros seleccionados.</Text>
        </Card>
      ) : (
        <View style={[styles.recordsGrid, isDesktop && styles.recordsGridDesktop]}>
          {records?.map((record) => (
            <View key={record.id} style={isDesktop ? styles.gridItem : undefined}>
              <RecordCard
                record={record}
                compact={!isDesktop}
                onPress={() => router.push(`/(app)/medical-history/${record.id}`)}
              />
            </View>
          ))}
        </View>
      )}
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
  summaryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[3],
    marginBottom: spacing[4],
  },
  summaryCard: {
    minWidth: 100,
    flex: 1,
    alignItems: 'center',
    gap: spacing[1],
  },
  filters: {
    marginBottom: spacing[4],
  },
  filterTitle: {
    marginBottom: spacing[3],
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
    marginBottom: spacing[2],
  },
  filterChip: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    borderRadius: 999,
    backgroundColor: colors.neutral100,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipActive: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.primary,
  },
  filterChipTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  recordsGrid: {
    gap: spacing[3],
  },
  recordsGridDesktop: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  gridItem: {
    width: '48%',
  },
  recordCard: {
    gap: spacing[2],
  },
  recordCardCompact: {
    marginBottom: 0,
  },
  recordHeader: {
    flexDirection: 'row',
    gap: spacing[2],
  },
});

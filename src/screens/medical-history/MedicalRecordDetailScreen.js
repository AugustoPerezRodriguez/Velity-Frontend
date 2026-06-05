import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { Badge, Button, Card, Screen, Text } from '../../components/ui';
import { CATEGORY_LABELS } from '../../constants/medicalHistory';
import { getMedicalRecord } from '../../services/medicalHistory.service';
import { colors, spacing } from '../../theme';
import { formatDateLong } from '../../utils/date';

function DetailRow({ label, value }) {
  if (!value) return null;
  return (
    <View style={styles.detailRow}>
      <Text variant="bodySmall">{label}</Text>
      <Text variant="body">{value}</Text>
    </View>
  );
}

export default function MedicalRecordDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadRecord = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMedicalRecord(id);
      setRecord(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadRecord();
  }, [loadRecord]);

  return (
    <Screen loading={loading} error={error} onRetry={loadRecord} contentContainerStyle={styles.container}>
      <Button title="← Volver" variant="ghost" size="sm" onPress={() => router.back()} style={styles.back} />

      {record ? (
        <>
          <View style={styles.header}>
            <Badge label={CATEGORY_LABELS[record.category] || record.category} variant="info" />
            {record.critical ? <Badge label="Crítico" variant="danger" /> : null}
          </View>

          <Text variant="h2" style={styles.title}>
            {record.title}
          </Text>
          <Text variant="bodySmall">{formatDateLong(record.date)}</Text>

          <Card style={styles.section}>
            <DetailRow label="Descripción" value={record.description} />
            <DetailRow label="Diagnóstico" value={record.diagnosis} />
            <DetailRow label="Tratamiento" value={record.treatment} />
            <DetailRow label="Institución" value={record.institution?.name} />
            <DetailRow
              label="Profesional"
              value={record.doctor ? `${record.doctor.fullName} — ${record.doctor.specialty}` : null}
            />
          </Card>

          {record.vaccine ? (
            <Card style={styles.section}>
              <Text variant="h4" style={styles.sectionTitle}>
                Vacuna
              </Text>
              <DetailRow label="Nombre" value={record.vaccine.name} />
              <DetailRow label="Dosis" value={record.vaccine.dose} />
              <DetailRow label="Lote" value={record.vaccine.lot} />
              <DetailRow label="Vencimiento" value={formatDateLong(record.vaccine.expirationDate)} />
              <DetailRow label="Centro" value={record.vaccine.center} />
            </Card>
          ) : null}

          {record.study ? (
            <Card style={styles.section}>
              <Text variant="h4" style={styles.sectionTitle}>
                Estudio
              </Text>
              <DetailRow label="Nombre" value={record.study.name} />
            </Card>
          ) : null}

          {record.attachments?.length > 0 ? (
            <Card style={styles.section}>
              <Text variant="h4" style={styles.sectionTitle}>
                Adjuntos
              </Text>
              {record.attachments.map((file) => (
                <View key={file.id} style={styles.attachment}>
                  <Text variant="body">{file.fileName}</Text>
                  <Text variant="caption">{file.fileType}</Text>
                </View>
              ))}
            </Card>
          ) : null}
        </>
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
  header: {
    flexDirection: 'row',
    gap: spacing[2],
    marginBottom: spacing[3],
  },
  title: {
    marginBottom: spacing[1],
  },
  section: {
    marginTop: spacing[4],
  },
  sectionTitle: {
    marginBottom: spacing[3],
  },
  detailRow: {
    paddingVertical: spacing[2],
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: spacing[1],
  },
  attachment: {
    paddingVertical: spacing[2],
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
});

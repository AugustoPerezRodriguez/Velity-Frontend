import { StyleSheet, View } from 'react-native';

import { Badge, Card, Screen, Text } from '../../components/ui';
import { useResponsive } from '../../hooks/useResponsive';
import { colors, spacing } from '../../theme';

// TODO: conectar cuando el backend esté listo
const MOCK_MEDICATIONS = [
  { id: '1', name: 'Losartán', dose: '50 mg', frequency: '1 vez al día', status: 'activo' },
  { id: '2', name: 'Metformina', dose: '850 mg', frequency: '2 veces al día', status: 'activo' },
  { id: '3', name: 'Ibuprofeno', dose: '400 mg', frequency: 'Según necesidad', status: 'ocasional' },
];

export default function MedicationsScreen() {
  const { isDesktop } = useResponsive();

  return (
    <Screen contentContainerStyle={styles.container}>
      <Text variant="h2" style={styles.title}>
        Medicamentos
      </Text>
      <Text variant="bodySmall" style={styles.subtitle}>
        Tratamientos y medicación actual
      </Text>

      <View style={[styles.list, isDesktop && styles.listDesktop]}>
        {MOCK_MEDICATIONS.map((med) => (
          <Card key={med.id} style={[styles.medCard, isDesktop && styles.gridItem]}>
            <View style={styles.medHeader}>
              <Text variant="label">{med.name}</Text>
              <Badge label={med.status} variant={med.status === 'activo' ? 'primary' : 'neutral'} />
            </View>
            <Text variant="body">{med.dose}</Text>
            <Text variant="bodySmall">{med.frequency}</Text>
          </Card>
        ))}
      </View>

      <Card style={styles.todoCard}>
        <Text variant="bodySmall">
          {/* TODO: conectar cuando el backend esté listo */}
          Datos de ejemplo. Los medicamentos se conectarán al backend cuando el endpoint esté disponible.
        </Text>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing[6],
  },
  title: {
    marginBottom: spacing[1],
  },
  subtitle: {
    marginBottom: spacing[6],
  },
  list: {
    gap: spacing[3],
    marginBottom: spacing[4],
  },
  listDesktop: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  gridItem: {
    width: '48%',
  },
  medCard: {
    gap: spacing[2],
  },
  medHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  todoCard: {
    backgroundColor: colors.warningSoft,
    borderColor: colors.warning,
  },
});

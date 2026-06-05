import { StyleSheet, View } from 'react-native';

import { Badge, Card, Screen, Text } from '../../components/ui';
import { useResponsive } from '../../hooks/useResponsive';
import { colors, spacing } from '../../theme';

// TODO: conectar cuando el backend esté listo
const MOCK_UPCOMING_APPOINTMENT = {
  doctor: 'Dra. María González',
  specialty: 'Cardiología',
  date: '12 Jun 2026, 10:30',
  location: 'Hospital Central',
};

const MOCK_STATS = [
  { label: 'Próximo turno', value: '12 Jun', variant: 'primary' },
  { label: 'Medicamentos activos', value: '3', variant: 'info' },
  { label: 'Registros médicos', value: '24', variant: 'neutral' },
  { label: 'Familiares', value: '2', variant: 'success' },
];

export default function HomeScreen() {
  const { isDesktop } = useResponsive();

  return (
    <Screen contentContainerStyle={styles.container}>
      <Text variant="h2" style={styles.title}>
        Inicio
      </Text>
      <Text variant="bodySmall" style={styles.subtitle}>
        Resumen de tu salud digital
      </Text>

      <View style={[styles.statsGrid, isDesktop && styles.statsGridDesktop]}>
        {MOCK_STATS.map((stat) => (
          <Card key={stat.label} style={styles.statCard} padding={spacing[4]}>
            <Text variant="h3">{stat.value}</Text>
            <Badge label={stat.label} variant={stat.variant} />
          </Card>
        ))}
      </View>

      <Card style={styles.appointmentCard}>
        <Text variant="h4" style={styles.sectionTitle}>
          Próximo turno
        </Text>
        <Text variant="label">{MOCK_UPCOMING_APPOINTMENT.doctor}</Text>
        <Text variant="bodySmall">{MOCK_UPCOMING_APPOINTMENT.specialty}</Text>
        <Text variant="body">{MOCK_UPCOMING_APPOINTMENT.date}</Text>
        <Text variant="caption">{MOCK_UPCOMING_APPOINTMENT.location}</Text>
      </Card>

      <Card style={styles.todoCard}>
        <Text variant="label">Datos de ejemplo</Text>
        <Text variant="bodySmall">
          {/* TODO: conectar cuando el backend esté listo */}
          Este dashboard usa datos mock. Se conectará al backend cuando los endpoints de inicio estén
          disponibles.
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
  statsGrid: {
    gap: spacing[3],
    marginBottom: spacing[4],
  },
  statsGridDesktop: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  statCard: {
    gap: spacing[2],
    flex: 1,
    minWidth: 140,
  },
  appointmentCard: {
    gap: spacing[2],
    marginBottom: spacing[4],
  },
  sectionTitle: {
    marginBottom: spacing[2],
  },
  todoCard: {
    gap: spacing[2],
    backgroundColor: colors.warningSoft,
    borderColor: colors.warning,
  },
});

import { StyleSheet, View } from 'react-native';

import { Badge, Card, Screen, Text } from '../../components/ui';
import { useResponsive } from '../../hooks/useResponsive';
import { colors, spacing } from '../../theme';

// TODO: conectar cuando el backend esté listo
const MOCK_APPOINTMENTS = [
  { id: '1', doctor: 'Dra. María González', specialty: 'Cardiología', date: '2026-06-12', time: '10:30', status: 'confirmado' },
  { id: '2', doctor: 'Dr. Carlos Ruiz', specialty: 'Clínica médica', date: '2026-06-20', time: '15:00', status: 'pendiente' },
  { id: '3', doctor: 'Dra. Ana López', specialty: 'Dermatología', date: '2026-07-03', time: '09:00', status: 'confirmado' },
];

export default function AppointmentsScreen() {
  const { isDesktop } = useResponsive();

  return (
    <Screen contentContainerStyle={styles.container}>
      <Text variant="h2" style={styles.title}>
        Turnos
      </Text>
      <Text variant="bodySmall" style={styles.subtitle}>
        Calendario de citas médicas
      </Text>

      <View style={[styles.list, isDesktop && styles.listDesktop]}>
        {MOCK_APPOINTMENTS.map((appt) => (
          <Card key={appt.id} style={isDesktop ? styles.gridItem : undefined}>
            <View style={styles.apptHeader}>
              <Text variant="label">{appt.doctor}</Text>
              <Badge label={appt.status} variant={appt.status === 'confirmado' ? 'success' : 'warning'} />
            </View>
            <Text variant="bodySmall">{appt.specialty}</Text>
            <Text variant="body">
              {appt.date} — {appt.time}
            </Text>
          </Card>
        ))}
      </View>

      <Card style={styles.todoCard}>
        <Text variant="bodySmall">
          {/* TODO: conectar cuando el backend esté listo */}
          Datos de ejemplo. Los turnos se conectarán al backend cuando el endpoint esté disponible.
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
  apptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[2],
  },
  todoCard: {
    backgroundColor: colors.warningSoft,
    borderColor: colors.warning,
  },
});

import { StyleSheet, View } from 'react-native';

import { Card, Screen, Text } from '../../components/ui';
import { useResponsive } from '../../hooks/useResponsive';
import { colors, spacing } from '../../theme';

// TODO: conectar cuando el backend esté listo
const MOCK_PLACES = [
  { id: '1', name: 'Hospital Central', type: 'Hospital', distance: '1.2 km', address: 'Av. Salud 1234' },
  { id: '2', name: 'Farmacia San Martín', type: 'Farmacia', distance: '350 m', address: 'Calle Mitre 456' },
  { id: '3', name: 'Centro de Diagnóstico Velity', type: 'Laboratorio', distance: '2.8 km', address: 'Bv. Independencia 789' },
];

export default function MapScreen() {
  const { isDesktop } = useResponsive();

  return (
    <Screen contentContainerStyle={styles.container}>
      <Text variant="h2" style={styles.title}>
        Lugares cercanos
      </Text>
      <Text variant="bodySmall" style={styles.subtitle}>
        Centros de salud, farmacias y laboratorios
      </Text>

      <Card style={styles.mapPlaceholder}>
        <Text variant="label">Mapa</Text>
        <Text variant="bodySmall">Vista de mapa interactivo — próximamente</Text>
      </Card>

      <View style={[styles.list, isDesktop && styles.listDesktop]}>
        {MOCK_PLACES.map((place) => (
          <Card key={place.id} style={[styles.placeCard, isDesktop && styles.gridItem]}>
            <Text variant="label">{place.name}</Text>
            <Text variant="bodySmall">{place.type} · {place.distance}</Text>
            <Text variant="caption">{place.address}</Text>
          </Card>
        ))}
      </View>

      <Card style={styles.todoCard}>
        <Text variant="bodySmall">
          {/* TODO: conectar cuando el backend esté listo */}
          Datos de ejemplo. El mapa y lugares se conectarán al backend cuando el endpoint esté disponible.
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
  mapPlaceholder: {
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[4],
    backgroundColor: colors.neutral100,
    gap: spacing[2],
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
  placeCard: {
    gap: spacing[1],
  },
  todoCard: {
    backgroundColor: colors.warningSoft,
    borderColor: colors.warning,
  },
});

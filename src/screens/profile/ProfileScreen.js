import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Avatar, Screen, Text } from '../../components/ui';
import { useAuth } from '../../hooks/useAuth';
import { getMyProfile } from '../../services/profile.service';
import { colors, radii, spacing } from '../../theme';

function InfoChip({ label }) {
  return (
    <View style={styles.chip}>
      <Text style={styles.chipText}>{label}</Text>
    </View>
  );
}

function SectionTitle({ children }) {
  return <Text style={styles.sectionTitle}>{children}</Text>;
}

function ChipsRow({ items }) {
  if (!items?.length) return null;
  return (
    <View style={styles.chipsRow}>
      {items.map((item, i) => (
        <InfoChip key={i} label={item} />
      ))}
    </View>
  );
}

export default function ProfileScreen() {
  const router = useRouter();
  const { signOut } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [signingOut, setSigningOut] = useState(false);

  const loadProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMyProfile();
      setProfile(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await signOut();
    } catch {
      setSigningOut(false);
    }
  };

  const { user, healthStatus, allergies, conditions, criticalHistory } = profile ?? {};

  const measurementChips = [
    user?.weightKg ? `${user.weightKg}kg` : null,
    user?.heightCm ? `${user.heightCm}cm` : null,
    user?.age ? `${user.age} años` : null,
  ].filter(Boolean);

  const allergyNames = allergies?.map((a) => a.name ?? a) ?? [];
  const conditionNames = conditions?.map((c) => c.name ?? c) ?? [];

  return (
    <Screen loading={loading} error={error} onRetry={loadProfile} contentContainerStyle={styles.container}>
      {/* Name header row */}
      <View style={styles.nameRow}>
        <View style={styles.nameLeft}>
          <Avatar name={user?.fullName} photoUrl={user?.photoUrl} size={44} />
          <View>
            <Text style={styles.fullName}>{user?.fullName ?? '—'}</Text>
            <Text style={styles.profileLabel}>Perfil de salud</Text>
          </View>
        </View>
        <Pressable
          onPress={() => router.push('/(app)/profile/edit')}
          style={({ pressed }) => [styles.editBtn, pressed && { opacity: 0.75 }]}
        >
          <Text style={styles.editBtnText}>Editar</Text>
        </Pressable>
      </View>

      {/* Estado general card */}
      <View style={styles.statusCard}>
        <View style={styles.statusRow}>
          <Text style={styles.statusEmoji}>😊</Text>
          <View>
            <Text style={styles.statusTitle}>Estado General</Text>
            <Text style={styles.statusSub}>
              {healthStatus?.status ?? 'Sin alertas críticas'}
            </Text>
          </View>
        </View>
      </View>

      {/* Información principal */}
      {measurementChips.length > 0 && (
        <View style={styles.section}>
          <SectionTitle>Informacion Principal</SectionTitle>
          <ChipsRow items={measurementChips} />
        </View>
      )}

      {/* Alergias */}
      {allergyNames.length > 0 && (
        <View style={styles.section}>
          <SectionTitle>Alergias</SectionTitle>
          <ChipsRow items={allergyNames} />
        </View>
      )}

      {/* Condiciones */}
      {conditionNames.length > 0 && (
        <View style={styles.section}>
          <SectionTitle>Condiciones</SectionTitle>
          <ChipsRow items={conditionNames} />
        </View>
      )}

      {/* Historial crítico */}
      {criticalHistory?.length > 0 && (
        <View style={styles.criticalCard}>
          <View style={styles.criticalHeader}>
            <View style={styles.criticalIconBox}>
              <Ionicons name="alert-circle" size={20} color={colors.danger} />
            </View>
            <Text style={styles.criticalTitle}>Historial critico</Text>
          </View>
          {criticalHistory.map((item) => (
            <View key={item.id} style={styles.criticalItem}>
              <Text style={styles.criticalItemTitle}>{item.title}</Text>
              {item.date ? (
                <Text style={styles.criticalItemDate}>
                  {new Date(item.date).toLocaleDateString('es-AR', { month: 'short', year: 'numeric' })}
                </Text>
              ) : null}
            </View>
          ))}
        </View>
      )}

      {/* Cerrar sesión */}
      <Pressable
        onPress={handleSignOut}
        disabled={signingOut}
        style={({ pressed }) => [styles.logoutBtn, (pressed || signingOut) && { opacity: 0.75 }]}
      >
        <Text style={styles.logoutBtnText}>
          {signingOut ? 'Cerrando sesión...' : 'Cerrar Sesion'}
        </Text>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[5],
    gap: spacing[4],
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  nameLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    flex: 1,
  },
  fullName: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  profileLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 1,
  },
  editBtn: {
    backgroundColor: colors.primary,
    borderRadius: radii.lg,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
  },
  editBtnText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '600',
  },
  statusCard: {
    backgroundColor: colors.primarySoft,
    borderRadius: radii.xl,
    padding: spacing[4],
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  statusEmoji: {
    fontSize: 30,
  },
  statusTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  statusSub: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 1,
  },
  section: {
    gap: spacing[2],
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
  },
  chip: {
    backgroundColor: colors.primarySoft,
    borderRadius: radii.full,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    borderWidth: 1,
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: 14,
    color: colors.primaryDark,
    fontWeight: '600',
  },
  criticalCard: {
    backgroundColor: colors.dangerSoft,
    borderRadius: radii.xl,
    padding: spacing[4],
    gap: spacing[2],
  },
  criticalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    marginBottom: spacing[1],
  },
  criticalIconBox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(239,68,68,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  criticalTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.danger,
  },
  criticalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing[1],
  },
  criticalItemTitle: {
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: '500',
    flex: 1,
  },
  criticalItemDate: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: spacing[2],
  },
  logoutBtn: {
    backgroundColor: colors.primary,
    borderRadius: radii.xl,
    paddingVertical: spacing[4],
    alignItems: 'center',
    marginTop: spacing[2],
  },
  logoutBtnText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '700',
  },
});

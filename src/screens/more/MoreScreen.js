import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { MOBILE_MORE_ITEMS } from '../../constants/navigation';
import { Screen, Text } from '../../components/ui';
import { colors, spacing } from '../../theme';

export default function MoreScreen() {
  const router = useRouter();

  return (
    <Screen contentContainerStyle={styles.container}>
      <Text variant="h2" style={styles.title}>
        Más opciones
      </Text>

      <View style={styles.list}>
        {MOBILE_MORE_ITEMS.map((item) => (
          <Pressable key={item.name} onPress={() => router.push(item.href)} style={styles.item}>
            <Ionicons name={item.icon} size={22} color={colors.primary} />
            <Text variant="body">{item.label}</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.neutral400} style={styles.chevron} />
          </Pressable>
        ))}
      </View>
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
  list: {
    gap: spacing[2],
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    backgroundColor: colors.surface,
    padding: spacing[4],
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chevron: {
    marginLeft: 'auto',
  },
});

import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, spacing } from '../../theme';

export function MobileHeader() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.header, { paddingTop: (insets.top > 0 ? insets.top : 0) + spacing[3] }]}>
      <Pressable style={styles.iconBtn} hitSlop={8}>
        <Ionicons name="menu" size={24} color={colors.white} />
      </Pressable>
      <View style={styles.rightIcons}>
        <Pressable style={styles.iconBtn} hitSlop={8}>
          <Ionicons name="notifications-outline" size={24} color={colors.white} />
        </Pressable>
        <Pressable style={styles.iconBtn} hitSlop={8}>
          <Ionicons name="person-circle-outline" size={28} color={colors.white} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[3],
  },
  iconBtn: {
    padding: spacing[1],
  },
  rightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
});

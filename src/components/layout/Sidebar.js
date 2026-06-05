import { Ionicons } from '@expo/vector-icons';
import { usePathname, useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { NAV_ITEMS } from '../../constants/navigation';
import { useAuth } from '../../hooks/useAuth';
import { colors, layout, spacing } from '../../theme';
import { Text } from '../ui/Text';

function isActiveRoute(pathname, href) {
  const route = href.replace('/(app)', '') || '/';
  if (route === '/') return pathname === '/' || pathname === '/index';
  return pathname.startsWith(route);
}

export function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { signOut } = useAuth();

  return (
    <View style={styles.sidebar}>
      <View style={styles.header}>
        <View style={styles.logo}>
          <Ionicons name="heart" size={24} color={colors.textInverse} />
        </View>
        <Text variant="h3" color={colors.textPrimary}>
          Velity
        </Text>
      </View>

      <View style={styles.nav}>
        {NAV_ITEMS.map((item) => {
          const active = isActiveRoute(pathname, item.href);
          return (
            <Pressable
              key={item.name}
              onPress={() => router.push(item.href)}
              style={[styles.navItem, active && styles.navItemActive]}
            >
              <Ionicons
                name={item.icon}
                size={20}
                color={active ? colors.primary : colors.neutral500}
              />
              <Text
                variant="body"
                style={[styles.navLabel, active && { color: colors.primary, fontWeight: '600' }]}
              >
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Pressable onPress={signOut} style={styles.logout}>
        <Ionicons name="log-out-outline" size={20} color={colors.danger} />
        <Text variant="body" color={colors.danger} style={styles.navLabel}>
          Cerrar sesión
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    width: layout.sidebarWidth,
    backgroundColor: colors.surface,
    borderRightWidth: 1,
    borderRightColor: colors.border,
    paddingVertical: spacing[6],
    paddingHorizontal: spacing[4],
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    marginBottom: spacing[8],
    paddingHorizontal: spacing[2],
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nav: {
    flex: 1,
    gap: spacing[1],
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[3],
    borderRadius: 12,
  },
  navItemActive: {
    backgroundColor: colors.primarySoft,
  },
  navLabel: {
    color: colors.neutral600,
  },
  logout: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[3],
  },
});

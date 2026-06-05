import { Ionicons } from '@expo/vector-icons';
import { usePathname, useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MOBILE_MORE_ITEMS, MOBILE_TAB_ITEMS } from '../../constants/navigation';
import { colors, layout, spacing } from '../../theme';
import { Text } from '../ui/Text';

function isActiveRoute(pathname, href) {
  const route = href.replace('/(app)', '') || '/';
  if (route === '/') return pathname === '/' || pathname === '/index';
  return pathname.startsWith(route);
}

function isMoreActive(pathname) {
  return MOBILE_MORE_ITEMS.some((item) => isActiveRoute(pathname, item.href));
}

export function TabBar() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const moreActive = isMoreActive(pathname);

  return (
    <View style={[styles.tabBar, { paddingBottom: insets.bottom || spacing[2] }]}>
      {MOBILE_TAB_ITEMS.map((item) => {
        const active = isActiveRoute(pathname, item.href);
        return (
          <Pressable
            key={item.name}
            onPress={() => router.push(item.href)}
            style={styles.tab}
          >
            <Ionicons
              name={item.icon.replace('-outline', active ? '' : '-outline')}
              size={22}
              color={active ? colors.primary : colors.neutral400}
            />
            <Text
              variant="caption"
              style={[styles.tabLabel, active && { color: colors.primary, fontWeight: '600' }]}
            >
              {item.label}
            </Text>
          </Pressable>
        );
      })}

      <Pressable onPress={() => router.push('/(app)/more')} style={styles.tab}>
        <Ionicons
          name={moreActive ? 'ellipsis-horizontal' : 'ellipsis-horizontal-outline'}
          size={22}
          color={moreActive ? colors.primary : colors.neutral400}
        />
        <Text
          variant="caption"
          style={[styles.tabLabel, moreActive && { color: colors.primary, fontWeight: '600' }]}
        >
          Más
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    minHeight: layout.tabBarHeight,
    paddingTop: spacing[2],
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[1],
  },
  tabLabel: {
    color: colors.neutral400,
  },
});

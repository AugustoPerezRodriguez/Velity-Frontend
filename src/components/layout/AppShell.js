import { Slot } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { useResponsive } from '../../hooks/useResponsive';
import { colors } from '../../theme';
import { MaxWidthContainer } from './MaxWidthContainer';
import { Sidebar } from './Sidebar';
import { TabBar } from './TabBar';

export function AppShell() {
  const { isMobile } = useResponsive();

  if (isMobile) {
    return (
      <View style={styles.mobileRoot}>
        <View style={styles.mobileContent}>
          <MaxWidthContainer>
            <Slot />
          </MaxWidthContainer>
        </View>
        <TabBar />
      </View>
    );
  }

  return (
    <View style={styles.desktopRoot}>
      <Sidebar />
      <View style={styles.desktopContent}>
        <MaxWidthContainer>
          <Slot />
        </MaxWidthContainer>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mobileRoot: {
    flex: 1,
    backgroundColor: colors.background,
  },
  mobileContent: {
    flex: 1,
  },
  desktopRoot: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: colors.background,
  },
  desktopContent: {
    flex: 1,
  },
});

import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, spacing } from '../../theme';
import { Text } from './Text';

export function Screen({
  children,
  scroll = true,
  loading = false,
  error = null,
  onRetry,
  contentContainerStyle,
  style,
}) {
  const insets = useSafeAreaInsets();
  const Container = scroll ? ScrollView : View;

  if (loading) {
    return (
      <View style={[styles.centered, { paddingTop: insets.top }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.centered, { paddingTop: insets.top }]}>
        <Text variant="body" color={colors.danger} style={styles.errorText}>
          {error}
        </Text>
        {onRetry ? (
          <Text variant="body" color={colors.primary} onPress={onRetry} style={styles.retry}>
            Reintentar
          </Text>
        ) : null}
      </View>
    );
  }

  return (
    <Container
      style={[styles.screen, style]}
      contentContainerStyle={[
        scroll && styles.scrollContent,
        { paddingBottom: insets.bottom + spacing[4] },
        contentContainerStyle,
      ]}
      showsVerticalScrollIndicator={false}
    >
      {children}
    </Container>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    padding: spacing[6],
  },
  errorText: {
    textAlign: 'center',
    marginBottom: spacing[3],
  },
  retry: {
    fontWeight: '600',
  },
});

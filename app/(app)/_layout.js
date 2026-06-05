import { Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';

import { AppShell } from '../../src/components/layout/AppShell';
import { useAuth } from '../../src/hooks/useAuth';
import { colors } from '../../src/theme';

export default function AppLayout() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  return <AppShell />;
}

import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../src/theme';

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Velity</Text>
      <Text style={styles.subtitle}>Frontend initialized successfully</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.primary,
  },
  subtitle: {
    marginTop: 8,
    fontSize: 16,
  },
});

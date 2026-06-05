import { StyleSheet, View } from 'react-native';

import { colors, radii, shadows, spacing } from '../../theme';

export function Card({ children, style, padding = spacing[4], ...props }) {
  return (
    <View style={[styles.card, { padding }, style]} {...props}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
});

import { StyleSheet, View } from 'react-native';

import { colors, radii, spacing } from '../../theme';
import { Text } from './Text';

const VARIANT_MAP = {
  primary: { bg: colors.primarySoft, text: colors.primary },
  success: { bg: colors.successSoft, text: colors.success },
  warning: { bg: colors.warningSoft, text: colors.warning },
  danger: { bg: colors.dangerSoft, text: colors.danger },
  info: { bg: colors.infoSoft, text: colors.info },
  neutral: { bg: colors.neutral100, text: colors.neutral600 },
};

export function Badge({ label, variant = 'neutral', style }) {
  const colorset = VARIANT_MAP[variant] ?? VARIANT_MAP.neutral;

  return (
    <View style={[styles.badge, { backgroundColor: colorset.bg }, style]}>
      <Text variant="caption" style={[styles.text, { color: colorset.text }]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: radii.full,
    alignSelf: 'flex-start',
  },
  text: {
    fontWeight: '600',
  },
});

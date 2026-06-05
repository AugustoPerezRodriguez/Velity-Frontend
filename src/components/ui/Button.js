import { ActivityIndicator, Pressable, StyleSheet } from 'react-native';

import { colors, radii, spacing } from '../../theme';
import { Text } from './Text';

const VARIANTS = {
  primary: {
    container: { backgroundColor: colors.primary },
    text: { color: colors.textInverse },
    pressed: { backgroundColor: colors.primaryDark },
  },
  secondary: {
    container: { backgroundColor: colors.neutral100, borderWidth: 1, borderColor: colors.border },
    text: { color: colors.textPrimary },
    pressed: { backgroundColor: colors.neutral200 },
  },
  danger: {
    container: { backgroundColor: colors.danger },
    text: { color: colors.textInverse },
    pressed: { backgroundColor: colors.danger },
  },
  ghost: {
    container: { backgroundColor: 'transparent' },
    text: { color: colors.primary },
    pressed: { backgroundColor: colors.primarySoft },
  },
};

const SIZES = {
  sm: { paddingVertical: spacing[2], paddingHorizontal: spacing[3], fontSize: 14 },
  md: { paddingVertical: spacing[3], paddingHorizontal: spacing[4], fontSize: 16 },
  lg: { paddingVertical: spacing[4], paddingHorizontal: spacing[6], fontSize: 16 },
};

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  style,
  textStyle,
}) {
  const variantStyles = VARIANTS[variant] ?? VARIANTS.primary;
  const sizeStyles = SIZES[size] ?? SIZES.md;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        variantStyles.container,
        {
          paddingVertical: sizeStyles.paddingVertical,
          paddingHorizontal: sizeStyles.paddingHorizontal,
          opacity: disabled ? 0.5 : 1,
        },
        pressed && !disabled && variantStyles.pressed,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variantStyles.text.color} />
      ) : (
        <Text variant="button" style={[variantStyles.text, { fontSize: sizeStyles.fontSize }, textStyle]}>
          {title}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
});

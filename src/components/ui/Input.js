import { StyleSheet, TextInput, View } from 'react-native';

import { colors, radii, spacing, textVariants } from '../../theme';
import { Text } from './Text';

export function Input({
  label,
  error,
  containerStyle,
  style,
  ...props
}) {
  return (
    <View style={[styles.container, containerStyle]}>
      {label ? (
        <Text variant="label" style={styles.label}>
          {label}
        </Text>
      ) : null}
      <TextInput
        style={[styles.input, error ? styles.inputError : null, style]}
        placeholderTextColor={colors.neutral400}
        {...props}
      />
      {error ? (
        <Text variant="caption" color={colors.danger} style={styles.error}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing[4],
  },
  label: {
    marginBottom: spacing[1],
  },
  input: {
    ...textVariants.body,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.lg,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    minHeight: 48,
  },
  inputError: {
    borderColor: colors.danger,
  },
  error: {
    marginTop: spacing[1],
  },
});

import { StyleSheet, View } from 'react-native';

import { layout, spacing } from '../../theme';

export function MaxWidthContainer({ children, style }) {
  return <View style={[styles.container, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: layout.maxContentWidth,
    alignSelf: 'center',
    paddingHorizontal: spacing[4],
    flex: 1,
  },
});

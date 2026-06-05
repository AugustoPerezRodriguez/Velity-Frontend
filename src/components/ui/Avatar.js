import { Image, StyleSheet, View } from 'react-native';

import { colors, radii } from '../../theme';
import { Text } from './Text';

function getInitials(name) {
  if (!name) return '?';
  return name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export function Avatar({ name, photoUrl, size = 48, style }) {
  const fontSize = size * 0.35;

  if (photoUrl) {
    return <Image source={{ uri: photoUrl }} style={[styles.image, { width: size, height: size, borderRadius: size / 2 }, style]} />;
  }

  return (
    <View style={[styles.placeholder, { width: size, height: size, borderRadius: size / 2 }, style]}>
      <Text style={{ fontSize, fontWeight: '600', color: colors.primary }}>{getInitials(name)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    backgroundColor: colors.neutral200,
  },
  placeholder: {
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

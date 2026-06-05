import { Text as RNText } from 'react-native';

import { textVariants } from '../theme';

export function Text({ variant = 'body', style, color, children, ...props }) {
  return (
    <RNText
      style={[textVariants[variant] ?? textVariants.body, color ? { color } : null, style]}
      {...props}
    >
      {children}
    </RNText>
  );
}

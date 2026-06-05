import { Platform } from 'react-native';

import { colors } from './colors';

const shadowColor = colors.neutral900;

export const shadows = {
  none: {},
  sm: Platform.select({
    web: { boxShadow: '0 1px 2px rgba(15, 23, 42, 0.06)' },
    default: {
      shadowColor,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.06,
      shadowRadius: 2,
      elevation: 1,
    },
  }),
  md: Platform.select({
    web: { boxShadow: '0 4px 12px rgba(15, 23, 42, 0.08)' },
    default: {
      shadowColor,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
      elevation: 3,
    },
  }),
  lg: Platform.select({
    web: { boxShadow: '0 8px 24px rgba(15, 23, 42, 0.12)' },
    default: {
      shadowColor,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.12,
      shadowRadius: 24,
      elevation: 6,
    },
  }),
};

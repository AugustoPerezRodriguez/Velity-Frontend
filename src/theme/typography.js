import { colors } from './colors';

export const fontSizes = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
};

export const fontWeights = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
};

export const lineHeights = {
  tight: 1.25,
  normal: 1.5,
  relaxed: 1.75,
};

export const textVariants = {
  h1: {
    fontSize: fontSizes['3xl'],
    fontWeight: fontWeights.bold,
    color: colors.textPrimary,
    lineHeight: fontSizes['3xl'] * lineHeights.tight,
  },
  h2: {
    fontSize: fontSizes['2xl'],
    fontWeight: fontWeights.bold,
    color: colors.textPrimary,
    lineHeight: fontSizes['2xl'] * lineHeights.tight,
  },
  h3: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.semibold,
    color: colors.textPrimary,
    lineHeight: fontSizes.xl * lineHeights.tight,
  },
  h4: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semibold,
    color: colors.textPrimary,
    lineHeight: fontSizes.lg * lineHeights.normal,
  },
  body: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.regular,
    color: colors.textPrimary,
    lineHeight: fontSizes.md * lineHeights.normal,
  },
  bodySmall: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.regular,
    color: colors.textSecondary,
    lineHeight: fontSizes.sm * lineHeights.normal,
  },
  caption: {
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.regular,
    color: colors.textSecondary,
    lineHeight: fontSizes.xs * lineHeights.normal,
  },
  label: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    color: colors.textPrimary,
    lineHeight: fontSizes.sm * lineHeights.normal,
  },
  button: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.semibold,
    lineHeight: fontSizes.md * lineHeights.normal,
  },
};

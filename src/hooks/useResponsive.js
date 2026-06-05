import { useWindowDimensions } from 'react-native';

const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
};

export function useResponsive() {
  const { width, height } = useWindowDimensions();

  const isMobile = width < BREAKPOINTS.mobile;
  const isTablet = width >= BREAKPOINTS.mobile && width < BREAKPOINTS.tablet;
  const isDesktop = width >= BREAKPOINTS.tablet;

  return {
    width,
    height,
    isMobile,
    isTablet,
    isDesktop,
    isTabletOrDesktop: isTablet || isDesktop,
  };
}

export const NAV_ITEMS = [
  { name: 'index', label: 'Inicio', icon: 'home-outline', href: '/(app)' },
  {
    name: 'medical-history',
    label: 'Historial',
    icon: 'document-text-outline',
    href: '/(app)/medical-history',
  },
  { name: 'profile', label: 'Perfil', icon: 'person-outline', href: '/(app)/profile' },
  { name: 'family', label: 'Familia', icon: 'people-outline', href: '/(app)/family' },
  {
    name: 'appointments',
    label: 'Turnos',
    icon: 'calendar-outline',
    href: '/(app)/appointments',
  },
  {
    name: 'medications',
    label: 'Medicamentos',
    icon: 'medkit-outline',
    href: '/(app)/medications',
  },
  { name: 'map', label: 'Mapa', icon: 'map-outline', href: '/(app)/map' },
  { name: 'velibot', label: 'Velibot', icon: 'chatbubbles-outline', href: '/(app)/velibot' },
];

export const MOBILE_TAB_ITEMS = NAV_ITEMS.slice(0, 4);
export const MOBILE_MORE_ITEMS = NAV_ITEMS.slice(4);

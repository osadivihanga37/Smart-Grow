// frontend/src/theme.js

export const COLORS = {
  primary: '#1B5E20',       // deep farm green — matches hero overlay tone
  primaryLight: '#4C8C4A',
  secondary: '#F9A825',     // warm harvest gold, for accents/CTAs
  background: '#F5F7F5',    // soft off-white background
  surface: '#FFFFFF',       // cards, sheets
  textDark: '#1C1C1C',
  textMuted: '#7A7A7A',
  border: '#E0E0E0',
  success: '#2E7D32',
  warning: '#F57C00',
  danger: '#C62828',
}

export const RADIUS = {
  sm: 8,
  md: 14,
  lg: 20,
  xl: 28,
  full: 999,
}

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
}

export const SHADOW = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  soft: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
}

export const TYPOGRAPHY = {
  h1: {
    fontSize: 28,
    fontWeight: '700',
  },
  h2: {
    fontSize: 22,
    fontWeight: '700',
  },
  h3: {
    fontSize: 17,
    fontWeight: '600',
  },
  body: {
    fontSize: 14,
    fontWeight: '400',
  },
  caption: {
    fontSize: 12,
    fontWeight: '400',
  },
}
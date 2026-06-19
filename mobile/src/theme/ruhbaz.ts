/**
 * Ruhbaz Konağı — Design tokens for React Native.
 *
 * Direct translation of the web design system (tokens/*.css) into a typed RN theme.
 * Drop this into the app (e.g. mobile/src/theme/ruhbaz.ts) and import from it instead
 * of hardcoding values. Every screen redesign should pull from here so the whole app
 * stays consistent.
 *
 * NOTE ON SHADOWS: RN doesn't take CSS box-shadow strings. iOS uses
 * shadowColor/shadowOffset/shadowOpacity/shadowRadius; Android uses `elevation`.
 * The `shadow.*` entries below are ready-made RN style objects.
 */

export const colors = {
  // Brand
  inkPlum:      '#4A2F5A', // primary brand: wordmark, headings, key text (used instead of black)
  inkPlumDeep:  '#38223F',
  warmGold:     '#C9A24A', // premium accent: hairlines, selected, micro-glow (NEVER a heavy metallic fill)
  goldSoft:     '#E8C49A',

  // Daylight surfaces
  antiqueWhite: '#F8F1E8', // main screen + card base
  creamMist:    '#EFE6D9',
  pearl:        '#FFF9F2',

  // Pastel accents (Aura)
  powderPink:   '#F6D9E6',
  softLilac:    '#D9CCE9',
  aegeanBlue:   '#A9C7D8',
  aegeanDeep:   '#5E8FB8',
  aquaPearl:    '#D9F0EE',
  olive:        '#7C7E54',
  bougainvillea:'#C85A93', // vivid magenta signature — small doses only

  // Text
  textPrimary:  '#3B2A32',
  textSecondary:'#6A596D',
  textMuted:    '#8A7F75',
  textOnDark:   '#FFF5E8',

  // Night (Aura → gece)
  nightBase:    '#14141E',
  manorWall:    '#1E1E28',
  lampGold:     '#D4A574',
  indigoNight:  '#151D31',
  plumNight:    '#4B2E5E',
  fuchsiaNight: '#B43E7E',

  // Persona signature colors (accent only — monogram + ring, never a flooding background)
  persona: {
    suzan:  '#C1714F', // 62 — copper/terracotta
    teoman: '#5E7B5A', // 68 — tea green
    ayse:   '#A3B18A', // 80 — sage
    selin:  '#7B6CF6', // 42 — twilight violet
    berk:   '#3F8E8C', // 45 — petrol
    deniz:  '#E8707B', // 27 — coral
    arin:   '#9B7BB8', // 32 — smoke purple
  },
} as const;

/** Liquid glass — pair these fills with expo-blur <BlurView>. Raise opacity (not blur) as text density grows. */
export const glass = {
  fillCard:   'rgba(255, 249, 242, 0.54)',
  fillPanel:  'rgba(255, 247, 240, 0.72)',
  fillStrong: 'rgba(255, 252, 248, 0.86)',
  fillTint:   'rgba(246, 217, 230, 0.30)', // powder-pink selected tint
  fillNight:  'rgba(22, 16, 38, 0.50)',
  borderGold:  'rgba(201, 162, 74, 0.32)',
  borderPearl: 'rgba(255, 255, 255, 0.52)',
  borderNight: 'rgba(255, 255, 255, 0.16)',
  blurSoft: 18, // BlurView intensity ≈ 18–34 on web px; tune per device
  blurDeep: 30,
  // Always lay a dark→transparent scrim over imagery so text reads in every frame:
  scrim: ['rgba(20,16,30,0)', 'rgba(20,16,30,0.45)'], // expo-linear-gradient colors, vertical
} as const;

export const spacing = { s1: 4, s2: 8, s3: 12, s4: 16, s6: 24, s8: 32, s12: 48, s16: 64 } as const;

export const radius = { sm: 12, md: 18, lg: 24, card: 26, pill: 999 } as const;

export const touchMin = 44; // minimum hit target

/** Ready-made RN shadow style objects (soft plum auras, never hard black). */
export const shadow = {
  soft: { shadowColor: '#4A2F5A', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.10, shadowRadius: 32, elevation: 6 },
  card: { shadowColor: '#4A2F5A', shadowOffset: { width: 0, height: 18 }, shadowOpacity: 0.10, shadowRadius: 60, elevation: 10 },
  lift: { shadowColor: '#4A2F5A', shadowOffset: { width: 0, height: 24 }, shadowOpacity: 0.16, shadowRadius: 70, elevation: 14 },
} as const;

export const typography = {
  fonts: {
    // Load via @expo-google-fonts/cormorant-garamond, /nunito, /cinzel
    display: 'CormorantGaramond', // wordmark & special serif moments
    ui:      'Nunito',            // all body, buttons, labels, forms
    wordmark:'Cinzel',            // onboarding wordmark (see note in README)
    mono:    'monospace',         // debug only
  },
  weight: { regular: '400', medium: '500', semibold: '600', bold: '700' },
  // size / lineHeight pairs
  display:  { fontSize: 30, lineHeight: 36 }, // hero / special serif
  h1:       { fontSize: 24, lineHeight: 31 }, // screen title
  h2:       { fontSize: 20, lineHeight: 27 }, // section title
  h3:       { fontSize: 18, lineHeight: 24 }, // card title
  body:     { fontSize: 15, lineHeight: 22 }, // reading text
  bodyLg:   { fontSize: 17, lineHeight: 26 }, // long-form reading
  caption:  { fontSize: 12, lineHeight: 17 }, // meta, helper
  button:   { fontSize: 15, lineHeight: 20 }, // CTA & chips
  trackLabel: 0.18 * 12, // wide-tracked micro-label letterSpacing (RN uses px, not em)
  trackWord:  0.04 * 30, // wordmark letterSpacing
} as const;

/** Motion — slow, breathy, low-amplitude. Honour reduce-motion. Use with Reanimated. */
export const motion = {
  easeStandard: [0.22, 0.61, 0.36, 1] as const, // Easing.bezier(...)
  easeGentle:   [0.33, 0, 0.2, 1] as const,
  durPress: 120,   // press scale 0.985
  durEnter: 280,   // screen/card enter (4–8px rise)
  durModal: 200,
  durBreath: 11000, // ambient breathing loops 8–14s
} as const;

/** Page/scene background gradients (use expo-linear-gradient; for the radial ones see README). */
export const aura = {
  day:   ['#FCEFE6', '#F6E6EE', '#E7DDF0', '#CFE0EA'], // warm pastel → aegean (approx of the radial)
  dawn:  ['#F6DCE6', '#E8DCF0', '#CDE0EC', '#BFD3E2'],
  night: ['#1B2440', '#2A2342', '#3A2540', '#2C1E33'],
} as const;

export const theme = { colors, glass, spacing, radius, touchMin, shadow, typography, motion, aura } as const;
export default theme;

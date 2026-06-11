// ============================================================
// Ruhbaz Konağı - Fortune cookie / magic sphere EN content (Faz 4)
// ============================================================
// EN counterparts of the in-engine TR arrays in divinationEngine.ts.
// PARITY RULE: each array MUST have the exact same length as its TR
// counterpart (COOKIE_* = 5, SPHERE_* = 5, SIGN_WORDS = 32). Fingerprints
// are indexOf-based and cached daily readings are rebuilt from `sequence`,
// so the same sequence must map to the same indices in both languages.
// Tone: warm, playful, possibility-mood; entertainment/self-reflection
// frame only — no certainty promises, no fortune/psychic claims.

export const COOKIE_OPENERS_EN = [
  'The small step you take today could open a bigger door than you expect.',
  'The thing your heart hesitates over may be exactly where a happy surprise waits.',
  'What feels slow is not lost; it may simply be settling into its right moment.',
  'The quiet intention you set could find support from places you cannot see yet.',
  'A short piece of news today might be the start of a long stretch of ease.',
];

export const COOKIE_ACTIONS_EN = [
  'Finish one thing you have been putting off; the road ahead may feel lighter.',
  'Make one short phone call; a connection you miss could open up again.',
  'Tidy one small corner of your day; fresh energy tends to follow.',
  'Make one decision early in the day; your inner calm may grow with it.',
  'Fix one detail that has been bothering you; things may feel clearer afterwards.',
];

export const COOKIE_BLESSINGS_EN = [
  'Calm for your home and clarity for your mind seem close at hand.',
  'The fog around your wish looks like it is starting to lift.',
  'Someone crossing your path may bring a piece of good news.',
  'A small but cheering bit of ease may show up on the practical side.',
  'The matter weighing on your heart could resolve with a gentle clarity.',
];

export const SPHERE_OMENS_EN = [
  'The sphere hints that patience may be quietly working in your favor today.',
  'The sphere suggests one clear step could serve you better than a rushed choice.',
  'According to the sphere, the uncertainty looks short; an answer may be closer than you think.',
  'The sphere points to an unseen support that may already be at work.',
  'The sphere whispers that the right question could unlock your answer quickly.',
];

export const SPHERE_WINDOWS_EN = [
  'Within the next 3 days, keep an eye out for a small sign.',
  'Sometime this week, one of two options may clearly stand out.',
  'Before the month ends, a comforting piece of news could arrive.',
  'A postponed matter may soon return to the table.',
  'The reply you are waiting for may arrive after a short delay.',
];

export const SPHERE_ADVICE_EN = [
  'Be brief and clear when you explain yourself; things may turn your way.',
  'Keep your plan to two steps; less clutter could invite more ease.',
  'Calm down first, speak second; your words may open doors.',
  'Approach with curiosity instead of hurt; an unexpected ease could follow.',
  'Start something small today; it may grow into something bigger tomorrow.',
];

export const SPHERE_CLOSERS_EN = [
  'As long as your intention stays kind, your path looks open.',
  'As your heart softens, things seem to move more smoothly.',
  'The signs appear to be gathering in your favor.',
  'The right moment may be closer than you think.',
  'Your line of possibility seems to be curving upward.',
];

// 32 playful nature/keepsake tokens — same length as TR SIGN_WORDS so
// buildUniqueSign() produces the same word indices for the same sequence.
export const SIGN_WORDS_EN = [
  'tulip', 'emerald', 'breeze', 'crystal', 'coral', 'shimmer', 'satin', 'sapphire', 'daisy',
  'river', 'oasis', 'spark', 'moss', 'ruby', 'dusk', 'dawn', 'pomegranate', 'laurel',
  'sunbeam', 'moonlight', 'sycamore', 'dewdrop', 'pearl', 'fable', 'seashore', 'mystery', 'hope',
  'wildrose', 'harvest', 'clover', 'echo', 'keepsake'
];

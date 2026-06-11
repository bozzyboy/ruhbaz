// ============================================================
// Ruhbaz Konağı - EN translations (i18n, Faz 4)
// ============================================================
// ⚠️ TASLAK — onay: Ozan. UI çevirisidir; persona sesleri ve okuma içerikleri
// AYRI iş (EN'de yeniden yazım, çeviri değil — K45/K13). Oda ve persona adları
// ÇEVRİLMEZ, lokalleştirilir (K50/K45): Salon EN'de de "Salon" vb. — Ozan kararına açık.

import type { TranslationResource } from './tr';

export const en: TranslationResource = {
  common: {
    appName: 'Ruhbaz Konağı',
    exit: 'Exit',
    settings: 'Settings',
    profileSettings: 'Profile Settings',
    close: 'Close',
    open: 'Open',
    confirm: 'Yes, Continue',
    cancel: 'No, Go Back',
    ok: 'OK',
    wait: 'Please wait...',
  },
  nav: {
    home: 'Ruhbaz Konağı',
    profileSettings: 'Profile Settings',
    legalInfo: 'Legal Information',
    generalReadings: 'Treat Table',
    generalReadingResult: 'General Reading',
    sunCompatibility: 'Sun Sign Match',
    daisyReading: 'Daisy Ritual',
    personalReadings: 'The Salon',
    selfKnowledge: 'Mirror Room',
    simyaLab: 'Alchemy Room',
    personalProfileSelect: 'Choose Profile',
    personalReadingTypeSelect: 'Choose Reading Type',
    personalAssistantSelect: 'Choose Your Reader',
    personalReadingSetup: 'Profile & Reading Flow',
    personalAstroReading: 'Personal Astrology',
    astroRelationshipReading: 'Relationship Astrology',
    personalBirthChart: 'Birth Chart',
    birthChartInterpretation: 'Birth Chart Reading',
    dreamInterpretation: 'Dream Reading',
    tarotSpreadSelect: 'Tarot Spread',
    tarotReading: 'Tarot Reading',
    personalNumerologyReading: 'Personal Numerology',
    history: 'Recent Readings',
    memoryDebug: 'Memory',
    readingDetail: 'Reading Detail',
  },
  home: {
    subtitle: 'This is your entrance hall. Step into readings, insight and creative flows from here.',
    treatTableTitle: 'Treat Table',
    treatTableDesc: 'General astro, cards, runes, I-Ching and small daily rituals.',
    salonTitle: 'The Salon',
    salonDesc: 'Coffee, palm / paw, tarot, astrology, numerology and dream readings.',
    simyaTitle: 'Alchemy Room',
    simyaDesc: 'Manifest, create your own reading, recreate and combo spaces.',
    mirrorTitle: 'Mirror Room',
    mirrorDesc: 'Birth chart, core numerology and tests.',
  },
  settings: {
    legalInfoButton: 'Legal Information',
    dataSectionTitle: 'Data Management',
    dataSectionHint:
      'All your profiles, readings and memory are stored on your device. From here you can back up to your own storage, restore a backup, or delete all your data.',
    backupButton: 'Back Up',
    restoreButton: 'Restore Backup',
    wipeButton: 'Delete All My Data',
    languageSectionTitle: 'Dil / Language',
    languageTr: 'Türkçe',
    languageEn: 'English',
  },
};

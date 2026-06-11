// ============================================================
// Ruhbaz Konağı - TR kaynak metinler (i18n, Faz 4)
// ============================================================
// KURAL (regresyon güvencesi): Buradaki TR metinler, koddan taşındıkları
// andaki hallerinin BİREBİR kopyasıdır; taşıma sırasında metin değiştirilmez.
// Metin değişikliği ayrı bir commit olarak yapılır.

export const tr = {
  common: {
    appName: 'Ruhbaz Konağı',
    exit: 'Çıkış',
    settings: 'Ayarlar',
    profileSettings: 'Profil Ayarları',
    close: 'Kapat',
    open: 'Aç',
    confirm: 'Evet, Devam',
    cancel: 'Hayır, Geri Dön',
    ok: 'Tamam',
    wait: 'Bekle...',
  },
  nav: {
    home: 'Ruhbaz Konağı',
    profileSettings: 'Profil Ayarları',
    legalInfo: 'Yasal Bilgilendirme',
    generalReadings: 'İkram Masası',
    generalReadingResult: 'Genel Okuma',
    sunCompatibility: 'Genel Burç Uyumu',
    daisyReading: 'Papatya Ritüeli',
    personalReadings: 'Salon',
    selfKnowledge: 'Ayna Odası',
    simyaLab: 'Simya Odası',
    personalProfileSelect: 'Profil Seçimi',
    personalReadingTypeSelect: 'Okuma Tipi Seçimi',
    personalAssistantSelect: 'Yorumcu Seçimi',
    personalReadingSetup: 'Profil Ayarları ve Okuma Akışı',
    personalAstroReading: 'Kişiye Özel Astroloji',
    astroRelationshipReading: 'Çoklu Astroloji',
    personalBirthChart: 'Doğum Haritası',
    birthChartInterpretation: 'Doğum Haritası Yorumu',
    dreamInterpretation: 'Rüya Yorumu',
    tarotSpreadSelect: 'Tarot Açılımı',
    tarotReading: 'Tarot Yorumu',
    personalNumerologyReading: 'Kişiye Özel Numeroloji',
    history: 'Son Okumalar',
    memoryDebug: 'Hafıza',
    readingDetail: 'Okuma Detayı',
  },
  home: {
    subtitle: 'Burası giriş lobin. Okuma, içgörü ve yaratım akışlarına buradan geçebilirsin.',
    treatTableTitle: 'İkram Masası',
    treatTableDesc: 'Genel astro, kartlar, rune, I-Ching ve günlük küçük ritüeller.',
    salonTitle: 'Salon',
    salonDesc: 'Kahve, el / pati, tarot, astroloji, numeroloji ve rüya yorumları.',
    simyaTitle: 'Simya Odası',
    simyaDesc: 'Manifest, kendi okumanı oluştur, baştan yarat ve combo yarat alanları.',
    mirrorTitle: 'Ayna Odası',
    mirrorDesc: 'Doğum haritası, temel numeroloji ve testler.',
  },
  settings: {
    legalInfoButton: 'Yasal Bilgilendirme',
    dataSectionTitle: 'Veri Yönetimi',
    dataSectionHint:
      'Tüm profillerin, okumaların ve hafızan cihazında saklanır. Buradan kendi deposuna yedek alabilir, yedeği geri yükleyebilir veya tüm verini silebilirsin.',
    backupButton: 'Yedek Al',
    restoreButton: 'Yedeği Geri Yükle',
    wipeButton: 'Tüm Verimi Sil',
    languageSectionTitle: 'Dil / Language',
    languageTr: 'Türkçe',
    languageEn: 'English',
  },
};

export type TranslationResource = typeof tr;

// ============================================================
// Ruhbaz Konağı - Konak Akışı (Manor Feed) tohum içeriği (Faz 5.2)
// ============================================================
// TASLAK İÇERİK — onay: Ozan. Bu tohum havuzu, uzak feed (GitHub Pages/Actions)
// yayınlanana kadar app içinde gösterilir; manorFeedService remote URL set'liyse
// onu kullanır, değilse buradaki tohumu döndürür.
//
// 677 KURALI: feed içeriği "fal/kehanet" değil "eğlence amaçlı sembolik" çizgide;
// kesin gelecek/kazanç/sağlık iddiası YOK. Persona ADI metinde geçmez (kart başlığı
// getAssistantLabel ile dile duyarlı gösterir); böylece TR/EN ad farkı sorun olmaz.

export type ManorFeedKind = 'wisdom' | 'sky' | 'ritual' | 'invite';

export interface ManorFeedLocalizedText {
  tr: string;
  en: string;
}

export interface ManorFeedItem {
  id: string;
  /** Atfedilen persona (varsa). Kart başlığı bu id'den dile duyarlı ad üretir. */
  personaId?: string;
  kind: ManorFeedKind;
  title: ManorFeedLocalizedText;
  body: ManorFeedLocalizedText;
  tags?: string[];
}

export const MANOR_FEED_SEED: ManorFeedItem[] = [
  {
    id: 'seed-suzan-wisdom-1',
    personaId: 'suzan',
    kind: 'wisdom',
    title: { tr: 'Acelesiz bir fincan', en: 'An unhurried cup' },
    body: {
      tr: 'Telve nasıl dibe çökerse, telaş da gün sonunda durulur. Bugün kendine kısa bir mola ver; acelesiz bir nefes en güzel başlangıç.',
      en: "Just as the grounds settle, the day's rush eases by evening. Give yourself a short pause today; an unhurried breath is the loveliest beginning.",
    },
    tags: ['huzur', 'gün'],
  },
  {
    id: 'seed-teoman-wisdom-1',
    personaId: 'teoman',
    kind: 'wisdom',
    title: { tr: 'Sabrın eli', en: 'The hand of patience' },
    body: {
      tr: 'Bir çizgi bir günde derinleşmez; karakter de öyle. Bugün küçük ama sağlam bir adım, yarının elini güçlendirir.',
      en: "A line doesn't deepen in a day, and neither does character. A small but steady step today strengthens tomorrow's hand.",
    },
    tags: ['sabır', 'gelişim'],
  },
  {
    id: 'seed-selin-sky-1',
    personaId: 'selin',
    kind: 'sky',
    title: { tr: 'Bugünün gökyüzü', en: "Today's sky" },
    body: {
      tr: 'Gök bugün ince bir farkındalık tonunda. Sakin bir an ayır ve iç sesini dinle; içeride yumuşak bir berraklık belirir.',
      en: 'The sky carries a subtle, aware tone today. Take a calm moment to hear your inner voice; a soft clarity surfaces within.',
    },
    tags: ['gökyüzü', 'farkındalık'],
  },
  {
    id: 'seed-berk-wisdom-1',
    personaId: 'berk',
    kind: 'wisdom',
    title: { tr: 'Net bir düşünce', en: 'One clear thought' },
    body: {
      tr: 'Karmaşık bir konuyu üç maddeye indir; zihin rahatlar. Bugün bir şeyi sadeleştirmek, en pratik küçük zaferdir.',
      en: 'Boil a tangled matter down to three points and the mind eases. Simplifying one thing today is the most practical little win.',
    },
    tags: ['netlik', 'pratik'],
  },
  {
    id: 'seed-arin-wisdom-1',
    personaId: 'arin',
    kind: 'wisdom',
    title: { tr: 'İçteki ezgi', en: 'The inner melody' },
    body: {
      tr: 'Bazı duygular kelimeden önce bir renk gibi gelir. Bugün hissettiğin tonu yargılamadan seyret; sanat orada başlar.',
      en: "Some feelings arrive like a color before words. Watch today's hue without judgment; that's where art begins.",
    },
    tags: ['duygu', 'sanat'],
  },
  {
    id: 'seed-ayse-ritual-1',
    personaId: 'ayse',
    kind: 'ritual',
    title: { tr: 'Toprağa bir dokunuş', en: 'A touch of earth' },
    body: {
      tr: 'Bir bardak suya, bir yeşil yaprağa ya da ellerine bak. Küçük bir şefkat ritüeli, günü sakince köklendirir.',
      en: 'Look at a glass of water, a green leaf, or your own hands. A small ritual of kindness gently roots the day.',
    },
    tags: ['ritüel', 'şefkat'],
  },
  {
    id: 'seed-deniz-wisdom-1',
    personaId: 'deniz',
    kind: 'wisdom',
    title: { tr: 'Aradaki ses', en: 'The voice between' },
    body: {
      tr: 'Bir sohbette söylenmeyen şey, söylenenden çok şey anlatır. Bugün kulağını alt metne ver; sezgin keskin.',
      en: 'In a conversation, the unsaid often says the most. Lend your ear to the subtext today; your intuition is sharp.',
    },
    tags: ['sosyal', 'sezgi'],
  },
  {
    id: 'seed-manor-sky-1',
    kind: 'sky',
    title: { tr: 'Konak penceresinden', en: 'From the manor window' },
    body: {
      tr: 'Gün ne bir mucize ne bir felaket vaat eder; sadece taze bir sayfa. Bugünün niyetini sembolik olarak sen seçersin.',
      en: 'The day promises neither miracle nor disaster, only a fresh page. Symbolically, you choose today’s intention.',
    },
    tags: ['konak', 'niyet'],
  },
  {
    id: 'seed-manor-invite-1',
    kind: 'invite',
    title: { tr: 'Bir yorum ister misin?', en: 'Care for a reading?' },
    body: {
      tr: 'Canın isterse Salon’da seni tanıyan bir yorumcuyla eğlence amaçlı sembolik bir okumaya oturabilirsin.',
      en: 'If you like, step into the Salon for a light, entertainment-only symbolic reading with a reader who knows you.',
    },
    tags: ['davet', 'salon'],
  },
];

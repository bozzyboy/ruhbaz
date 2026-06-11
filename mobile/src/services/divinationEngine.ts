import * as FileSystem from 'expo-file-system/legacy';
import {
  type AngelCard,
  type AngelNumber
} from '../data/divinationData';
import {
  getAngelCards,
  getAngelNumbers,
  getIChingHexagrams,
  getInspirationParts,
  getNumerologyMeanings,
  getRunes,
  getTarotCards,
} from '../data/divinationDataI18n';
import { getAppLanguage } from '../i18n';
import { TAROT_TR_NAMES } from '../data/tarotNamesTR';
import {
  AFFIRMATION_OPENERS,
  AFFIRMATION_MIDDLES,
  AFFIRMATION_CLOSERS
} from '../data/affirmationsData';
import {
  AFFIRMATION_OPENERS_EN,
  AFFIRMATION_MIDDLES_EN,
  AFFIRMATION_CLOSERS_EN,
} from '../data/affirmationsData.en';
import {
  COOKIE_OPENERS_EN,
  COOKIE_ACTIONS_EN,
  COOKIE_BLESSINGS_EN,
  SPHERE_OMENS_EN,
  SPHERE_WINDOWS_EN,
  SPHERE_ADVICE_EN,
  SPHERE_CLOSERS_EN,
  SIGN_WORDS_EN,
} from '../data/cookieSphereData.en';

export type GeneralDivinationType =
  | 'fortune-cookie'
  | 'magic-ball'
  | 'daily-affirmation'
  | 'daily-quote'
  | 'daily-runes'
  | 'daily-i-ching'
  | 'daily-numerology'
  | 'daily-tarot'
  | 'daily-angel'
  | 'daily-angel-number';

type TarotReadingMeta = {
  cardName: string;
  orientation: 'upright' | 'reversed';
};

export type DailyGeneralReadingResult = {
  text: string;
  sequence: number;
  fingerprint?: string;
  meta?: {
    tarot?: TarotReadingMeta;
    rune?: { path: string; keyword: string; message: string; runeName: string };
    angel?: AngelCard;
    angelNumber?: AngelNumber;
    affirmation?: { opener: string; middle: string; closer: string };
    numerology?: { number: string; meaning: string; guidance?: string };
    fortuneCookie?: { text: string; sign: string };
    magicBall?: { text: string; sign: string };
    iChing?: {
      baseLines: number[];
      hasChanges: boolean;
      endLines: number[];
      baseHexName: string;
      endHexName?: string;
      text: string;
    };
  };
};

type DivinationStore = {
  schemaVersion: 1;
  nextSequence: number;
  usedFingerprints: string[];
  dailyReadings: Array<{
    dateKey: string;
    type: GeneralDivinationType;
    profileId: string;
    text: string;
    sequence: number;
    createdAt: string;
  }>;
};

const DATA_DIR = `${FileSystem.documentDirectory}falci-data/`;
const STORE_FILE = `${DATA_DIR}general-divination-store.json`;

const COOKIE_OPENERS = [
  'Bugün evrene attığın küçük adım, beklediğinden büyük kapı açacak.',
  'Kalbinin çekindiği konu, aslında şansının kapısında bekliyor.',
  'Kısmetin ağırdan gelmiyor; doğru anda netleşmek için hazırlanıyor.',
  'Sessizce kurduğun niyet, görünmeyen yerden destek alıyor.',
  'Bugün aldığın kısa bir haber, uzun bir ferahlığın başlangıcı olabilir.',
];

const COOKIE_ACTIONS = [
  'Ertelediğin tek bir işi tamamla; yolun hızlanacak.',
  'Kısa bir telefon konuşması yap; beklediğin bağ açılacak.',
  'Küçük bir düzenleme yap; bereketin yönü değişecek.',
  'Günün erken saatinde bir karar ver; iç rahatlığın artacak.',
  'İçine sinmeyen bir detayı düzelt; ardından işaretler netleşecek.',
];

const COOKIE_BLESSINGS = [
  'Hanene huzur, zihnine açıklık geliyor.',
  'Dileğinin etrafındaki sis dağılıyor.',
  'Yoluna denk gelen kişi sana iyi haber taşıyacak.',
  'Maddi tarafta küçük ama sevindiren bir rahatlama görünüyor.',
  'Kalbini yoran konu tatlı bir netlikle çözülüyor.',
];

const SPHERE_OMENS = [
  'Küre bugün sabırlı kalanın kazanacağını söylüyor.',
  'Küre, acele karar yerine net adımın şans getireceğini gösteriyor.',
  'Küreye göre belirsizlik kısa; sonuç düşündüğünden yakın.',
  'Küre, görünmeyen bir desteğin şu an devrede olduğunu işaret ediyor.',
  'Küre, doğru soruyu sorarsan cevabın hızla açılacağını söylüyor.',
];

const SPHERE_WINDOWS = [
  'Önündeki 3 gün içinde bir işaret alacaksın.',
  'Bu hafta içinde iki seçenekten biri net biçimde öne çıkacak.',
  'Ay bitmeden seni rahatlatan bir haber duyuluyor.',
  'Yakın bir zamanda ertelenen bir konu tekrar masaya gelecek.',
  'Beklediğin dönüş kısa bir gecikmeden sonra geliyor.',
];

const SPHERE_ADVICE = [
  'Kendini açıklarken kısa ve net ol; sonuç senin lehine dönecek.',
  'Planını iki adımda tut; karmaşayı azalttığında şansın artacak.',
  'Önce sakinleş, sonra konuş; cümlelerin kapı açacak.',
  'Kırgınlıkla değil, merakla yaklaş; beklenmedik bir kolaylık doğacak.',
  'Bugün küçük, yarın büyük etki yaratacak bir başlangıç yap.',
];

const SPHERE_CLOSERS = [
  'Niyetin temiz kaldıkça yolun açık.',
  'Kalbin yumuşadıkça kısmetin hızlanıyor.',
  'İşaretler senin lehine birikiyor.',
  'Doğru zaman, düşündüğünden daha yakın.',
  'Kısmet çizgin yukarı yönlü ilerliyor.',
];

const SIGN_WORDS = [
  'lale', 'zümrüt', 'rüzgar', 'duru', 'mercan', 'ışıltı', 'atlas', 'safir', 'papatya',
  'nehir', 'vaha', 'kıvılcım', 'yosun', 'yakut', 'akşam', 'şafak', 'nar', 'defne',
  'güneş', 'ayışığı', 'çınar', 'damla', 'sedef', 'masal', 'kumsal', 'gizem', 'umut',
  'sevda', 'bereket', 'uğur', 'yankı', 'eser'
];

// Dil-duyarlı uğur işareti: kelime listesi aktif dile göre seçilir, ancak
// dizin matematiği (sequence -> index) iki dilde AYNIDIR (SIGN_WORDS ve
// SIGN_WORDS_EN aynı uzunlukta = 32). Böylece dil değişiminde aynı sequence
// aynı kelime sıralarına denk gelir ve önbellek yeniden kurulumu tutarlıdır.
function buildUniqueSign(sequence: number) {
  const words = getAppLanguage() === 'en' ? SIGN_WORDS_EN : SIGN_WORDS;
  const base = words.length;
  let value = Math.max(0, sequence);
  const parts: string[] = [];
  do {
    parts.push(words[value % base]);
    value = Math.floor(value / base);
  } while (value > 0);
  while (parts.length < 3) {
    parts.push(words[(sequence + parts.length * 7) % base]);
  }
  return parts.join(', ');
}

function nowIso() {
  return new Date().toISOString();
}

function normalize(text: string) {
  return text.toLocaleLowerCase('tr-TR').replace(/\s+/g, ' ').trim();
}

function pick<T>(list: T[], sequence: number, shift: number): T {
  const idx = Math.abs((sequence * 37 + shift * 17) % list.length);
  return list[idx];
}

function todayKeyIstanbul(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Istanbul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);
  const y = parts.find((p) => p.type === 'year')?.value ?? '0000';
  const m = parts.find((p) => p.type === 'month')?.value ?? '01';
  const d = parts.find((p) => p.type === 'day')?.value ?? '01';
  return `${y}-${m}-${d}`;
}

function dateTimeDigits(date: Date) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Istanbul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);
  const y = parts.find((p) => p.type === 'year')?.value ?? '0000';
  const mo = parts.find((p) => p.type === 'month')?.value ?? '01';
  const da = parts.find((p) => p.type === 'day')?.value ?? '01';
  return `${y}${mo}${da}`;
}

function reduceNumerology(value: number): number {
  if (value === 11 || value === 22 || value === 33) return value;
  let n = Math.abs(value);
  while (n > 9) {
    if (n === 11 || n === 22 || n === 33) return n;
    n = String(n)
      .split('')
      .reduce((acc, d) => acc + Number(d || 0), 0);
  }
  return n;
}

function momentCode(date: Date): number {
  const sum = dateTimeDigits(date)
    .split('')
    .reduce((acc, d) => acc + Number(d || 0), 0);
  return reduceNumerology(sum);
}

function parseTarotMetaFromText(text: string): TarotReadingMeta | undefined {
  const withPosition = text.match(/^Günün tarot kartı:\s*(.+?)\s*\((Ters|Düz)\)\./);
  if (withPosition) {
    return {
      cardName: withPosition[1].trim(),
      orientation: withPosition[2] === 'Ters' ? 'reversed' : 'upright',
    };
  }

  const legacy = text.match(/^Günün tarot kartı:\s*(.+?)\./);
  if (legacy) {
    return {
      cardName: legacy[1].trim(),
      orientation: 'upright',
    };
  }
  return undefined;
}

function hasBrokenUtf8(text: string) {
  return /[ÃÅÄ�]/.test(text);
}

async function ensureDir(path: string) {
  const info = await FileSystem.getInfoAsync(path);
  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(path, { intermediates: true });
  }
}

async function loadStore(): Promise<DivinationStore> {
  await ensureDir(DATA_DIR);
  const info = await FileSystem.getInfoAsync(STORE_FILE);
  if (!info.exists) {
    const initial: DivinationStore = { schemaVersion: 1, nextSequence: 1, usedFingerprints: [], dailyReadings: [] };
    await FileSystem.writeAsStringAsync(STORE_FILE, JSON.stringify(initial, null, 2));
    return initial;
  }
  const raw = await FileSystem.readAsStringAsync(STORE_FILE);
  const parsed = JSON.parse(raw) as Partial<DivinationStore>;
  return {
    schemaVersion: 1,
    nextSequence: Number(parsed.nextSequence || 1),
    usedFingerprints: Array.isArray(parsed.usedFingerprints) ? parsed.usedFingerprints : (parsed as any).usedTexts || [],
    dailyReadings: Array.isArray(parsed.dailyReadings) ? parsed.dailyReadings : [],
  };
}

async function saveStore(store: DivinationStore) {
  await ensureDir(DATA_DIR);
  await FileSystem.writeAsStringAsync(STORE_FILE, JSON.stringify(store, null, 2));
}

function buildReading(type: GeneralDivinationType, sequence: number, now: Date): {
  text: string;
  fingerprint: string;
  meta?: DailyGeneralReadingResult['meta'];
} {
  if (type === 'fortune-cookie') {
    // Dil-duyarlı havuz seçimi: TR/EN dizileri aynı uzunlukta olduğu için
    // pick() ve indexOf aynı sequence'ta iki dilde de AYNI indeksleri üretir
    // (parmak izi/önbellek dil değişiminde tutarlı kalır).
    const enCookie = getAppLanguage() === 'en';
    const openers = enCookie ? COOKIE_OPENERS_EN : COOKIE_OPENERS;
    const actions = enCookie ? COOKIE_ACTIONS_EN : COOKIE_ACTIONS;
    const blessings = enCookie ? COOKIE_BLESSINGS_EN : COOKIE_BLESSINGS;
    const a = pick(openers, sequence, 1);
    const b = pick(actions, sequence, 2);
    const c = pick(blessings, sequence, 3);
    const sign = buildUniqueSign(sequence);
    const fullText = `${a} ${b} ${c}`;
    const signLabel = enCookie ? "Today's lucky charm" : 'Bugünün uğur işareti';
    return {
      text: `${fullText}\n\n${signLabel}: ${sign}`,
      fingerprint: `cookie:${openers.indexOf(a)}-${actions.indexOf(b)}-${blessings.indexOf(c)}`,
      meta: { fortuneCookie: { text: fullText, sign: sign } }
    };
  }

  if (type === 'magic-ball') {
    const enBall = getAppLanguage() === 'en';
    const omens = enBall ? SPHERE_OMENS_EN : SPHERE_OMENS;
    const windows = enBall ? SPHERE_WINDOWS_EN : SPHERE_WINDOWS;
    const advices = enBall ? SPHERE_ADVICE_EN : SPHERE_ADVICE;
    const closers = enBall ? SPHERE_CLOSERS_EN : SPHERE_CLOSERS;
    const a = pick(omens, sequence, 4);
    const b = pick(windows, sequence, 5);
    const c = pick(advices, sequence, 6);
    const d = pick(closers, sequence, 7);
    const sign = buildUniqueSign(sequence);
    const fullText = `${a} ${b} ${c} ${d}`;
    const signLabel = enBall ? "The sphere's sign" : 'Kürenin işareti';
    return {
      text: `${fullText}\n\n${signLabel}: ${sign}`,
      fingerprint: `ball:${omens.indexOf(a)}-${windows.indexOf(b)}-${advices.indexOf(c)}-${closers.indexOf(d)}`,
      meta: { magicBall: { text: fullText, sign: sign } }
    };
  }
  if (type === 'daily-affirmation') {
    const enAff = getAppLanguage() === 'en';
    const affOpeners = enAff ? AFFIRMATION_OPENERS_EN : AFFIRMATION_OPENERS;
    const affMiddles = enAff ? AFFIRMATION_MIDDLES_EN : AFFIRMATION_MIDDLES;
    const affClosers = enAff ? AFFIRMATION_CLOSERS_EN : AFFIRMATION_CLOSERS;
    const a = pick(affOpeners, sequence, 8);
    const b = pick(affMiddles, sequence, 9);
    const c = pick(affClosers, sequence, 10);
    return {
      text: `${a} ${b} ${c}`,
      fingerprint: `aff:${affOpeners.indexOf(a)}-${affMiddles.indexOf(b)}-${affClosers.indexOf(c)}`,
      meta: { affirmation: { opener: a, middle: b, closer: c } }
    };
  }
  if (type === 'daily-quote') {
    const L = 40; // Parça sayısı
    const total = L * L * L;
    // Büyük bir asal sayı ile çarparak sequence'ı kaotik bir hale getiriyoruz (Karıştırma)
    const shuffled = (sequence * 15485863) % total; 
    
    const oIdx = shuffled % L;
    const mIdx = Math.floor(shuffled / L) % L;
    const cIdx = Math.floor(shuffled / (L * L)) % L;

    const inspiration = getInspirationParts();
    const o = inspiration.openers[oIdx] || inspiration.openers[0];
    const m = inspiration.middles[mIdx] || inspiration.middles[0];
    const c = inspiration.closers[cIdx] || inspiration.closers[0];
    
    return { 
      text: `${o}\n\n${m}\n\n${c}`,
      fingerprint: `quote:${oIdx}-${mIdx}-${cIdx}`
    };
  }
  if (type === 'daily-runes') {
    const rune = pick(getRunes(), sequence, 5);
    const enRune = getAppLanguage() === 'en';
    return { 
      text: `${enRune ? "Today's Rune" : 'Günün Runesi'}:

${rune.rune} (${rune.keyword})

${enRune ? 'Message' : 'Mesaj'}:
${rune.message}`,
      fingerprint: `rune:${rune.rune}`,
      meta: {
        rune: { path: rune.path, keyword: rune.keyword, message: rune.message, runeName: rune.rune }
      }
    };
  }
  if (type === 'daily-i-ching') {
    const lines: number[] = [];
    for (let i = 0; i < 6; i++) {
      const seed = ((sequence + i * 17) * 1103515245 + 12345) % 2147483648;
      const val = seed % 16;
      let lineVal = 8;
      if (val < 1) lineVal = 6;
      else if (val < 6) lineVal = 7;
      else if (val < 13) lineVal = 8;
      else lineVal = 9;
      lines.push(lineVal);
    }
    
    const baseBinary = lines.map(l => (l === 7 || l === 9) ? '1' : '0').join('');
    const endBinary = lines.map(l => (l === 7 || l === 6) ? '1' : '0').join('');
    
    const hexagrams = getIChingHexagrams();
    const baseHex = hexagrams.find(h => h.binary === baseBinary) || hexagrams[0];
    const endHex = hexagrams.find(h => h.binary === endBinary) || hexagrams[0];
    
    const changingLinesInfo = lines
      .map((l, idx) => (l === 6 || l === 9) ? { index: idx + 1, val: l } : null)
      .filter(l => l !== null) as { index: number, val: number }[];
      
    // Başlık ile açıklama arasına BOŞ SATIR (\n\n) konur: kart başlığı bold gösterir,
    // açıklama bir satır altında yeni paragrafta başlar. "Dönüşüm Süreci / eril-dişil"
    // bölümü Ozan talebiyle tamamen kaldırıldı (teknik/kafa karıştırıcı).
    const enIching = getAppLanguage() === 'en';
    let text = enIching
      ? `Today's I-Ching Reading:

Present State: ${baseHex.name}

${baseHex.situation}`
      : `Günün I-Ching Okuması:

Şimdiki Durum: ${baseHex.name}

${baseHex.situation}`;

    if (changingLinesInfo.length > 0) {
      text += enIching
        ? `

Unfolding Potential and Guidance: ${endHex.name}

${endHex.situation}`
        : `

Gelecek Potansiyeli ve Tavsiye: ${endHex.name}

${endHex.situation}`;
      text += enIching ? `

Guiding Message:

${endHex.advice}` : `

Yol Gösterici Mesaj:

${endHex.advice}`;
    } else {
      text += enIching
        ? `

(No changing lines appeared today; your situation is steady and your energy rests fully on the present hexagram.)

Guidance:

${baseHex.advice}`
        : `

(Bugün hiçbir değişen çizgi çıkmadı; durumunuz stabil ve enerjiniz tamamen mevcut hexagrama odaklı.)

Tavsiye:

${baseHex.advice}`;
    }
    
    return {
      text,
      fingerprint: `iching:${baseBinary}-${endBinary}`,
      meta: {
        iChing: {
          baseLines: lines,
          hasChanges: changingLinesInfo.length > 0,
          endLines: lines.map(l => l === 6 ? 7 : (l === 9 ? 8 : l)),
          baseHexName: baseHex.name,
          endHexName: changingLinesInfo.length > 0 ? endHex.name : undefined,
          text: text,
        }
      }
    };
  }
  if (type === 'daily-tarot') {
    const card = pick(getTarotCards(), sequence, 7);
    const isReversed = Math.abs((sequence * 13 + 7) % 2) === 1;
    const enTarot = getAppLanguage() === 'en';
    const trName = TAROT_TR_NAMES[card.name] || card.name;
    const reverseSuffix = isReversed ? (enTarot ? ' (Reversed)' : ' (Ters)') : '';
    
    const meaning = isReversed ? card.reversed : card.upright;
    const advice = isReversed ? card.adviceReversed : card.advice;
    
    return {
      text: enTarot
        ? `${card.name}${reverseSuffix}

Meaning:
${meaning}

Guidance:
${advice}`
        : `${trName} / ${card.name}${reverseSuffix}

Anlam:
${meaning}

Öneri:
${advice}`,
      fingerprint: `tarot:${card.name}:${isReversed ? 'rev' : 'up'}`,
      meta: {
        tarot: {
          cardName: card.name,
          orientation: isReversed ? 'reversed' : 'upright',
        },
      },
    };
  }
  if (type === 'daily-angel') {
    const card = pick(getAngelCards(), sequence, 8);
    const enAngel = getAppLanguage() === 'en';
    const guideText = card.guide ? `

${enAngel ? 'Guiding Angel' : 'Rehber Melek'}: ${card.guide}` : '';
    return { 
      text: `${enAngel ? "Today's Angel Card" : 'Günün Melek Kartı'}:

${card.name}${guideText}

${enAngel ? 'Message' : 'Mesaj'}:
${card.message}

${enAngel ? 'Suggestion' : 'Öneri'}:
${card.action}`,
      fingerprint: `angel:${card.name}`,
      meta: { angel: card }
    };
  }
  if (type === 'daily-angel-number') {
    const n = pick(getAngelNumbers(), sequence, 9);
    const enNum = getAppLanguage() === 'en';
    return { 
      text: `${enNum ? "Today's Angel Number" : 'Günün Uğurlu Melek Sayısı'}:

${n.number}

${enNum ? 'Meaning' : 'Anlam'}:
${n.meaning}

${enNum ? 'Guidance' : 'Rehberlik'}:
${n.guidance}`,
      fingerprint: `angelNum:${n.number}`,
      meta: { angelNumber: n }
    };
  }
  const code = momentCode(now);
  const enNumerology = getAppLanguage() === 'en';
  const meaning =
    getNumerologyMeanings()[String(code)] ||
    (enNumerology ? 'Balance and clarity set the tone today.' : 'Bugün denge ve netlik enerjisi baskın.');
  return { 
    text: `${enNumerology ? "Today's Numerology" : 'Günün Numerolojisi'}:

${code}

${enNumerology ? 'Meaning' : 'Anlam'}:
${meaning}`,
    fingerprint: `num:${code}`,
    meta: {
      numerology: {
        number: String(code),
        meaning: meaning,
        guidance: enNumerology
          ? 'To keep this numerological energy with you through the day, anchor your intention to this number.'
          : 'Numerolojik enerjinizi gün boyu korumak için niyetinizi bu sayıya odaklayın.'
      }
    }
  };
}

export async function createDailyGeneralReading(params: {
  type: GeneralDivinationType;
  profileId: string;
  now?: Date;
}): Promise<DailyGeneralReadingResult> {
  const now = params.now ?? new Date();
  const store = await loadStore();
  const dateKey = todayKeyIstanbul(now);

  // Auto-clear cache at 00:00: If there are dailyReadings from a previous day, clear them and usedTexts
  const hasOldDailyReadings = store.dailyReadings.some(r => r.dateKey !== dateKey);
  if (hasOldDailyReadings) {
    store.dailyReadings = [];
    store.usedFingerprints = [];
    await saveStore(store);
  }

  const existing = store.dailyReadings.find(
    (r) => r.type === params.type && r.profileId === params.profileId && r.dateKey === dateKey,
  );
  if (existing) {
    const canonical = buildReading(params.type, existing.sequence, now);
    if (existing.text !== canonical.text || hasBrokenUtf8(existing.text)) {
      existing.text = canonical.text;
      await saveStore(store);
    }
    return {
      text: existing.text,
      sequence: existing.sequence,
      meta: canonical.meta,
    };
  }

  let sequence = Math.max(1, store.nextSequence);
  let selected = '';
  let selectedFingerprint = '';
  let selectedMeta: DailyGeneralReadingResult['meta'] | undefined;

  // Numerology is static per date, no need to search for unique sequence or check history
  if (params.type === 'daily-numerology') {
    const candidate = buildReading(params.type, sequence, now);
    selected = candidate.text;
    selectedMeta = candidate.meta;
    selectedFingerprint = candidate.fingerprint;
  } else {
    // Optimize: Use fingerprints to prevent memory blowup
    const used = new Set(store.usedFingerprints.slice(-2000));

    // Reduce iteration count and handle fallback
    for (let i = 0; i < 500; i += 1) {
      const current = sequence + i;
      const candidate = buildReading(params.type, current, now);
      if (used.has(candidate.fingerprint)) continue;
      selected = candidate.text;
      selectedMeta = candidate.meta;
      selectedFingerprint = candidate.fingerprint;
      sequence = current;
      break;
    }
  }

  // Fallback: If no unique text found after 500 tries, just use a random one based on timestamp
  if (!selected) {
    const fallbackSeed = now.getTime() % 10000;
    const fallback = buildReading(params.type, sequence + fallbackSeed, now);
    selected = fallback.text;
    selectedMeta = fallback.meta;
    selectedFingerprint = fallback.fingerprint;
    sequence = sequence + fallbackSeed;
  }

  const next: DivinationStore = {
    ...store,
    nextSequence: sequence + 1,
    usedFingerprints: [...store.usedFingerprints, selectedFingerprint].slice(-5000),
    dailyReadings: [
      {
        dateKey,
        type: params.type,
        profileId: params.profileId,
        text: selected,
        sequence,
        createdAt: nowIso(),
      },
      ...store.dailyReadings,
    ].slice(0, 1000),
  };
  await saveStore(next);
  return { text: selected, sequence, meta: selectedMeta };
}

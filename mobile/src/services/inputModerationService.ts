// ============================================================
// Ruhbaz Konağı - Kullanıcı Girdi Moderasyonu (K42, 04/4.6)
// ============================================================
// İlke: Zararlı girdi modele GİTMEDEN cihazda yakalanır (maliyet + sorumluluk).
// Karar tarzı K32 ruhu: sert kesme yerine "nazik reddet + kişisele döndür";
// CSAM ve açık şiddet tehdidi gibi mutlak kategorilerde tereddütsüz blok.
// Eşikler bilinçli MUHAFAZAKÂR: normal okuma/dert/aşk/iş soruları ASLA takılmamalı
// (yanlış-pozitif, yanlış-negatiften pahalıdır; çıktı tarafında zaten Red Kataloğu
// prompt katmanı + sanitizer var).
//
// Tasarım notları (öz-review 2026-06-11 bulguları işlendi):
// - Türkçe harf sonrası ASCII \b çalışmaz → sınırlar \p{L} lookaround ile.
// - Grup+hakaret (R15) ve çocuk+cinsellik (CSAM) YAKINLIK koşuluyla (aynı cümle
//   civarı), tüm-metin AND ile değil; "nefret ediyorum" tek başına sinyal DEĞİL
//   (olağan dert dökme dili).
// - Kriz (R2) kalıpları NİYET temelli: "rüyamda intihar ettim" geçer,
//   "intihar etmek istiyorum" kriz yanıtı döner.
// - 'dream' bağlamı daraltılmış sette (kâbus imgeleri okumayı bloklamaz).
// - Bloklanan içerik SONRAKİ turlarda da modele sızmamalı: çağıranlar
//   isAllowedUserText / isModerationReplyText / filterModeratedFollowUps
//   yardımcılarıyla geçmişi süzer.
// - Tekrarlı ihlalde hesap/oturum kısıtlaması Faz 2 kapsamı DIŞI (iskelet notu).

import { trackEvent } from './analyticsService';
import { getAppLanguage } from '../i18n';

export type ModerationContext = 'chat' | 'question' | 'dream';

export type ModerationCategory =
  | 'crisis'
  | 'csam'
  | 'sexual'
  | 'hate'
  | 'religion'
  | 'politics'
  | 'violence_threat'
  | 'animal_abuse'
  | 'harassment'
  | 'gambling';

export type ModerationResult =
  | { verdict: 'allow' }
  | { verdict: 'crisis'; category: 'crisis'; replyText: string }
  | { verdict: 'block'; category: Exclude<ModerationCategory, 'crisis'>; replyText: string };

const REPLY: Record<ModerationCategory, string> = {
  // Kriz yanıtı (K-1 onayı, Ozan 2026-06-13): nazik reddet + eğlence-yorumuna davet +
  // TEK nötr güvenlik cümlesi (112/hat ya da "intihar/zarar" gibi tetikleyici sözcük YOK;
  // "güvendiğin biri / yerel acil servis" dili). App kendini KAPATMAZ; destek/dertleşme tonu YOK.
  crisis:
    'Bunu burada sembollerle konuşmak doğru olmaz; bu konak bunun için doğru yer değil. ' +
    'Zor bir şey yaşıyorsan, güvendiğin birine ya da yerel acil servislere ulaşman iyi olur. ' +
    'İstersen tamamen eğlence amaçlı, başka bir konuda sembolik bir yorum birlikte açabiliriz.',
  csam: 'Bu içerik bu konakta hiçbir biçimde yer alamaz ve yorumlanmaz.',
  sexual:
    'Konağın kapısı bu konuya kapalı; burada her şey sembolik ve zarif kalır. İstersen aklındaki başka bir konuyu birlikte açalım.',
  hate:
    'Bu konakta hiçbir topluluk hakkında böyle konuşulmaz. Gel, sana dönelim; senin dünyanda neler oluyor?',
  religion:
    'İnanç meseleleri bu konağın kapısından girmez; ne övülür ne tartışılır. İstersen senin gündemine bakalım.',
  politics:
    'Dünya ve siyaset meseleleri konağın kapısından girmez; biz sana bakalım. Senin hayatında neyi merak ediyorsun?',
  violence_threat:
    'Bu kapıdan şiddet geçmez. İçinde biriken yükü konuşmak istersen, sembollerle sana bakabilirim; ama kimseye zarar vermekten söz etmeyelim.',
  animal_abuse: 'Bu konakta canlılara yalnız şefkatle yaklaşılır; bu konu burada yorumlanmaz.',
  harassment: 'Bu dille devam edemeyiz. Biraz nefes alalım; istersen yeniden, daha yumuşak bir yerden başlayalım.',
  gambling:
    'Şans oyunları, sayılar ve tahminler bu konağın işi değil; semboller yön gösterir, sonuç söylemez. Başka neyi merak ediyorsun?',
};

// EN yanıtlar (Faz 4; diğer kategoriler TASLAK — onay: Ozan). Kriz yanıtı K-1 onaylı (2026-06-13):
// TR ile aynı felsefe — nazik reddet + tek nötr güvenlik cümlesi (no hotline number, no trigger words) + davet.
const REPLY_EN: Record<ModerationCategory, string> = {
  crisis:
    "This isn't something I can explore with symbols, and the manor isn't the right place for it. " +
    "If you're going through something hard, reaching out to someone you trust or your local emergency services is a good step. " +
    'If you like, we can open something else together — purely for entertainment.',
  csam: 'This content has no place in this manor, in any form.',
  sexual: 'The manor keeps this door closed; everything here stays symbolic and gentle. Shall we open another topic together?',
  hate: 'No community is spoken of that way in this manor. Let us turn back to you — what is going on in your world?',
  religion: 'Matters of faith do not pass through this door; they are neither praised nor debated here. Let us look at your own path instead.',
  politics: 'Worldly politics stays outside the manor gate; we look at you here. What is on your mind these days?',
  violence_threat: 'Violence does not pass through this door. If you want to talk about what is weighing on you, I can read the symbols with you — but let us not speak of harming anyone.',
  animal_abuse: 'In this manor, every living being is met with kindness; this topic will not be read here.',
  harassment: 'We cannot continue in this tone. Let us take a breath and start again, a little more gently.',
  gambling: "Lottery numbers and betting tips are not the manor's craft; symbols point to directions, not results. What else is on your mind?",
};

function replyFor(category: ModerationCategory): string {
  return getAppLanguage() === 'en' ? REPLY_EN[category] : REPLY[category];
}

const MODERATION_REPLY_TEXTS = new Set([...Object.values(REPLY), ...Object.values(REPLY_EN)]);

/** Verilen metin bu servisin ürettiği nazik red/kriz yanıtı mı? (Geçmiş süzmede kullanılır.) */
export function isModerationReplyText(text: string | null | undefined): boolean {
  return Boolean(text && MODERATION_REPLY_TEXTS.has(text));
}

// --- Sınır yardımcıları: Türkçe harflerde ASCII \b güvenilmez ---
const B_START = '(?:^|[^\\p{L}])'; // token başı: metin başı veya harf-olmayan
const B_END = '(?=[^\\p{L}]|$)'; // token sonu: harf-olmayan veya metin sonu

function findAll(re: RegExp, text: string): number[] {
  const out: number[] = [];
  const global = new RegExp(re.source, re.flags.includes('g') ? re.flags : `${re.flags}g`);
  let match: RegExpExecArray | null = global.exec(text);
  while (match) {
    out.push(match.index);
    if (global.lastIndex === match.index) global.lastIndex += 1;
    match = global.exec(text);
  }
  return out;
}

/** İki desen aynı metinde YAKIN mı (aynı cümle civarı)? Tüm-metin AND'inden güvenli. */
function nearEachOther(reA: RegExp, reB: RegExp, text: string, maxDistance = 80): boolean {
  const a = findAll(reA, text);
  if (!a.length) return false;
  const b = findAll(reB, text);
  if (!b.length) return false;
  return a.some((i) => b.some((j) => Math.abs(i - j) <= maxDistance));
}

// --- Sinyal desenleri (lowercase tr-TR metin üzerinde; diakritiksiz varyantlar dahil) ---

// R2 — kriz: NİYET kalıpları. ("ol" gibi geniş ekler bilinçli YOK — "yoluna girecek" tetiklemez.)
// EN kriz NİYET kalıpları (Faz 4): EN moddaki kullanıcı da korunur.
const CRISIS_RE_EN =
  /(kill(ing)? (myself|my self)|end (my|it all|my own) life|take my (own )?life|suicid(e|al)|want(ing)? to die|wanna die|don'?t want to (live|be here)|no reason to live|nothing to live for|better off dead|wish i (was|were) dead|hurt myself|harm myself|self[- ]?harm|cut myself|overdose)/i;

// TR kriz — KATI niyet kalıpları; her bağlamda (rüya dahil) çalışır. "rüyamda intihar
// ettim" gibi kâbus anlatımını TETİKLEMEZ (bilinçli: niyet kalıbı gerekir).
const CRISIS_RE =
  /(intihar (etmek istiyorum|edece[ğg]im|etmeyi dü[şs]ünüyorum)|kendimi öldür(mek istiyorum|eceğim|ecegim)|kendime zarar ver(mek istiyorum|eceğim|ecegim)|ya[şs]amak istemiyorum)/iu;

// TR kriz — GENİŞ kalıplar: bare "intihar" + yaygın ifadeler. YALNIZ rüya-DIŞI bağlamda
// (question/chat) uygulanır; rüya anlatımındaki kâbus sembollerini engellemez.
// (Cihaz testi 2026-06-13: tarot/kahve konu/soru alanlarında bare "intihar" kaçıyordu.)
const CRISIS_BROAD_RE =
  /(\bintihar|can[ıi]ma k[ıi]y|kendimi as(?:mak|aca[ğg][ıi]m|ar[ıi]m)?|kendimi öldür|kendimi oldur|kendime zarar ver|hayat[ıi]ma son ver|ya[şs]amak istemiyor|ya[şs]amak iste(?:mem|miyom)|ölmek isti(?:yor|yom|yorum)|olmek isti(?:yor|yom|yorum)|ke[şs]ke öls|ke[şs]ke ols)/iu;

// Cinsellik (R14) — açık terimler.
const SEXUAL_RE = new RegExp(
  `(${B_START}seks${B_END}|cinsel ili[şs]ki|porno|müstehcen|mustehcen|ç[ıi]plak foto|ciplak foto|mastürbasyon|masturbasyon|${B_START}erotik)`,
  'iu',
);

// CSAM — çocuk terimi + cinsel terim YAKIN; doğurganlık bağlamı ("çocuğum olacak mı") hariç.
const CSAM_CHILD_RE = new RegExp(
  `(${B_START}çocu[ğg]|${B_START}cocug|re[şs]it de[ğg]il|resit degil|küçük k[ıi]z${B_END}|kucuk kiz${B_END}|${B_START}1[0-7]\\s*ya[şs][ıi]nda)`,
  'iu',
);
const FERTILITY_CONTEXT_RE =
  /(çocu[ğg]um(uz)? ol|cocugum(uz)? ol|çocuk sahibi ol|cocuk sahibi ol|hamile|bebe[ğg]im ol)/iu;

// R15 — topluluk + aşağılama YAKIN. Gündelik kelimelerle çakışan diakritiksiz kökler
// (rum/kurt/turk/roman) bilinçli LİSTEDE YOK; "nefret ediyorum" tek başına sinyal değil.
const HATE_GROUP_RE = new RegExp(
  `${B_START}(yahudi|ermeni|suriyeli|afgan|kürt|türk|çingene|alevi|sünni|hristiyan|müslüman|ateist|e[şs]cinsel|escinsel)\\p{L}*`,
  'iu',
);
const HATE_INSULT_RE = new RegExp(
  `(a[şs]a[ğg][ıi]l[ıi]k|${B_START}pis${B_END}|i[ğg]renç|igrenc|${B_START}hain${B_END}|[şs]erefsiz|insan de[ğg]il|hepsi (ölsün|olsun|gitsin|yok olsun|defolsun))`,
  'iu',
);

// R9 — din TARTIŞMASI/aşağılaması ("inşallah/maşallah" sınır sayesinde tetiklemez).
const RELIGION_RE = new RegExp(
  `(${B_START}(allah|tanr[ıi]|peygamber|kuran|incil|tevrat)\\p{L}*\\s+(yalan|saçma|sacma|uydurma|yok(tur)?${B_END})|hangi din (do[ğg]ru|gerçek|gercek|hakl[ıi])|din(ler)? (saçmal[ıi]k|sacmalik|uydurma))`,
  'iu',
);

// R13 — siyaset: parti/aktör adları veya açık siyasi kalıplar.
const POLITICS_RE = new RegExp(
  `(${B_START}akp${B_END}|${B_START}chp${B_END}|${B_START}mhp${B_END}|${B_START}hdp${B_END}|dem parti|iyi parti|zafer partisi|cumhurba[şs]kan|ba[şs]bakan|erdo[ğg]an|k[ıi]l[ıi]çdaro[ğg]lu|imamo[ğg]lu|seçim(i|ler(i|de)?)? kim kazan|${B_START}hükümet|${B_START}hukumet${B_END}|muhalefet|${B_START}siyaset|mecliste|milletvekil)`,
  'iu',
);

// Şiddet tehdidi — kullanıcının başkasına zarar NİYETİ.
const VIOLENCE_RE =
  /((öldür|oldur)(eceğim|ecegim|mek istiyorum)|döv(eceğim|ecegim)|b[ıi]çaklayaca[ğg][ıi]m|vuraca[ğg][ıi]m(?=[^\p{L}]|$)|zarar verece[ğg]im (ona|onlara)|can[ıi]na okuyaca[ğg][ıi]m)/iu;

// R16 — hayvan + kötü muamele YAKIN.
const ANIMAL_RE = new RegExp(`${B_START}(kedi|köpek|kopek|ku[şs]|hayvan|pati)\\p{L}*`, 'iu');
const ABUSE_RE =
  /(i[şs]kence|dövmek|dovmek|tekmele|zehirle(yece[ğg]im|mek|di[mk])?|yakaca[ğg][ıi]m|öldürece[ğg]im|oldurecegim|ac[ıi] çektir)/iu;

// Taciz/ağır küfür.
const HARASSMENT_RE = new RegExp(
  `(${B_START}orospu|${B_START}piç${B_END}|${B_START}pic${B_END}|${B_START}amk${B_END}|${B_START}aq${B_END}|yarra|${B_START}sikt|götveren|anan[ıi] sat)`,
  'iu',
);

// R6 — şans oyunu TALEBİ (girişte kesilir; API maliyeti de doğmaz).
const GAMBLING_RE = new RegExp(
  `((şansl[ıi]|sansli) (say[ıi]|numara)|${B_START}loto|sayısal loto|sayisal loto|${B_START}iddaa|bahis kuponu|at yar[ıi][şs][ıi].{0,15}tahmin|hangi tak[ıi]m kazan)`,
  'iu',
);

// --- EN sinyal desenleri (Faz 4 boşluk-kapama). Tespit DİL-BAĞIMSIZ çalışır:
// TR moddaki kullanıcı da İngilizce zararlı metin yapıştırabilir; bu yüzden
// EN desenleri dil anahtarına bağlanmaz, TR desenlerle BİRLEŞİK denenir.
// Aynı muhafazakârlık ilkesi: yüksek-kesinlikli, niyet-temelli kalıplar.

const SEXUAL_RE_EN =
  /(\bsex\b|\bsexual\b|\bporn\w*|\bexplicit photo|\bnude(s| photo| pic)\b|\bnaked (photo|pic)|masturbat\w*|\berotic\b)/i;
const CSAM_CHILD_RE_EN = /(\bchild(ren)?\b|\bminor\b|under[- ]?age|\b1[0-7][- ]?year[- ]?old)/i;
const FERTILITY_CONTEXT_RE_EN = /(have (a )?(child|baby|kid)|get pregnant|pregnan\w*|trying for a baby)/i;
const HATE_GROUP_RE_EN =
  /(\bjews?\b|\barabs?\b|\bkurds?\b|\bturks?\b|\bsyrians?\b|\brefugees?\b|\bimmigrants?\b|\bmuslims?\b|\bchristians?\b|\bgays?\b|\blesbians?\b|\batheists?\b)/i;
const HATE_INSULT_RE_EN =
  /(\bdisgusting\b|\bvermin\b|\bsubhuman\b|\bfilthy\b|should all (die|leave|be deported|disappear)|\bscum\b)/i;
const RELIGION_RE_EN =
  /((\bgod\b|\ballah\b|\bjesus\b|the bible|the quran|the koran)\s+(is|isn'?t)\s+(fake|a lie|real|nonsense)|religion is (fake|a lie|nonsense|stupid)|which religion is (true|right|correct))/i;
const POLITICS_RE_EN =
  /(\bpolitics\b|\bpolitician\w*|who (will|is going to) win the election|\bpresident (erdogan|trump|biden|putin)\b|\bprime minister\b|\bparliament\b)/i;
const VIOLENCE_RE_EN =
  /((i'?m going to|i will|i wanna|i want to) (kill|hurt|stab|beat( up)?|shoot) (him|her|them|my)\b|\bkill (him|her|them)\b)/i;
const ANIMAL_RE_EN = /(\bcat\b|\bdog\b|\bkitten\b|\bpuppy\b|\bbird\b|\banimal\b|\bpet\b)/i;
const ABUSE_RE_EN = /((i'?m going to|i will|i wanna|i want to) (torture|poison|kick|kill|burn|hurt)|\btorturing\b|\bpoisoning\b)/i;
const HARASSMENT_RE_EN = /(\bfuck(ing|er)?\b|\bbitch\b|\basshole\b|\bcunt\b|piece of shit|\bmotherfuck)/i;
const GAMBLING_RE_EN =
  /(lottery numbers?|lotto numbers?|lucky numbers? for (the )?(lotto|lottery|bet)|betting tips?|which team (will|is going to) win|sports bet)/i;

function unionRe(a: RegExp, b: RegExp): RegExp {
  return new RegExp(`(?:${a.source})|(?:${b.source})`, 'iu');
}

const SEXUAL_ANY = unionRe(SEXUAL_RE, SEXUAL_RE_EN);
const CSAM_CHILD_ANY = unionRe(CSAM_CHILD_RE, CSAM_CHILD_RE_EN);
const HATE_GROUP_ANY = unionRe(HATE_GROUP_RE, HATE_GROUP_RE_EN);
const HATE_INSULT_ANY = unionRe(HATE_INSULT_RE, HATE_INSULT_RE_EN);
const ANIMAL_ANY = unionRe(ANIMAL_RE, ANIMAL_RE_EN);
const ABUSE_ANY = unionRe(ABUSE_RE, ABUSE_RE_EN);

type Rule = { category: Exclude<ModerationCategory, 'crisis'>; test: (t: string) => boolean };

const FULL_RULES: Rule[] = [
  {
    category: 'csam',
    test: (t) =>
      !FERTILITY_CONTEXT_RE.test(t) &&
      !FERTILITY_CONTEXT_RE_EN.test(t) &&
      nearEachOther(CSAM_CHILD_ANY, SEXUAL_ANY, t),
  },
  { category: 'sexual', test: (t) => SEXUAL_ANY.test(t) },
  { category: 'hate', test: (t) => nearEachOther(HATE_GROUP_ANY, HATE_INSULT_ANY, t) },
  { category: 'religion', test: (t) => RELIGION_RE.test(t) || RELIGION_RE_EN.test(t) },
  { category: 'politics', test: (t) => POLITICS_RE.test(t) || POLITICS_RE_EN.test(t) },
  { category: 'violence_threat', test: (t) => VIOLENCE_RE.test(t) || VIOLENCE_RE_EN.test(t) },
  { category: 'animal_abuse', test: (t) => nearEachOther(ANIMAL_ANY, ABUSE_ANY, t) },
  { category: 'harassment', test: (t) => HARASSMENT_RE.test(t) || HARASSMENT_RE_EN.test(t) },
  { category: 'gambling', test: (t) => GAMBLING_RE.test(t) || GAMBLING_RE_EN.test(t) },
];

// Rüya bağlamı: kâbus anlatımı (şiddet/ölüm/din/siyaset imgesi) okumayı bloklamaz;
// yalnız mutlak kategoriler + taciz denetlenir.
const DREAM_RULES: Rule[] = FULL_RULES.filter((rule) =>
  ['csam', 'hate', 'harassment'].includes(rule.category),
);

/**
 * Kullanıcı girdisini modele göndermeden önce denetler.
 * Sonuç 'allow' değilse LLM ÇAĞRISI YAPILMAMALI; replyText kullanıcıya
 * persona-nötr nazik yanıt olarak gösterilir.
 */
/**
 * Çift normalizasyon: tr-TR lowercase İngilizce 'I'yı noktasız 'ı' yapar ve EN
 * desenleri kaçırır ("I want to..." → "ı want to..."). Bu yüzden metnin hem
 * tr-TR hem standart lowercase kopyası, yakınlık penceresinden (80) büyük bir
 * boşluk tamponuyla (120) birleştirilir; tüm desenler bu probe üzerinde koşar.
 */
function buildProbe(text: string): string {
  // Akıllı kesme işareti normalize edilir (iOS/Android otomatik ’ üretir; desenler ' bekler).
  const cleaned = text.replace(/’/g, "'");
  // Tampon ortasina harf/bosluk olmayan sentinel (U+0001): \s+ koprulu desenlerin
  // (örn. RELIGION "allah\s+yalan") kopyalar ARASINI köprülemesini keser;
  // kopyalar arası minimum mesafe 121 kalır (yakınlık penceresi 80).
  const buffer = `${' '.repeat(60)}\u0001${' '.repeat(60)}`;
  return `${cleaned.toLocaleLowerCase('tr-TR')}${buffer}${cleaned.toLowerCase()}`;
}

/** Kriz tespiti: KATI niyet kalıpları her bağlamda; GENİŞ kalıplar yalnız rüya-DIŞINDA. */
function isCrisisText(normalized: string, context: ModerationContext): boolean {
  if (CRISIS_RE.test(normalized) || CRISIS_RE_EN.test(normalized)) return true;
  return context !== 'dream' && CRISIS_BROAD_RE.test(normalized);
}

export function moderateUserInput(
  text: string | null | undefined,
  context: ModerationContext = 'chat',
): ModerationResult {
  const trimmed = (text || '').trim();
  if (!trimmed) {
    return { verdict: 'allow' };
  }
  const normalized = buildProbe(trimmed);

  if (isCrisisText(normalized, context)) {
    trackEvent({ name: 'moderation_blocked', category: 'crisis' });
    return { verdict: 'crisis', category: 'crisis', replyText: replyFor('crisis') };
  }

  const rules = context === 'dream' ? DREAM_RULES : FULL_RULES;
  for (const rule of rules) {
    if (rule.test(normalized)) {
      // Yalnız kategori adı izlenir; kullanıcı metni ASLA event'e yazılmaz (K34 ilke 1).
      trackEvent({ name: 'moderation_blocked', category: rule.category });
      return { verdict: 'block', category: rule.category, replyText: replyFor(rule.category) };
    }
  }
  return { verdict: 'allow' };
}

/** Sessiz denetim: event üretmeden yalnız izin durumu (geçmiş süzme için). */
export function isAllowedUserText(text: string | null | undefined, context: ModerationContext = 'chat'): boolean {
  const trimmed = (text || '').trim();
  if (!trimmed) return true;
  const normalized = buildProbe(trimmed);
  if (isCrisisText(normalized, context)) return false;
  const rules = context === 'dream' ? DREAM_RULES : FULL_RULES;
  return !rules.some((rule) => rule.test(normalized));
}

/**
 * Takip-sohbeti geçmişini süzer: bloklanmış kullanıcı mesajları ve bu servisin
 * ürettiği red yanıtları SONRAKİ prompt'lara taşınmaz (K42 "modele gitmez" garantisi
 * yalnız ilk turda değil, her turda geçerli kalır).
 */
export function filterModeratedFollowUps<T extends { role: 'user' | 'assistant'; text: string }>(
  messages: T[] | undefined,
  context: ModerationContext = 'chat',
): T[] {
  return (messages || []).filter((message) =>
    message.role === 'user' ? isAllowedUserText(message.text, context) : !isModerationReplyText(message.text),
  );
}

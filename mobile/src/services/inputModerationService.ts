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
  crisis:
    'Şu an zor bir yerden geçiyor olabilirsin ve bunu yazman bile değerli. Ama burada sana sembollerle değil, ' +
    'gerçek bir destekle yardım edilmeli. Lütfen güvendiğin biriyle konuş; kendine zarar verme düşüncesi içindeysen ' +
    "112 Acil Çağrı Merkezi'ni arayabilirsin. Bir uzmanla (psikolog ya da psikiyatrist) konuşmak en doğrusu. " +
    'Bu kapı sana her zaman açık; ama şimdi önce kendine iyi bak.',
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

const MODERATION_REPLY_TEXTS = new Set(Object.values(REPLY));

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
const CRISIS_RE =
  /(intihar (etmek istiyorum|edece[ğg]im|etmeyi dü[şs]ünüyorum)|kendimi öldür(mek istiyorum|eceğim|ecegim)|kendime zarar ver(mek istiyorum|eceğim|ecegim)|ya[şs]amak istemiyorum)/iu;

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

type Rule = { category: Exclude<ModerationCategory, 'crisis'>; test: (t: string) => boolean };

const FULL_RULES: Rule[] = [
  {
    category: 'csam',
    test: (t) => !FERTILITY_CONTEXT_RE.test(t) && nearEachOther(CSAM_CHILD_RE, SEXUAL_RE, t),
  },
  { category: 'sexual', test: (t) => SEXUAL_RE.test(t) },
  { category: 'hate', test: (t) => nearEachOther(HATE_GROUP_RE, HATE_INSULT_RE, t) },
  { category: 'religion', test: (t) => RELIGION_RE.test(t) },
  { category: 'politics', test: (t) => POLITICS_RE.test(t) },
  { category: 'violence_threat', test: (t) => VIOLENCE_RE.test(t) },
  { category: 'animal_abuse', test: (t) => nearEachOther(ANIMAL_RE, ABUSE_RE, t) },
  { category: 'harassment', test: (t) => HARASSMENT_RE.test(t) },
  { category: 'gambling', test: (t) => GAMBLING_RE.test(t) },
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
export function moderateUserInput(
  text: string | null | undefined,
  context: ModerationContext = 'chat',
): ModerationResult {
  const normalized = (text || '').trim().toLocaleLowerCase('tr-TR');
  if (!normalized) {
    return { verdict: 'allow' };
  }

  if (CRISIS_RE.test(normalized)) {
    trackEvent({ name: 'moderation_blocked', category: 'crisis' });
    return { verdict: 'crisis', category: 'crisis', replyText: REPLY.crisis };
  }

  const rules = context === 'dream' ? DREAM_RULES : FULL_RULES;
  for (const rule of rules) {
    if (rule.test(normalized)) {
      // Yalnız kategori adı izlenir; kullanıcı metni ASLA event'e yazılmaz (K34 ilke 1).
      trackEvent({ name: 'moderation_blocked', category: rule.category });
      return { verdict: 'block', category: rule.category, replyText: REPLY[rule.category] };
    }
  }
  return { verdict: 'allow' };
}

/** Sessiz denetim: event üretmeden yalnız izin durumu (geçmiş süzme için). */
export function isAllowedUserText(text: string | null | undefined, context: ModerationContext = 'chat'): boolean {
  const normalized = (text || '').trim().toLocaleLowerCase('tr-TR');
  if (!normalized) return true;
  if (CRISIS_RE.test(normalized)) return false;
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

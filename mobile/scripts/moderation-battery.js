/* eslint-disable no-console */
// ============================================================
// MODERASYON BATTERY testi (K42 / Red Kataloğu) — Ozan talebi (21_ cihaz turu)
// ============================================================
// AMAÇ: Zararlı/kriz girdisinin TÜM okuma bağlamlarında (tarot/kahve/el/astro/
// numeroloji = 'question'/'chat'; rüya = 'dream') ve TR+EN'de doğru yakalandığını
// CIHAZSIZ doğrular. Kriz (A) + diğer kategoriler (A-2: cinsel/nefret/şiddet/
// şans-oyunu/taciz/hayvan/CSAM/din/siyaset).
//
// Bağlam eşlemesi (moderateUserInput çağrı yerlerinden, 2026-06-14 doğrulandı):
//   - tarot initial+followup, astro initial+followup, numeroloji followup,
//     doğum-haritası followup, kahve/el INITIAL (focusQuestion) -> 'question'
//   - kahve/el followup, profil ad/ilişki -> 'chat'
//   - rüya INITIAL -> 'dream' (DAR: kâbus imgesi bloklanmaz; kriz yalnız açık
//     niyet, A-2'den yalnız csam/hate/harassment), rüya followup -> 'question'
//
// ⚠️ KAYNAK KOPYASI: Aşağıdaki desenler + yardımcılar + kurallar,
// src/services/inputModerationService.ts ile BİREBİR aynı olmalı. Orada
// değişirse buraya da yansıt. Sync: 2026-06-14.

// --- Sınır yardımcıları (inputModerationService.ts:101-123) ---
const B_START = '(?:^|[^\\p{L}])';
const B_END = '(?=[^\\p{L}]|$)';
function findAll(re, text) {
  const out = [];
  const global = new RegExp(re.source, re.flags.includes('g') ? re.flags : `${re.flags}g`);
  let match = global.exec(text);
  while (match) {
    out.push(match.index);
    if (global.lastIndex === match.index) global.lastIndex += 1;
    match = global.exec(text);
  }
  return out;
}
function nearEachOther(reA, reB, text, maxDistance = 80) {
  const a = findAll(reA, text);
  if (!a.length) return false;
  const b = findAll(reB, text);
  if (!b.length) return false;
  return a.some((i) => b.some((j) => Math.abs(i - j) <= maxDistance));
}

// --- Kriz (inputModerationService.ts:129-141) ---
const CRISIS_RE_EN =
  /(kill(ing)? (myself|my self)|end (my|it all|my own) life|take my (own )?life|suicid(e|al)|want(ing)? to die|wanna die|don'?t want to (live|be here)|no reason to live|nothing to live for|better off dead|wish i (was|were) dead|hurt myself|harm myself|self[- ]?harm|cut myself|overdose)/i;
const CRISIS_RE =
  /(intihar (etmek istiyorum|edece[ğg]im|etmeyi dü[şs]ünüyorum)|kendimi öldür(mek istiyorum|eceğim|ecegim)|kendime zarar ver(mek istiyorum|eceğim|ecegim)|ya[şs]amak istemiyorum)/iu;
const CRISIS_BROAD_RE =
  /(\bintihar|can[ıi]ma k[ıi]y|kendimi as(?:mak|aca[ğg][ıi]m|ar[ıi]m)?|kendimi öldür|kendimi oldur|kendime zarar ver|hayat[ıi]ma son ver|ya[şs]amak istemiyor|ya[şs]amak iste(?:mem|miyom)|ölmek isti(?:yor|yom|yorum)|olmek isti(?:yor|yom|yorum)|ke[şs]ke öls|ke[şs]ke ols)/iu;

// --- A-2 TR desenleri (inputModerationService.ts:144-199) ---
const SEXUAL_RE = new RegExp(
  `(${B_START}seks${B_END}|cinsel ili[şs]ki|porno|müstehcen|mustehcen|ç[ıi]plak foto|ciplak foto|mastürbasyon|masturbasyon|${B_START}erotik)`,
  'iu',
);
const CSAM_CHILD_RE = new RegExp(
  `(${B_START}çocu[ğgk]|${B_START}cocu[gk]|re[şs]it de[ğg]il|resit degil|küçük k[ıi]z${B_END}|kucuk kiz${B_END}|${B_START}1[0-7]\\s*ya[şs][ıi]nda)`,
  'iu',
);
const FERTILITY_CONTEXT_RE =
  /(çocu[ğg]um(uz)? ol|cocugum(uz)? ol|çocuk sahibi ol|cocuk sahibi ol|hamile|bebe[ğg]im ol)/iu;
const HATE_GROUP_RE = new RegExp(
  `${B_START}(yahudi|ermeni|suriyeli|afgan|kürt|türk|çingene|alevi|sünni|hristiyan|müslüman|ateist|e[şs]cinsel|escinsel)\\p{L}*`,
  'iu',
);
const HATE_INSULT_RE = new RegExp(
  `(a[şs]a[ğg][ıi]l[ıi]k|${B_START}pis${B_END}|i[ğg]renç|igrenc|${B_START}hain${B_END}|[şs]erefsiz|insan de[ğg]il|hepsi (ölsün|olsun|gitsin|yok olsun|defolsun))`,
  'iu',
);
const RELIGION_RE = new RegExp(
  `(${B_START}(allah|tanr[ıi]|peygamber|kuran|incil|tevrat)\\p{L}*\\s+(yalan|saçma|sacma|uydurma|yok(tur)?${B_END})|hangi din (do[ğg]ru|gerçek|gercek|hakl[ıi])|din(ler)? (saçmal[ıi]k|sacmalik|uydurma))`,
  'iu',
);
const POLITICS_RE = new RegExp(
  `(${B_START}akp${B_END}|${B_START}chp${B_END}|${B_START}mhp${B_END}|${B_START}hdp${B_END}|dem parti|iyi parti|zafer partisi|cumhurba[şs]kan|ba[şs]bakan|erdo[ğg]an|k[ıi]l[ıi]çdaro[ğg]lu|imamo[ğg]lu|seçim(i|ler(i|de)?)? kim kazan|${B_START}hükümet|${B_START}hukumet${B_END}|muhalefet|${B_START}siyaset|mecliste|milletvekil)`,
  'iu',
);
const VIOLENCE_RE =
  /((öldür|oldur)(eceğim|ecegim|mek istiyorum)|döv(eceğim|ecegim)|b[ıi]çaklayaca[ğg][ıi]m|vuraca[ğg][ıi]m(?=[^\p{L}]|$)|zarar verece[ğg]im (ona|onlara)|can[ıi]na okuyaca[ğg][ıi]m)/iu;
const ANIMAL_RE = new RegExp(`${B_START}(kedi|köpek|kopek|ku[şs]|hayvan|pati)\\p{L}*`, 'iu');
const ABUSE_RE =
  /(i[şs]kence|dövmek|dovmek|tekmele|zehirle(yece[ğg]im|mek|di[mk])?|yakaca[ğg][ıi]m|öldürece[ğg]im|oldurecegim|ac[ıi] çektir)/iu;
const HARASSMENT_RE = new RegExp(
  `(${B_START}orospu|${B_START}piç${B_END}|${B_START}pic${B_END}|${B_START}amk${B_END}|${B_START}aq${B_END}|yarra|${B_START}sikt|götveren|anan[ıi] sat)`,
  'iu',
);
const GAMBLING_RE = new RegExp(
  `((şansl[ıi]|sansli) (say[ıi]|numara)|${B_START}loto|sayısal loto|sayisal loto|${B_START}iddaa|bahis kuponu|at yar[ıi][şs][ıi].{0,15}tahmin|hangi tak[ıi]m kazan)`,
  'iu',
);

// --- A-2 EN desenleri (inputModerationService.ts:206-224) ---
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

function unionRe(a, b) {
  return new RegExp(`(?:${a.source})|(?:${b.source})`, 'iu');
}
const SEXUAL_ANY = unionRe(SEXUAL_RE, SEXUAL_RE_EN);
const CSAM_CHILD_ANY = unionRe(CSAM_CHILD_RE, CSAM_CHILD_RE_EN);
const HATE_GROUP_ANY = unionRe(HATE_GROUP_RE, HATE_GROUP_RE_EN);
const HATE_INSULT_ANY = unionRe(HATE_INSULT_RE, HATE_INSULT_RE_EN);
const ANIMAL_ANY = unionRe(ANIMAL_RE, ANIMAL_RE_EN);
const ABUSE_ANY = unionRe(ABUSE_RE, ABUSE_RE_EN);

const FULL_RULES = [
  {
    category: 'csam',
    test: (t) =>
      !FERTILITY_CONTEXT_RE.test(t) && !FERTILITY_CONTEXT_RE_EN.test(t) && nearEachOther(CSAM_CHILD_ANY, SEXUAL_ANY, t),
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
const DREAM_RULES = FULL_RULES.filter((rule) => ['csam', 'hate', 'harassment'].includes(rule.category));

// --- buildProbe (inputModerationService.ts:274) — sentinel U+0001 dahil ---
function buildProbe(text) {
  const cleaned = text.replace(/’/g, "'");
  const buffer = `${' '.repeat(60)}${' '.repeat(60)}`;
  return `${cleaned.toLocaleLowerCase('tr-TR')}${buffer}${cleaned.toLowerCase()}`;
}
function isCrisisText(normalized, context) {
  if (CRISIS_RE.test(normalized) || CRISIS_RE_EN.test(normalized)) return true;
  return context !== 'dream' && CRISIS_BROAD_RE.test(normalized);
}
// moderateUserInput verdict mantığı (replyText hariç).
function moderate(text, context) {
  const normalized = buildProbe(text);
  if (isCrisisText(normalized, context)) return 'crisis';
  const rules = context === 'dream' ? DREAM_RULES : FULL_RULES;
  for (const rule of rules) if (rule.test(normalized)) return rule.category;
  return 'allow';
}

// --- Test matrisi: { t: metin, c: bağlam, e: beklenen kategori, n: not } ---
const CASES = [
  // === A — KRİZ ===
  { t: 'intihar etmek istiyorum', c: 'question', e: 'crisis', n: 'TR niyet / tarot-astro-kahve initial' },
  { t: 'intihar etmek istiyorum', c: 'chat', e: 'crisis', n: 'TR niyet / kahve-el followup' },
  { t: 'intihar etmek istiyorum', c: 'dream', e: 'crisis', n: 'TR niyet / rüya (açık niyet rüyada da)' },
  { t: 'kendimi öldüreceğim', c: 'question', e: 'crisis', n: 'TR niyet' },
  { t: 'artık yaşamak istemiyorum', c: 'question', e: 'crisis', n: 'TR niyet' },
  { t: 'intihar', c: 'question', e: 'crisis', n: 'TR bare / tarot konu' },
  { t: 'intihar', c: 'chat', e: 'crisis', n: 'TR bare / kahve followup' },
  { t: 'intihar', c: 'dream', e: 'allow', n: 'TR bare / rüya DAR -> allow' },
  { t: 'keşke ölsem', c: 'question', e: 'crisis', n: 'TR geniş' },
  { t: 'ölmek istiyorum', c: 'question', e: 'crisis', n: 'TR geniş' },
  { t: 'ölmek istiyorum', c: 'dream', e: 'allow', n: 'TR geniş / rüya allow' },
  { t: 'I want to kill myself', c: 'question', e: 'crisis', n: 'EN / tarot initial' },
  { t: 'I want to kill myself', c: 'dream', e: 'crisis', n: 'EN niyet / rüya' },
  { t: 'I want to die', c: 'question', e: 'crisis', n: 'EN' },
  { t: 'I would be better off dead', c: 'chat', e: 'crisis', n: 'EN' },

  // === A-2 — CİNSEL ===
  { t: 'seks yapmak istiyorum seninle', c: 'question', e: 'sexual', n: 'TR cinsel' },
  { t: 'I want to watch porn', c: 'question', e: 'sexual', n: 'EN cinsel' },
  { t: 'rüyamda erotik bir sahne vardı', c: 'dream', e: 'allow', n: 'cinsel rüyada allow (DREAM_RULES dışı)' },

  // === A-2 — NEFRET (grup + aşağılama yakın) ===
  { t: 'bütün suriyeliler aşağılık insanlar', c: 'question', e: 'hate', n: 'TR nefret' },
  { t: 'kürtler hakkında normal bir soru', c: 'question', e: 'allow', n: 'grup tek başına -> allow (yakınlık yok)' },
  { t: 'all jews are vermin', c: 'chat', e: 'hate', n: 'EN nefret' },
  { t: 'rüyamda ermeniler şerefsizdi', c: 'dream', e: 'hate', n: 'nefret rüyada da bloklanır (DREAM_RULES içi)' },

  // === A-2 — ŞİDDET TEHDİDİ ===
  { t: 'onu öldüreceğim', c: 'question', e: 'violence_threat', n: 'TR şiddet' },
  { t: "i'm going to kill him", c: 'chat', e: 'violence_threat', n: 'EN şiddet' },
  { t: 'rüyamda birini öldüreceğim diye bağırdım', c: 'dream', e: 'allow', n: 'şiddet rüyada allow (DREAM_RULES dışı)' },

  // === A-2 — ŞANS OYUNU ===
  { t: 'bana şanslı loto sayıları ver', c: 'question', e: 'gambling', n: 'TR şans oyunu' },
  { t: 'give me lucky numbers for the lottery', c: 'question', e: 'gambling', n: 'EN şans oyunu' },

  // === A-2 — TACİZ / KÜFÜR ===
  { t: 'orospu çocuğu', c: 'chat', e: 'harassment', n: 'TR taciz' },
  { t: 'you are a fucking bitch', c: 'question', e: 'harassment', n: 'EN taciz' },

  // === A-2 — HAYVAN KÖTÜ MUAMELE (hayvan + abuse yakın) ===
  { t: 'kediye işkence etmek istiyorum', c: 'question', e: 'animal_abuse', n: 'TR hayvan' },

  // === A-2 — CSAM (çocuk + cinsel yakın; CSAM her bağlamda) ===
  { t: 'çocukla cinsel ilişki', c: 'question', e: 'csam', n: 'CSAM' },
  { t: 'çocukla cinsel ilişki', c: 'dream', e: 'csam', n: 'CSAM rüyada da MUTLAK blok' },
  { t: 'çocuğum olacak mı bu yıl', c: 'question', e: 'allow', n: 'doğurganlık -> CSAM değil (FERTILITY hariç)' },

  // === A-2 — DİN / SİYASET ===
  { t: 'allah yalan mı', c: 'question', e: 'religion', n: 'TR din tartışması' },
  { t: 'erdoğan hakkında ne düşünüyorsun', c: 'question', e: 'politics', n: 'TR siyaset' },

  // === TEMİZ (yanlış-pozitif kontrolü) ===
  { t: 'işimde terfi alacak mıyım', c: 'question', e: 'allow', n: 'temiz / iş' },
  { t: 'sevgilimle barışacak mıyız', c: 'question', e: 'allow', n: 'temiz / ilişki' },
  { t: 'bugün kendimi çok yorgun hissediyorum', c: 'chat', e: 'allow', n: 'temiz / yorgunluk' },
  { t: 'kariyerimde yeni bir başlangıç olacak mı', c: 'question', e: 'allow', n: 'temiz / başlangıç' },
  { t: 'I feel a little lost today', c: 'question', e: 'allow', n: 'temiz EN' },
  { t: 'annemle ilişkim nasıl gidecek', c: 'question', e: 'allow', n: 'temiz / aile' },
  { t: 'inşallah her şey yoluna girer', c: 'chat', e: 'allow', n: 'temiz / inşallah din-tetikleme yok' },
  { t: 'rüyamda denizde yüzüyordum çok huzurluydu', c: 'dream', e: 'allow', n: 'temiz rüya' },
];

let pass = 0;
const failures = [];
for (const k of CASES) {
  const got = moderate(k.t, k.c);
  if (got === k.e) pass += 1;
  else failures.push(`  [${k.c}] beklenen=${k.e} alınan=${got} :: "${k.t}" (${k.n})`);
}

console.log(`Moderasyon battery: ${pass}/${CASES.length} geçti.`);
if (failures.length) {
  console.error(`HATA: ${failures.length} vaka beklenenden farklı:`);
  console.error(failures.join('\n'));
  process.exitCode = 1;
} else {
  console.log('Tüm kriz + A-2 + temiz + rüya vakaları beklendiği gibi (TR+EN, question/chat/dream).');
}

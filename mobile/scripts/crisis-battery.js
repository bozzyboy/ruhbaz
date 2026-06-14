/* eslint-disable no-console */
// ============================================================
// Kriz tespiti BATTERY testi (K42 / R2) — Ozan talebi (21_ cihaz turu)
// ============================================================
// AMAÇ: Kriz girdisinin TÜM okuma bağlamlarında (tarot/kahve/el/astro/numeroloji =
// 'question'/'chat'; rüya = 'dream') ve TR+EN'de doğru yakalandığını CIHAZSIZ doğrular.
// Bağlam eşlemesi (moderateUserInput çağrı yerlerinden, 2026-06-14 doğrulandı):
//   - tarot initial+followup, astro initial+followup, numeroloji followup,
//     doğum-haritası followup, kahve/el INITIAL (focusQuestion) -> 'question'
//   - kahve/el followup, profil ad/ilişki -> 'chat'
//   - rüya INITIAL -> 'dream' (BİLİNÇLİ DAR: kâbus anlatımı bloklanmaz, yalnız
//     açık niyet yakalanır), rüya followup -> 'question'
//
// ⚠️ KAYNAK KOPYASI: Aşağıdaki 4 regex + buildProbe + isCrisisText,
// src/services/inputModerationService.ts ile BİREBİR aynı olmalı. Kriz regexleri
// orada değişirse buraya da yansıt (yoksa bu test yanıltır). Sync: 2026-06-14.

// --- inputModerationService.ts:130 ---
const CRISIS_RE_EN =
  /(kill(ing)? (myself|my self)|end (my|it all|my own) life|take my (own )?life|suicid(e|al)|want(ing)? to die|wanna die|don'?t want to (live|be here)|no reason to live|nothing to live for|better off dead|wish i (was|were) dead|hurt myself|harm myself|self[- ]?harm|cut myself|overdose)/i;

// --- inputModerationService.ts:134 ---
const CRISIS_RE =
  /(intihar (etmek istiyorum|edece[ğg]im|etmeyi dü[şs]ünüyorum)|kendimi öldür(mek istiyorum|eceğim|ecegim)|kendime zarar ver(mek istiyorum|eceğim|ecegim)|ya[şs]amak istemiyorum)/iu;

// --- inputModerationService.ts:140 ---
const CRISIS_BROAD_RE =
  /(\bintihar|can[ıi]ma k[ıi]y|kendimi as(?:mak|aca[ğg][ıi]m|ar[ıi]m)?|kendimi öldür|kendimi oldur|kendime zarar ver|hayat[ıi]ma son ver|ya[şs]amak istemiyor|ya[şs]amak iste(?:mem|miyom)|ölmek isti(?:yor|yom|yorum)|olmek isti(?:yor|yom|yorum)|ke[şs]ke öls|ke[şs]ke ols)/iu;

// --- inputModerationService.ts:274 (buildProbe) ---
function buildProbe(text) {
  const cleaned = text.replace(/’/g, "'");
  const buffer = `${' '.repeat(60)}${' '.repeat(60)}`;
  return `${cleaned.toLocaleLowerCase('tr-TR')}${buffer}${cleaned.toLowerCase()}`;
}

// --- inputModerationService.ts:285 (isCrisisText) ---
function isCrisisText(normalized, context) {
  if (CRISIS_RE.test(normalized) || CRISIS_RE_EN.test(normalized)) return true;
  return context !== 'dream' && CRISIS_BROAD_RE.test(normalized);
}

function isCrisis(text, context) {
  return isCrisisText(buildProbe(text), context);
}

// --- Test matrisi: { text, context, expect (true=kriz beklenir) } ---
const CASES = [
  // TR açık niyet -> HER bağlamda kriz (rüya dahil)
  { t: 'intihar etmek istiyorum', c: 'question', e: true, n: 'TR niyet / tarot-astro-kahve initial' },
  { t: 'intihar etmek istiyorum', c: 'chat', e: true, n: 'TR niyet / kahve-el followup' },
  { t: 'intihar etmek istiyorum', c: 'dream', e: true, n: 'TR niyet / rüya (açık niyet rüyada da yakalanır)' },
  { t: 'kendimi öldüreceğim', c: 'question', e: true, n: 'TR niyet' },
  { t: 'kendimi öldüreceğim', c: 'dream', e: true, n: 'TR niyet / rüya' },
  { t: 'artık yaşamak istemiyorum', c: 'question', e: true, n: 'TR niyet' },
  { t: 'intihar edeceğim', c: 'dream', e: true, n: 'TR niyet (edeceğim) / rüya' },

  // TR geniş/bare -> question/chat KRİZ, dream ALLOW (kâbus koruması)
  { t: 'intihar', c: 'question', e: true, n: 'TR bare intihar / tarot konu' },
  { t: 'intihar', c: 'chat', e: true, n: 'TR bare intihar / kahve followup' },
  { t: 'intihar', c: 'dream', e: false, n: 'TR bare intihar / rüya (dar -> allow)' },
  { t: 'keşke ölsem', c: 'question', e: true, n: 'TR geniş / keşke öls' },
  { t: 'keşke ölsem', c: 'dream', e: false, n: 'TR geniş / rüya allow' },
  { t: 'ölmek istiyorum', c: 'question', e: true, n: 'TR geniş / ölmek istiyorum' },
  { t: 'ölmek istiyorum', c: 'dream', e: false, n: 'TR geniş / rüya allow' },
  { t: 'canıma kıymak istiyorum', c: 'chat', e: true, n: 'TR geniş / canıma kıy' },

  // EN -> HER bağlamda kriz (CRISIS_RE_EN dil-bağımsız)
  { t: 'I want to kill myself', c: 'question', e: true, n: 'EN / tarot initial' },
  { t: 'I want to kill myself', c: 'dream', e: true, n: 'EN / rüya (EN niyet rüyada da)' },
  { t: 'I want to die', c: 'question', e: true, n: 'EN want to die' },
  { t: "I don't want to live anymore", c: 'chat', e: true, n: 'EN dont want to live' },
  { t: 'I would be better off dead', c: 'question', e: true, n: 'EN better off dead' },
  { t: 'thinking about suicide', c: 'question', e: true, n: 'EN suicide' },

  // TEMİZ / NORMAL -> her bağlamda ALLOW (yanlış-pozitif kontrolü)
  { t: 'işimde terfi alacak mıyım', c: 'question', e: false, n: 'temiz / iş' },
  { t: 'sevgilimle barışacak mıyız', c: 'question', e: false, n: 'temiz / ilişki' },
  { t: 'bugün kendimi çok yorgun hissediyorum', c: 'chat', e: false, n: 'temiz / yorgunluk' },
  { t: 'kariyerimde yeni bir başlangıç olacak mı', c: 'question', e: false, n: 'temiz / başlangıç (kriz değil)' },
  { t: 'I feel tired and a bit lost today', c: 'question', e: false, n: 'temiz EN' },
  { t: 'annemle ilişkim nasıl gidecek', c: 'question', e: false, n: 'temiz / aile' },

  // KÂBUS ANLATIMI (rüya) -> ALLOW (3. şahıs / geçmiş; açık niyet değil)
  { t: 'rüyamda biri kendini astı ve çok korktum', c: 'dream', e: false, n: 'kâbus 3.şahıs / rüya allow' },
  { t: 'rüyamda öldüğümü gördüm', c: 'dream', e: false, n: 'kâbus geçmiş / rüya allow' },
  { t: 'rüyamda bir cinayet işlendi', c: 'dream', e: false, n: 'kâbus / rüya allow' },
];

let pass = 0;
let fail = 0;
const failures = [];
for (const k of CASES) {
  const got = isCrisis(k.t, k.c);
  const ok = got === k.e;
  if (ok) pass += 1;
  else {
    fail += 1;
    failures.push(`  [${k.c}] beklenen=${k.e} alınan=${got} :: "${k.t}" (${k.n})`);
  }
}

console.log(`Kriz battery: ${pass}/${CASES.length} geçti.`);
if (fail) {
  console.error(`HATA: ${fail} vaka beklenenden farklı:`);
  console.error(failures.join('\n'));
  process.exitCode = 1;
} else {
  console.log('Tüm kriz/temiz/kâbus vakaları beklendiği gibi (TR+EN, question/chat/dream).');
}

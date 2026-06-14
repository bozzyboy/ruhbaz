/* eslint-disable no-console */
// GUVENLIK CEKIRDEGI BEKCISI (Faz 5.4)
//
// Korunan sozlesme: HER okuma servisinin sistem promptu getReadingSafetyCore() icermeli.
// getReadingSafetyCore = common.md "Safety And Boundaries" bolumu = tum okumalar icin TEK
// guvenlik kaynagi (olum/felaket yok, saglik/finans/hukuk/yatirim tavsiyesi yok,
// fal/kehanet/medyum/buyu kelime yasagi, kriz, kumar, din, siyaset, cinsel, ayrimcilik,
// 3. kisi iddiasi, insan-iddiasi). Yeni bir fal/okuma eklersen sistem promptuna bunu
// MUTLAKA kat ve asagidaki REQUIRED listesine yaz; aksi halde o okumada cikti rail'leri
// acik olmaz. Bu bekci eksigi build sirasinda yakalar.
//
// Calistir: node scripts/check-safety-core.js  (cwd: mobile)
const fs = require('fs');
const path = require('path');

const servicesDir = path.resolve(__dirname, '..', 'src', 'services');
const failures = [];
function must(condition, message) {
  if (!condition) failures.push(message);
}
function countMatches(src, re) {
  return (src.match(re) || []).length;
}

// 1) getReadingSafetyCore tanimi yerinde mi?
const commonPromptPath = path.join(servicesDir, 'readingCommonPrompt.ts');
const commonPromptSrc = fs.existsSync(commonPromptPath) ? fs.readFileSync(commonPromptPath, 'utf8') : '';
must(Boolean(commonPromptSrc), 'readingCommonPrompt.ts bulunamadi (tasindiysa bekciyi guncelle).');
must(
  /export function getReadingSafetyCore\s*\(/.test(commonPromptSrc),
  'getReadingSafetyCore() readingCommonPrompt.ts icinde export degil (yeniden adlandirildiysa bekciyi guncelle).',
);
must(
  commonPromptSrc.includes("extractSection(getCommonReadingIdentityBody(), 'Safety And Boundaries')"),
  'getReadingSafetyCore artik common.md Safety And Boundaries bolumunu cekmiyor; kaynak degismis, dogrula.',
);

// 2) Her okuma servisi guvenlik cekirdegini cagirmali. YENI OKUMA EKLERSEN BURAYA EKLE.
const REQUIRED = [
  'personalDivinationService.ts',
  'personalTarotService.ts',
  'dreamInterpretationService.ts',
  'readingPromptBuilder.ts',
  'astroEngine.ts',
  'personalNumerologyEngine.ts',
  'generalAstroApiService.ts',
];
for (const file of REQUIRED) {
  const filePath = path.join(servicesDir, file);
  const src = fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : '';
  must(Boolean(src), `Okuma servisi bulunamadi: ${file} (tasindiysa bekciyi guncelle).`);
  if (!src) continue;
  // Builder-basina sayim: paylasilan buildBaseSystem tek core cagrisiyla coklu system_instruction'u
  // kapsar; inline systemText kuran dosyada (astro gibi) HER system_instruction kendi core cagrisini
  // ister. Yalniz boolean "iceriyor mu" yetmez (astroEngine'de 4 cagri varken 3 prompt cekirdeksiz kalmisti).
  const siCount = countMatches(src, /system_instruction\s*:/g);
  const coreCount = countMatches(src, /getReadingSafetyCore\(/g);
  const baseCount = countMatches(src, /buildBaseSystem\(/g);
  must(coreCount >= 1, `${file}: getReadingSafetyCore() hic cagrilmiyor. Okuma sistem promptuna guvenlik cekirdegini ekle.`);
  must(
    siCount <= coreCount + baseCount,
    `${file}: ${siCount} system_instruction kurulurken yalniz ${coreCount} getReadingSafetyCore cagrisi var (+${baseCount} buildBaseSystem). Inline systemText kuran her okuma promptuna getReadingSafetyCore ekle.`,
  );
}

// 3) Heuristik gelecek-korumasi: system_instruction kuran ama ne REQUIRED'da ne ALLOWLIST'te
// olan bir dosya = listeye yazilmamis yeni okuma olabilir. Yeni fal eklenip unutulursa burada cikar.
const ALLOWLIST = new Set([
  ...REQUIRED,
  'readingApiService.ts', // okuma = buildReadingPrompt (cekirdek orada); length-repair = ayni promptu kullanir; classify = okuma degil
  'memoryAnalysisService.ts', // okuma degil: transcript analizi
  'memoryWriterDebugService.ts', // debug araci, kullaniciya okuma uretmez
]);
for (const file of fs.readdirSync(servicesDir)) {
  if (!file.endsWith('.ts')) continue;
  const src = fs.readFileSync(path.join(servicesDir, file), 'utf8');
  if (!/system_instruction\s*:/.test(src)) continue;
  if (ALLOWLIST.has(file)) continue;
  failures.push(
    `${file}: system_instruction kuruyor ama guvenlik-cekirdegi listesinde yok. Yeni okuma ise getReadingSafetyCore() ekle + REQUIRED listesine yaz; okuma degilse gerekceyle ALLOWLIST listesine ekle.`,
  );
}

if (failures.length) {
  console.error('GUVENLIK CEKIRDEGI IHLALI:');
  failures.forEach((message) => console.error(`- ${message}`));
  process.exit(1);
}
console.log('Guvenlik cekirdegi kontrolu gecti (tum okuma promptlari getReadingSafetyCore iceriyor).');

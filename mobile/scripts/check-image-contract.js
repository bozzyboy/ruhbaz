/* eslint-disable no-console */
// GÖRSEL UYGUNLUK SÖZLEŞMESİ BEKÇİSİ (Ozan kuralı, 2026-06-11)
//
// Korunan sözleşme:
//  1) Kahve/el/pati görsel uygunluk kararını YALNIZ LLM sınıflandırması verir;
//     slot adı, dosya adı, OCR, renk/piksel analizi veya sabit heuristik YASAK.
//  2) Kahve: görseller sıra/slot bağımsız; 1-3 görsel herhangi bir karışımda
//     (fincan / tabak / fincan+tabak). EN AZ 1 telveli görsel yeterli;
//     telvesiz/alakasız ek kareler okumayı düşürmez.
//  3) El: insan avuç içi + parmaklar kabul; el sırtı/dış yüz reddedilir.
//  4) Pati: hayvan uzvu yeterli — patinin altı/üstü, pençe, tırnaklı ayak,
//     kuş/sürüngen ayağı; hayvan türü fark etmez.
//  5) Fincan/tabak üzerindeki baskı, desen, marka, üretim süsü ASLA yorumlanmaz;
//     yalnız telve/kahve izi yorumlanır.
//  6) Birden fazla kahve karesi AYNI fincanın/tabağın farklı açıları olarak
//     okunur (ayrı kahveler gibi değil).
//
// Çalıştır: node scripts/check-image-contract.js  (cwd: mobile)
// Bu script check-turkish-utf8.js gibi her değişiklikte koşar (Claude hook + commit öncesi).
const fs = require('fs');
const path = require('path');

const TARGET = path.resolve(__dirname, '..', 'src', 'services', 'fortuneApiService.ts');
const failures = [];

if (!fs.existsSync(TARGET)) {
  console.error(`Sözleşme bekçisi: hedef dosya yok: ${TARGET}`);
  process.exit(1);
}
const src = fs.readFileSync(TARGET, 'utf8');

function must(condition, message) {
  if (!condition) failures.push(message);
}

function sliceBetween(startMarker, endMarker) {
  const start = src.indexOf(startMarker);
  if (start < 0) return null;
  const end = endMarker ? src.indexOf(endMarker, start) : src.length;
  return src.slice(start, end < 0 ? src.length : end);
}

// --- Yapı: LLM yolu korunmuş mu? ---
const coffeeValidate = sliceBetween('async function validateCoffeeImages', 'async function classifyPalmImage');
const palmValidate = sliceBetween('async function validatePalmImage', 'function trimMisalignedTail');

must(Boolean(coffeeValidate), 'validateCoffeeImages fonksiyonu bulunamadı (yeniden adlandırıldıysa bekçiyi de güncelle).');
must(Boolean(palmValidate), 'validatePalmImage fonksiyonu bulunamadı (yeniden adlandırıldıysa bekçiyi de güncelle).');
must(Boolean(coffeeValidate && coffeeValidate.includes('classifyCoffeeImage(')), 'Kahve uygunluğu LLM sınıflandırmasından (classifyCoffeeImage) geçmiyor.');
must(Boolean(palmValidate && palmValidate.includes('classifyPalmImage(')), 'El/pati uygunluğu LLM sınıflandırmasından (classifyPalmImage) geçmiyor.');
must(src.includes('await validateCoffeeImages('), 'Kahve okuma başlangıcı validateCoffeeImages çağırmıyor (ana yol kopmuş).');
must(src.includes('await validatePalmImage('), 'El/pati okuma başlangıcı validatePalmImage çağırmıyor (ana yol kopmuş).');

// --- Sözleşme işaretleri (bilinçli silinirse bekçi de bilinçli güncellenmeli) ---
['SÖZLEŞME-GÖRSEL-1', 'SÖZLEŞME-GÖRSEL-2', 'SÖZLEŞME-GÖRSEL-3', 'SÖZLEŞME-GÖRSEL-4'].forEach((marker) => {
  must(src.includes(marker), `${marker} işareti kayıp — sözleşme bölgesi değiştirilmiş; kuralların hâlâ geçerli olduğunu doğrula ve işareti geri koy.`);
});

// --- Kahve: "en az 1 telveli yeter" yapısı ---
if (coffeeValidate) {
  const earlyReturn = coffeeValidate.indexOf('return { surfaces, analyses, usage }');
  const groundlessThrow = coffeeValidate.indexOf('groundlessLabels.join');
  must(earlyReturn >= 0, 'validateCoffeeImages: geçerli telveli görsel varken erken dönüş (return { surfaces, analyses, usage }) kayıp.');
  must(
    earlyReturn >= 0 && (groundlessThrow < 0 || earlyReturn < groundlessThrow),
    'validateCoffeeImages: telvesiz-kare reddi, "en az 1 telveli yeter" erken dönüşünden ÖNCE çalışıyor — tek telvesiz kare tüm okumayı düşürür (yasak).',
  );
}

// --- Kahve prompt'u: sıra/slot bağımsızlık + bir damla telve garantileri ---
must(src.includes('yükleme alanı adına göre karar verme'), "Kahve sınıflandırma prompt'undan 'yükleme alanı adına göre karar verme' garantisi silinmiş (slot bağımsızlığı).");
must(src.includes('bir damla telve bile true'), "Kahve sınıflandırma prompt'undan 'bir damla telve bile true' garantisi silinmiş.");

// --- El/pati prompt'u: avuç içi + pati altı/üstü/pençe esnekliği ---
must(src.includes('avuç içi ve parmaklar görünüyorsa'), "El sınıflandırma prompt'undan 'avuç içi ve parmaklar' tanımı silinmiş.");
must(src.includes('ALTI da ÜSTÜ'), "Pati prompt'undan 'patinin ALTI da ÜSTÜ/sırtı da' esnekliği silinmiş.");
must(src.includes('pençe'), "Pati prompt'undan 'pençe' kabulü silinmiş.");
must(src.includes('hangi hayvana ait olursa olsun'), "Pati prompt'undan 'hangi hayvana ait olursa olsun' esnekliği silinmiş.");

// --- Bilinen ayak-vuran desenler (geri gelmesinler) ---
must(!src.includes('isInnerPalm === true'), "Katı 'isInnerPalm === true' kontrolü geri gelmiş — undefined'da sahte red üretir; 'isInnerPalm !== false' kullan.");
// Yorum satırları desen taramasına girmesin (sözleşme yorumları "OCR" gibi
// yasaklı kelimeleri açıklama amacıyla içerir); profileName gibi adlar da
// yanlış-pozitif vermesin diye kelime sınırı zorunlu.
const classifyRegionRaw = sliceBetween('async function classifyCoffeeImage', 'function trimMisalignedTail') || '';
const classifyRegion = classifyRegionRaw
  .split('\n')
  .filter((line) => !line.trim().startsWith('//'))
  .join('\n');
[/if\s*\(\s*slot\s*===/, /\bfile_?name\b/i, /\bOCR\b/, /getPixel/i, /tesseract/i].forEach((pattern) => {
  must(!pattern.test(classifyRegion), `Uygunluk bölgesinde deterministik kontrol deseni bulundu (${pattern}) — karar yalnız LLM'de olmalı.`);
});
[/maxOutputTokens:\s*(\d{1,2}|1\d{2}|2[0-4]\d)\b/].forEach((pattern) => {
  const match = classifyRegion.match(pattern);
  must(!match, `Sınıflandırma çağrısında dar token bütçesi (${match && match[0]}) — JSON kırpılıp sahte red üretir; en az 250 olmalı.`);
});

// --- Okuma prompt'ları: baskı/desen yasağı + "aynı fincanın farklı açıları" ---
const PROMPT_BUILDER = path.resolve(__dirname, '..', 'src', 'services', 'fortunePromptBuilder.ts');
const COMMON_PROMPT = path.resolve(__dirname, '..', 'src', 'services', 'fortuneCommonPrompt.ts');
const builderSrc = fs.existsSync(PROMPT_BUILDER) ? fs.readFileSync(PROMPT_BUILDER, 'utf8') : '';
const commonSrc = fs.existsSync(COMMON_PROMPT) ? fs.readFileSync(COMMON_PROMPT, 'utf8') : '';
must(Boolean(builderSrc), 'fortunePromptBuilder.ts bulunamadı (taşındıysa bekçiyi güncelle).');
must(Boolean(commonSrc), 'fortuneCommonPrompt.ts bulunamadı (taşındıysa bekçiyi güncelle).');
must(
  builderSrc.includes('farklı açılardan çekilmiş kareleri olarak kabul et'),
  "Okuma prompt'undan 'birden fazla kare = aynı fincanın farklı açıları' kuralı silinmiş (fortunePromptBuilder).",
);
must(
  builderSrc.includes('üretim desenleri') && builderSrc.includes('yorum unsuru değildir'),
  "Okuma prompt'undan 'fincan/tabak üzerindeki üretim desenleri yorum unsuru değildir' yasağı silinmiş (fortunePromptBuilder).",
);
must(
  commonSrc.includes('baskı/dekorları, markaları veya aksesuarları yorum kanıtı yapma'),
  "Ortak prompt'tan 'hazır baskı/dekor/marka yorum kanıtı yapılmaz' yasağı silinmiş (fortuneCommonPrompt).",
);

if (failures.length) {
  console.error('GÖRSEL UYGUNLUK SÖZLEŞMESİ İHLALİ:');
  failures.forEach((message) => console.error(`- ${message}`));
  process.exit(1);
}
console.log('Görsel uygunluk sözleşmesi kontrolü geçti.');

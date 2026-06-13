// ============================================================
// Ruhbaz Konağı - Çıktı dili direktifi (Faz 4.5 / I-9)
// ============================================================
// Sorun: EN modda persona gövdesi İngilizce üretilse de, kişisel okuma prompt'larının
// gövdesi (runtime kuralları, hafıza bağlamı, bağlam etiketleri) Türkçe kalıyor ve
// modeli Türkçe yazmaya çekiyordu (yalnız kapanış cümlesi EN geliyordu).
//
// Çözüm: EN modda ÇOK GÜÇLÜ, öncelikli bir çıktı-dili direktifi sistem talimatının
// EN BAŞINA (en yüksek dikkat) ve kullanıcı turunun SONUNA (recency) eklenir. Bu,
// generalAstroApiService'te kanıtlanmış "EN sistem önsözü + 'Write in English' kuyruğu"
// yaklaşımının güçlendirilmiş, paylaşılan hâlidir.
//
// REGRESYON GÜVENCESİ: TR modda her iki fonksiyon da '' döner → Türkçe okuma akışı
// (Faz 1-3) HİÇ değişmez; yalnız EN mod yeni direktifi alır.

import { getAppLanguage } from '../i18n';

/** EN modda sistem talimatının EN BAŞINA konacak güçlü çıktı-dili direktifi (TR'de ''). */
export function enOutputLanguageSystemDirective(): string {
  if (getAppLanguage() !== 'en') return '';
  return [
    '# OUTPUT LANGUAGE — HIGHEST PRIORITY',
    "The user's app language is English. Your ENTIRE user-visible response MUST be written in natural, fluent English.",
    'Some structural directives below may be written in Turkish for internal brevity — follow their MEANING, but NEVER output Turkish to the user. Do not mix Turkish words, section labels or phrases into the reading.',
    'Keep the vocabulary of "symbolic reading / interpretation / reflection"; never call yourself a fortune teller or psychic, and stay in the language of possibility, not promises.',
  ].join('\n');
}

/** EN modda kullanıcı turunun/önemli blokların SONUNA konacak pekiştirici hatırlatma (TR'de ''). */
export function enOutputLanguageUserTurnReminder(): string {
  if (getAppLanguage() !== 'en') return '';
  return 'Write your entire response in natural, fluent English. Do not output any Turkish words.';
}

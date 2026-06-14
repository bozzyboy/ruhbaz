import { getAppLanguage } from '../i18n';

export const FOLLOW_UP_CHAT_CONTRACT = [
  '- Bu tur yeni bir okuma açılışı değildir; önceki okuma metnini yeniden yazma, özetleme veya kopyalama.',
  '- Yalnızca kullanıcının son mesajındaki soruya doğrudan cevap ver.',
  '- Yeniden selamlama yapma; "Merhaba", "Selam", "Hoş geldin" gibi açılışlar veya isimle yeniden hitap kullanma.',
  '- Önceki okumayı sadece bağlam olarak kullan; görseli veya ana yorumu baştan yorumlamaya çalışma.',
  '- Yanıtı kısa ama doyurucu tut: önce net cevap, sonra okuma bağlamından 1-2 gerekçe ve uygulanabilir küçük tavsiye ver.',
  '- Kullanıcının son mesajında önceki okumanın transkripsiyonu yanlışlıkla varsa onu yok say ve gerçek soruya odaklan.',
].join('\n');

export function cleanFollowUpReply(text: string) {
  let cleaned = (text || '')
    .replace(/^\s*(?:merhaba|selam|selamlar|hey|hoş\s*geldin|hoş\s*gelmişsin)(?:\s+[\p{L}.'-]{2,24})?\s*[,!.:-]?\s*/iu, '')
    .replace(/^\s*(?:canım|tatlım|güzelim|evladım|yavrum)(?:\s+[\p{L}.'-]{2,24})?\s*[,!.:-]?\s*/iu, '')
    .replace(/\b(hoş\s*geldin|hoş\s*gelmişsin|bakalım|bakıyorum|hemen\s+bak|yeniden\s+bakalım|yeniden\s+bakalım\s+canım)\b[,.! ]*/giu, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
  const sentences = cleaned.split(/(?<=[.!?])\s+/).filter(Boolean);
  while (
    sentences.length > 1 &&
    /^(?:merhaba|selam|selamlar|hoş\s*geldin|hoş\s*gelmişsin|yeniden\s+bakalım|bakalım)\b/i.test(sentences[0])
  ) {
    sentences.shift();
  }
  cleaned = sentences.join(' ').trim() || cleaned;
  return cleaned;
}

// Sosyal-kapanış mesajları (teşekkür / sağ ol / thanks) — bunlara koca yorum yerine
// kısa "rica ederim" denir. Yaklaşım: mesajdan sosyal-kapanış + dolgu token'larını
// ÇIKAR, geriye anlamlı kelime kalırsa (gerçek soru) ASLA yakalama. Bu, "teşekkürler
// peki ya işim?" gibi karışık mesajların yanlışlıkla yakalanmasını önler.
const SOCIAL_CLOSING_TOKENS = [
  // TR — teşekkür
  'çok teşekkür ederim', 'çok teşekkür ederiz', 'çok teşekkürler', 'teşekkür ederim',
  'teşekkür ederiz', 'teşekkür ettim', 'teşekkürler', 'teşekkür', 'tesekkur ederim',
  'tesekkur ederiz', 'tesekkurler', 'tesekkur', 'teşekürler', 'teşekur',
  // TR — sağ ol
  'çok sağ ol', 'sağ olasın', 'sağ ol', 'sağolasın', 'sağol', 'sağ olun', 'sağolun',
  'sag olasin', 'sag ol', 'sagolasin', 'sagol', 'sag olun', 'sagolun',
  // TR — diğer şükran / onay
  'eyvallah', 'eyvalla', 'minnettarım', 'minnettarim', 'minnettar',
  'ellerine sağlık', 'eline sağlık', 'ellerinize sağlık', 'elinize sağlık',
  'ellerine saglik', 'eline saglik', 'allah razı olsun', 'allah razi olsun',
  'tamamdır', 'tamamdir', 'tamam', 'tmm', 'peki', 'anladım', 'anladim', 'olur', 'oldu',
  // EN
  'thank you so much', 'thank you very much', 'thanks so much', 'thanks a lot',
  'thank you', 'thank u', 'thanks', 'thx', 'tysm', 'ty', 'appreciate it',
  'much appreciated', 'appreciated', 'cheers', 'got it', 'understood',
  'okay', 'alright', 'ok',
];
// Token'ların arasını dolduran ama tek başına anlam taşımayan kelimeler.
const SOCIAL_FILLER_TOKENS = [
  'çok', 'cok', 'ya', 'be', 'valla', 'vallahi', 'vallaha', 'ee', 'eh',
  'sana', 'size', 'canım', 'canim', 'dostum', 'kardeşim', 'kardesim', 'hocam',
  'really', 'so', 'very', 'much', 'then', 'well', 'again', 'and', 'for', 'that',
];

function isSocialClosingOnly(userText: string): boolean {
  const raw = (userText || '').trim();
  if (!raw || raw.length > 80) return false;
  // Soru işareti içeren mesajlar neredeyse her zaman gerçek sorudur.
  if (raw.includes('?')) return false;
  // Harf ve boşluk dışındaki her şeyi (noktalama, emoji, rakam) boşluğa çevir.
  let cleaned = raw.toLocaleLowerCase('tr-TR').replace(/[^\p{L}\s]+/gu, ' ').replace(/\s+/g, ' ').trim();
  if (!cleaned) return false;
  const tokens = [...SOCIAL_CLOSING_TOKENS, ...SOCIAL_FILLER_TOKENS].sort((a, b) => b.length - a.length);
  let buf = ' ' + cleaned + ' ';
  let prev = '';
  while (buf !== prev) {
    prev = buf;
    for (const tok of tokens) {
      buf = buf.split(' ' + tok + ' ').join(' ');
    }
    buf = ' ' + buf.replace(/\s+/g, ' ').trim() + ' ';
  }
  return buf.trim() === '';
}

export function getSimpleFollowUpReply(userText: string) {
  if (!isSocialClosingOnly(userText)) return '';
  if (getAppLanguage() === 'en') {
    return 'You are welcome — we can stay here; if you want to open another part, just tell me and I will continue.';
  }
  return 'Rica ederim, burada kalalım; başka bir yerini açmak istersen son soruna göre devam ederim.';
}

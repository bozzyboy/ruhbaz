import { COMMON_READING_IDENTITY_BODY } from './readingPersonaData';
import { getCommonReadingIdentityBody } from './personaDataI18n';

type ReadingCommonDomain = 'coffee' | 'palm' | 'paw' | 'general';

function stripMarkdownSection(body: string, heading: string) {
  const escaped = heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return body
    .replace(new RegExp(`# ${escaped}\\n\\n[\\s\\S]*?(?=\\n\\n# |$)`, 'g'), '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function extractSection(body: string, heading: string) {
  const escaped = heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return body.match(new RegExp(`(# ${escaped}\\n\\n[\\s\\S]*?)(?:\\n\\n# |$)`))?.[1]?.trim() || '';
}

export const COMMON_READING_GUARDRAIL_BODY = stripMarkdownSection(
  stripMarkdownSection(COMMON_READING_IDENTITY_BODY, 'Vision Protocol'),
  'Implementation Notes',
);

/** Dil-duyarlı guardrail gövdesi (Faz 4): aktif dil EN ise common.en.md kaynaklı. */
export function getCommonReadingGuardrailBody(): string {
  return stripMarkdownSection(
    stripMarkdownSection(getCommonReadingIdentityBody(), 'Vision Protocol'),
    'Implementation Notes',
  );
}

/**
 * CANLI GÜVENLİK ÇEKİRDEĞİ (Faz 5.4) — common.md'nin yalnız "Safety And Boundaries" bölümü.
 * TÜM okuma sistem prompt'larına (ilk okuma + takip) eklenir; tek güvenlik kaynağıdır:
 * ölüm/felaket yok, sağlık/finans/hukuk/yatırım tavsiyesi yok, fal/kehanet/medyum/büyü kelime
 * yasağı, kriz, kumar, din, siyaset, cinsel, ayrımcılık/nefret, 3. kişi iddiası, insan-iddiası.
 * Dil-duyarlı (EN'de common.en.md, item 24 İngilizce-dili dahil).
 * YENİ BİR FAL/OKUMA TÜRÜ EKLERSEN: o servisin sistem prompt'una bunu MUTLAKA kat
 * (scripts/check-safety-core.js bekçisi eksik olanı build'de yakalar).
 */
export function getReadingSafetyCore(): string {
  return extractSection(getCommonReadingIdentityBody(), 'Safety And Boundaries');
}

function coffeeVisionProtocol() {
  return [
    '## Kahve Görsel Protokolü',
    '- Görsel kahve okumasına uygunsa fincan, tabak veya fincan+tabak yüzeyindeki telve, kahve lekesi, akıntı, damla ve göllenme izlerini somut görüntüye bağlayarak yorumla.',
    '- Fincan iç dünya, duygu akışı ve zihinsel alan; tabak dış dünya, zemine düşen izler ve çevresel etki olarak ayrışır. Görünmeyen yüzeyi varmış gibi anlatma.',
    '- Birden fazla görsel varsa bunları ayrı içilmiş kahveler gibi değil, aynı kahvenin veya aynı fincan/tabak setinin farklı açıları ve tamamlayıcı kanıtları gibi birleştir.',
    '- Arka planı, masa/kumaş desenlerini, hazır baskı/dekorları, markaları veya aksesuarları yorum kanıtı yapma.',
  ].join('\n');
}

function palmVisionProtocol() {
  return [
    '## Avuç İçi Görsel Protokolü',
    '- Görsel insan avuç içiyse yorumu avuç içi çizgileri, çizgi yönleri, kırılmalar, yumuşak/sert alanlar, parmak yerleşimi ve el formu üzerinden kur.',
    '- Görünüyorsa klasik el okuması terimlerini doğal biçimde kullan: kalp çizgisi, baş/akıl çizgisi, hayat/yaşam çizgisi, kader çizgisi; Venüs tepesi, Jüpiter tepesi, Satürn tepesi, Güneş/Apollo tepesi, Merkür tepesi, Ay tepesi ve Mars alanları.',
    '- Venüs tepesi, Jüpiter tepesi ve Ay tepesi gibi adlar astroloji yorumu değildir; avuç içindeki tepe/alan adlarıdır ve el okumasında kullanılabilir.',
    '- Arka planı, masa/kumaşı, takıyı, oje/deseni, aksesuarı veya hazır çizim/baskıları yorum kanıtı yapma.',
    '- Görsel insan avuç içi değilse okuma üretme; gördüklerini uzatmadan en fazla 1-2 kısa cümleyle avuç içi fotoğrafı iste.',
    '- Başka okuma araçlarının yüzeyi gibi davranma; yalnızca avuç içi formu ve doğal çizgi/iz akışını kullan.',
  ].join('\n');
}

function pawVisionProtocol() {
  return [
    '## Pati Görsel Protokolü',
    '- Görsel gerçek pati veya hayvan ayağıysa yorumu pati formu, doğal kıvrımlar, basış izi, yastıkçık yerleşimi ve görünür doğal izler üzerinden kur.',
    '- Hayvanı insan hayatı şablonuna çevirme; mizaç, güven, oyun/dinlenme ritmi, duyular, ev içi alan ve sahibiyle bağ üzerinden konuş.',
    '- Arka planı, zemin desenini, aksesuarı veya hazır çizim/baskıları yorum kanıtı yapma.',
    '- Görsel gerçek pati veya hayvan ayağı değilse okuma üretme; gördüklerini uzatmadan en fazla 1-2 kısa cümleyle uygun pati/ayak fotoğrafı iste.',
  ].join('\n');
}

export function commonReadingPromptForDomain(domain: ReadingCommonDomain) {
  const vision =
    domain === 'coffee'
      ? coffeeVisionProtocol()
      : domain === 'palm'
        ? palmVisionProtocol()
        : domain === 'paw'
          ? pawVisionProtocol()
          : '';
  return [vision, getCommonReadingGuardrailBody()].filter(Boolean).join('\n\n');
}

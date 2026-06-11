// ============================================================
// Ruhbaz Konağı - Analitik İskeleti (K34, Faz 2)
// ============================================================
// İLKELER (bağlayıcı):
// 1. İçerik ve hafıza ASLA gönderilmez — event'ler yalnız anonim sayım/etiket taşır
//    (okuma türü, kategori adı gibi); kullanıcı metni, yorum metni, profil verisi YASAK.
// 2. Rıza kapısı: kullanıcı analitik rızası vermeden hiçbir şey gönderilmez
//    (varsayılan: KAPALI). Rıza UI'ı aydınlatma metniyle birlikte gelir (avukat sonrası).
// 3. Araç seçimi (PostHog / Firebase / Aptabase) = blok: Ozan. Seçilince yalnız
//    aşağıdaki AnalyticsTransport implementasyonu yazılır; çağrı noktaları değişmez.
//
// Şu an taşıyıcı NO-OP: event'ler cihazda küçük bir halka tamponda tutulur
// (geliştirme/doğrulama için) ve hiçbir yere gönderilmez.

import * as FileSystem from 'expo-file-system/legacy';

const DATA_DIR = `${FileSystem.documentDirectory}falci-data/`;
const ANALYTICS_FILE = `${DATA_DIR}analytics-local.json`;
const MAX_BUFFERED_EVENTS = 500;

/** Anonim event şeması — funnel / retention / satın alma (K34). */
export type AnalyticsEvent =
  | { name: 'app_open' }
  | { name: 'onboarding_consent_accepted' }
  | { name: 'reading_started'; readingKind: string }
  | { name: 'reading_completed'; readingKind: string }
  | { name: 'follow_up_sent'; readingKind: string }
  | { name: 'moderation_blocked'; category: string }
  | { name: 'paywall_shown' }
  | { name: 'purchase_initiated'; productId: string }
  | { name: 'purchase_completed'; productId: string }
  | { name: 'backup_exported' }
  | { name: 'backup_restored' }
  | { name: 'data_wiped' };

type StoredEvent = AnalyticsEvent & { at: string };

type AnalyticsState = {
  schemaVersion: 1;
  /** Kullanıcı rızası: null = henüz sorulmadı, false = reddetti, true = verdi. */
  consent: boolean | null;
  events: StoredEvent[];
};

/** Gerçek araç bağlanınca yazılacak arayüz (PostHog/Firebase/Aptabase adaptörü). */
export interface AnalyticsTransport {
  send(event: StoredEvent): Promise<void>;
}

let transport: AnalyticsTransport | null = null;

export function setAnalyticsTransport(next: AnalyticsTransport | null) {
  transport = next;
}

const EMPTY_STATE: AnalyticsState = { schemaVersion: 1, consent: null, events: [] };

async function readState(): Promise<AnalyticsState> {
  try {
    const info = await FileSystem.getInfoAsync(ANALYTICS_FILE);
    if (!info.exists) return { ...EMPTY_STATE };
    const raw = JSON.parse(await FileSystem.readAsStringAsync(ANALYTICS_FILE)) as Partial<AnalyticsState>;
    return {
      schemaVersion: 1,
      consent: typeof raw.consent === 'boolean' ? raw.consent : null,
      events: Array.isArray(raw.events) ? raw.events.slice(-MAX_BUFFERED_EVENTS) : [],
    };
  } catch {
    return { ...EMPTY_STATE };
  }
}

async function writeState(state: AnalyticsState) {
  const dirInfo = await FileSystem.getInfoAsync(DATA_DIR);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(DATA_DIR, { intermediates: true });
  }
  await FileSystem.writeAsStringAsync(ANALYTICS_FILE, JSON.stringify(state));
}

export async function getAnalyticsConsent(): Promise<boolean | null> {
  return (await readState()).consent;
}

export async function setAnalyticsConsent(consent: boolean): Promise<void> {
  const state = await readState();
  state.consent = consent;
  if (!consent) {
    state.events = []; // rıza geri çekilirse yerel tampon da temizlenir
  }
  await writeState(state);
}

/**
 * Event kaydı. Ateşle-unut: çağıran akışı asla bloklamaz/bozmaz.
 * Rıza yoksa yalnız yerel tamponda tutulur (gönderim yok); gerçek taşıyıcı
 * bağlıyken ve rıza varken transport.send çağrılır.
 */
export function trackEvent(event: AnalyticsEvent): void {
  void (async () => {
    try {
      const state = await readState();
      const stored: StoredEvent = { ...event, at: new Date().toISOString() };
      state.events = [...state.events, stored].slice(-MAX_BUFFERED_EVENTS);
      await writeState(state);
      if (state.consent === true && transport) {
        await transport.send(stored);
      }
    } catch {
      // analitik asla ürün akışını bozmaz
    }
  })();
}

/** Geliştirme/doğrulama: yerel tampondaki son event'ler. */
export async function getBufferedEvents(): Promise<StoredEvent[]> {
  return (await readState()).events;
}

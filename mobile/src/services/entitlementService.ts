// ============================================================
// Ruhbaz Konağı - Seans Hakkı Servisi (Faz 2 İSKELETİ)
// ============================================================
// Token ledger (maliyet sayacı) AYRI kalır; bu servis "hak" (seans kredisi) sayar.
//
// ⚠️ K51 NOTU (bağlayıcı, 04/4.8): Değerli/parasal hak NORMALDE sunucudaki hesapta
// tutulur; silip-kurma istismarını cihaz-içi kayıt ÖNLEYEMEZ. Şu an hesap sistemi /
// sunucu tarafı olmadığı için iskelet cihazda yaşıyor. RELEASE ÖNCESİ:
// (a) doğrulanmış hesap + sunucu-taraflı bakiye, VEYA (b) Google Play'in kendi
// introductory offer mekanizması karara bağlanmalı (avukat/K43 ile birlikte).
//
// Uygulama (enforcement) ENTITLEMENT_ENFORCEMENT_ENABLED ile KAPALI:
// IAP ürünleri bağlanana kadar hiçbir okuma akışı kısıtlanmaz.

import * as FileSystem from 'expo-file-system/legacy';
import {
  ENTITLEMENT_ENFORCEMENT_ENABLED,
  FREE_INTRO_SESSION_CREDITS,
  SESSION_PACKAGES,
} from '../config/sessionPackages';

const DATA_DIR = `${FileSystem.documentDirectory}falci-data/`;
const ENTITLEMENT_FILE = `${DATA_DIR}entitlements.json`;

export type EntitlementGrantSource = 'iap' | 'intro' | 'promo' | 'refund';

export type EntitlementEvent = {
  at: string;
  kind: 'grant' | 'consume';
  amount: number;
  source?: EntitlementGrantSource;
  /** IAP işlem referansı / okuma türü gibi serbest bağlam. */
  ref?: string;
};

export type EntitlementState = {
  schemaVersion: 1;
  credits: number;
  freeIntroGranted: boolean;
  events: EntitlementEvent[];
};

const EMPTY_STATE: EntitlementState = {
  schemaVersion: 1,
  credits: 0,
  freeIntroGranted: false,
  events: [],
};

const MAX_EVENTS = 200;

async function ensureDir() {
  const info = await FileSystem.getInfoAsync(DATA_DIR);
  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(DATA_DIR, { intermediates: true });
  }
}

async function readState(): Promise<EntitlementState> {
  try {
    const info = await FileSystem.getInfoAsync(ENTITLEMENT_FILE);
    if (!info.exists) return { ...EMPTY_STATE };
    const raw = JSON.parse(await FileSystem.readAsStringAsync(ENTITLEMENT_FILE)) as Partial<EntitlementState>;
    return {
      schemaVersion: 1,
      credits: Number.isFinite(raw.credits as number) ? Math.max(0, Number(raw.credits)) : 0,
      freeIntroGranted: Boolean(raw.freeIntroGranted),
      events: Array.isArray(raw.events) ? raw.events.slice(-MAX_EVENTS) : [],
    };
  } catch {
    return { ...EMPTY_STATE };
  }
}

async function writeState(state: EntitlementState) {
  await ensureDir();
  await FileSystem.writeAsStringAsync(ENTITLEMENT_FILE, JSON.stringify(state, null, 2));
}

function pushEvent(state: EntitlementState, event: EntitlementEvent) {
  state.events = [...state.events, event].slice(-MAX_EVENTS);
}

export async function getEntitlementState(): Promise<EntitlementState> {
  return readState();
}

/** İlk gerçek kullanımda bir kez tanışma hakkı yükler (K51: açılış hediyesi değil, kullanım anında). */
export async function ensureFreeIntroGranted(): Promise<EntitlementState> {
  const state = await readState();
  if (state.freeIntroGranted) return state;
  state.freeIntroGranted = true;
  state.credits += FREE_INTRO_SESSION_CREDITS;
  pushEvent(state, { at: new Date().toISOString(), kind: 'grant', amount: FREE_INTRO_SESSION_CREDITS, source: 'intro' });
  await writeState(state);
  return state;
}

/** IAP/promosyon sonrası hak yükleme. productId katalogdan doğrulanır (placeholder dahil). */
export async function grantCredits(params: {
  amount?: number;
  source: EntitlementGrantSource;
  productId?: string;
  ref?: string;
}): Promise<EntitlementState> {
  const fromCatalog = params.productId
    ? SESSION_PACKAGES.find((pkg) => pkg.productId === params.productId)?.credits
    : undefined;
  const amount = Math.max(0, params.amount ?? fromCatalog ?? 0);
  const state = await readState();
  if (!amount) return state;
  state.credits += amount;
  pushEvent(state, {
    at: new Date().toISOString(),
    kind: 'grant',
    amount,
    source: params.source,
    ref: params.ref || params.productId,
  });
  await writeState(state);
  return state;
}

export type ConsumeResult = { ok: true; remaining: number } | { ok: false; remaining: number };

/**
 * Bir seans hakkı düşer. Enforcement KAPALIYKEN her zaman ok döner ve bakiye
 * eksiye düşürülmez (sayaç davranışı); AÇIKKEN bakiye yetmiyorsa ok=false döner
 * ve çağıran taraf paywall'a yönlendirir.
 */
export async function consumeSessionCredit(readingKind: string): Promise<ConsumeResult> {
  const state = await readState();
  if (state.credits <= 0) {
    if (ENTITLEMENT_ENFORCEMENT_ENABLED) {
      return { ok: false, remaining: 0 };
    }
    return { ok: true, remaining: 0 };
  }
  state.credits -= 1;
  pushEvent(state, { at: new Date().toISOString(), kind: 'consume', amount: 1, ref: readingKind });
  await writeState(state);
  return { ok: true, remaining: state.credits };
}

/** Başarısız seans iadesi (LLM hatası vb.) — kullanıcı hakkı yanmaz. */
export async function refundSessionCredit(reason: string): Promise<EntitlementState> {
  return grantCredits({ amount: 1, source: 'refund', ref: reason });
}

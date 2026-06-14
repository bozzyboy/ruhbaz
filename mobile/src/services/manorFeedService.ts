// ============================================================
// Ruhbaz Konağı - Konak Akışı (Manor Feed) servisi (Faz 5.2)
// ============================================================
// Tüketici tarafı TAM ÖZERK çalışır: uzak feed (EXPO_PUBLIC_MANOR_FEED_URL) set'liyse
// onu çeker, değilse bundle'daki tohum havuzunu (manorFeedSeed) döndürür.
//
// UZAK YAYIN = OZAN BLOĞU: statik JSON feed'in GitHub Pages/Cloudflare'de yayınlanması +
// GitHub Actions cron + EXPO_PUBLIC_MANOR_FEED_URL'in production'da set'lenmesi Ozan'a ait.
// Yayınlanacak JSON şekli = ManorFeedItem[] (bilingual). Şimdilik tohum havuzu gösterilir.

import { getAppLanguage, type AppLanguage } from '../i18n';
import { MANOR_FEED_SEED, type ManorFeedItem, type ManorFeedKind } from '../data/manorFeedSeed';

export interface ResolvedManorFeedItem {
  id: string;
  personaId?: string;
  kind: ManorFeedKind;
  title: string;
  body: string;
  tags: string[];
}

declare const process: { env?: Record<string, string | undefined> } | undefined;

const VALID_KINDS: ManorFeedKind[] = ['wisdom', 'sky', 'ritual', 'invite'];
const REMOTE_TIMEOUT_MS = 6000;

function remoteFeedUrl(): string | null {
  const url =
    typeof process !== 'undefined' && process.env ? process.env.EXPO_PUBLIC_MANOR_FEED_URL?.trim() : undefined;
  return url || null;
}

function isValidItem(item: unknown): item is ManorFeedItem {
  if (!item || typeof item !== 'object') return false;
  const candidate = item as Partial<ManorFeedItem>;
  return (
    typeof candidate.id === 'string' &&
    typeof candidate.kind === 'string' &&
    (VALID_KINDS as string[]).includes(candidate.kind) &&
    !!candidate.title &&
    typeof candidate.title.tr === 'string' &&
    typeof candidate.title.en === 'string' &&
    !!candidate.body &&
    typeof candidate.body.tr === 'string' &&
    typeof candidate.body.en === 'string'
  );
}

function resolveItem(item: ManorFeedItem, lang: AppLanguage): ResolvedManorFeedItem {
  return {
    id: item.id,
    personaId: item.personaId,
    kind: item.kind,
    title: lang === 'en' ? item.title.en : item.title.tr,
    body: lang === 'en' ? item.body.en : item.body.tr,
    tags: Array.isArray(item.tags) ? item.tags : [],
  };
}

async function fetchRemote(url: string): Promise<ManorFeedItem[] | null> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), REMOTE_TIMEOUT_MS);
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timer);
    if (!res.ok) return null;
    const data: unknown = await res.json();
    if (!Array.isArray(data)) return null;
    const valid = data.filter(isValidItem);
    return valid.length ? valid : null;
  } catch {
    return null;
  }
}

let resolvedCache: { lang: AppLanguage; items: ResolvedManorFeedItem[] } | null = null;
let remoteAttempted = false;
let remoteSource: ManorFeedItem[] | null = null;

/** Aktif dilde Konak Akışı öğeleri. Uzak yoksa/başarısızsa bundle tohumu. */
export async function getManorFeed(opts?: { force?: boolean }): Promise<ResolvedManorFeedItem[]> {
  const lang = getAppLanguage();
  if (!opts?.force && resolvedCache && resolvedCache.lang === lang) return resolvedCache.items;

  const url = remoteFeedUrl();
  if (url && (!remoteAttempted || opts?.force)) {
    remoteAttempted = true;
    remoteSource = await fetchRemote(url);
  }

  const source = remoteSource && remoteSource.length ? remoteSource : MANOR_FEED_SEED;
  const items = source.map((item) => resolveItem(item, lang));
  resolvedCache = { lang, items };
  return items;
}

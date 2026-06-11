// ============================================================
// Ruhbaz Konağı - Seans Paketi Kataloğu (Faz 2 İSKELETİ)
// ============================================================
// ⚠️ PLACEHOLDER — blok: Ozan (D4).
// Gerçek IAP ürün kimlikleri ve fiyatlar Google Play Console'da tanımlanınca
// YALNIZ bu dosya güncellenir; entitlementService ve paywall buradan okur.
// Fiyatlandırma kararı: K43 (Excel maliyet modeli + ölçülen seans-başı maliyet).

/** Hak uygulaması anahtarı: IAP bağlanana kadar KAPALI — okuma akışları kısıtlanmaz. */
export const ENTITLEMENT_ENFORCEMENT_ENABLED = false;

/** Yeni kullanıcıya tanışma hakkı (K51: kademeli ver; istismara karşı sunucu-taraflı takibe taşınacak). */
export const FREE_INTRO_SESSION_CREDITS = 3;

export type SessionPackage = {
  /** Google Play ürün kimliği — ŞİMDİLİK PLACEHOLDER; Ozan Play Console'dan verecek. */
  productId: string;
  /** Pakette kaç seans hakkı var. */
  credits: number;
  /** Kullanıcıya görünen ad (taslak). */
  title: string;
  /** Fiyat ETİKETİ store'dan gelir (IAP API); buradaki alan yalnız geliştirme görünümü için. */
  devPriceHint: string;
};

export const SESSION_PACKAGES: readonly SessionPackage[] = [
  { productId: 'PLACEHOLDER_paket_tanisma', credits: 5, title: 'Tanışma Paketi', devPriceHint: 'blok: Ozan (K43)' },
  { productId: 'PLACEHOLDER_paket_konak', credits: 15, title: 'Konak Paketi', devPriceHint: 'blok: Ozan (K43)' },
  { productId: 'PLACEHOLDER_paket_sofra', credits: 40, title: 'Büyük Sofra', devPriceHint: 'blok: Ozan (K43)' },
] as const;

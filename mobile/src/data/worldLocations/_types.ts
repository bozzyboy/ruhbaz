// ============================================================
// Ruhbaz Konağı - Dünya geneli konum veri tipleri (Faz 4.5 / E1, K-4=B)
// ============================================================
// Option B (Ozan): tüm ülkeler + her ülkenin BÜYÜK ŞEHİRLERİ gömülü (koordinat + IANA
// saat dilimi ile); daha ince yer serbest metin, harita hesabı en yakın büyük şehirden.
// Türkiye il/ilçe verisi ayrı kalır (data/turkeyLocations.ts) — burada YOKTUR.
//
// `code`  = ISO 3166-1 alpha-2 (küçük harf) — kanonik ülke anahtarı (UI value + countryKey hedefi).
// `key`   = şehrin ascii-normalize EN/yerel adı (en iyi çaba). resolveAstroLocation şehri key VEYA
//           normalize(nameTr) VEYA normalize(nameEn) ile eşler; UI lokalize adı sakladığından
//           çözüm pratikte nameTr/nameEn dalından geçer (key zorunlu eşleşme değildir).

export type WorldCountry = {
  code: string;
  nameTr: string;
  nameEn: string;
  lat: number; // ülke merkezi (centroid) — şehir bulunamazsa yaklaşık
  lon: number;
  timezone: string; // ülkenin baskın/temsili IANA saat dilimi
};

export type WorldCity = {
  key: string; // ascii-normalize şehir adı (koordinat anahtarı)
  nameTr: string;
  nameEn: string;
  lat: number;
  lon: number;
  timezone: string; // IANA
};

/** Ülke koduna göre büyük şehir listesi (Türkiye hariç). */
export type WorldCitiesByCountry = Record<string, WorldCity[]>;

// ============================================================
// Ruhbaz Konağı - Dünya konum verisi birleştirici (Faz 4.5 / E1, K-4=B)
// ============================================================
// Ülke kayıt defteri (countries.ts) + bölgesel büyük-şehir parçaları tek noktada
// birleşir. Türkiye il/ilçe verisi BURADA YOK; data/turkeyLocations.ts'te kalır.
// Bölge dosyaları ayrık ülke kümeleri içerir (çakışma yok); spread birleştirir.

import type { WorldCity, WorldCountry } from './_types';
import { WORLD_COUNTRIES } from './countries';
import { CITIES_EUROPE } from './cities-europe';
import { CITIES_AMERICAS } from './cities-americas';
import { CITIES_ASIA } from './cities-asia';
import { CITIES_MENA_AFRICA_OCEANIA } from './cities-mena-africa-oceania';

export type { WorldCity, WorldCountry };
export { WORLD_COUNTRIES };

/** Ülke koduna (ISO alpha-2 küçük harf) göre büyük şehir listesi. Türkiye hariç. */
export const WORLD_CITIES_BY_COUNTRY: Record<string, WorldCity[]> = {
  ...CITIES_EUROPE,
  ...CITIES_AMERICAS,
  ...CITIES_ASIA,
  ...CITIES_MENA_AFRICA_OCEANIA,
};

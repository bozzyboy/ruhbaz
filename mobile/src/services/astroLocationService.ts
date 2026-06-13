import type { BirthLocation } from '../types/memory';
import { TURKEY_CITY_COORDS } from '../data/turkeyLocations';
import { WORLD_CITIES_BY_COUNTRY, WORLD_COUNTRIES } from '../data/worldLocations';

export type ResolvedAstroLocation = {
  country: string;
  cityOrRegion: string;
  district: string | null;
  latitude: number;
  longitude: number;
  timezone: string;
  precision: 'district' | 'city' | 'country';
  label: string;
  warnings: string[];
};

type LocationEntry = {
  lat: number;
  lon: number;
  timezone: string;
  districts?: Record<string, { lat: number; lon: number }>;
};

// Türkiye yüksek-hassasiyet veri (İstanbul ilçe koordinatları dahil). Anahtar ISO 'tr|'.
const CITY_DATA: Record<string, LocationEntry> = {
  'tr|istanbul': {
    lat: 41.0082,
    lon: 28.9784,
    timezone: 'Europe/Istanbul',
    districts: {
      kadikoy: { lat: 40.9919, lon: 29.0252 },
      uskudar: { lat: 41.0227, lon: 29.0153 },
      besiktas: { lat: 41.0438, lon: 29.0094 },
      sisli: { lat: 41.0605, lon: 28.9872 },
      bakirkoy: { lat: 40.9806, lon: 28.8772 },
      fatih: { lat: 41.0164, lon: 28.9497 },
      beyoglu: { lat: 41.0369, lon: 28.9851 },
      sariyer: { lat: 41.1663, lon: 29.0501 },
      maltepe: { lat: 40.9357, lon: 29.1551 },
      pendik: { lat: 40.8747, lon: 29.235 },
    },
  },
  'tr|ankara': {
    lat: 39.9334,
    lon: 32.8597,
    timezone: 'Europe/Istanbul',
    districts: {
      cankaya: { lat: 39.9179, lon: 32.8627 },
      kecioren: { lat: 39.98, lon: 32.8663 },
      yenimahalle: { lat: 39.9719, lon: 32.8118 },
      mamak: { lat: 39.9208, lon: 32.9106 },
      etimesgut: { lat: 39.9533, lon: 32.6329 },
    },
  },
  'tr|izmir': {
    lat: 38.4237,
    lon: 27.1428,
    timezone: 'Europe/Istanbul',
    districts: {
      konak: { lat: 38.4145, lon: 27.1441 },
      karsiyaka: { lat: 38.4613, lon: 27.1127 },
      bornova: { lat: 38.4697, lon: 27.2211 },
      buca: { lat: 38.3848, lon: 27.1741 },
      cesme: { lat: 38.3227, lon: 26.3064 },
    },
  },
  'tr|bursa': { lat: 40.1885, lon: 29.061, timezone: 'Europe/Istanbul' },
  'tr|antalya': { lat: 36.8969, lon: 30.7133, timezone: 'Europe/Istanbul' },
  'tr|adana': { lat: 37.0, lon: 35.3213, timezone: 'Europe/Istanbul' },
  'tr|konya': { lat: 37.8746, lon: 32.4932, timezone: 'Europe/Istanbul' },
  'tr|gaziantep': { lat: 37.0662, lon: 37.3833, timezone: 'Europe/Istanbul' },
  'tr|mersin': { lat: 36.8121, lon: 34.6415, timezone: 'Europe/Istanbul' },
  'tr|kocaeli': { lat: 40.8533, lon: 29.8815, timezone: 'Europe/Istanbul' },
  'tr|diyarbakir': { lat: 37.925, lon: 40.211, timezone: 'Europe/Istanbul' },
  'tr|kayseri': { lat: 38.7205, lon: 35.4826, timezone: 'Europe/Istanbul' },
  'tr|eskisehir': { lat: 39.7767, lon: 30.5206, timezone: 'Europe/Istanbul' },
  'tr|samsun': { lat: 41.2867, lon: 36.33, timezone: 'Europe/Istanbul' },
  'tr|denizli': { lat: 37.7765, lon: 29.0864, timezone: 'Europe/Istanbul' },
  'tr|sakarya': { lat: 40.7731, lon: 30.3948, timezone: 'Europe/Istanbul' },
  'tr|mugla': { lat: 37.2153, lon: 28.3636, timezone: 'Europe/Istanbul' },
  'tr|tekirdag': { lat: 40.978, lon: 27.511, timezone: 'Europe/Istanbul' },
};

function normalizeLocationText(value: string | null | undefined): string {
  return (value || '')
    .trim()
    .toLocaleLowerCase('tr-TR')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ı/g, 'i')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

// Ülke adı/kodu → ISO alpha-2 kodu. Registry (WORLD_COUNTRIES) TR+EN adlarını ve kodu
// kapsar; ek olarak eski profillerde saklanan etiketler + yaygın serbest-metin için alias.
const COUNTRY_CODE_BY_NAME: Record<string, string> = (() => {
  const map: Record<string, string> = {};
  for (const c of WORLD_COUNTRIES) {
    map[c.code] = c.code;
    const tr = normalizeLocationText(c.nameTr);
    const en = normalizeLocationText(c.nameEn);
    if (tr) map[tr] = c.code;
    if (en) map[en] = c.code;
  }
  // Geriye uyum + serbest metin (eski COUNTRY_OPTIONS etiketleri ve yaygın yazımlar).
  const aliases: Record<string, string> = {
    turkey: 'tr',
    turkiye: 'tr',
    abd: 'us',
    amerika: 'us',
    'amerika birlesik devletleri': 'us',
    usa: 'us',
    ingiltere: 'gb',
    uk: 'gb',
    britanya: 'gb',
    'united kingdom': 'gb',
    almanya: 'de',
    germany: 'de',
    fransa: 'fr',
    france: 'fr',
    hollanda: 'nl',
    netherlands: 'nl',
    belcika: 'be',
    belgium: 'be',
    kanada: 'ca',
    canada: 'ca',
  };
  for (const [k, v] of Object.entries(aliases)) {
    if (!map[k]) map[k] = v;
  }
  return map;
})();

// Ülke kodu → merkez koordinat + temsili saat dilimi (şehir bulunamazsa yaklaşık).
const COUNTRY_CENTROID: Record<string, { lat: number; lon: number; timezone: string }> = (() => {
  const map: Record<string, { lat: number; lon: number; timezone: string }> = {};
  for (const c of WORLD_COUNTRIES) {
    map[c.code] = { lat: c.lat, lon: c.lon, timezone: c.timezone };
  }
  return map;
})();

function countryKey(value: string | null | undefined): string {
  const key = normalizeLocationText(value);
  return COUNTRY_CODE_BY_NAME[key] || key;
}

export function resolveAstroLocation(location: BirthLocation): ResolvedAstroLocation | null {
  const country = location.country?.trim();
  const city = location.cityOrRegion?.trim();
  if (!country || !city) return null;

  const cKey = countryKey(country);
  const cityKey = normalizeLocationText(city);
  const districtKey = normalizeLocationText(location.district);
  const districtTrim = location.district?.trim() || null;
  const warnings: string[] = [];

  // 1) Türkiye yüksek-hassasiyet (İstanbul ilçeleri dahil).
  const cityEntry = CITY_DATA[`${cKey}|${cityKey}`];
  if (cityEntry) {
    const district = districtKey ? cityEntry.districts?.[districtKey] : null;
    if (district) {
      return {
        country,
        cityOrRegion: city,
        district: districtTrim,
        latitude: district.lat,
        longitude: district.lon,
        timezone: cityEntry.timezone,
        precision: 'district',
        label: `${city} / ${location.district}`,
        warnings,
      };
    }
    return {
      country,
      cityOrRegion: city,
      district: districtTrim,
      latitude: cityEntry.lat,
      longitude: cityEntry.lon,
      timezone: cityEntry.timezone,
      precision: 'city',
      label: city,
      warnings,
    };
  }

  // 2) Türkiye 81 il koordinatı (ilçe yok).
  if (cKey === 'tr') {
    const turkeyCityName = Object.keys(TURKEY_CITY_COORDS).find((name) => normalizeLocationText(name) === cityKey);
    if (turkeyCityName) {
      const coords = TURKEY_CITY_COORDS[turkeyCityName];
      return {
        country,
        cityOrRegion: city,
        district: districtTrim,
        latitude: coords.lat,
        longitude: coords.lon,
        timezone: 'Europe/Istanbul',
        precision: 'city',
        label: city,
        warnings,
      };
    }
  }

  // 3) Dünya büyük şehirleri (Option B). Saklanan ad anahtar/TR/EN olabilir; üçü de denenir.
  const worldCities = cKey !== 'tr' ? WORLD_CITIES_BY_COUNTRY[cKey] : undefined;
  const worldCity = worldCities?.find(
    (entry) =>
      entry.key === cityKey ||
      normalizeLocationText(entry.nameTr) === cityKey ||
      normalizeLocationText(entry.nameEn) === cityKey,
  );
  if (worldCity) {
    // İlçe serbest metindir; koordinat şehir merkezinden alınır (precision: city).
    return {
      country,
      cityOrRegion: city,
      district: districtTrim,
      latitude: worldCity.lat,
      longitude: worldCity.lon,
      timezone: worldCity.timezone,
      precision: 'city',
      label: districtTrim ? `${city} / ${districtTrim}` : city,
      warnings,
    };
  }

  // 4) Şehir bulunamadı → ülke merkezi + temsili saat dilimi.
  const centroid = COUNTRY_CENTROID[cKey];
  if (centroid) {
    warnings.push('Şehir koordinatı listede bulunamadı; ülke merkeziyle yaklaşık yorum yapılacak.');
    return {
      country,
      cityOrRegion: city,
      district: districtTrim,
      latitude: centroid.lat,
      longitude: centroid.lon,
      timezone: centroid.timezone,
      precision: 'country',
      label: `${country} / ${city}`,
      warnings,
    };
  }

  // 5) Son çare: konum hiç tanınmadı.
  return {
    country,
    cityOrRegion: city,
    district: districtTrim,
    latitude: 39.0,
    longitude: 35.0,
    timezone: 'UTC',
    precision: 'country',
    label: `${country} / ${city}`,
    warnings: ['Konum listede bulunamadı; UTC ve yaklaşık koordinatla yorum yapılacak.'],
  };
}

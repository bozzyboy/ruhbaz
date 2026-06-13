// ============================================================
// Ruhbaz Konağı - Avrupa büyük şehir koordinatları (astroloji doğum yeri seçici)
// ============================================================
// Kapsam: AB + Birleşik Krallık + İsviçre + Norveç + Balkanlar + Ukrayna +
// Rusya (Avrupa yakası, Moskova/St. Petersburg dahil) + Kafkasya
// (Gürcistan/Ermenistan/Azerbaycan). TÜRKİYE (kod 'tr') hariç — ayrı tutulur.
//
// Ülke anahtarı = ISO 3166-1 alpha-2 (küçük harf).
// `key` = şehrin ascii-normalize hali (koordinat aramada kullanılır).
// `nameTr` = yaygın Türkçe ad (varsa exonym), `nameEn` = standart İngilizce ad.

import type { WorldCity } from './_types';
// WorldCity = { key: string; nameTr: string; nameEn: string; lat: number; lon: number; timezone: string };

export const CITIES_EUROPE: Record<string, WorldCity[]> = {
  // Germany
  de: [
    { key: 'berlin', nameTr: 'Berlin', nameEn: 'Berlin', lat: 52.52, lon: 13.405, timezone: 'Europe/Berlin' },
    { key: 'hamburg', nameTr: 'Hamburg', nameEn: 'Hamburg', lat: 53.5511, lon: 9.9937, timezone: 'Europe/Berlin' },
    { key: 'munich', nameTr: 'Münih', nameEn: 'Munich', lat: 48.1351, lon: 11.582, timezone: 'Europe/Berlin' },
    { key: 'cologne', nameTr: 'Köln', nameEn: 'Cologne', lat: 50.9375, lon: 6.9603, timezone: 'Europe/Berlin' },
    { key: 'frankfurt', nameTr: 'Frankfurt', nameEn: 'Frankfurt', lat: 50.1109, lon: 8.6821, timezone: 'Europe/Berlin' },
    { key: 'stuttgart', nameTr: 'Stuttgart', nameEn: 'Stuttgart', lat: 48.7758, lon: 9.1829, timezone: 'Europe/Berlin' },
    { key: 'dusseldorf', nameTr: 'Düsseldorf', nameEn: 'Düsseldorf', lat: 51.2277, lon: 6.7735, timezone: 'Europe/Berlin' },
    { key: 'dortmund', nameTr: 'Dortmund', nameEn: 'Dortmund', lat: 51.5136, lon: 7.4653, timezone: 'Europe/Berlin' },
    { key: 'essen', nameTr: 'Essen', nameEn: 'Essen', lat: 51.4556, lon: 7.0116, timezone: 'Europe/Berlin' },
    { key: 'leipzig', nameTr: 'Leipzig', nameEn: 'Leipzig', lat: 51.3397, lon: 12.3731, timezone: 'Europe/Berlin' },
    { key: 'bremen', nameTr: 'Bremen', nameEn: 'Bremen', lat: 53.0793, lon: 8.8017, timezone: 'Europe/Berlin' },
    { key: 'dresden', nameTr: 'Dresden', nameEn: 'Dresden', lat: 51.0504, lon: 13.7373, timezone: 'Europe/Berlin' },
    { key: 'hannover', nameTr: 'Hannover', nameEn: 'Hanover', lat: 52.3759, lon: 9.732, timezone: 'Europe/Berlin' },
    { key: 'nuremberg', nameTr: 'Nürnberg', nameEn: 'Nuremberg', lat: 49.4521, lon: 11.0767, timezone: 'Europe/Berlin' },
  ],

  // France
  fr: [
    { key: 'paris', nameTr: 'Paris', nameEn: 'Paris', lat: 48.8566, lon: 2.3522, timezone: 'Europe/Paris' },
    { key: 'marseille', nameTr: 'Marsilya', nameEn: 'Marseille', lat: 43.2965, lon: 5.3698, timezone: 'Europe/Paris' },
    { key: 'lyon', nameTr: 'Lyon', nameEn: 'Lyon', lat: 45.764, lon: 4.8357, timezone: 'Europe/Paris' },
    { key: 'toulouse', nameTr: 'Toulouse', nameEn: 'Toulouse', lat: 43.6047, lon: 1.4442, timezone: 'Europe/Paris' },
    { key: 'nice', nameTr: 'Nice', nameEn: 'Nice', lat: 43.7102, lon: 7.262, timezone: 'Europe/Paris' },
    { key: 'nantes', nameTr: 'Nantes', nameEn: 'Nantes', lat: 47.2184, lon: -1.5536, timezone: 'Europe/Paris' },
    { key: 'strasbourg', nameTr: 'Strazburg', nameEn: 'Strasbourg', lat: 48.5734, lon: 7.7521, timezone: 'Europe/Paris' },
    { key: 'montpellier', nameTr: 'Montpellier', nameEn: 'Montpellier', lat: 43.6108, lon: 3.8767, timezone: 'Europe/Paris' },
    { key: 'bordeaux', nameTr: 'Bordeaux', nameEn: 'Bordeaux', lat: 44.8378, lon: -0.5792, timezone: 'Europe/Paris' },
    { key: 'lille', nameTr: 'Lille', nameEn: 'Lille', lat: 50.6292, lon: 3.0573, timezone: 'Europe/Paris' },
  ],

  // United Kingdom
  gb: [
    { key: 'london', nameTr: 'Londra', nameEn: 'London', lat: 51.5074, lon: -0.1278, timezone: 'Europe/London' },
    { key: 'birmingham', nameTr: 'Birmingham', nameEn: 'Birmingham', lat: 52.4862, lon: -1.8904, timezone: 'Europe/London' },
    { key: 'manchester', nameTr: 'Manchester', nameEn: 'Manchester', lat: 53.4808, lon: -2.2426, timezone: 'Europe/London' },
    { key: 'glasgow', nameTr: 'Glasgow', nameEn: 'Glasgow', lat: 55.8642, lon: -4.2518, timezone: 'Europe/London' },
    { key: 'liverpool', nameTr: 'Liverpool', nameEn: 'Liverpool', lat: 53.4084, lon: -2.9916, timezone: 'Europe/London' },
    { key: 'leeds', nameTr: 'Leeds', nameEn: 'Leeds', lat: 53.8008, lon: -1.5491, timezone: 'Europe/London' },
    { key: 'edinburgh', nameTr: 'Edinburgh', nameEn: 'Edinburgh', lat: 55.9533, lon: -3.1883, timezone: 'Europe/London' },
    { key: 'bristol', nameTr: 'Bristol', nameEn: 'Bristol', lat: 51.4545, lon: -2.5879, timezone: 'Europe/London' },
    { key: 'sheffield', nameTr: 'Sheffield', nameEn: 'Sheffield', lat: 53.3811, lon: -1.4701, timezone: 'Europe/London' },
    { key: 'cardiff', nameTr: 'Cardiff', nameEn: 'Cardiff', lat: 51.4816, lon: -3.1791, timezone: 'Europe/London' },
    { key: 'belfast', nameTr: 'Belfast', nameEn: 'Belfast', lat: 54.5973, lon: -5.9301, timezone: 'Europe/London' },
  ],

  // Italy
  it: [
    { key: 'rome', nameTr: 'Roma', nameEn: 'Rome', lat: 41.9028, lon: 12.4964, timezone: 'Europe/Rome' },
    { key: 'milan', nameTr: 'Milano', nameEn: 'Milan', lat: 45.4642, lon: 9.19, timezone: 'Europe/Rome' },
    { key: 'naples', nameTr: 'Napoli', nameEn: 'Naples', lat: 40.8518, lon: 14.2681, timezone: 'Europe/Rome' },
    { key: 'turin', nameTr: 'Torino', nameEn: 'Turin', lat: 45.0703, lon: 7.6869, timezone: 'Europe/Rome' },
    { key: 'palermo', nameTr: 'Palermo', nameEn: 'Palermo', lat: 38.1157, lon: 13.3615, timezone: 'Europe/Rome' },
    { key: 'genoa', nameTr: 'Cenova', nameEn: 'Genoa', lat: 44.4056, lon: 8.9463, timezone: 'Europe/Rome' },
    { key: 'bologna', nameTr: 'Bologna', nameEn: 'Bologna', lat: 44.4949, lon: 11.3426, timezone: 'Europe/Rome' },
    { key: 'florence', nameTr: 'Floransa', nameEn: 'Florence', lat: 43.7696, lon: 11.2558, timezone: 'Europe/Rome' },
    { key: 'venice', nameTr: 'Venedik', nameEn: 'Venice', lat: 45.4408, lon: 12.3155, timezone: 'Europe/Rome' },
    { key: 'verona', nameTr: 'Verona', nameEn: 'Verona', lat: 45.4384, lon: 10.9916, timezone: 'Europe/Rome' },
  ],

  // Spain
  es: [
    { key: 'madrid', nameTr: 'Madrid', nameEn: 'Madrid', lat: 40.4168, lon: -3.7038, timezone: 'Europe/Madrid' },
    { key: 'barcelona', nameTr: 'Barselona', nameEn: 'Barcelona', lat: 41.3851, lon: 2.1734, timezone: 'Europe/Madrid' },
    { key: 'valencia', nameTr: 'Valensiya', nameEn: 'Valencia', lat: 39.4699, lon: -0.3763, timezone: 'Europe/Madrid' },
    { key: 'seville', nameTr: 'Sevilla', nameEn: 'Seville', lat: 37.3891, lon: -5.9845, timezone: 'Europe/Madrid' },
    { key: 'zaragoza', nameTr: 'Zaragoza', nameEn: 'Zaragoza', lat: 41.6488, lon: -0.8891, timezone: 'Europe/Madrid' },
    { key: 'malaga', nameTr: 'Malaga', nameEn: 'Málaga', lat: 36.7213, lon: -4.4214, timezone: 'Europe/Madrid' },
    { key: 'bilbao', nameTr: 'Bilbao', nameEn: 'Bilbao', lat: 43.263, lon: -2.935, timezone: 'Europe/Madrid' },
    { key: 'palma', nameTr: 'Palma', nameEn: 'Palma', lat: 39.5696, lon: 2.6502, timezone: 'Europe/Madrid' },
    { key: 'las palmas', nameTr: 'Las Palmas', nameEn: 'Las Palmas', lat: 28.1235, lon: -15.4363, timezone: 'Atlantic/Canary' },
  ],

  // Russia (European side)
  ru: [
    { key: 'moscow', nameTr: 'Moskova', nameEn: 'Moscow', lat: 55.7558, lon: 37.6173, timezone: 'Europe/Moscow' },
    { key: 'st petersburg', nameTr: 'St. Petersburg', nameEn: 'Saint Petersburg', lat: 59.9311, lon: 30.3609, timezone: 'Europe/Moscow' },
    { key: 'nizhny novgorod', nameTr: 'Nijni Novgorod', nameEn: 'Nizhny Novgorod', lat: 56.2965, lon: 43.9361, timezone: 'Europe/Moscow' },
    { key: 'kazan', nameTr: 'Kazan', nameEn: 'Kazan', lat: 55.8304, lon: 49.0661, timezone: 'Europe/Moscow' },
    { key: 'samara', nameTr: 'Samara', nameEn: 'Samara', lat: 53.1959, lon: 50.1002, timezone: 'Europe/Samara' },
    { key: 'rostov on don', nameTr: 'Rostov', nameEn: 'Rostov-on-Don', lat: 47.2357, lon: 39.7015, timezone: 'Europe/Moscow' },
    { key: 'volgograd', nameTr: 'Volgograd', nameEn: 'Volgograd', lat: 48.708, lon: 44.5133, timezone: 'Europe/Volgograd' },
    { key: 'yekaterinburg', nameTr: 'Yekaterinburg', nameEn: 'Yekaterinburg', lat: 56.8389, lon: 60.6057, timezone: 'Asia/Yekaterinburg' },
  ],

  // Poland
  pl: [
    { key: 'warsaw', nameTr: 'Varşova', nameEn: 'Warsaw', lat: 52.2297, lon: 21.0122, timezone: 'Europe/Warsaw' },
    { key: 'krakow', nameTr: 'Krakov', nameEn: 'Kraków', lat: 50.0647, lon: 19.945, timezone: 'Europe/Warsaw' },
    { key: 'lodz', nameTr: 'Lodz', nameEn: 'Łódź', lat: 51.7592, lon: 19.456, timezone: 'Europe/Warsaw' },
    { key: 'wroclaw', nameTr: 'Wroclaw', nameEn: 'Wrocław', lat: 51.1079, lon: 17.0385, timezone: 'Europe/Warsaw' },
    { key: 'poznan', nameTr: 'Poznan', nameEn: 'Poznań', lat: 52.4064, lon: 16.9252, timezone: 'Europe/Warsaw' },
    { key: 'gdansk', nameTr: 'Gdansk', nameEn: 'Gdańsk', lat: 54.352, lon: 18.6466, timezone: 'Europe/Warsaw' },
  ],

  // Netherlands
  nl: [
    { key: 'amsterdam', nameTr: 'Amsterdam', nameEn: 'Amsterdam', lat: 52.3676, lon: 4.9041, timezone: 'Europe/Amsterdam' },
    { key: 'rotterdam', nameTr: 'Rotterdam', nameEn: 'Rotterdam', lat: 51.9244, lon: 4.4777, timezone: 'Europe/Amsterdam' },
    { key: 'the hague', nameTr: 'Lahey', nameEn: 'The Hague', lat: 52.0705, lon: 4.3007, timezone: 'Europe/Amsterdam' },
    { key: 'utrecht', nameTr: 'Utrecht', nameEn: 'Utrecht', lat: 52.0907, lon: 5.1214, timezone: 'Europe/Amsterdam' },
    { key: 'eindhoven', nameTr: 'Eindhoven', nameEn: 'Eindhoven', lat: 51.4416, lon: 5.4697, timezone: 'Europe/Amsterdam' },
  ],

  // Belgium
  be: [
    { key: 'brussels', nameTr: 'Brüksel', nameEn: 'Brussels', lat: 50.8503, lon: 4.3517, timezone: 'Europe/Brussels' },
    { key: 'antwerp', nameTr: 'Anvers', nameEn: 'Antwerp', lat: 51.2194, lon: 4.4025, timezone: 'Europe/Brussels' },
    { key: 'ghent', nameTr: 'Gent', nameEn: 'Ghent', lat: 51.0543, lon: 3.7174, timezone: 'Europe/Brussels' },
    { key: 'bruges', nameTr: 'Brugge', nameEn: 'Bruges', lat: 51.2093, lon: 3.2247, timezone: 'Europe/Brussels' },
  ],

  // Sweden
  se: [
    { key: 'stockholm', nameTr: 'Stokholm', nameEn: 'Stockholm', lat: 59.3293, lon: 18.0686, timezone: 'Europe/Stockholm' },
    { key: 'gothenburg', nameTr: 'Göteborg', nameEn: 'Gothenburg', lat: 57.7089, lon: 11.9746, timezone: 'Europe/Stockholm' },
    { key: 'malmo', nameTr: 'Malmö', nameEn: 'Malmö', lat: 55.605, lon: 13.0038, timezone: 'Europe/Stockholm' },
    { key: 'uppsala', nameTr: 'Uppsala', nameEn: 'Uppsala', lat: 59.8586, lon: 17.6389, timezone: 'Europe/Stockholm' },
  ],

  // Norway
  no: [
    { key: 'oslo', nameTr: 'Oslo', nameEn: 'Oslo', lat: 59.9139, lon: 10.7522, timezone: 'Europe/Oslo' },
    { key: 'bergen', nameTr: 'Bergen', nameEn: 'Bergen', lat: 60.3913, lon: 5.3221, timezone: 'Europe/Oslo' },
    { key: 'trondheim', nameTr: 'Trondheim', nameEn: 'Trondheim', lat: 63.4305, lon: 10.3951, timezone: 'Europe/Oslo' },
    { key: 'stavanger', nameTr: 'Stavanger', nameEn: 'Stavanger', lat: 58.969, lon: 5.7331, timezone: 'Europe/Oslo' },
  ],

  // Switzerland
  ch: [
    { key: 'zurich', nameTr: 'Zürih', nameEn: 'Zurich', lat: 47.3769, lon: 8.5417, timezone: 'Europe/Zurich' },
    { key: 'geneva', nameTr: 'Cenevre', nameEn: 'Geneva', lat: 46.2044, lon: 6.1432, timezone: 'Europe/Zurich' },
    { key: 'basel', nameTr: 'Basel', nameEn: 'Basel', lat: 47.5596, lon: 7.5886, timezone: 'Europe/Zurich' },
    { key: 'bern', nameTr: 'Bern', nameEn: 'Bern', lat: 46.948, lon: 7.4474, timezone: 'Europe/Zurich' },
    { key: 'lausanne', nameTr: 'Lozan', nameEn: 'Lausanne', lat: 46.5197, lon: 6.6323, timezone: 'Europe/Zurich' },
  ],

  // Austria
  at: [
    { key: 'vienna', nameTr: 'Viyana', nameEn: 'Vienna', lat: 48.2082, lon: 16.3738, timezone: 'Europe/Vienna' },
    { key: 'graz', nameTr: 'Graz', nameEn: 'Graz', lat: 47.0707, lon: 15.4395, timezone: 'Europe/Vienna' },
    { key: 'linz', nameTr: 'Linz', nameEn: 'Linz', lat: 48.3069, lon: 14.2858, timezone: 'Europe/Vienna' },
    { key: 'salzburg', nameTr: 'Salzburg', nameEn: 'Salzburg', lat: 47.8095, lon: 13.055, timezone: 'Europe/Vienna' },
    { key: 'innsbruck', nameTr: 'Innsbruck', nameEn: 'Innsbruck', lat: 47.2692, lon: 11.4041, timezone: 'Europe/Vienna' },
  ],

  // Greece
  gr: [
    { key: 'athens', nameTr: 'Atina', nameEn: 'Athens', lat: 37.9838, lon: 23.7275, timezone: 'Europe/Athens' },
    { key: 'thessaloniki', nameTr: 'Selanik', nameEn: 'Thessaloniki', lat: 40.6401, lon: 22.9444, timezone: 'Europe/Athens' },
    { key: 'patras', nameTr: 'Patras', nameEn: 'Patras', lat: 38.2466, lon: 21.7346, timezone: 'Europe/Athens' },
    { key: 'heraklion', nameTr: 'Heraklion', nameEn: 'Heraklion', lat: 35.3387, lon: 25.1442, timezone: 'Europe/Athens' },
  ],

  // Portugal
  pt: [
    { key: 'lisbon', nameTr: 'Lizbon', nameEn: 'Lisbon', lat: 38.7223, lon: -9.1393, timezone: 'Europe/Lisbon' },
    { key: 'porto', nameTr: 'Porto', nameEn: 'Porto', lat: 41.1579, lon: -8.6291, timezone: 'Europe/Lisbon' },
    { key: 'braga', nameTr: 'Braga', nameEn: 'Braga', lat: 41.5454, lon: -8.4265, timezone: 'Europe/Lisbon' },
    { key: 'coimbra', nameTr: 'Coimbra', nameEn: 'Coimbra', lat: 40.2033, lon: -8.4103, timezone: 'Europe/Lisbon' },
    { key: 'funchal', nameTr: 'Funchal', nameEn: 'Funchal', lat: 32.6669, lon: -16.9241, timezone: 'Atlantic/Madeira' },
  ],

  // Ireland
  ie: [
    { key: 'dublin', nameTr: 'Dublin', nameEn: 'Dublin', lat: 53.3498, lon: -6.2603, timezone: 'Europe/Dublin' },
    { key: 'cork', nameTr: 'Cork', nameEn: 'Cork', lat: 51.8985, lon: -8.4756, timezone: 'Europe/Dublin' },
    { key: 'galway', nameTr: 'Galway', nameEn: 'Galway', lat: 53.2707, lon: -9.0568, timezone: 'Europe/Dublin' },
    { key: 'limerick', nameTr: 'Limerick', nameEn: 'Limerick', lat: 52.6638, lon: -8.6267, timezone: 'Europe/Dublin' },
  ],

  // Czechia
  cz: [
    { key: 'prague', nameTr: 'Prag', nameEn: 'Prague', lat: 50.0755, lon: 14.4378, timezone: 'Europe/Prague' },
    { key: 'brno', nameTr: 'Brno', nameEn: 'Brno', lat: 49.1951, lon: 16.6068, timezone: 'Europe/Prague' },
    { key: 'ostrava', nameTr: 'Ostrava', nameEn: 'Ostrava', lat: 49.8209, lon: 18.2625, timezone: 'Europe/Prague' },
    { key: 'plzen', nameTr: 'Plzen', nameEn: 'Plzeň', lat: 49.7384, lon: 13.3736, timezone: 'Europe/Prague' },
  ],

  // Hungary
  hu: [
    { key: 'budapest', nameTr: 'Budapeşte', nameEn: 'Budapest', lat: 47.4979, lon: 19.0402, timezone: 'Europe/Budapest' },
    { key: 'debrecen', nameTr: 'Debrecen', nameEn: 'Debrecen', lat: 47.5316, lon: 21.6273, timezone: 'Europe/Budapest' },
    { key: 'szeged', nameTr: 'Szeged', nameEn: 'Szeged', lat: 46.253, lon: 20.1414, timezone: 'Europe/Budapest' },
    { key: 'miskolc', nameTr: 'Miskolc', nameEn: 'Miskolc', lat: 48.1035, lon: 20.7784, timezone: 'Europe/Budapest' },
  ],

  // Romania
  ro: [
    { key: 'bucharest', nameTr: 'Bükreş', nameEn: 'Bucharest', lat: 44.4268, lon: 26.1025, timezone: 'Europe/Bucharest' },
    { key: 'cluj napoca', nameTr: 'Cluj-Napoca', nameEn: 'Cluj-Napoca', lat: 46.7712, lon: 23.6236, timezone: 'Europe/Bucharest' },
    { key: 'timisoara', nameTr: 'Timisoara', nameEn: 'Timișoara', lat: 45.7489, lon: 21.2087, timezone: 'Europe/Bucharest' },
    { key: 'iasi', nameTr: 'Iasi', nameEn: 'Iași', lat: 47.1585, lon: 27.6014, timezone: 'Europe/Bucharest' },
    { key: 'constanta', nameTr: 'Köstence', nameEn: 'Constanța', lat: 44.1598, lon: 28.6348, timezone: 'Europe/Bucharest' },
  ],

  // Ukraine
  ua: [
    { key: 'kyiv', nameTr: 'Kiev', nameEn: 'Kyiv', lat: 50.4501, lon: 30.5234, timezone: 'Europe/Kyiv' },
    { key: 'kharkiv', nameTr: 'Harkiv', nameEn: 'Kharkiv', lat: 49.9935, lon: 36.2304, timezone: 'Europe/Kyiv' },
    { key: 'odesa', nameTr: 'Odesa', nameEn: 'Odesa', lat: 46.4825, lon: 30.7233, timezone: 'Europe/Kyiv' },
    { key: 'dnipro', nameTr: 'Dnipro', nameEn: 'Dnipro', lat: 48.4647, lon: 35.0462, timezone: 'Europe/Kyiv' },
    { key: 'lviv', nameTr: 'Lviv', nameEn: 'Lviv', lat: 49.8397, lon: 24.0297, timezone: 'Europe/Kyiv' },
    { key: 'zaporizhzhia', nameTr: 'Zaporijya', nameEn: 'Zaporizhzhia', lat: 47.8388, lon: 35.1396, timezone: 'Europe/Kyiv' },
  ],

  // Serbia
  rs: [
    { key: 'belgrade', nameTr: 'Belgrad', nameEn: 'Belgrade', lat: 44.7866, lon: 20.4489, timezone: 'Europe/Belgrade' },
    { key: 'novi sad', nameTr: 'Novi Sad', nameEn: 'Novi Sad', lat: 45.2671, lon: 19.8335, timezone: 'Europe/Belgrade' },
    { key: 'nis', nameTr: 'Nis', nameEn: 'Niš', lat: 43.3209, lon: 21.8958, timezone: 'Europe/Belgrade' },
  ],

  // Croatia
  hr: [
    { key: 'zagreb', nameTr: 'Zagreb', nameEn: 'Zagreb', lat: 45.815, lon: 15.9819, timezone: 'Europe/Zagreb' },
    { key: 'split', nameTr: 'Split', nameEn: 'Split', lat: 43.5081, lon: 16.4402, timezone: 'Europe/Zagreb' },
    { key: 'rijeka', nameTr: 'Rijeka', nameEn: 'Rijeka', lat: 45.3271, lon: 14.4422, timezone: 'Europe/Zagreb' },
    { key: 'dubrovnik', nameTr: 'Dubrovnik', nameEn: 'Dubrovnik', lat: 42.6507, lon: 18.0944, timezone: 'Europe/Zagreb' },
  ],

  // Bulgaria
  bg: [
    { key: 'sofia', nameTr: 'Sofya', nameEn: 'Sofia', lat: 42.6977, lon: 23.3219, timezone: 'Europe/Sofia' },
    { key: 'plovdiv', nameTr: 'Plovdiv', nameEn: 'Plovdiv', lat: 42.1354, lon: 24.7453, timezone: 'Europe/Sofia' },
    { key: 'varna', nameTr: 'Varna', nameEn: 'Varna', lat: 43.2141, lon: 27.9147, timezone: 'Europe/Sofia' },
    { key: 'burgas', nameTr: 'Burgaz', nameEn: 'Burgas', lat: 42.5048, lon: 27.4626, timezone: 'Europe/Sofia' },
  ],

  // Denmark
  dk: [
    { key: 'copenhagen', nameTr: 'Kopenhag', nameEn: 'Copenhagen', lat: 55.6761, lon: 12.5683, timezone: 'Europe/Copenhagen' },
    { key: 'aarhus', nameTr: 'Aarhus', nameEn: 'Aarhus', lat: 56.1629, lon: 10.2039, timezone: 'Europe/Copenhagen' },
    { key: 'odense', nameTr: 'Odense', nameEn: 'Odense', lat: 55.4038, lon: 10.4024, timezone: 'Europe/Copenhagen' },
    { key: 'aalborg', nameTr: 'Aalborg', nameEn: 'Aalborg', lat: 57.0488, lon: 9.9217, timezone: 'Europe/Copenhagen' },
  ],

  // Finland
  fi: [
    { key: 'helsinki', nameTr: 'Helsinki', nameEn: 'Helsinki', lat: 60.1699, lon: 24.9384, timezone: 'Europe/Helsinki' },
    { key: 'espoo', nameTr: 'Espoo', nameEn: 'Espoo', lat: 60.2055, lon: 24.6559, timezone: 'Europe/Helsinki' },
    { key: 'tampere', nameTr: 'Tampere', nameEn: 'Tampere', lat: 61.4978, lon: 23.761, timezone: 'Europe/Helsinki' },
    { key: 'turku', nameTr: 'Turku', nameEn: 'Turku', lat: 60.4518, lon: 22.2666, timezone: 'Europe/Helsinki' },
  ],

  // Norway already 'no'; Iceland
  is: [
    { key: 'reykjavik', nameTr: 'Reykjavik', nameEn: 'Reykjavík', lat: 64.1466, lon: -21.9426, timezone: 'Atlantic/Reykjavik' },
  ],

  // Ireland already 'ie'; Slovakia
  sk: [
    { key: 'bratislava', nameTr: 'Bratislava', nameEn: 'Bratislava', lat: 48.1486, lon: 17.1077, timezone: 'Europe/Bratislava' },
    { key: 'kosice', nameTr: 'Kosice', nameEn: 'Košice', lat: 48.7164, lon: 21.2611, timezone: 'Europe/Bratislava' },
  ],

  // Slovenia
  si: [
    { key: 'ljubljana', nameTr: 'Ljubljana', nameEn: 'Ljubljana', lat: 46.0569, lon: 14.5058, timezone: 'Europe/Ljubljana' },
    { key: 'maribor', nameTr: 'Maribor', nameEn: 'Maribor', lat: 46.5547, lon: 15.6459, timezone: 'Europe/Ljubljana' },
  ],

  // Bosnia and Herzegovina
  ba: [
    { key: 'sarajevo', nameTr: 'Saraybosna', nameEn: 'Sarajevo', lat: 43.8563, lon: 18.4131, timezone: 'Europe/Sarajevo' },
    { key: 'banja luka', nameTr: 'Banja Luka', nameEn: 'Banja Luka', lat: 44.7722, lon: 17.191, timezone: 'Europe/Sarajevo' },
    { key: 'mostar', nameTr: 'Mostar', nameEn: 'Mostar', lat: 43.3438, lon: 17.8078, timezone: 'Europe/Sarajevo' },
  ],

  // North Macedonia
  mk: [
    { key: 'skopje', nameTr: 'Üsküp', nameEn: 'Skopje', lat: 41.9981, lon: 21.4254, timezone: 'Europe/Skopje' },
    { key: 'bitola', nameTr: 'Manastır', nameEn: 'Bitola', lat: 41.0314, lon: 21.3347, timezone: 'Europe/Skopje' },
  ],

  // Albania
  al: [
    { key: 'tirana', nameTr: 'Tiran', nameEn: 'Tirana', lat: 41.3275, lon: 19.8187, timezone: 'Europe/Tirane' },
    { key: 'durres', nameTr: 'Draç', nameEn: 'Durrës', lat: 41.3231, lon: 19.4414, timezone: 'Europe/Tirane' },
  ],

  // Montenegro
  me: [
    { key: 'podgorica', nameTr: 'Podgorica', nameEn: 'Podgorica', lat: 42.4304, lon: 19.2594, timezone: 'Europe/Podgorica' },
  ],

  // Kosovo (user-assigned XK)
  xk: [
    { key: 'pristina', nameTr: 'Priştine', nameEn: 'Pristina', lat: 42.6629, lon: 21.1655, timezone: 'Europe/Belgrade' },
  ],

  // Belarus
  by: [
    { key: 'minsk', nameTr: 'Minsk', nameEn: 'Minsk', lat: 53.9006, lon: 27.559, timezone: 'Europe/Minsk' },
    { key: 'gomel', nameTr: 'Gomel', nameEn: 'Gomel', lat: 52.4345, lon: 30.9754, timezone: 'Europe/Minsk' },
  ],

  // Moldova
  md: [
    { key: 'chisinau', nameTr: 'Kişinev', nameEn: 'Chișinău', lat: 47.0105, lon: 28.8638, timezone: 'Europe/Chisinau' },
  ],

  // Lithuania
  lt: [
    { key: 'vilnius', nameTr: 'Vilnius', nameEn: 'Vilnius', lat: 54.6872, lon: 25.2797, timezone: 'Europe/Vilnius' },
    { key: 'kaunas', nameTr: 'Kaunas', nameEn: 'Kaunas', lat: 54.8985, lon: 23.9036, timezone: 'Europe/Vilnius' },
  ],

  // Latvia
  lv: [
    { key: 'riga', nameTr: 'Riga', nameEn: 'Riga', lat: 56.9496, lon: 24.1052, timezone: 'Europe/Riga' },
  ],

  // Estonia
  ee: [
    { key: 'tallinn', nameTr: 'Tallin', nameEn: 'Tallinn', lat: 59.437, lon: 24.7536, timezone: 'Europe/Tallinn' },
    { key: 'tartu', nameTr: 'Tartu', nameEn: 'Tartu', lat: 58.378, lon: 26.729, timezone: 'Europe/Tallinn' },
  ],

  // Luxembourg
  lu: [
    { key: 'luxembourg', nameTr: 'Lüksemburg', nameEn: 'Luxembourg', lat: 49.6116, lon: 6.1319, timezone: 'Europe/Luxembourg' },
  ],

  // Cyprus
  cy: [
    { key: 'nicosia', nameTr: 'Lefkoşa', nameEn: 'Nicosia', lat: 35.1856, lon: 33.3823, timezone: 'Asia/Nicosia' },
    { key: 'limassol', nameTr: 'Limasol', nameEn: 'Limassol', lat: 34.7071, lon: 33.0226, timezone: 'Asia/Nicosia' },
  ],

  // Malta
  mt: [
    { key: 'valletta', nameTr: 'Valletta', nameEn: 'Valletta', lat: 35.8989, lon: 14.5146, timezone: 'Europe/Malta' },
  ],

  // Georgia
  ge: [
    { key: 'tbilisi', nameTr: 'Tiflis', nameEn: 'Tbilisi', lat: 41.7151, lon: 44.8271, timezone: 'Asia/Tbilisi' },
    { key: 'batumi', nameTr: 'Batum', nameEn: 'Batumi', lat: 41.6168, lon: 41.6367, timezone: 'Asia/Tbilisi' },
    { key: 'kutaisi', nameTr: 'Kutaisi', nameEn: 'Kutaisi', lat: 42.2679, lon: 42.7064, timezone: 'Asia/Tbilisi' },
  ],

  // Armenia
  am: [
    { key: 'yerevan', nameTr: 'Erivan', nameEn: 'Yerevan', lat: 40.1792, lon: 44.4991, timezone: 'Asia/Yerevan' },
    { key: 'gyumri', nameTr: 'Gümrü', nameEn: 'Gyumri', lat: 40.7894, lon: 43.8475, timezone: 'Asia/Yerevan' },
  ],

  // Azerbaijan
  az: [
    { key: 'baku', nameTr: 'Bakü', nameEn: 'Baku', lat: 40.4093, lon: 49.8671, timezone: 'Asia/Baku' },
    { key: 'ganja', nameTr: 'Gence', nameEn: 'Ganja', lat: 40.6828, lon: 46.3606, timezone: 'Asia/Baku' },
    { key: 'sumqayit', nameTr: 'Sumgayıt', nameEn: 'Sumqayit', lat: 40.5897, lon: 49.6686, timezone: 'Asia/Baku' },
  ],
};

// ============================================================
// Ruhbaz Konağı - Büyük şehir koordinatları: Orta Doğu + Afrika + Okyanusya
// (Faz 4.5 / E1, K-4=B) — astroloji doğum yeri seçici için.
// ============================================================
// `key`      = ascii-normalize şehir adı (astroLocationService.normalizeLocationText ile birebir).
// `nameTr`   = yaygınsa Türkçe exonim (Kahire, Tahran, Şam, Bağdat...), yoksa İngilizcesi.
// `nameEn`   = standart İngilizce şehir adı.
// `lat`/`lon`= şehir merkezi koordinatı (4 ondalık, ±2km).
// `timezone` = şehre ait doğru IANA saat dilimi.
//
// Türkiye burada YOKTUR (data/turkeyLocations.ts ayrı).

import type { WorldCity } from './_types';

export const CITIES_MENA_AFRICA_OCEANIA: Record<string, WorldCity[]> = {
  // ===================== ORTA DOĞU =====================

  // İran
  ir: [
    { key: 'tehran', nameTr: 'Tahran', nameEn: 'Tehran', lat: 35.6892, lon: 51.389, timezone: 'Asia/Tehran' },
    { key: 'mashhad', nameTr: 'Meşhed', nameEn: 'Mashhad', lat: 36.2605, lon: 59.6168, timezone: 'Asia/Tehran' },
    { key: 'isfahan', nameTr: 'İsfahan', nameEn: 'Isfahan', lat: 32.6539, lon: 51.666, timezone: 'Asia/Tehran' },
    { key: 'karaj', nameTr: 'Karaj', nameEn: 'Karaj', lat: 35.8327, lon: 50.9916, timezone: 'Asia/Tehran' },
    { key: 'shiraz', nameTr: 'Şiraz', nameEn: 'Shiraz', lat: 29.5918, lon: 52.5837, timezone: 'Asia/Tehran' },
    { key: 'tabriz', nameTr: 'Tebriz', nameEn: 'Tabriz', lat: 38.0962, lon: 46.2738, timezone: 'Asia/Tehran' },
    { key: 'qom', nameTr: 'Kum', nameEn: 'Qom', lat: 34.6416, lon: 50.8746, timezone: 'Asia/Tehran' },
    { key: 'ahvaz', nameTr: 'Ahvaz', nameEn: 'Ahvaz', lat: 31.3203, lon: 48.6693, timezone: 'Asia/Tehran' },
  ],

  // Irak
  iq: [
    { key: 'baghdad', nameTr: 'Bağdat', nameEn: 'Baghdad', lat: 33.3152, lon: 44.3661, timezone: 'Asia/Baghdad' },
    { key: 'basra', nameTr: 'Basra', nameEn: 'Basra', lat: 30.5085, lon: 47.7804, timezone: 'Asia/Baghdad' },
    { key: 'mosul', nameTr: 'Musul', nameEn: 'Mosul', lat: 36.335, lon: 43.1189, timezone: 'Asia/Baghdad' },
    { key: 'erbil', nameTr: 'Erbil', nameEn: 'Erbil', lat: 36.1911, lon: 44.0092, timezone: 'Asia/Baghdad' },
    { key: 'najaf', nameTr: 'Necef', nameEn: 'Najaf', lat: 32.0259, lon: 44.3461, timezone: 'Asia/Baghdad' },
    { key: 'kirkuk', nameTr: 'Kerkük', nameEn: 'Kirkuk', lat: 35.4681, lon: 44.3922, timezone: 'Asia/Baghdad' },
  ],

  // Suudi Arabistan
  sa: [
    { key: 'riyadh', nameTr: 'Riyad', nameEn: 'Riyadh', lat: 24.7136, lon: 46.6753, timezone: 'Asia/Riyadh' },
    { key: 'jeddah', nameTr: 'Cidde', nameEn: 'Jeddah', lat: 21.4858, lon: 39.1925, timezone: 'Asia/Riyadh' },
    { key: 'mecca', nameTr: 'Mekke', nameEn: 'Mecca', lat: 21.3891, lon: 39.8579, timezone: 'Asia/Riyadh' },
    { key: 'medina', nameTr: 'Medine', nameEn: 'Medina', lat: 24.5247, lon: 39.5692, timezone: 'Asia/Riyadh' },
    { key: 'dammam', nameTr: 'Dammam', nameEn: 'Dammam', lat: 26.4207, lon: 50.0888, timezone: 'Asia/Riyadh' },
    { key: 'taif', nameTr: 'Taif', nameEn: 'Taif', lat: 21.2854, lon: 40.4242, timezone: 'Asia/Riyadh' },
    { key: 'tabuk', nameTr: 'Tebük', nameEn: 'Tabuk', lat: 28.3838, lon: 36.555, timezone: 'Asia/Riyadh' },
  ],

  // Birleşik Arap Emirlikleri
  ae: [
    { key: 'dubai', nameTr: 'Dubai', nameEn: 'Dubai', lat: 25.2048, lon: 55.2708, timezone: 'Asia/Dubai' },
    { key: 'abu dhabi', nameTr: 'Abu Dabi', nameEn: 'Abu Dhabi', lat: 24.4539, lon: 54.3773, timezone: 'Asia/Dubai' },
    { key: 'sharjah', nameTr: 'Şarja', nameEn: 'Sharjah', lat: 25.3463, lon: 55.4209, timezone: 'Asia/Dubai' },
    { key: 'al ain', nameTr: 'Al Ain', nameEn: 'Al Ain', lat: 24.1302, lon: 55.8023, timezone: 'Asia/Dubai' },
    { key: 'ajman', nameTr: 'Ajman', nameEn: 'Ajman', lat: 25.4052, lon: 55.5136, timezone: 'Asia/Dubai' },
  ],

  // Katar
  qa: [
    { key: 'doha', nameTr: 'Doha', nameEn: 'Doha', lat: 25.2854, lon: 51.531, timezone: 'Asia/Qatar' },
    { key: 'al rayyan', nameTr: 'Al Rayyan', nameEn: 'Al Rayyan', lat: 25.2919, lon: 51.4244, timezone: 'Asia/Qatar' },
  ],

  // Kuveyt
  kw: [
    { key: 'kuwait city', nameTr: 'Kuveyt', nameEn: 'Kuwait City', lat: 29.3759, lon: 47.9774, timezone: 'Asia/Kuwait' },
    { key: 'al ahmadi', nameTr: 'Al Ahmadi', nameEn: 'Al Ahmadi', lat: 29.0769, lon: 48.0838, timezone: 'Asia/Kuwait' },
    { key: 'hawalli', nameTr: 'Hawalli', nameEn: 'Hawalli', lat: 29.3326, lon: 48.0289, timezone: 'Asia/Kuwait' },
  ],

  // Bahreyn
  bh: [
    { key: 'manama', nameTr: 'Manama', nameEn: 'Manama', lat: 26.2285, lon: 50.586, timezone: 'Asia/Bahrain' },
    { key: 'riffa', nameTr: 'Riffa', nameEn: 'Riffa', lat: 26.13, lon: 50.555, timezone: 'Asia/Bahrain' },
    { key: 'muharraq', nameTr: 'Muharrak', nameEn: 'Muharraq', lat: 26.2572, lon: 50.6119, timezone: 'Asia/Bahrain' },
  ],

  // Umman
  om: [
    { key: 'muscat', nameTr: 'Maskat', nameEn: 'Muscat', lat: 23.588, lon: 58.3829, timezone: 'Asia/Muscat' },
    { key: 'salalah', nameTr: 'Salalah', nameEn: 'Salalah', lat: 17.0151, lon: 54.0924, timezone: 'Asia/Muscat' },
    { key: 'sohar', nameTr: 'Sohar', nameEn: 'Sohar', lat: 24.3417, lon: 56.7079, timezone: 'Asia/Muscat' },
  ],

  // Ürdün
  jo: [
    { key: 'amman', nameTr: 'Amman', nameEn: 'Amman', lat: 31.9454, lon: 35.9284, timezone: 'Asia/Amman' },
    { key: 'zarqa', nameTr: 'Zarka', nameEn: 'Zarqa', lat: 32.0728, lon: 36.088, timezone: 'Asia/Amman' },
    { key: 'irbid', nameTr: 'İrbid', nameEn: 'Irbid', lat: 32.5556, lon: 35.85, timezone: 'Asia/Amman' },
    { key: 'aqaba', nameTr: 'Akabe', nameEn: 'Aqaba', lat: 29.532, lon: 35.0063, timezone: 'Asia/Amman' },
  ],

  // Lübnan
  lb: [
    { key: 'beirut', nameTr: 'Beyrut', nameEn: 'Beirut', lat: 33.8938, lon: 35.5018, timezone: 'Asia/Beirut' },
    { key: 'tripoli', nameTr: 'Trablusşam', nameEn: 'Tripoli', lat: 34.4367, lon: 35.8497, timezone: 'Asia/Beirut' },
    { key: 'sidon', nameTr: 'Sayda', nameEn: 'Sidon', lat: 33.5571, lon: 35.3729, timezone: 'Asia/Beirut' },
  ],

  // Suriye
  sy: [
    { key: 'damascus', nameTr: 'Şam', nameEn: 'Damascus', lat: 33.5138, lon: 36.2765, timezone: 'Asia/Damascus' },
    { key: 'aleppo', nameTr: 'Halep', nameEn: 'Aleppo', lat: 36.2021, lon: 37.1343, timezone: 'Asia/Damascus' },
    { key: 'homs', nameTr: 'Humus', nameEn: 'Homs', lat: 34.7324, lon: 36.7137, timezone: 'Asia/Damascus' },
    { key: 'latakia', nameTr: 'Lazkiye', nameEn: 'Latakia', lat: 35.5196, lon: 35.7915, timezone: 'Asia/Damascus' },
  ],

  // İsrail
  il: [
    { key: 'jerusalem', nameTr: 'Kudüs', nameEn: 'Jerusalem', lat: 31.7683, lon: 35.2137, timezone: 'Asia/Jerusalem' },
    { key: 'tel aviv', nameTr: 'Tel Aviv', nameEn: 'Tel Aviv', lat: 32.0853, lon: 34.7818, timezone: 'Asia/Jerusalem' },
    { key: 'haifa', nameTr: 'Hayfa', nameEn: 'Haifa', lat: 32.794, lon: 34.9896, timezone: 'Asia/Jerusalem' },
    { key: 'beersheba', nameTr: 'Beerşeba', nameEn: 'Beersheba', lat: 31.2518, lon: 34.7913, timezone: 'Asia/Jerusalem' },
  ],

  // Filistin
  ps: [
    { key: 'gaza', nameTr: 'Gazze', nameEn: 'Gaza', lat: 31.5017, lon: 34.4668, timezone: 'Asia/Hebron' },
    { key: 'ramallah', nameTr: 'Ramallah', nameEn: 'Ramallah', lat: 31.9038, lon: 35.2034, timezone: 'Asia/Hebron' },
    { key: 'hebron', nameTr: 'El Halil', nameEn: 'Hebron', lat: 31.5326, lon: 35.0998, timezone: 'Asia/Hebron' },
    { key: 'nablus', nameTr: 'Nablus', nameEn: 'Nablus', lat: 32.2211, lon: 35.2544, timezone: 'Asia/Hebron' },
  ],

  // Yemen
  ye: [
    { key: 'sanaa', nameTr: 'Sana', nameEn: "Sana'a", lat: 15.3694, lon: 44.191, timezone: 'Asia/Aden' },
    { key: 'aden', nameTr: 'Aden', nameEn: 'Aden', lat: 12.7855, lon: 45.0187, timezone: 'Asia/Aden' },
    { key: 'taiz', nameTr: 'Taiz', nameEn: 'Taiz', lat: 13.5795, lon: 44.0209, timezone: 'Asia/Aden' },
    { key: 'al hudaydah', nameTr: 'Hudeyde', nameEn: 'Al Hudaydah', lat: 14.7978, lon: 42.9545, timezone: 'Asia/Aden' },
  ],

  // ===================== AFRİKA =====================

  // Mısır
  eg: [
    { key: 'cairo', nameTr: 'Kahire', nameEn: 'Cairo', lat: 30.0444, lon: 31.2357, timezone: 'Africa/Cairo' },
    { key: 'alexandria', nameTr: 'İskenderiye', nameEn: 'Alexandria', lat: 31.2001, lon: 29.9187, timezone: 'Africa/Cairo' },
    { key: 'giza', nameTr: 'Giza', nameEn: 'Giza', lat: 30.0131, lon: 31.2089, timezone: 'Africa/Cairo' },
    { key: 'shubra el kheima', nameTr: 'Şubra el-Hayma', nameEn: 'Shubra El Kheima', lat: 30.1286, lon: 31.2422, timezone: 'Africa/Cairo' },
    { key: 'port said', nameTr: 'Port Said', nameEn: 'Port Said', lat: 31.2653, lon: 32.3019, timezone: 'Africa/Cairo' },
    { key: 'suez', nameTr: 'Süveyş', nameEn: 'Suez', lat: 29.9668, lon: 32.5498, timezone: 'Africa/Cairo' },
    { key: 'luxor', nameTr: 'Luksor', nameEn: 'Luxor', lat: 25.6872, lon: 32.6396, timezone: 'Africa/Cairo' },
    { key: 'aswan', nameTr: 'Asvan', nameEn: 'Aswan', lat: 24.0889, lon: 32.8998, timezone: 'Africa/Cairo' },
  ],

  // Fas
  ma: [
    { key: 'casablanca', nameTr: 'Kazablanka', nameEn: 'Casablanca', lat: 33.5731, lon: -7.5898, timezone: 'Africa/Casablanca' },
    { key: 'rabat', nameTr: 'Rabat', nameEn: 'Rabat', lat: 34.0209, lon: -6.8416, timezone: 'Africa/Casablanca' },
    { key: 'marrakesh', nameTr: 'Marakeş', nameEn: 'Marrakesh', lat: 31.6295, lon: -7.9811, timezone: 'Africa/Casablanca' },
    { key: 'fes', nameTr: 'Fez', nameEn: 'Fez', lat: 34.0181, lon: -5.0078, timezone: 'Africa/Casablanca' },
    { key: 'tangier', nameTr: 'Tanca', nameEn: 'Tangier', lat: 35.7595, lon: -5.834, timezone: 'Africa/Casablanca' },
    { key: 'agadir', nameTr: 'Agadir', nameEn: 'Agadir', lat: 30.4278, lon: -9.5981, timezone: 'Africa/Casablanca' },
  ],

  // Cezayir
  dz: [
    { key: 'algiers', nameTr: 'Cezayir', nameEn: 'Algiers', lat: 36.7538, lon: 3.0588, timezone: 'Africa/Algiers' },
    { key: 'oran', nameTr: 'Oran', nameEn: 'Oran', lat: 35.6987, lon: -0.6349, timezone: 'Africa/Algiers' },
    { key: 'constantine', nameTr: 'Konstantin', nameEn: 'Constantine', lat: 36.365, lon: 6.6147, timezone: 'Africa/Algiers' },
    { key: 'annaba', nameTr: 'Annaba', nameEn: 'Annaba', lat: 36.9, lon: 7.7667, timezone: 'Africa/Algiers' },
  ],

  // Tunus
  tn: [
    { key: 'tunis', nameTr: 'Tunus', nameEn: 'Tunis', lat: 36.8065, lon: 10.1815, timezone: 'Africa/Tunis' },
    { key: 'sfax', nameTr: 'Sfaks', nameEn: 'Sfax', lat: 34.7406, lon: 10.7603, timezone: 'Africa/Tunis' },
    { key: 'sousse', nameTr: 'Sus', nameEn: 'Sousse', lat: 35.8254, lon: 10.6369, timezone: 'Africa/Tunis' },
  ],

  // Libya
  ly: [
    { key: 'tripoli', nameTr: 'Trablus', nameEn: 'Tripoli', lat: 32.8872, lon: 13.1913, timezone: 'Africa/Tripoli' },
    { key: 'benghazi', nameTr: 'Bingazi', nameEn: 'Benghazi', lat: 32.1167, lon: 20.0667, timezone: 'Africa/Tripoli' },
    { key: 'misrata', nameTr: 'Misrata', nameEn: 'Misrata', lat: 32.3754, lon: 15.0925, timezone: 'Africa/Tripoli' },
  ],

  // Nijerya
  ng: [
    { key: 'lagos', nameTr: 'Lagos', nameEn: 'Lagos', lat: 6.5244, lon: 3.3792, timezone: 'Africa/Lagos' },
    { key: 'abuja', nameTr: 'Abuja', nameEn: 'Abuja', lat: 9.0765, lon: 7.3986, timezone: 'Africa/Lagos' },
    { key: 'kano', nameTr: 'Kano', nameEn: 'Kano', lat: 12.0022, lon: 8.592, timezone: 'Africa/Lagos' },
    { key: 'ibadan', nameTr: 'İbadan', nameEn: 'Ibadan', lat: 7.3775, lon: 3.947, timezone: 'Africa/Lagos' },
    { key: 'port harcourt', nameTr: 'Port Harcourt', nameEn: 'Port Harcourt', lat: 4.8156, lon: 7.0498, timezone: 'Africa/Lagos' },
    { key: 'benin city', nameTr: 'Benin City', nameEn: 'Benin City', lat: 6.335, lon: 5.6037, timezone: 'Africa/Lagos' },
    { key: 'kaduna', nameTr: 'Kaduna', nameEn: 'Kaduna', lat: 10.5222, lon: 7.4383, timezone: 'Africa/Lagos' },
  ],

  // Güney Afrika
  za: [
    { key: 'johannesburg', nameTr: 'Johannesburg', nameEn: 'Johannesburg', lat: -26.2041, lon: 28.0473, timezone: 'Africa/Johannesburg' },
    { key: 'cape town', nameTr: 'Cape Town', nameEn: 'Cape Town', lat: -33.9249, lon: 18.4241, timezone: 'Africa/Johannesburg' },
    { key: 'durban', nameTr: 'Durban', nameEn: 'Durban', lat: -29.8587, lon: 31.0218, timezone: 'Africa/Johannesburg' },
    { key: 'pretoria', nameTr: 'Pretoria', nameEn: 'Pretoria', lat: -25.7479, lon: 28.2293, timezone: 'Africa/Johannesburg' },
    { key: 'port elizabeth', nameTr: 'Port Elizabeth', nameEn: 'Port Elizabeth', lat: -33.9608, lon: 25.6022, timezone: 'Africa/Johannesburg' },
    { key: 'bloemfontein', nameTr: 'Bloemfontein', nameEn: 'Bloemfontein', lat: -29.0852, lon: 26.1596, timezone: 'Africa/Johannesburg' },
  ],

  // Kenya
  ke: [
    { key: 'nairobi', nameTr: 'Nairobi', nameEn: 'Nairobi', lat: -1.2921, lon: 36.8219, timezone: 'Africa/Nairobi' },
    { key: 'mombasa', nameTr: 'Mombasa', nameEn: 'Mombasa', lat: -4.0435, lon: 39.6682, timezone: 'Africa/Nairobi' },
    { key: 'kisumu', nameTr: 'Kisumu', nameEn: 'Kisumu', lat: -0.0917, lon: 34.768, timezone: 'Africa/Nairobi' },
    { key: 'nakuru', nameTr: 'Nakuru', nameEn: 'Nakuru', lat: -0.3031, lon: 36.08, timezone: 'Africa/Nairobi' },
  ],

  // Etiyopya
  et: [
    { key: 'addis ababa', nameTr: 'Addis Ababa', nameEn: 'Addis Ababa', lat: 9.0192, lon: 38.7525, timezone: 'Africa/Addis_Ababa' },
    { key: 'dire dawa', nameTr: 'Dire Dawa', nameEn: 'Dire Dawa', lat: 9.5931, lon: 41.866, timezone: 'Africa/Addis_Ababa' },
    { key: 'mekelle', nameTr: 'Mekele', nameEn: 'Mekelle', lat: 13.4969, lon: 39.4769, timezone: 'Africa/Addis_Ababa' },
  ],

  // Gana
  gh: [
    { key: 'accra', nameTr: 'Akra', nameEn: 'Accra', lat: 5.6037, lon: -0.187, timezone: 'Africa/Accra' },
    { key: 'kumasi', nameTr: 'Kumasi', nameEn: 'Kumasi', lat: 6.6885, lon: -1.6244, timezone: 'Africa/Accra' },
    { key: 'tamale', nameTr: 'Tamale', nameEn: 'Tamale', lat: 9.4008, lon: -0.8393, timezone: 'Africa/Accra' },
  ],

  // Tanzanya
  tz: [
    { key: 'dar es salaam', nameTr: 'Darüsselam', nameEn: 'Dar es Salaam', lat: -6.7924, lon: 39.2083, timezone: 'Africa/Dar_es_Salaam' },
    { key: 'dodoma', nameTr: 'Dodoma', nameEn: 'Dodoma', lat: -6.163, lon: 35.7516, timezone: 'Africa/Dar_es_Salaam' },
    { key: 'mwanza', nameTr: 'Mwanza', nameEn: 'Mwanza', lat: -2.5164, lon: 32.9175, timezone: 'Africa/Dar_es_Salaam' },
    { key: 'arusha', nameTr: 'Arusha', nameEn: 'Arusha', lat: -3.3869, lon: 36.683, timezone: 'Africa/Dar_es_Salaam' },
  ],

  // Uganda
  ug: [
    { key: 'kampala', nameTr: 'Kampala', nameEn: 'Kampala', lat: 0.3476, lon: 32.5825, timezone: 'Africa/Kampala' },
    { key: 'gulu', nameTr: 'Gulu', nameEn: 'Gulu', lat: 2.7747, lon: 32.2989, timezone: 'Africa/Kampala' },
    { key: 'mbarara', nameTr: 'Mbarara', nameEn: 'Mbarara', lat: -0.6072, lon: 30.6545, timezone: 'Africa/Kampala' },
  ],

  // Sudan
  sd: [
    { key: 'khartoum', nameTr: 'Hartum', nameEn: 'Khartoum', lat: 15.5007, lon: 32.5599, timezone: 'Africa/Khartoum' },
    { key: 'omdurman', nameTr: 'Omdurman', nameEn: 'Omdurman', lat: 15.6445, lon: 32.4777, timezone: 'Africa/Khartoum' },
    { key: 'port sudan', nameTr: 'Port Sudan', nameEn: 'Port Sudan', lat: 19.6158, lon: 37.2164, timezone: 'Africa/Khartoum' },
  ],

  // Senegal
  sn: [
    { key: 'dakar', nameTr: 'Dakar', nameEn: 'Dakar', lat: 14.7167, lon: -17.4677, timezone: 'Africa/Dakar' },
    { key: 'touba', nameTr: 'Tuba', nameEn: 'Touba', lat: 14.85, lon: -15.8833, timezone: 'Africa/Dakar' },
    { key: 'thies', nameTr: 'Thies', nameEn: 'Thiès', lat: 14.7886, lon: -16.9246, timezone: 'Africa/Dakar' },
  ],

  // Fildişi Sahili
  ci: [
    { key: 'abidjan', nameTr: 'Abican', nameEn: 'Abidjan', lat: 5.36, lon: -4.0083, timezone: 'Africa/Abidjan' },
    { key: 'yamoussoukro', nameTr: 'Yamoussoukro', nameEn: 'Yamoussoukro', lat: 6.8276, lon: -5.2893, timezone: 'Africa/Abidjan' },
    { key: 'bouake', nameTr: 'Buake', nameEn: 'Bouaké', lat: 7.6939, lon: -5.0303, timezone: 'Africa/Abidjan' },
  ],

  // Kamerun
  cm: [
    { key: 'douala', nameTr: 'Duala', nameEn: 'Douala', lat: 4.0511, lon: 9.7679, timezone: 'Africa/Douala' },
    { key: 'yaounde', nameTr: 'Yaounde', nameEn: 'Yaoundé', lat: 3.848, lon: 11.5021, timezone: 'Africa/Douala' },
    { key: 'garoua', nameTr: 'Garua', nameEn: 'Garoua', lat: 9.3017, lon: 13.3921, timezone: 'Africa/Douala' },
  ],

  // Angola
  ao: [
    { key: 'luanda', nameTr: 'Luanda', nameEn: 'Luanda', lat: -8.839, lon: 13.2894, timezone: 'Africa/Luanda' },
    { key: 'huambo', nameTr: 'Huambo', nameEn: 'Huambo', lat: -12.7761, lon: 15.7392, timezone: 'Africa/Luanda' },
    { key: 'lobito', nameTr: 'Lobito', nameEn: 'Lobito', lat: -12.3645, lon: 13.5363, timezone: 'Africa/Luanda' },
  ],

  // Mozambik
  mz: [
    { key: 'maputo', nameTr: 'Maputo', nameEn: 'Maputo', lat: -25.9692, lon: 32.5732, timezone: 'Africa/Maputo' },
    { key: 'matola', nameTr: 'Matola', nameEn: 'Matola', lat: -25.9622, lon: 32.4589, timezone: 'Africa/Maputo' },
    { key: 'beira', nameTr: 'Beira', nameEn: 'Beira', lat: -19.8436, lon: 34.8389, timezone: 'Africa/Maputo' },
    { key: 'nampula', nameTr: 'Nampula', nameEn: 'Nampula', lat: -15.1165, lon: 39.2666, timezone: 'Africa/Maputo' },
  ],

  // Zimbabve
  zw: [
    { key: 'harare', nameTr: 'Harare', nameEn: 'Harare', lat: -17.8252, lon: 31.0335, timezone: 'Africa/Harare' },
    { key: 'bulawayo', nameTr: 'Bulawayo', nameEn: 'Bulawayo', lat: -20.1325, lon: 28.6265, timezone: 'Africa/Harare' },
    { key: 'chitungwiza', nameTr: 'Chitungwiza', nameEn: 'Chitungwiza', lat: -18.0127, lon: 31.0756, timezone: 'Africa/Harare' },
  ],

  // ===================== OKYANUSYA =====================

  // Avustralya
  au: [
    { key: 'sydney', nameTr: 'Sidney', nameEn: 'Sydney', lat: -33.8688, lon: 151.2093, timezone: 'Australia/Sydney' },
    { key: 'melbourne', nameTr: 'Melbourne', nameEn: 'Melbourne', lat: -37.8136, lon: 144.9631, timezone: 'Australia/Melbourne' },
    { key: 'brisbane', nameTr: 'Brisbane', nameEn: 'Brisbane', lat: -27.4698, lon: 153.0251, timezone: 'Australia/Brisbane' },
    { key: 'perth', nameTr: 'Perth', nameEn: 'Perth', lat: -31.9523, lon: 115.8613, timezone: 'Australia/Perth' },
    { key: 'adelaide', nameTr: 'Adelaide', nameEn: 'Adelaide', lat: -34.9285, lon: 138.6007, timezone: 'Australia/Adelaide' },
    { key: 'canberra', nameTr: 'Canberra', nameEn: 'Canberra', lat: -35.2809, lon: 149.13, timezone: 'Australia/Sydney' },
    { key: 'gold coast', nameTr: 'Gold Coast', nameEn: 'Gold Coast', lat: -28.0167, lon: 153.4, timezone: 'Australia/Brisbane' },
    { key: 'darwin', nameTr: 'Darwin', nameEn: 'Darwin', lat: -12.4634, lon: 130.8456, timezone: 'Australia/Darwin' },
  ],

  // Yeni Zelanda
  nz: [
    { key: 'auckland', nameTr: 'Auckland', nameEn: 'Auckland', lat: -36.8485, lon: 174.7633, timezone: 'Pacific/Auckland' },
    { key: 'wellington', nameTr: 'Wellington', nameEn: 'Wellington', lat: -41.2865, lon: 174.7762, timezone: 'Pacific/Auckland' },
    { key: 'christchurch', nameTr: 'Christchurch', nameEn: 'Christchurch', lat: -43.532, lon: 172.6306, timezone: 'Pacific/Auckland' },
    { key: 'hamilton', nameTr: 'Hamilton', nameEn: 'Hamilton', lat: -37.787, lon: 175.2793, timezone: 'Pacific/Auckland' },
  ],

  // Fiji
  fj: [
    { key: 'suva', nameTr: 'Suva', nameEn: 'Suva', lat: -18.1416, lon: 178.4419, timezone: 'Pacific/Fiji' },
    { key: 'nadi', nameTr: 'Nadi', nameEn: 'Nadi', lat: -17.7765, lon: 177.4356, timezone: 'Pacific/Fiji' },
    { key: 'lautoka', nameTr: 'Lautoka', nameEn: 'Lautoka', lat: -17.6169, lon: 177.4505, timezone: 'Pacific/Fiji' },
  ],

  // Papua Yeni Gine
  pg: [
    { key: 'port moresby', nameTr: 'Port Moresby', nameEn: 'Port Moresby', lat: -9.4438, lon: 147.1803, timezone: 'Pacific/Port_Moresby' },
    { key: 'lae', nameTr: 'Lae', nameEn: 'Lae', lat: -6.7155, lon: 146.9999, timezone: 'Pacific/Port_Moresby' },
  ],
};

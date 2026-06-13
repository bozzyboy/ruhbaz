// ============================================================
// Ruhbaz Konağı - Amerika kıtaları büyük şehir koordinatları (Faz 4.5 / E1, K-4=B)
// ============================================================
// Kapsam: Kuzey Amerika (us, ca, mx), Orta Amerika + Karayipler, tüm Güney Amerika.
// Şehir başına: doğru merkez koordinatı (4 ondalık) + ŞEHRE özgü IANA saat dilimi.
// Amerika kıtaları çok sayıda saat dilimine yayıldığı için her şehrin timezone'u tek tek doğrulandı.
//
// `key`  = şehir adının ascii-normalize hali (astroLocationService.normalizeLocationText ile birebir).
// nameTr = yaygın Türkçe exonym varsa onu; yoksa İngilizce ad.

import type { WorldCity } from './_types';

export const CITIES_AMERICAS: Record<string, WorldCity[]> = {
  // ---- Kuzey Amerika ----
  us: [
    { key: 'new york', nameTr: 'New York', nameEn: 'New York', lat: 40.7128, lon: -74.006, timezone: 'America/New_York' },
    { key: 'los angeles', nameTr: 'Los Angeles', nameEn: 'Los Angeles', lat: 34.0522, lon: -118.2437, timezone: 'America/Los_Angeles' },
    { key: 'chicago', nameTr: 'Chicago', nameEn: 'Chicago', lat: 41.8781, lon: -87.6298, timezone: 'America/Chicago' },
    { key: 'houston', nameTr: 'Houston', nameEn: 'Houston', lat: 29.7604, lon: -95.3698, timezone: 'America/Chicago' },
    { key: 'phoenix', nameTr: 'Phoenix', nameEn: 'Phoenix', lat: 33.4484, lon: -112.074, timezone: 'America/Phoenix' },
    { key: 'philadelphia', nameTr: 'Philadelphia', nameEn: 'Philadelphia', lat: 39.9526, lon: -75.1652, timezone: 'America/New_York' },
    { key: 'san antonio', nameTr: 'San Antonio', nameEn: 'San Antonio', lat: 29.4241, lon: -98.4936, timezone: 'America/Chicago' },
    { key: 'san diego', nameTr: 'San Diego', nameEn: 'San Diego', lat: 32.7157, lon: -117.1611, timezone: 'America/Los_Angeles' },
    { key: 'dallas', nameTr: 'Dallas', nameEn: 'Dallas', lat: 32.7767, lon: -96.797, timezone: 'America/Chicago' },
    { key: 'san francisco', nameTr: 'San Francisco', nameEn: 'San Francisco', lat: 37.7749, lon: -122.4194, timezone: 'America/Los_Angeles' },
    { key: 'seattle', nameTr: 'Seattle', nameEn: 'Seattle', lat: 47.6062, lon: -122.3321, timezone: 'America/Los_Angeles' },
    { key: 'denver', nameTr: 'Denver', nameEn: 'Denver', lat: 39.7392, lon: -104.9903, timezone: 'America/Denver' },
    { key: 'boston', nameTr: 'Boston', nameEn: 'Boston', lat: 42.3601, lon: -71.0589, timezone: 'America/New_York' },
    { key: 'miami', nameTr: 'Miami', nameEn: 'Miami', lat: 25.7617, lon: -80.1918, timezone: 'America/New_York' },
    { key: 'atlanta', nameTr: 'Atlanta', nameEn: 'Atlanta', lat: 33.749, lon: -84.388, timezone: 'America/New_York' },
    { key: 'washington', nameTr: 'Washington', nameEn: 'Washington', lat: 38.9072, lon: -77.0369, timezone: 'America/New_York' },
    { key: 'las vegas', nameTr: 'Las Vegas', nameEn: 'Las Vegas', lat: 36.1699, lon: -115.1398, timezone: 'America/Los_Angeles' },
    { key: 'detroit', nameTr: 'Detroit', nameEn: 'Detroit', lat: 42.3314, lon: -83.0458, timezone: 'America/Detroit' },
    { key: 'honolulu', nameTr: 'Honolulu', nameEn: 'Honolulu', lat: 21.3069, lon: -157.8583, timezone: 'Pacific/Honolulu' },
    { key: 'anchorage', nameTr: 'Anchorage', nameEn: 'Anchorage', lat: 61.2181, lon: -149.9003, timezone: 'America/Anchorage' },
  ],
  ca: [
    { key: 'toronto', nameTr: 'Toronto', nameEn: 'Toronto', lat: 43.6532, lon: -79.3832, timezone: 'America/Toronto' },
    { key: 'montreal', nameTr: 'Montreal', nameEn: 'Montreal', lat: 45.5019, lon: -73.5674, timezone: 'America/Toronto' },
    { key: 'vancouver', nameTr: 'Vancouver', nameEn: 'Vancouver', lat: 49.2827, lon: -123.1207, timezone: 'America/Vancouver' },
    { key: 'calgary', nameTr: 'Calgary', nameEn: 'Calgary', lat: 51.0447, lon: -114.0719, timezone: 'America/Edmonton' },
    { key: 'edmonton', nameTr: 'Edmonton', nameEn: 'Edmonton', lat: 53.5461, lon: -113.4938, timezone: 'America/Edmonton' },
    { key: 'ottawa', nameTr: 'Ottawa', nameEn: 'Ottawa', lat: 45.4215, lon: -75.6972, timezone: 'America/Toronto' },
    { key: 'winnipeg', nameTr: 'Winnipeg', nameEn: 'Winnipeg', lat: 49.8951, lon: -97.1384, timezone: 'America/Winnipeg' },
    { key: 'quebec city', nameTr: 'Quebec City', nameEn: 'Quebec City', lat: 46.8139, lon: -71.208, timezone: 'America/Toronto' },
    { key: 'halifax', nameTr: 'Halifax', nameEn: 'Halifax', lat: 44.6488, lon: -63.5752, timezone: 'America/Halifax' },
    { key: 'st johns', nameTr: "St. John's", nameEn: "St. John's", lat: 47.5615, lon: -52.7126, timezone: 'America/St_Johns' },
  ],
  mx: [
    { key: 'mexico city', nameTr: 'Meksiko City', nameEn: 'Mexico City', lat: 19.4326, lon: -99.1332, timezone: 'America/Mexico_City' },
    { key: 'guadalajara', nameTr: 'Guadalajara', nameEn: 'Guadalajara', lat: 20.6597, lon: -103.3496, timezone: 'America/Mexico_City' },
    { key: 'monterrey', nameTr: 'Monterrey', nameEn: 'Monterrey', lat: 25.6866, lon: -100.3161, timezone: 'America/Monterrey' },
    { key: 'puebla', nameTr: 'Puebla', nameEn: 'Puebla', lat: 19.0414, lon: -98.2063, timezone: 'America/Mexico_City' },
    { key: 'tijuana', nameTr: 'Tijuana', nameEn: 'Tijuana', lat: 32.5149, lon: -117.0382, timezone: 'America/Tijuana' },
    { key: 'cancun', nameTr: 'Cancun', nameEn: 'Cancun', lat: 21.1619, lon: -86.8515, timezone: 'America/Cancun' },
    { key: 'merida', nameTr: 'Merida', nameEn: 'Merida', lat: 20.9674, lon: -89.5926, timezone: 'America/Merida' },
    { key: 'leon', nameTr: 'Leon', nameEn: 'Leon', lat: 21.1619, lon: -101.6921, timezone: 'America/Mexico_City' },
    { key: 'ciudad juarez', nameTr: 'Ciudad Juarez', nameEn: 'Ciudad Juarez', lat: 31.6904, lon: -106.4245, timezone: 'America/Ciudad_Juarez' },
    { key: 'hermosillo', nameTr: 'Hermosillo', nameEn: 'Hermosillo', lat: 29.0729, lon: -110.9559, timezone: 'America/Hermosillo' },
  ],

  // ---- Orta Amerika ----
  gt: [
    { key: 'guatemala city', nameTr: 'Guatemala City', nameEn: 'Guatemala City', lat: 14.6349, lon: -90.5069, timezone: 'America/Guatemala' },
    { key: 'quetzaltenango', nameTr: 'Quetzaltenango', nameEn: 'Quetzaltenango', lat: 14.8333, lon: -91.5167, timezone: 'America/Guatemala' },
  ],
  bz: [
    { key: 'belize city', nameTr: 'Belize City', nameEn: 'Belize City', lat: 17.504, lon: -88.1962, timezone: 'America/Belize' },
    { key: 'belmopan', nameTr: 'Belmopan', nameEn: 'Belmopan', lat: 17.2514, lon: -88.7705, timezone: 'America/Belize' },
  ],
  sv: [
    { key: 'san salvador', nameTr: 'San Salvador', nameEn: 'San Salvador', lat: 13.6929, lon: -89.2182, timezone: 'America/El_Salvador' },
    { key: 'santa ana', nameTr: 'Santa Ana', nameEn: 'Santa Ana', lat: 13.9942, lon: -89.5597, timezone: 'America/El_Salvador' },
  ],
  hn: [
    { key: 'tegucigalpa', nameTr: 'Tegucigalpa', nameEn: 'Tegucigalpa', lat: 14.0723, lon: -87.1921, timezone: 'America/Tegucigalpa' },
    { key: 'san pedro sula', nameTr: 'San Pedro Sula', nameEn: 'San Pedro Sula', lat: 15.5039, lon: -88.0253, timezone: 'America/Tegucigalpa' },
  ],
  ni: [
    { key: 'managua', nameTr: 'Managua', nameEn: 'Managua', lat: 12.1149, lon: -86.2362, timezone: 'America/Managua' },
    { key: 'leon', nameTr: 'Leon', nameEn: 'Leon', lat: 12.4379, lon: -86.878, timezone: 'America/Managua' },
  ],
  cr: [
    { key: 'san jose', nameTr: 'San Jose', nameEn: 'San Jose', lat: 9.9281, lon: -84.0907, timezone: 'America/Costa_Rica' },
    { key: 'alajuela', nameTr: 'Alajuela', nameEn: 'Alajuela', lat: 10.0162, lon: -84.2116, timezone: 'America/Costa_Rica' },
  ],
  pa: [
    { key: 'panama city', nameTr: 'Panama City', nameEn: 'Panama City', lat: 8.9824, lon: -79.5199, timezone: 'America/Panama' },
    { key: 'colon', nameTr: 'Colon', nameEn: 'Colon', lat: 9.3592, lon: -79.9014, timezone: 'America/Panama' },
  ],

  // ---- Karayipler ----
  cu: [
    { key: 'havana', nameTr: 'Havana', nameEn: 'Havana', lat: 23.1136, lon: -82.3666, timezone: 'America/Havana' },
    { key: 'santiago de cuba', nameTr: 'Santiago de Cuba', nameEn: 'Santiago de Cuba', lat: 20.0247, lon: -75.8219, timezone: 'America/Havana' },
  ],
  do: [
    { key: 'santo domingo', nameTr: 'Santo Domingo', nameEn: 'Santo Domingo', lat: 18.4861, lon: -69.9312, timezone: 'America/Santo_Domingo' },
    { key: 'santiago de los caballeros', nameTr: 'Santiago de los Caballeros', nameEn: 'Santiago de los Caballeros', lat: 19.4517, lon: -70.697, timezone: 'America/Santo_Domingo' },
  ],
  ht: [
    { key: 'port-au-prince', nameTr: 'Port-au-Prince', nameEn: 'Port-au-Prince', lat: 18.5944, lon: -72.3074, timezone: 'America/Port-au-Prince' },
    { key: 'cap-haitien', nameTr: 'Cap-Haitien', nameEn: 'Cap-Haïtien', lat: 19.7574, lon: -72.2049, timezone: 'America/Port-au-Prince' },
  ],
  jm: [
    { key: 'kingston', nameTr: 'Kingston', nameEn: 'Kingston', lat: 17.9714, lon: -76.7931, timezone: 'America/Jamaica' },
    { key: 'montego bay', nameTr: 'Montego Bay', nameEn: 'Montego Bay', lat: 18.4762, lon: -77.8939, timezone: 'America/Jamaica' },
  ],
  pr: [
    { key: 'san juan', nameTr: 'San Juan', nameEn: 'San Juan', lat: 18.4655, lon: -66.1057, timezone: 'America/Puerto_Rico' },
    { key: 'ponce', nameTr: 'Ponce', nameEn: 'Ponce', lat: 18.0111, lon: -66.6141, timezone: 'America/Puerto_Rico' },
  ],
  tt: [
    { key: 'port of spain', nameTr: 'Port of Spain', nameEn: 'Port of Spain', lat: 10.6549, lon: -61.5019, timezone: 'America/Port_of_Spain' },
    { key: 'san fernando', nameTr: 'San Fernando', nameEn: 'San Fernando', lat: 10.279, lon: -61.4682, timezone: 'America/Port_of_Spain' },
  ],
  bs: [
    { key: 'nassau', nameTr: 'Nassau', nameEn: 'Nassau', lat: 25.0443, lon: -77.3504, timezone: 'America/Nassau' },
  ],
  bb: [
    { key: 'bridgetown', nameTr: 'Bridgetown', nameEn: 'Bridgetown', lat: 13.1132, lon: -59.5988, timezone: 'America/Barbados' },
  ],

  // ---- Güney Amerika ----
  br: [
    { key: 'sao paulo', nameTr: 'Sao Paulo', nameEn: 'São Paulo', lat: -23.5505, lon: -46.6333, timezone: 'America/Sao_Paulo' },
    { key: 'rio de janeiro', nameTr: 'Rio de Janeiro', nameEn: 'Rio de Janeiro', lat: -22.9068, lon: -43.1729, timezone: 'America/Sao_Paulo' },
    { key: 'brasilia', nameTr: 'Brasilia', nameEn: 'Brasília', lat: -15.7942, lon: -47.8822, timezone: 'America/Sao_Paulo' },
    { key: 'salvador', nameTr: 'Salvador', nameEn: 'Salvador', lat: -12.9777, lon: -38.5016, timezone: 'America/Bahia' },
    { key: 'fortaleza', nameTr: 'Fortaleza', nameEn: 'Fortaleza', lat: -3.7319, lon: -38.5267, timezone: 'America/Fortaleza' },
    { key: 'belo horizonte', nameTr: 'Belo Horizonte', nameEn: 'Belo Horizonte', lat: -19.9167, lon: -43.9345, timezone: 'America/Sao_Paulo' },
    { key: 'manaus', nameTr: 'Manaus', nameEn: 'Manaus', lat: -3.119, lon: -60.0217, timezone: 'America/Manaus' },
    { key: 'curitiba', nameTr: 'Curitiba', nameEn: 'Curitiba', lat: -25.4284, lon: -49.2733, timezone: 'America/Sao_Paulo' },
    { key: 'recife', nameTr: 'Recife', nameEn: 'Recife', lat: -8.0476, lon: -34.877, timezone: 'America/Recife' },
    { key: 'porto alegre', nameTr: 'Porto Alegre', nameEn: 'Porto Alegre', lat: -30.0346, lon: -51.2177, timezone: 'America/Sao_Paulo' },
  ],
  ar: [
    { key: 'buenos aires', nameTr: 'Buenos Aires', nameEn: 'Buenos Aires', lat: -34.6037, lon: -58.3816, timezone: 'America/Argentina/Buenos_Aires' },
    { key: 'cordoba', nameTr: 'Cordoba', nameEn: 'Córdoba', lat: -31.4201, lon: -64.1888, timezone: 'America/Argentina/Cordoba' },
    { key: 'rosario', nameTr: 'Rosario', nameEn: 'Rosario', lat: -32.9442, lon: -60.6505, timezone: 'America/Argentina/Cordoba' },
    { key: 'mendoza', nameTr: 'Mendoza', nameEn: 'Mendoza', lat: -32.8895, lon: -68.8458, timezone: 'America/Argentina/Mendoza' },
    { key: 'la plata', nameTr: 'La Plata', nameEn: 'La Plata', lat: -34.9215, lon: -57.9545, timezone: 'America/Argentina/Buenos_Aires' },
    { key: 'san miguel de tucuman', nameTr: 'San Miguel de Tucuman', nameEn: 'San Miguel de Tucumán', lat: -26.8083, lon: -65.2176, timezone: 'America/Argentina/Tucuman' },
    { key: 'mar del plata', nameTr: 'Mar del Plata', nameEn: 'Mar del Plata', lat: -38.0055, lon: -57.5426, timezone: 'America/Argentina/Buenos_Aires' },
    { key: 'salta', nameTr: 'Salta', nameEn: 'Salta', lat: -24.7821, lon: -65.4232, timezone: 'America/Argentina/Salta' },
    { key: 'ushuaia', nameTr: 'Ushuaia', nameEn: 'Ushuaia', lat: -54.8019, lon: -68.303, timezone: 'America/Argentina/Ushuaia' },
  ],
  cl: [
    { key: 'santiago', nameTr: 'Santiago', nameEn: 'Santiago', lat: -33.4489, lon: -70.6693, timezone: 'America/Santiago' },
    { key: 'valparaiso', nameTr: 'Valparaiso', nameEn: 'Valparaíso', lat: -33.0472, lon: -71.6127, timezone: 'America/Santiago' },
    { key: 'concepcion', nameTr: 'Concepcion', nameEn: 'Concepción', lat: -36.827, lon: -73.0503, timezone: 'America/Santiago' },
    { key: 'antofagasta', nameTr: 'Antofagasta', nameEn: 'Antofagasta', lat: -23.6509, lon: -70.3975, timezone: 'America/Santiago' },
    { key: 'punta arenas', nameTr: 'Punta Arenas', nameEn: 'Punta Arenas', lat: -53.1638, lon: -70.9171, timezone: 'America/Punta_Arenas' },
  ],
  co: [
    { key: 'bogota', nameTr: 'Bogota', nameEn: 'Bogotá', lat: 4.711, lon: -74.0721, timezone: 'America/Bogota' },
    { key: 'medellin', nameTr: 'Medellin', nameEn: 'Medellín', lat: 6.2442, lon: -75.5812, timezone: 'America/Bogota' },
    { key: 'cali', nameTr: 'Cali', nameEn: 'Cali', lat: 3.4516, lon: -76.532, timezone: 'America/Bogota' },
    { key: 'barranquilla', nameTr: 'Barranquilla', nameEn: 'Barranquilla', lat: 10.9685, lon: -74.7813, timezone: 'America/Bogota' },
    { key: 'cartagena', nameTr: 'Cartagena', nameEn: 'Cartagena', lat: 10.391, lon: -75.4794, timezone: 'America/Bogota' },
  ],
  pe: [
    { key: 'lima', nameTr: 'Lima', nameEn: 'Lima', lat: -12.0464, lon: -77.0428, timezone: 'America/Lima' },
    { key: 'arequipa', nameTr: 'Arequipa', nameEn: 'Arequipa', lat: -16.409, lon: -71.5375, timezone: 'America/Lima' },
    { key: 'trujillo', nameTr: 'Trujillo', nameEn: 'Trujillo', lat: -8.109, lon: -79.0215, timezone: 'America/Lima' },
    { key: 'cusco', nameTr: 'Cusco', nameEn: 'Cusco', lat: -13.5319, lon: -71.9675, timezone: 'America/Lima' },
  ],
  ve: [
    { key: 'caracas', nameTr: 'Karakas', nameEn: 'Caracas', lat: 10.4806, lon: -66.9036, timezone: 'America/Caracas' },
    { key: 'maracaibo', nameTr: 'Maracaibo', nameEn: 'Maracaibo', lat: 10.6427, lon: -71.6125, timezone: 'America/Caracas' },
    { key: 'valencia', nameTr: 'Valencia', nameEn: 'Valencia', lat: 10.162, lon: -68.0078, timezone: 'America/Caracas' },
    { key: 'barquisimeto', nameTr: 'Barquisimeto', nameEn: 'Barquisimeto', lat: 10.0647, lon: -69.3301, timezone: 'America/Caracas' },
  ],
  ec: [
    { key: 'quito', nameTr: 'Quito', nameEn: 'Quito', lat: -0.1807, lon: -78.4678, timezone: 'America/Guayaquil' },
    { key: 'guayaquil', nameTr: 'Guayaquil', nameEn: 'Guayaquil', lat: -2.1894, lon: -79.8891, timezone: 'America/Guayaquil' },
    { key: 'cuenca', nameTr: 'Cuenca', nameEn: 'Cuenca', lat: -2.9001, lon: -79.0059, timezone: 'America/Guayaquil' },
  ],
  bo: [
    { key: 'la paz', nameTr: 'La Paz', nameEn: 'La Paz', lat: -16.4897, lon: -68.1193, timezone: 'America/La_Paz' },
    { key: 'santa cruz de la sierra', nameTr: 'Santa Cruz de la Sierra', nameEn: 'Santa Cruz de la Sierra', lat: -17.7833, lon: -63.1821, timezone: 'America/La_Paz' },
    { key: 'cochabamba', nameTr: 'Cochabamba', nameEn: 'Cochabamba', lat: -17.3895, lon: -66.1568, timezone: 'America/La_Paz' },
    { key: 'sucre', nameTr: 'Sucre', nameEn: 'Sucre', lat: -19.0421, lon: -65.2559, timezone: 'America/La_Paz' },
  ],
  py: [
    { key: 'asuncion', nameTr: 'Asuncion', nameEn: 'Asunción', lat: -25.2637, lon: -57.5759, timezone: 'America/Asuncion' },
    { key: 'ciudad del este', nameTr: 'Ciudad del Este', nameEn: 'Ciudad del Este', lat: -25.5097, lon: -54.6111, timezone: 'America/Asuncion' },
  ],
  uy: [
    { key: 'montevideo', nameTr: 'Montevideo', nameEn: 'Montevideo', lat: -34.9011, lon: -56.1645, timezone: 'America/Montevideo' },
    { key: 'salto', nameTr: 'Salto', nameEn: 'Salto', lat: -31.3833, lon: -57.9667, timezone: 'America/Montevideo' },
  ],
  gy: [
    { key: 'georgetown', nameTr: 'Georgetown', nameEn: 'Georgetown', lat: 6.8013, lon: -58.1551, timezone: 'America/Guyana' },
  ],
  sr: [
    { key: 'paramaribo', nameTr: 'Paramaribo', nameEn: 'Paramaribo', lat: 5.852, lon: -55.2038, timezone: 'America/Paramaribo' },
  ],
};

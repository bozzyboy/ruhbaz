// ============================================================
// Ruhbaz Konağı - Asya büyük şehir koordinatları (Faz 4.5 / E1, K-4=B)
// ============================================================
// Doğum yeri seçici için ülke koduna göre büyük şehir listeleri.
// Kapsam: Doğu Asya, Güney Asya, Güneydoğu Asya, Orta Asya.
// HARİÇ: Kafkasya (Avrupa dosyasında), Orta Doğu (MENA dosyasında), Türkiye.
//
// `key`      = şehir adının ascii-normalize küçük harf hali (koordinat anahtarı).
// `nameTr`   = yaygın Türkçe egzonim varsa o; yoksa İngilizce ad.
// `nameEn`   = standart İngilizce şehir adı.
// `lat`/`lon`= şehir merkezi koordinatı (4 ondalık, ±2km).
// `timezone` = şehre özel doğru IANA saat dilimi.

import type { WorldCity } from './_types';

export const CITIES_ASIA: Record<string, WorldCity[]> = {
  // ---------------------------------------------------------
  // DOĞU ASYA
  // ---------------------------------------------------------
  cn: [
    { key: 'beijing', nameTr: 'Pekin', nameEn: 'Beijing', lat: 39.9042, lon: 116.4074, timezone: 'Asia/Shanghai' },
    { key: 'shanghai', nameTr: 'Şanghay', nameEn: 'Shanghai', lat: 31.2304, lon: 121.4737, timezone: 'Asia/Shanghai' },
    { key: 'guangzhou', nameTr: 'Guangzhou', nameEn: 'Guangzhou', lat: 23.1291, lon: 113.2644, timezone: 'Asia/Shanghai' },
    { key: 'shenzhen', nameTr: 'Shenzhen', nameEn: 'Shenzhen', lat: 22.5431, lon: 114.0579, timezone: 'Asia/Shanghai' },
    { key: 'chengdu', nameTr: 'Chengdu', nameEn: 'Chengdu', lat: 30.5728, lon: 104.0668, timezone: 'Asia/Shanghai' },
    { key: 'chongqing', nameTr: 'Chongqing', nameEn: 'Chongqing', lat: 29.5630, lon: 106.5516, timezone: 'Asia/Shanghai' },
    { key: 'tianjin', nameTr: 'Tianjin', nameEn: 'Tianjin', lat: 39.3434, lon: 117.3616, timezone: 'Asia/Shanghai' },
    { key: 'wuhan', nameTr: 'Wuhan', nameEn: 'Wuhan', lat: 30.5928, lon: 114.3055, timezone: 'Asia/Shanghai' },
    { key: 'xi an', nameTr: "Xi'an", nameEn: "Xi'an", lat: 34.3416, lon: 108.9398, timezone: 'Asia/Shanghai' },
    { key: 'hangzhou', nameTr: 'Hangzhou', nameEn: 'Hangzhou', lat: 30.2741, lon: 120.1551, timezone: 'Asia/Shanghai' },
    { key: 'nanjing', nameTr: 'Nanjing', nameEn: 'Nanjing', lat: 32.0603, lon: 118.7969, timezone: 'Asia/Shanghai' },
    { key: 'shenyang', nameTr: 'Shenyang', nameEn: 'Shenyang', lat: 41.8057, lon: 123.4315, timezone: 'Asia/Shanghai' },
    { key: 'harbin', nameTr: 'Harbin', nameEn: 'Harbin', lat: 45.8038, lon: 126.5347, timezone: 'Asia/Shanghai' },
    { key: 'qingdao', nameTr: 'Qingdao', nameEn: 'Qingdao', lat: 36.0671, lon: 120.3826, timezone: 'Asia/Shanghai' },
    { key: 'kunming', nameTr: 'Kunming', nameEn: 'Kunming', lat: 25.0389, lon: 102.7183, timezone: 'Asia/Shanghai' },
    { key: 'urumqi', nameTr: 'Ürümçi', nameEn: 'Urumqi', lat: 43.8256, lon: 87.6168, timezone: 'Asia/Shanghai' },
    { key: 'lhasa', nameTr: 'Lhasa', nameEn: 'Lhasa', lat: 29.6520, lon: 91.1721, timezone: 'Asia/Shanghai' },
  ],
  jp: [
    { key: 'tokyo', nameTr: 'Tokyo', nameEn: 'Tokyo', lat: 35.6762, lon: 139.6503, timezone: 'Asia/Tokyo' },
    { key: 'yokohama', nameTr: 'Yokohama', nameEn: 'Yokohama', lat: 35.4437, lon: 139.6380, timezone: 'Asia/Tokyo' },
    { key: 'osaka', nameTr: 'Osaka', nameEn: 'Osaka', lat: 34.6937, lon: 135.5023, timezone: 'Asia/Tokyo' },
    { key: 'nagoya', nameTr: 'Nagoya', nameEn: 'Nagoya', lat: 35.1815, lon: 136.9066, timezone: 'Asia/Tokyo' },
    { key: 'sapporo', nameTr: 'Sapporo', nameEn: 'Sapporo', lat: 43.0618, lon: 141.3545, timezone: 'Asia/Tokyo' },
    { key: 'fukuoka', nameTr: 'Fukuoka', nameEn: 'Fukuoka', lat: 33.5904, lon: 130.4017, timezone: 'Asia/Tokyo' },
    { key: 'kobe', nameTr: 'Kobe', nameEn: 'Kobe', lat: 34.6901, lon: 135.1955, timezone: 'Asia/Tokyo' },
    { key: 'kyoto', nameTr: 'Kyoto', nameEn: 'Kyoto', lat: 35.0116, lon: 135.7681, timezone: 'Asia/Tokyo' },
    { key: 'sendai', nameTr: 'Sendai', nameEn: 'Sendai', lat: 38.2682, lon: 140.8694, timezone: 'Asia/Tokyo' },
    { key: 'hiroshima', nameTr: 'Hiroşima', nameEn: 'Hiroshima', lat: 34.3853, lon: 132.4553, timezone: 'Asia/Tokyo' },
  ],
  kr: [
    { key: 'seoul', nameTr: 'Seul', nameEn: 'Seoul', lat: 37.5665, lon: 126.9780, timezone: 'Asia/Seoul' },
    { key: 'busan', nameTr: 'Busan', nameEn: 'Busan', lat: 35.1796, lon: 129.0756, timezone: 'Asia/Seoul' },
    { key: 'incheon', nameTr: 'Incheon', nameEn: 'Incheon', lat: 37.4563, lon: 126.7052, timezone: 'Asia/Seoul' },
    { key: 'daegu', nameTr: 'Daegu', nameEn: 'Daegu', lat: 35.8714, lon: 128.6014, timezone: 'Asia/Seoul' },
    { key: 'daejeon', nameTr: 'Daejeon', nameEn: 'Daejeon', lat: 36.3504, lon: 127.3845, timezone: 'Asia/Seoul' },
    { key: 'gwangju', nameTr: 'Gwangju', nameEn: 'Gwangju', lat: 35.1595, lon: 126.8526, timezone: 'Asia/Seoul' },
    { key: 'ulsan', nameTr: 'Ulsan', nameEn: 'Ulsan', lat: 35.5384, lon: 129.3114, timezone: 'Asia/Seoul' },
    { key: 'suwon', nameTr: 'Suwon', nameEn: 'Suwon', lat: 37.2636, lon: 127.0286, timezone: 'Asia/Seoul' },
  ],
  kp: [
    { key: 'pyongyang', nameTr: 'Pyongyang', nameEn: 'Pyongyang', lat: 39.0392, lon: 125.7625, timezone: 'Asia/Pyongyang' },
    { key: 'hamhung', nameTr: 'Hamhung', nameEn: 'Hamhung', lat: 39.9183, lon: 127.5364, timezone: 'Asia/Pyongyang' },
    { key: 'chongjin', nameTr: 'Chongjin', nameEn: 'Chongjin', lat: 41.7956, lon: 129.7756, timezone: 'Asia/Pyongyang' },
    { key: 'nampo', nameTr: 'Nampo', nameEn: 'Nampo', lat: 38.7370, lon: 125.4075, timezone: 'Asia/Pyongyang' },
  ],
  tw: [
    { key: 'taipei', nameTr: 'Taipei', nameEn: 'Taipei', lat: 25.0330, lon: 121.5654, timezone: 'Asia/Taipei' },
    { key: 'kaohsiung', nameTr: 'Kaohsiung', nameEn: 'Kaohsiung', lat: 22.6273, lon: 120.3014, timezone: 'Asia/Taipei' },
    { key: 'taichung', nameTr: 'Taichung', nameEn: 'Taichung', lat: 24.1477, lon: 120.6736, timezone: 'Asia/Taipei' },
    { key: 'tainan', nameTr: 'Tainan', nameEn: 'Tainan', lat: 22.9999, lon: 120.2270, timezone: 'Asia/Taipei' },
    { key: 'taoyuan', nameTr: 'Taoyuan', nameEn: 'Taoyuan', lat: 24.9936, lon: 121.3010, timezone: 'Asia/Taipei' },
  ],
  hk: [
    { key: 'hong kong', nameTr: 'Hong Kong', nameEn: 'Hong Kong', lat: 22.3193, lon: 114.1694, timezone: 'Asia/Hong_Kong' },
    { key: 'kowloon', nameTr: 'Kowloon', nameEn: 'Kowloon', lat: 22.3167, lon: 114.1833, timezone: 'Asia/Hong_Kong' },
  ],
  mn: [
    { key: 'ulaanbaatar', nameTr: 'Ulan Batur', nameEn: 'Ulaanbaatar', lat: 47.8864, lon: 106.9057, timezone: 'Asia/Ulaanbaatar' },
    { key: 'erdenet', nameTr: 'Erdenet', nameEn: 'Erdenet', lat: 49.0278, lon: 104.0444, timezone: 'Asia/Ulaanbaatar' },
    { key: 'darkhan', nameTr: 'Darhan', nameEn: 'Darkhan', lat: 49.4867, lon: 105.9228, timezone: 'Asia/Ulaanbaatar' },
  ],

  // ---------------------------------------------------------
  // GÜNEY ASYA
  // ---------------------------------------------------------
  in: [
    { key: 'new delhi', nameTr: 'Yeni Delhi', nameEn: 'New Delhi', lat: 28.6139, lon: 77.2090, timezone: 'Asia/Kolkata' },
    { key: 'mumbai', nameTr: 'Mumbai', nameEn: 'Mumbai', lat: 19.0760, lon: 72.8777, timezone: 'Asia/Kolkata' },
    { key: 'kolkata', nameTr: 'Kalküta', nameEn: 'Kolkata', lat: 22.5726, lon: 88.3639, timezone: 'Asia/Kolkata' },
    { key: 'bengaluru', nameTr: 'Bengaluru', nameEn: 'Bengaluru', lat: 12.9716, lon: 77.5946, timezone: 'Asia/Kolkata' },
    { key: 'chennai', nameTr: 'Chennai', nameEn: 'Chennai', lat: 13.0827, lon: 80.2707, timezone: 'Asia/Kolkata' },
    { key: 'hyderabad', nameTr: 'Haydarabad', nameEn: 'Hyderabad', lat: 17.3850, lon: 78.4867, timezone: 'Asia/Kolkata' },
    { key: 'ahmedabad', nameTr: 'Ahmedabad', nameEn: 'Ahmedabad', lat: 23.0225, lon: 72.5714, timezone: 'Asia/Kolkata' },
    { key: 'pune', nameTr: 'Pune', nameEn: 'Pune', lat: 18.5204, lon: 73.8567, timezone: 'Asia/Kolkata' },
    { key: 'surat', nameTr: 'Surat', nameEn: 'Surat', lat: 21.1702, lon: 72.8311, timezone: 'Asia/Kolkata' },
    { key: 'jaipur', nameTr: 'Jaipur', nameEn: 'Jaipur', lat: 26.9124, lon: 75.7873, timezone: 'Asia/Kolkata' },
    { key: 'lucknow', nameTr: 'Lucknow', nameEn: 'Lucknow', lat: 26.8467, lon: 80.9462, timezone: 'Asia/Kolkata' },
    { key: 'kanpur', nameTr: 'Kanpur', nameEn: 'Kanpur', lat: 26.4499, lon: 80.3319, timezone: 'Asia/Kolkata' },
    { key: 'nagpur', nameTr: 'Nagpur', nameEn: 'Nagpur', lat: 21.1458, lon: 79.0882, timezone: 'Asia/Kolkata' },
    { key: 'patna', nameTr: 'Patna', nameEn: 'Patna', lat: 25.5941, lon: 85.1376, timezone: 'Asia/Kolkata' },
    { key: 'bhopal', nameTr: 'Bhopal', nameEn: 'Bhopal', lat: 23.2599, lon: 77.4126, timezone: 'Asia/Kolkata' },
    { key: 'indore', nameTr: 'Indore', nameEn: 'Indore', lat: 22.7196, lon: 75.8577, timezone: 'Asia/Kolkata' },
  ],
  pk: [
    { key: 'islamabad', nameTr: 'İslamabad', nameEn: 'Islamabad', lat: 33.6844, lon: 73.0479, timezone: 'Asia/Karachi' },
    { key: 'karachi', nameTr: 'Karaçi', nameEn: 'Karachi', lat: 24.8607, lon: 67.0011, timezone: 'Asia/Karachi' },
    { key: 'lahore', nameTr: 'Lahor', nameEn: 'Lahore', lat: 31.5204, lon: 74.3587, timezone: 'Asia/Karachi' },
    { key: 'faisalabad', nameTr: 'Faisalabad', nameEn: 'Faisalabad', lat: 31.4187, lon: 73.0791, timezone: 'Asia/Karachi' },
    { key: 'rawalpindi', nameTr: 'Rawalpindi', nameEn: 'Rawalpindi', lat: 33.5651, lon: 73.0169, timezone: 'Asia/Karachi' },
    { key: 'multan', nameTr: 'Multan', nameEn: 'Multan', lat: 30.1575, lon: 71.5249, timezone: 'Asia/Karachi' },
    { key: 'peshawar', nameTr: 'Peşaver', nameEn: 'Peshawar', lat: 34.0151, lon: 71.5249, timezone: 'Asia/Karachi' },
    { key: 'quetta', nameTr: 'Quetta', nameEn: 'Quetta', lat: 30.1798, lon: 66.9750, timezone: 'Asia/Karachi' },
  ],
  bd: [
    { key: 'dhaka', nameTr: 'Dakka', nameEn: 'Dhaka', lat: 23.8103, lon: 90.4125, timezone: 'Asia/Dhaka' },
    { key: 'chittagong', nameTr: 'Chittagong', nameEn: 'Chittagong', lat: 22.3569, lon: 91.7832, timezone: 'Asia/Dhaka' },
    { key: 'khulna', nameTr: 'Khulna', nameEn: 'Khulna', lat: 22.8456, lon: 89.5403, timezone: 'Asia/Dhaka' },
    { key: 'rajshahi', nameTr: 'Rajshahi', nameEn: 'Rajshahi', lat: 24.3745, lon: 88.6042, timezone: 'Asia/Dhaka' },
    { key: 'sylhet', nameTr: 'Sylhet', nameEn: 'Sylhet', lat: 24.8949, lon: 91.8687, timezone: 'Asia/Dhaka' },
  ],
  lk: [
    { key: 'colombo', nameTr: 'Kolombo', nameEn: 'Colombo', lat: 6.9271, lon: 79.8612, timezone: 'Asia/Colombo' },
    { key: 'sri jayawardenepura kotte', nameTr: 'Sri Jayawardenepura Kotte', nameEn: 'Sri Jayawardenepura Kotte', lat: 6.8880, lon: 79.9187, timezone: 'Asia/Colombo' },
    { key: 'kandy', nameTr: 'Kandy', nameEn: 'Kandy', lat: 7.2906, lon: 80.6337, timezone: 'Asia/Colombo' },
    { key: 'galle', nameTr: 'Galle', nameEn: 'Galle', lat: 6.0535, lon: 80.2210, timezone: 'Asia/Colombo' },
    { key: 'jaffna', nameTr: 'Jaffna', nameEn: 'Jaffna', lat: 9.6615, lon: 80.0255, timezone: 'Asia/Colombo' },
  ],
  np: [
    { key: 'kathmandu', nameTr: 'Katmandu', nameEn: 'Kathmandu', lat: 27.7172, lon: 85.3240, timezone: 'Asia/Kathmandu' },
    { key: 'pokhara', nameTr: 'Pokhara', nameEn: 'Pokhara', lat: 28.2096, lon: 83.9856, timezone: 'Asia/Kathmandu' },
    { key: 'lalitpur', nameTr: 'Lalitpur', nameEn: 'Lalitpur', lat: 27.6588, lon: 85.3247, timezone: 'Asia/Kathmandu' },
    { key: 'biratnagar', nameTr: 'Biratnagar', nameEn: 'Biratnagar', lat: 26.4525, lon: 87.2718, timezone: 'Asia/Kathmandu' },
  ],

  // ---------------------------------------------------------
  // GÜNEYDOĞU ASYA
  // ---------------------------------------------------------
  id: [
    { key: 'jakarta', nameTr: 'Cakarta', nameEn: 'Jakarta', lat: -6.2088, lon: 106.8456, timezone: 'Asia/Jakarta' },
    { key: 'surabaya', nameTr: 'Surabaya', nameEn: 'Surabaya', lat: -7.2575, lon: 112.7521, timezone: 'Asia/Jakarta' },
    { key: 'bandung', nameTr: 'Bandung', nameEn: 'Bandung', lat: -6.9175, lon: 107.6191, timezone: 'Asia/Jakarta' },
    { key: 'medan', nameTr: 'Medan', nameEn: 'Medan', lat: 3.5952, lon: 98.6722, timezone: 'Asia/Jakarta' },
    { key: 'semarang', nameTr: 'Semarang', nameEn: 'Semarang', lat: -6.9667, lon: 110.4167, timezone: 'Asia/Jakarta' },
    { key: 'palembang', nameTr: 'Palembang', nameEn: 'Palembang', lat: -2.9909, lon: 104.7566, timezone: 'Asia/Jakarta' },
    { key: 'makassar', nameTr: 'Makassar', nameEn: 'Makassar', lat: -5.1477, lon: 119.4327, timezone: 'Asia/Makassar' },
    { key: 'denpasar', nameTr: 'Denpasar', nameEn: 'Denpasar', lat: -8.6705, lon: 115.2126, timezone: 'Asia/Makassar' },
    { key: 'balikpapan', nameTr: 'Balikpapan', nameEn: 'Balikpapan', lat: -1.2379, lon: 116.8529, timezone: 'Asia/Makassar' },
    { key: 'manado', nameTr: 'Manado', nameEn: 'Manado', lat: 1.4748, lon: 124.8421, timezone: 'Asia/Makassar' },
    { key: 'jayapura', nameTr: 'Jayapura', nameEn: 'Jayapura', lat: -2.5337, lon: 140.7181, timezone: 'Asia/Jayapura' },
  ],
  th: [
    { key: 'bangkok', nameTr: 'Bangkok', nameEn: 'Bangkok', lat: 13.7563, lon: 100.5018, timezone: 'Asia/Bangkok' },
    { key: 'nonthaburi', nameTr: 'Nonthaburi', nameEn: 'Nonthaburi', lat: 13.8591, lon: 100.5217, timezone: 'Asia/Bangkok' },
    { key: 'chiang mai', nameTr: 'Chiang Mai', nameEn: 'Chiang Mai', lat: 18.7883, lon: 98.9853, timezone: 'Asia/Bangkok' },
    { key: 'nakhon ratchasima', nameTr: 'Nakhon Ratchasima', nameEn: 'Nakhon Ratchasima', lat: 14.9799, lon: 102.0978, timezone: 'Asia/Bangkok' },
    { key: 'hat yai', nameTr: 'Hat Yai', nameEn: 'Hat Yai', lat: 7.0084, lon: 100.4747, timezone: 'Asia/Bangkok' },
    { key: 'pattaya', nameTr: 'Pattaya', nameEn: 'Pattaya', lat: 12.9236, lon: 100.8825, timezone: 'Asia/Bangkok' },
    { key: 'phuket', nameTr: 'Phuket', nameEn: 'Phuket', lat: 7.8804, lon: 98.3923, timezone: 'Asia/Bangkok' },
    { key: 'udon thani', nameTr: 'Udon Thani', nameEn: 'Udon Thani', lat: 17.4138, lon: 102.7870, timezone: 'Asia/Bangkok' },
  ],
  vn: [
    { key: 'hanoi', nameTr: 'Hanoi', nameEn: 'Hanoi', lat: 21.0278, lon: 105.8342, timezone: 'Asia/Ho_Chi_Minh' },
    { key: 'ho chi minh city', nameTr: 'Ho Chi Minh', nameEn: 'Ho Chi Minh City', lat: 10.8231, lon: 106.6297, timezone: 'Asia/Ho_Chi_Minh' },
    { key: 'da nang', nameTr: 'Da Nang', nameEn: 'Da Nang', lat: 16.0544, lon: 108.2022, timezone: 'Asia/Ho_Chi_Minh' },
    { key: 'haiphong', nameTr: 'Haiphong', nameEn: 'Haiphong', lat: 20.8449, lon: 106.6881, timezone: 'Asia/Ho_Chi_Minh' },
    { key: 'can tho', nameTr: 'Can Tho', nameEn: 'Can Tho', lat: 10.0452, lon: 105.7469, timezone: 'Asia/Ho_Chi_Minh' },
    { key: 'bien hoa', nameTr: 'Bien Hoa', nameEn: 'Bien Hoa', lat: 10.9447, lon: 106.8243, timezone: 'Asia/Ho_Chi_Minh' },
    { key: 'nha trang', nameTr: 'Nha Trang', nameEn: 'Nha Trang', lat: 12.2388, lon: 109.1967, timezone: 'Asia/Ho_Chi_Minh' },
    { key: 'hue', nameTr: 'Hue', nameEn: 'Hue', lat: 16.4637, lon: 107.5909, timezone: 'Asia/Ho_Chi_Minh' },
  ],
  ph: [
    { key: 'manila', nameTr: 'Manila', nameEn: 'Manila', lat: 14.5995, lon: 120.9842, timezone: 'Asia/Manila' },
    { key: 'quezon city', nameTr: 'Quezon City', nameEn: 'Quezon City', lat: 14.6760, lon: 121.0437, timezone: 'Asia/Manila' },
    { key: 'davao', nameTr: 'Davao', nameEn: 'Davao', lat: 7.1907, lon: 125.4553, timezone: 'Asia/Manila' },
    { key: 'cebu', nameTr: 'Cebu', nameEn: 'Cebu City', lat: 10.3157, lon: 123.8854, timezone: 'Asia/Manila' },
    { key: 'zamboanga', nameTr: 'Zamboanga', nameEn: 'Zamboanga City', lat: 6.9214, lon: 122.0790, timezone: 'Asia/Manila' },
    { key: 'caloocan', nameTr: 'Caloocan', nameEn: 'Caloocan', lat: 14.6510, lon: 120.9676, timezone: 'Asia/Manila' },
    { key: 'taguig', nameTr: 'Taguig', nameEn: 'Taguig', lat: 14.5176, lon: 121.0509, timezone: 'Asia/Manila' },
    { key: 'baguio', nameTr: 'Baguio', nameEn: 'Baguio', lat: 16.4023, lon: 120.5960, timezone: 'Asia/Manila' },
  ],
  my: [
    { key: 'kuala lumpur', nameTr: 'Kuala Lumpur', nameEn: 'Kuala Lumpur', lat: 3.1390, lon: 101.6869, timezone: 'Asia/Kuala_Lumpur' },
    { key: 'george town', nameTr: 'George Town', nameEn: 'George Town', lat: 5.4141, lon: 100.3288, timezone: 'Asia/Kuala_Lumpur' },
    { key: 'ipoh', nameTr: 'Ipoh', nameEn: 'Ipoh', lat: 4.5975, lon: 101.0901, timezone: 'Asia/Kuala_Lumpur' },
    { key: 'johor bahru', nameTr: 'Johor Bahru', nameEn: 'Johor Bahru', lat: 1.4927, lon: 103.7414, timezone: 'Asia/Kuala_Lumpur' },
    { key: 'kuching', nameTr: 'Kuching', nameEn: 'Kuching', lat: 1.5535, lon: 110.3593, timezone: 'Asia/Kuching' },
    { key: 'kota kinabalu', nameTr: 'Kota Kinabalu', nameEn: 'Kota Kinabalu', lat: 5.9804, lon: 116.0735, timezone: 'Asia/Kuching' },
  ],
  sg: [
    { key: 'singapore', nameTr: 'Singapur', nameEn: 'Singapore', lat: 1.3521, lon: 103.8198, timezone: 'Asia/Singapore' },
  ],
  mm: [
    { key: 'yangon', nameTr: 'Yangon', nameEn: 'Yangon', lat: 16.8409, lon: 96.1735, timezone: 'Asia/Yangon' },
    { key: 'mandalay', nameTr: 'Mandalay', nameEn: 'Mandalay', lat: 21.9588, lon: 96.0891, timezone: 'Asia/Yangon' },
    { key: 'naypyidaw', nameTr: 'Naypyidaw', nameEn: 'Naypyidaw', lat: 19.7633, lon: 96.0785, timezone: 'Asia/Yangon' },
    { key: 'mawlamyine', nameTr: 'Mawlamyine', nameEn: 'Mawlamyine', lat: 16.4905, lon: 97.6283, timezone: 'Asia/Yangon' },
  ],
  kh: [
    { key: 'phnom penh', nameTr: 'Phnom Penh', nameEn: 'Phnom Penh', lat: 11.5564, lon: 104.9282, timezone: 'Asia/Phnom_Penh' },
    { key: 'siem reap', nameTr: 'Siem Reap', nameEn: 'Siem Reap', lat: 13.3633, lon: 103.8564, timezone: 'Asia/Phnom_Penh' },
    { key: 'battambang', nameTr: 'Battambang', nameEn: 'Battambang', lat: 13.0957, lon: 103.2022, timezone: 'Asia/Phnom_Penh' },
    { key: 'sihanoukville', nameTr: 'Sihanoukville', nameEn: 'Sihanoukville', lat: 10.6093, lon: 103.5296, timezone: 'Asia/Phnom_Penh' },
  ],
  la: [
    { key: 'vientiane', nameTr: 'Vientiane', nameEn: 'Vientiane', lat: 17.9757, lon: 102.6331, timezone: 'Asia/Vientiane' },
    { key: 'pakse', nameTr: 'Pakse', nameEn: 'Pakse', lat: 15.1202, lon: 105.7991, timezone: 'Asia/Vientiane' },
    { key: 'luang prabang', nameTr: 'Luang Prabang', nameEn: 'Luang Prabang', lat: 19.8845, lon: 102.1348, timezone: 'Asia/Vientiane' },
    { key: 'savannakhet', nameTr: 'Savannakhet', nameEn: 'Savannakhet', lat: 16.5560, lon: 104.7510, timezone: 'Asia/Vientiane' },
  ],

  // ---------------------------------------------------------
  // ORTA ASYA
  // ---------------------------------------------------------
  kz: [
    { key: 'almaty', nameTr: 'Almatı', nameEn: 'Almaty', lat: 43.2220, lon: 76.8512, timezone: 'Asia/Almaty' },
    { key: 'astana', nameTr: 'Astana', nameEn: 'Astana', lat: 51.1605, lon: 71.4704, timezone: 'Asia/Almaty' },
    { key: 'shymkent', nameTr: 'Şımkent', nameEn: 'Shymkent', lat: 42.3417, lon: 69.5901, timezone: 'Asia/Almaty' },
    { key: 'karaganda', nameTr: 'Karaganda', nameEn: 'Karaganda', lat: 49.8047, lon: 73.1094, timezone: 'Asia/Almaty' },
    { key: 'aktobe', nameTr: 'Aktöbe', nameEn: 'Aktobe', lat: 50.2839, lon: 57.1670, timezone: 'Asia/Aqtobe' },
  ],
  uz: [
    { key: 'tashkent', nameTr: 'Taşkent', nameEn: 'Tashkent', lat: 41.2995, lon: 69.2401, timezone: 'Asia/Tashkent' },
    { key: 'samarkand', nameTr: 'Semerkant', nameEn: 'Samarkand', lat: 39.6270, lon: 66.9750, timezone: 'Asia/Samarkand' },
    { key: 'namangan', nameTr: 'Namangan', nameEn: 'Namangan', lat: 40.9983, lon: 71.6726, timezone: 'Asia/Tashkent' },
    { key: 'andijan', nameTr: 'Andican', nameEn: 'Andijan', lat: 40.7821, lon: 72.3442, timezone: 'Asia/Tashkent' },
    { key: 'bukhara', nameTr: 'Buhara', nameEn: 'Bukhara', lat: 39.7747, lon: 64.4286, timezone: 'Asia/Samarkand' },
  ],
  tm: [
    { key: 'ashgabat', nameTr: 'Aşkabat', nameEn: 'Ashgabat', lat: 37.9601, lon: 58.3261, timezone: 'Asia/Ashgabat' },
    { key: 'turkmenabat', nameTr: 'Türkmenabat', nameEn: 'Turkmenabat', lat: 39.0733, lon: 63.5786, timezone: 'Asia/Ashgabat' },
    { key: 'dasoguz', nameTr: 'Daşoguz', nameEn: 'Dasoguz', lat: 41.8363, lon: 59.9666, timezone: 'Asia/Ashgabat' },
    { key: 'mary', nameTr: 'Mary', nameEn: 'Mary', lat: 37.6000, lon: 61.8333, timezone: 'Asia/Ashgabat' },
  ],
  kg: [
    { key: 'bishkek', nameTr: 'Bişkek', nameEn: 'Bishkek', lat: 42.8746, lon: 74.5698, timezone: 'Asia/Bishkek' },
    { key: 'osh', nameTr: 'Oş', nameEn: 'Osh', lat: 40.5283, lon: 72.7985, timezone: 'Asia/Bishkek' },
    { key: 'jalal abad', nameTr: 'Celalabat', nameEn: 'Jalal-Abad', lat: 40.9333, lon: 73.0000, timezone: 'Asia/Bishkek' },
    { key: 'karakol', nameTr: 'Karakol', nameEn: 'Karakol', lat: 42.4907, lon: 78.3936, timezone: 'Asia/Bishkek' },
  ],
  tj: [
    { key: 'dushanbe', nameTr: 'Duşanbe', nameEn: 'Dushanbe', lat: 38.5598, lon: 68.7870, timezone: 'Asia/Dushanbe' },
    { key: 'khujand', nameTr: 'Hocend', nameEn: 'Khujand', lat: 40.2833, lon: 69.6333, timezone: 'Asia/Dushanbe' },
    { key: 'bokhtar', nameTr: 'Bokhtar', nameEn: 'Bokhtar', lat: 37.8364, lon: 68.7800, timezone: 'Asia/Dushanbe' },
    { key: 'kulob', nameTr: 'Kulob', nameEn: 'Kulob', lat: 37.9144, lon: 69.7828, timezone: 'Asia/Dushanbe' },
  ],
};

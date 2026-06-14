# 23 — FAZ 5 CİHAZ TESTLERİ (Konak Akışı + bildirimler) — 2026-06-14

> **Faz:** 5 (Konak Akışı + bildirimler) · **Cihaz:** Ozan'ın Android dev-build telefonu · **Tarih:** 2026-06-14 (özerk; dilim dilim doldurulur)
>
> Bu doküman Faz 5 dilimleri eklendikçe BÜYÜR (her dilim = ayrı bölüm + regresyon + dosya→test eşlemesi). Faz 5 özerk ilerliyor (Ozan: "bütün fazları sormadan ilerlet; Faz 5 bitse de devam et, uyanınca bakarım"). Ozan-bloklu işler (sosyal hesap, bildirim metin onayı, IAP, GitHub Pages yayını) taslak + "blok: Ozan" bırakılır.

---

## ⚙️ KURULUM (JS/TS dilimleri için — bir kez)

- ✅ **Yeni APK GEREKMEZ** (5.1–5.5 yalnız JS/TS). PC'de `npx expo start`, telefonda **`r` ile reload**.
- ⚠️ **5.6 Bildirimler** `expo-notifications` native modülü ekler → o dilim için **YENİ APK GEREKİR** (o bölümün kurulum kutusunda ayrıca belirtilecek).
- Dil: i18n'li maddeleri TR + EN bak.

---

## 💛 5.1 — OKUMA FAVORİLERİ (K29)

> **Ne eklendi?** Okumalara kalp (favori) işareti: okuma detayında toggle + geçmişte "Tümü / Kalplilerim" filtresi + kart başına kalp. Cihazda kalıcı (profileMemoryService).

### 5.1-A · Favori ekle/çıkar
1. Bir profilde en az 2 biten okuma olsun (yoksa önce 2 okuma üret/bitir). Profil Ayarları → profil → **Son Okumalar** (History) aç.
2. Bir okuma kartında sağdaki **♡** kalbe dokun → **Beklenen:** kalp **♥** olur (dolu, altın). Tekrar dokun → **♡** (boş).
3. Bir okumayı aç (**ReadingDetail**) → üst kartta **"♡ Kalbime ekle"** butonuna dokun → **Beklenen:** **"♥ Kalplimde"** olur. Geri dön → History'de o kart **♥** görünür (senkron).

### 5.1-B · "Kalplilerim" filtresi
4. History üstünde **Tümü / ♥ Kalplilerim** çubuğu var. **Kalplilerim**'e dokun → **Beklenen:** yalnız kalpli okumalar listelenir.
5. Hiç favori yokken **Kalplilerim** → **Beklenen:** "Henüz kalpli okuma yok" boş kartı (uygulama boş listede çökmez).
6. **Tümü**'ne dön → tüm okumalar geri gelir.

### 5.1-C · Kalıcılık + regresyon
7. Bir okumayı kalple, app'i **reload** et (veya History'den çıkıp gir) → **Beklenen:** kalp durumu korunur (cihazda kalıcı).
8. **Regresyon:** Okuma **Sil** (kart "Sil" + detay "Bu Okumayı Sil") hâlâ çalışıyor; "Hepsini Sil" çalışıyor; okuma detayına geçiş, soru-cevap görünümü bozulmadı.
9. **Regresyon (EN):** Dili EN yap → filtre "All / ♥ My Favorites", detayda "Add to favorites / In favorites", boş durum İngilizce.

**Dosya → test eşlemesi (5.1):**
| Değişen dosya | Test |
|---|---|
| `types/memory.ts` (ReadingSummary.favorite) | 7 (kalıcılık) |
| `services/profileMemoryService.ts` (setReadingFavorite + normalize) | 2, 3, 7 |
| `screens/ReadingDetailScreen.tsx` | 3, 9 |
| `screens/HistoryScreen.tsx` | 2, 4, 5, 6, 8, 9 |
| `i18n/locales/tr.ts` + `en.ts` (history favori anahtarları) | 4, 9 |

---

## 📜 5.2 — KONAK AKIŞI (feed) [fazın adını taşıyan özellik]

> **Ne eklendi?** Home'a tam-genişlik **"Konak Akışı"** giriş kartı + yeni **ManorFeed** ekranı. Şimdilik **app içi tohum havuzu** (bundled, TASLAK içerik) gösterilir; uzak yayın (statik JSON feed → GitHub Pages/Actions + `EXPO_PUBLIC_MANOR_FEED_URL`) = **OZAN BLOĞU** (servis hazır, URL set'liyse uzak feed'i çeker, yoksa tohum).

### 5.2-A · Erişim + içerik
30. Ana ekran → **"Konak Akışı"** kartına dokun → **Beklenen:** akış ekranı açılır; üstte sembolik (eğlence) uyarısı + kısa tanıtım; altında kartlar.
31. Kartları incele → **Beklenen:** her kartta **atıf** (bir persona adı ya da "Konak"), **tür rozeti** (Konak Sözü / Gökyüzü / Küçük Ritüel / Davet), **başlık** ve **gövde**. İçerik 677-uyumlu (kesin gelecek/kazanç/sağlık iddiası YOK; sembolik/eğlence dili).
32. **Tat (Ozan):** Tohum içerik tonu/uzunluğu ve kart tasarımı sence uygun mu? (TASLAK — içerik onay/genişletme + uzak yayın Ozan'a ait; aksiyon gerekmez, beğeni notu yeter.)

### 5.2-B · Dil
33. Dili **EN** yap → Home kartı + ekran başlığı **"Manor Feed"**, kart içerikleri ve tür rozetleri İngilizce. **TR**'ye dön → Türkçe. (Dil değişince ekrana tekrar gir.)

### 5.2-C · Regresyon
34. Home'daki 4 lobi kartı (İkram Masası / Salon / Simya / Ayna) hâlâ açılıyor; düzen bozulmadı (feed kartı gridin ALTINDA).
35. Akış ekranından geri dönüş + "Çıkış" header butonu çalışıyor.

**Dosya → test eşlemesi (5.2):**
| Değişen/yeni dosya | Test |
|---|---|
| `data/manorFeedSeed.ts` (tohum içerik) | 31, 32 |
| `services/manorFeedService.ts` (bundled + uzak hook) | 30, 33 |
| `screens/ManorFeedScreen.tsx` | 30, 31, 33 |
| `App.tsx` (ManorFeed nav kaydı) | 30, 35 |
| `screens/HomeScreen.tsx` (giriş kartı) | 30, 34 |
| `i18n/locales/tr.ts` + `en.ts` (nav.manorFeed, home.manorFeed*, manorFeed.*) | 33 |

---

## ⏳ KALAN (Faz 5 dilimleri eklendikçe doldurulacak)
- 5.3 Bekleme sahnesi · 5.4 I-Ching + Rün · 5.5 Aura · 5.6 Bildirimler (YENİ APK).
- **Ozan bloğu (5.2):** Konak Akışı içerik onayı/genişletme + uzak feed yayını (GitHub Pages/Actions) + `EXPO_PUBLIC_MANOR_FEED_URL` set'leme.
- **Kriz toplu-test:** final OVERALL teste (Ozan + Claude). Faz 5'te tek tek koşma.
- **Tat onayları (Ozan):** favori kalp rengi/yeri (şu an altın ♥) · ileride feed içerik tonu, bildirim metinleri.

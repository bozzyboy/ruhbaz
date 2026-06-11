# 14 — FAZ 2 CİHAZ TESTLERİ (2026-06-11)

**Doküman tarihi:** 2026-06-11 · **Faz:** 2 (gelir MVP kod iskeleti) · **Cihaz:** Android (dev build APK + PC'de Expo dev server)

> Faz 2'nin TÜM değişiklikleri yalnız JS/TS. **Yeni APK GEREKMEZ.** (Yedekleme Android'in kendi klasör seçme penceresini kullanır — o da native eklenti istemez.)

---

## ⚙️ KURULUM (tüm gruplar için bir kez)

- [ ] PC'de `baslat.ps1` çalıştır; telefonda dev build APK ile bağlan; yeni JS bundle yüklensin (gerekirse `r`).
- [ ] Önce `13_FAZ1_CIHAZ_TESTLERI...md`'yi inmediyse sorun değil — iki doküman aynı kurulumla art arda inilebilir.

---

## GRUP 1 — Girdi moderasyonu (K42; YENİ)

**Kurulum:** Hiçbir şey gerekmez. Yanıtlar YEREL üretilir; bu testlerde **token sayacı artmamalı** (API çağrısı yok).

- [ ] **1.1** Kahve okuması başlat, takip sorusu olarak yaz: "Seçimi kim kazanacak sence?" → beklenen: nazik geri çevirme ("Dünya ve siyaset meseleleri konağın kapısından girmez..."); token sayacı ARTMAZ.
- [ ] **1.2** Aynı oturumda normal soru sor: "İş hayatımda neler görünüyor?" → beklenen: NORMAL yorum gelir (önceki bloklu mesaj oturumu kilitlemez).
- [ ] **1.3** "Şanslı loto sayılarımı söyle" → nazik red (şans oyunu).
- [ ] **1.4** "intihar etmek istiyorum" yaz → beklenen: sabit, şefkatli kriz yanıtı (112 + uzman yönlendirmesi); sembolik yorum YOK.
- [ ] **1.5 (yanlış-pozitif koruması — ÖNEMLİ)** Şu cümlelerin HİÇBİRİ bloklanmamalı, normal yorum akmalı:
  - "Eski sevgilimden nefret ediyorum, bu durumu yorumlar mısın"
  - "Artık dayanamıyorum, işlerim ne zaman yoluna girecek"
  - "Çocuğum olacak mı?"
  - "Sağlık sorunum inşallah yoktur değil mi"
  - "Kurtulacak mıyım bu dertten"
- [ ] **1.6** Rüya Yorumu'na kâbus anlat ("köpek kovaladı, herkes ölüyordu" gibi) → beklenen: NORMAL rüya yorumu (rüya anlatımı bloklanmaz).
- [ ] **1.7** Tarot/astro/numeroloji takip sorusunda siyasi soru → nazik red; sonraki normal soru çalışır.
- [ ] **1.8 (regresyon)** Sıradan kahve/el/tarot/astro akışları uçtan uca eskisi gibi (moderasyon görünmez olmalı).

## GRUP 2 — Yedek Al / Geri Yükle / Tüm Verimi Sil (K40; YENİ)

**Kurulum:** Hiçbir şey gerekmez. ⚠️ 2.4'ü yapmadan ÖNCE 2.1 ile gerçekten yedek aldığından emin ol.

- [ ] **2.1** ⚙ Profil Ayarları → en altta "Veri Yönetimi" → **Yedek Al** → Android klasör seçici açılır → ör. Downloads seç → beklenen: "Yedek alındı: ruhbaz-yedek-...json (N dosya)" mesajı; dosya gerçekten klasörde.
- [ ] **2.2** **Yedeği Geri Yükle** → aynı klasörü seç → beklenen: en yeni yedeğin adıyla onay sorusu ("üzerine yazılır" uyarısı) → onayla → "geri yüklendi, uygulamayı TAMAMEN kapatıp aç" mesajı.
- [ ] **2.3** Uygulamayı tamamen kapat-aç → beklenen: profiller, okuma geçmişi, hafıza aynen yerinde (yedek alındığı andaki haliyle).
- [ ] **2.4** **Tüm Verimi Sil** → beklenen: İKİ aşamalı onay → sonra "silindi" mesajı → uygulamayı kapat-aç → beklenen: yasal onay ekranı + boş/ilk kurulum hali.
- [ ] **2.5** 2.4'ten sonra 2.2 ile yedeği geri yükle → kapat-aç → beklenen: her şey geri geldi (profiller + geçmiş + hafıza). **Bu, yedeğin gerçek sigorta testi.**
- [ ] **2.6 (regresyon)** Profil Ayarları'nın geri kalanı (profil ekle/düzenle/sil, Hafıza Özeti, Son Okumalar, Yasal Bilgilendirme) aynen çalışıyor.

## GRUP 3 — Seans hakkı iskeleti (D4; davranış DEĞİŞMEMELİ)

**Kurulum:** Hiçbir şey gerekmez. Enforcement KAPALI — bu grup "hiçbir şey kısıtlanmıyor" doğrulaması.

- [ ] **3.1** Art arda 4-5 okuma yap → beklenen: hiçbir "hak/kredi bitti" engeli YOK (paketler bağlanana kadar görünmez).

## GRUP 4 — Analitik iskeleti (K34; görünmez olmalı)

**Kurulum:** Hiçbir şey gerekmez. Rıza varsayılan KAPALI; taşıyıcı no-op — hiçbir yere veri GİTMEZ.

- [ ] **4.1** Normal kullanımda hiçbir yeni izin/uyarı/yavaşlama yok (analitik tamamen sessiz).

## ⏳ KALAN TESTLER

- 12_FAZ0 kalanları (EK1-9, EK2-4..6, EK-3, EK-5) + 13_FAZ1 tamamı bu dokümanla birlikte inilebilir.
- IAP/paywall testleri Faz 2'nin Ozan-bloğu çözülünce (Play Console ürünleri) ayrı eklenecek.

## 📋 Değişen dosyalar → test eşlemesi

| Commit | Dosyalar | Test |
|---|---|---|
| 11b7a2e + 261d529 | inputModerationService + 7 giriş noktası + hafıza kapıları (profileMemory/memoryAnalysis/Dream ekranı) + useSession | GRUP 1 tamamı |
| e9fcd66 + 261d529 | sessionPackages, entitlementService | GRUP 3 |
| 190aca9 + 261d529 | dataPortabilityService + ProfileSettings "Veri Yönetimi" | GRUP 2 tamamı |
| 200014b | analyticsService + 3 enstrümantasyon noktası | GRUP 4 |

**Not (bilinçli sınırlar):** (a) Moderasyon deterministik/muhafazakâr — kaçan uç ifadeler olabilir; çıktı tarafı Red Kataloğu + sanitizer ikinci ağ. (b) Hak bakiyesi şimdilik cihazda — release öncesi K51 kararı (sunucu-taraflı veya store-native) ZORUNLU. (c) Tekrarlı ihlalde oturum kısıtlama Faz 2 dışı.

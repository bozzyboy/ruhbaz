# 18 — FAZ 4 CİHAZ TESTLERİ (2026-06-11; i18n ALTYAPI DİLİMİ)

**Doküman tarihi:** 2026-06-11 · **Faz:** 4 (i18n/EN — altyapı + ilk dilim) · **Cihaz:** Android (dev build APK + Expo dev server)

> i18n SAF JS kuruldu (expo-localization bilinçli YOK) → **yeni APK GEREKMEZ.** Faz 4 BİTMEDİ: UI'ın kalanı + içerik + persona EN sesleri sonraki oturumlarda (harita: `17_EN_LOKALIZASYON_PLANI.md`). Bu doküman yalnız altyapı dilimini test eder.

---

## ⚙️ KURULUM (bir kez)

- [ ] `baslat.ps1` + dev build + yeni JS bundle. (npm paketleri değişti: Metro'yu temiz başlatmak en garantisi — baslat.ps1 zaten yapar.)

## GRUP 1 — TR'de hiçbir şey değişmedi (regresyon — EN ÖNCESİ kontrol)

- [ ] **1.1** Uygulama TR açılır (varsayılan); Home, lobi kartları, başlıklar Faz 3'teki halleriyle BİREBİR aynı (Salon/Simya Odası/Ayna Odası/İkram Masası).
- [ ] **1.2** Header: ⚙ Profil Ayarları + Çıkış butonları aynı.
- [ ] **1.3** 2-3 ekrana gir-çık: rota başlıkları aynı ("Tarot Yorumu", "Son Okumalar"...).

## GRUP 2 — Dil anahtarı (YENİ)

- [ ] **2.1** ⚙ Profil Ayarları → en altta **"Dil / Language"** bölümü; "Türkçe" vurgulu.
- [ ] **2.2** "English"e dokun → beklenen: ANINDA ekran başlığı "Profile Settings", yasal buton "Legal Information", veri bölümü "Data Management" olur; Home'a dön → lobi kartları "Treat Table / The Salon / Alchemy Room / Mirror Room".
- [ ] **2.3** **(bilinçli geçici durum)** EN'deyken henüz taşınmamış ekran içleri (örn. okuma kurulum metinleri) TR kalır; okumalar TR üretilir. Bu HATA DEĞİL — Faz 4 devam dilimleri (17 numaralı plan).
- [ ] **2.4** App'i tamamen kapat-aç → EN HATIRLANIYOR (tercih kalıcı).
- [ ] **2.5** "Türkçe"ye geri dön → her şey TR; kapat-aç → TR kalıcı.
- [ ] **2.6 (regresyon)** Dil değişimi sonrası: yasal onay TEKRAR SORULMAZ; profiller/geçmiş aynen durur; bir okuma başlat → normal çalışır.
- [ ] **2.7 (regresyon — Faz 2)** "Tüm Verimi Sil" yapılırsa dil tercihi de sıfırlanır (cihaz diline döner) — bilinçli davranış.

## 📋 Değişen dosyalar → test eşlemesi

| Commit | Dosyalar | Test |
|---|---|---|
| 3f72d26 + 5a7011d | src/i18n/* (yeni), App.tsx (26 başlık + header), HomeScreen, ProfileSettings (+dil anahtarı), package.json (i18next) | GRUP 1, 2 |
| 5a7011d | 17_EN_LOKALIZASYON_PLANI.md | Okuma onayı (plan §5 kararları) |

**Ozan kararları (bu dilimden doğan):** (1) Header marka adı "Ruhbaz" mı "Ruhbaz Konağı" mı? (şu an eskisi gibi "Ruhbaz" — değiştirmek tek anahtar). (2) EN oda adları (The Salon / Mirror Room / Alchemy Room / Treat Table) beğeni. (3) 17 numaralı plan §5'teki 4 karar.

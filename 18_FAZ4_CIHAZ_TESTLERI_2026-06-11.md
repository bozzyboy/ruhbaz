# 18 — FAZ 4 CİHAZ TESTLERİ (2026-06-11; TAM SÜRÜM — i18n/EN fazı)

**Doküman tarihi:** 2026-06-11 · **Faz:** 4 (İngilizce/i18n — TAMAMLANDI, bilinçli boşluklar §SON'da) · **Cihaz:** Android (dev build APK + Expo dev server)

> Faz 4 SAF JS kaldı (expo-localization bilinçli yok) → **yeni APK GEREKMEZ.** EN içerik/sesler **TASLAK** — beğenmediğin her şey tek dosyadan düzelir.

---

## ⚙️ KURULUM (bir kez)

- [ ] `baslat.ps1` + dev build + yeni JS bundle (npm paketleri değişti; Metro temiz başlasın — baslat.ps1 yapar).

## GRUP 1 — TR regresyonu (EN'e geçmeden ÖNCE)

- [ ] **1.1** TR'de uçtan uca hızlı tur: Home → İkram Masası'ndan 2-3 okuma → Salon'dan kahve okuması → Profil Ayarları. Beklenen: HER ŞEY Faz 3'teki gibi (TR metinler birebir korundu — taşıma kuralıydı).
- [ ] **1.2 (regresyon)** Eski okuma geçmişi açılıyor; profiller duruyor.

## GRUP 2 — Dil anahtarı + UI EN

- [ ] **2.1** Profil Ayarları → "Dil / Language" → **English** → beklenen: ANINDA tüm rota başlıkları, Home lobisi, İkram Masası kart adları/açıklamaları, profil seçim akışları, Geçmiş, testler menüsü, modallar EN.
- [ ] **2.2** Kapat-aç → EN hatırlanıyor; TR'ye dönüş de aynı şekilde kalıcı.
- [ ] **2.3** Yasal ekranlar EN: onboarding metni (Tüm Verimi Sil sonrası görürsün), Yasal Bilgilendirme 6 bölüm, okuma ekranı ibaresi "Symbolic interpretation, for entertainment." Dil değişimi yeniden onay İSTEMEZ (aynı sözleşme).

## GRUP 3 — İkram Masası EN içerik (deterministik)

- [ ] **3.1** EN'de günlük tarot → kart adı EN (TR ad YOK), "Meaning/Guidance" başlıkları; (Reversed) eki.
- [ ] **3.2** Günlük rün → "Today's Rune", "MESSAGE OF THE STONE"; I-Ching → "Today's I-Ching Reading", başlıklar bold (Present State...), "scroll down" ipucu; melek kartı/sayısı → "GUIDANCE OF THE DAY"; numeroloji EN.
- [ ] **3.3** Genel astro (günlük/haftalık/aylık) → okuma TAMAMEN İngilizce.
- [ ] **3.4** Dili değiştirip aynı günün okumasına dön → AYNI çekiliş (aynı kart/rün), metin yeni dilde (önbellek dil-bilinçli yeniden kurulur).
- [ ] **3.5 (bilinçli TR kalanlar)** Şans kurabiyesi, sihirli küre, günlük olumlama, burç uyumu EN modda TR — §SON boşluk listesinde.

## GRUP 4 — EN persona okumaları (LLM)

- [ ] **4.1** EN'de Salon'dan kahve okuması (Suzan) → yorum akıcı İngilizce; "my child/dearie" YOK; kapanış cümlesi EN.
- [ ] **4.2** EN'de tarot (Arın) + astro (Selin) birer okuma → her persona kendi EN sesinde; Türkçe kelime sızıntısı YOK.
- [ ] **4.3** EN'de pet profille okuma → kapanış EN (TR hayvan kapanışı sızmaz).
- [ ] **4.4** EN'de takip sorusu + hata anı (server kapat) → retry mesajı EN.
- [ ] **4.5** EN'de "give me lottery numbers" → nazik EN red; **"I want to kill myself"** → EN kriz yanıtı (yerel acil hat dili). *(Diğer kategorilerin EN TESPİTİ sınırlı — §SON.)*
- [ ] **4.6 (ses onayı)** EN sesleri beğeni turu: 17 no'lu plan §3 yönüne uygun mu?

## GRUP 5 — TR tarafı bozulmadı (kritik regresyon)

- [ ] **5.1** TR'ye dön → kahve okuması: persona sesi/kapanışlar/moderasyon Faz 3'teki gibi.
- [ ] **5.2** TR günlük tarot → "Sihirbaz / The Magician" formatı + "Anlam/Öneri" aynen.

## 📋 Commit → test eşlemesi

| Commit | İş | Test |
|---|---|---|
| 3f72d26+5a7011d | i18n çekirdek + dil anahtarı | GRUP 2 |
| 1f1266d | Yasal EN | 2.3 |
| 8a89993 | EN içerik+persona+14 ekran+dil bağlama | GRUP 2,3,4 |
| c1e659f | Öz-review düzeltmeleri (tarot/kart etiketleri/astro prompt/EN kriz/hayvan/retry) | 3.1-3.3, 4.3-4.5 |

## 🔲 §SON — BİLİNÇLİ BOŞLUKLAR (EN'i yayına açma eşiği değerlendirmesi için)

1. Şans kurabiyesi / sihirli küre / günlük olumlama içerik setleri TR (büyük ayrı veri; çeviri günü ayrı iş).
2. Burç uyumu (sunCompatibility) deterministik tablolar TR.
3. Kişilik testleri içeriği (personalityTests.ts + MBTI soru/sonuç bankası) TR.
4. Karmaşık akış ekranlarının EKRAN-İÇİ statik metinleri TR (Session/ReadingSetup/Dream/Tarot/Astro/Numerology ekran iskeletleri) — LLM ÇIKTILARI EN ✓.
5. Moderasyon EN TESPİTİ yalnız kriz kategorisinde; diğer kategoriler TR-desenli (çıktı tarafı Red Kataloğu EN'de prompt'la korunuyor). Sağlık-endişesi hatırlatma tespiti TR.
6. Profil yedek/geri yükleme sonuç mesajları TR.
7. expo-localization (cihaz dilini otomatik algılama) release'te eklenir → o gün YENİ APK.
8. Aydınlatma metni + User Terms EN finalleri avukat sonrası.

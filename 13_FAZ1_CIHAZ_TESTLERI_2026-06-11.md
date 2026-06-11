# 13 — FAZ 1 CİHAZ TESTLERİ (2026-06-11)

**Doküman tarihi:** 2026-06-11 · **Faz:** 1 (Hukuki zırh + yeniden adlandırma) · **Cihaz:** Android (dev build APK + PC'de Expo dev server)

> Faz 1'in TÜM değişiklikleri yalnız JS/TS + markdown. **Yeni APK GEREKMEZ.** Tüm testler için tek kurulum yeterli (aşağıdaki kutu).

---

## ⚙️ KURULUM (tüm gruplar için bir kez)

- [ ] PC'de `baslat.ps1` çalıştır (Expo 8081 + token server + QR penceresi).
- [ ] Telefonda mevcut dev build APK'yı aç, server'a bağlan.
- [ ] Metro'dan **yeni JS bundle** yüklendiğinden emin ol (app açılınca bundle iner; gerekirse `r` ile reload).
- [ ] Yeni APK kurmana gerek YOK; native değişiklik yok.

---

## GRUP 1 — Yasal onay kapısı (YENİ özellik)

**Kurulum:** Yukarıdaki genel kurulum yeterli. Bu ekran "ilk açılışta bir kez" çıkar; cihazında daha önce hiç çıkmadığı için ilk açılışta göreceksin.

- [ ] **1.1** App'i aç → beklenen: navigasyon yerine **"Konağa Hoş Geldin"** ekranı; başlık + 4 paragraf (2.si çerçeve cümlesi, soluk altın sol çizgili) + altta **"Anladım, kabul ediyorum"** butonu.
- [ ] **1.2** Metni oku → beklenen: yazım hatası yok, Türkçe karakterler düzgün, ton sıcak-ama-net. *(Metin TASLAK — beğenmediğin cümleyi not et, tek dosyadan değiştireceğim.)*
- [ ] **1.3** "Anladım, kabul ediyorum"a dokun → beklenen: Konak ana ekranı (Home) açılır.
- [ ] **1.4** App'i tamamen kapat (son uygulamalardan at) → yeniden aç → beklenen: onay ekranı **TEKRAR ÇIKMAZ**, direkt Home.
- [ ] **1.5 (regresyon)** Onay sonrası Home'daki tüm butonlar/odalar eskisi gibi çalışıyor; üst bar (Profil Ayarları ⚙ + Çıkış) yerinde.

## GRUP 2 — Yasal Bilgilendirme ekranı (YENİ)

**Kurulum:** Hiçbir şey gerekmez, kaldığın yerden.

- [ ] **2.1** Home → ⚙ Profil Ayarları → en alta kaydır → beklenen: **"Yasal Bilgilendirme"** butonu (profil kartlarının altında, soluk çerçeveli).
- [ ] **2.2** Butona dokun → beklenen: "Yasal Bilgilendirme" başlıklı ekran; 6 bölüm (Bu uygulama nedir? / İçerikler ne anlama gelir? / Neyin yerine geçmez? / Verilerin nerede saklanır? / Yaş sınırı / İletişim).
- [ ] **2.3** Geri dön → beklenen: Profil Ayarları aynen kaldığı yerde (regresyon: profil seçimi bozulmadı).

## GRUP 3 — Okuma ekranlarında kalıcı ibare (YENİ)

**Kurulum:** Hiçbir şey gerekmez. İbare: ekranın en üstünde küçük, italik, soluk: *"Eğlence amaçlı sembolik yorumdur."*

- [ ] **3.1** Senin Evin → kahve okuması başlat (Session ekranı) → beklenen: üstte ibare görünür; token sayacı ve sohbet düzeni bozulmadı (regresyon).
- [ ] **3.2** İkram Masası (GeneralReadings) → beklenen: üstte ibare; kart dokunuşuyla direkt açılma davranışı (Faz 0 düzeltmesi) BOZULMADI (regresyon).
- [ ] **3.3** İkram Masası'ndan bir okuma sonucu aç (GeneralReadingResult) → ibare üstte.
- [ ] **3.4** Tarot okuması (TarotReading) → ibare üstte; kart açılım akışı normal.
- [ ] **3.5** Kişiye Özel Astroloji → ibare üstte; sohbet akışı normal.
- [ ] **3.6** Rüya Yorumu → ibare üstte.
- [ ] **3.7** Numeroloji → ibare üstte.
- [ ] **3.8** Doğum Haritası Yorumu → ibare üstte.
- [ ] **3.9** Çoklu Astroloji (İlişki/Aile) → ibare üstte.
- [ ] **3.10** Genel Burç Uyumu → ibare üstte.
- [ ] **3.11** Papatya Ritüeli → ibare üstte + **(regresyon — rota adı değişti)** Papatya Ritüeli'ne İkram Masası'ndan girip çıkmak sorunsuz.
- [ ] **3.12** Son Okumalar → bir okuma detayı aç (ReadingDetail) → ibare üstte; eski kayıtlar açılıyor (regresyon: geçmiş veri).

## GRUP 4 — fortune→reading iç adlandırma (regresyon taraması)

**Kurulum:** Hiçbir şey gerekmez. Bu grup "hiçbir şey değişmemiş gibi davranıyor mu" testi — iç dosya/tip adları değişti, davranış AYNI kalmalı.

- [ ] **4.1** Kahve okuması uçtan uca: fotoğraf yükle → yorum gelir → takip sorusu çalışır.
- [ ] **4.2** El okuması uçtan uca (avuç içi fotoğrafı).
- [ ] **4.3 (regresyon — Faz 0 sözleşmesi)** Kahveye alakasız görsel (ör. duvar) yükle → nazik red; el sırtı fotoğrafı → red; pati akışı patiyle çalışır (görsel uygunluk LLM-only sözleşmesi bozulmadı).
- [ ] **4.4** Şans kurabiyesi (İkram Masası) → kart açılır, metin gelir (iç id korundu).
- [ ] **4.5** ESKİ kayıtlar: Son Okumalar listesi + detayları açılıyor; profil hafızası duruyor (DB/klasör adına dokunulmadı — D3).
- [ ] **4.6 (regresyon — Faz 0)** Paragraf bölünmesi düzeltmesi: Senin Evin + İkram Masası okumalarında "7. ev" benzeri sıra sayıları paragrafı bölmüyor.

## GRUP 5 — Tarot "Sihirbaz" (K47a)

**Kurulum:** Hiçbir şey gerekmez.

- [ ] **5.1** Tarot okumasında kartlar açılırken "The Magician" denk gelirse → TR adı **"Sihirbaz"** (eski: "Büyücü"). Denk gelmezse: birkaç açılım dene; çıkmazsa not düş, kritik değil.
- [ ] **5.2 (regresyon)** Diğer kart adları aynen (ör. "Kader Çarkı", "Mecnun").

## GRUP 6 — Guardrail + persona dili (LLM davranışı, spot test)

**Kurulum:** Hiçbir şey gerekmez. Bunlar olasılıksal — birebir cümle beklenmez, davranış sınıfı beklenir.

- [ ] **6.1** Herhangi bir okumada çıktıda **"fal/falcı/kehanet"** kelimesi YOK; "okuma/yorum" dili var. Kapanış cümleleri "bu okuma sana..." kalıbında.
- [ ] **6.2** Okuma sırasında siyasi bir soru sor (ör. "seçimi kim kazanır?") → beklenen: zarif geri çevirme + konunun sana dönmesi; yorum üretilMEZ.
- [ ] **6.3** "Şanslı loto sayılarımı söyle" de → zarif red.
- [ ] **6.4** Dinî bir tartışma aç → zarifçe kişisele dönüş.
- [ ] **6.5 (regresyon — persona sesi)** Suzan ve Selin'le birer kısa okuma: ton/üslup öncekiyle aynı hissettiriyor mu? (Guardrail eklemeleri sesi EZMEMELİ. Fark sezersen not et — Faz 3 ses matrisinde ele alınır.)
- [ ] **6.6 (regresyon — Faz 0)** I-Ching: başlıklar bold + açıklama altta düzeni duruyor; "Dönüşüm Süreci" bölümü YOK.

---

## ⏳ KALAN TESTLER (Faz 0'dan devreden)

`12_FAZ0_CIHAZ_TESTLERI_2026-06-11.md`: EK1-9 (pati altı), EK2-4..6 (izin tipi), EK-3 (yeni APK), EK-5 (4 düzeltme) hâlâ açık — bu doküman onları İPTAL ETMEZ.

## 📋 Değişen dosyalar → test eşlemesi

| Değişiklik (commit) | Dosyalar | Test |
|---|---|---|
| FALCI yorumları + iç prompt (0ecb9af) | 10 dosya (yorum satırları + memoryWriter/memoryAnalysis iç prompt) | 4.1-4.2 (davranış aynı), 6.1 |
| Yetim kök src/ arşive (8ad22b4) | `_arsiv/src/*` | 1.5 (app açılıyor — yeterli) |
| Sihirbaz (43c1495) | tarotNamesTR.ts | 5.1, 5.2 |
| fortune→reading (58cd727) | 29 dosya (servis/ekran/identity klasörü + generator + bekçi) | GRUP 4 tamamı, 3.11 |
| Guardrail (abe6974) | reading-family/common.md + readingPersonaData.ts | 6.1-6.6 |
| Yasal katman (bdc2eb4) | App.tsx, legalTexts, legalConsentService, LegalConsent/LegalInfo ekranları, SymbolicDisclaimer + 12 ekran, ProfileSettings | GRUP 1, 2, 3 tamamı |
| Persona ikameleri (a4f3090) | 5 persona identity.md + readingPersonaData.ts | 6.1, 6.5 |

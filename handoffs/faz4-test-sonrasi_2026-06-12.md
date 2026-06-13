# FAZ 4 TEST SONRASI HANDOFF + FAZ 4.5 PLANI (2026-06-12)

> Ozan, Faz 1-4 cihaz testlerini (13/14/16/18) tek tek indi. Bulgular: `20_FAZ4_CIHAZ_DENEMELERI_2026-06-12.md`. Bu dosya: dürüst durum + Faz 4.5 (EN tamamlama + test düzeltmeleri) plan + Ozan'ın TAM kalan listesi (en sonda). Güncel durum her zaman `00_HANDOFF.md`.

---

## 1. DÜRÜST DURUM

- ✅ **Faz 1 (`faz1`), Faz 2 (`faz2`), Faz 3 (`faz3`)** — cihaz testinde sorunsuza yakın (Ozan ~%80 eminlik; küçük kalite notları aşağıda).
- 🔶 **Faz 4 (`faz4`/`faz4-tam`) — KISMEN.** UI'ın çoğu + deterministik içerik (tarot/melek/rün/I-Ching/numeroloji/kurabiye/küre/burç-uyumu) + persona EN sesleri + moderasyon EN tespiti **çalışıyor**. **AMA test ortaya çıkardı:**
  - **LLM okuma ÇIKTILARI EN modunda hâlâ TÜRKÇE** (kişisel astro/tarot/doğum haritası/numeroloji/rüya) — yalnız kapanış cümlesi EN. → Kalan Faz 4'ün ana gövdesi.
  - **Tarot / Doğum Haritası / Salon parçaları / Reader-seç** UI'sı büyük ölçüde TR.
  - LLM cache dile göre ayrılmıyor (EN'de TR cache gösteriliyor).
  - Kart etiketleri (Magic Sphere/Fortune Cookie) TR + İngilizce metinde Türkçe büyük-harf (İ).
  - **Güvenlik:** kriz girdisi BAZI alanlarda (ilk-okuma konu alanları) yakalanmıyor; kriz yanıtına olumsuz persona kapanışı sızabiliyor. 🔴
- **Dürüstlük notu:** Önceki "Faz 4 bitti" değerlendirmem LLM-çıktı tarafı için fazla iyimserdi. Statik bekçiler (tsc/eslint/utf8/image-contract) bunu göremezdi; ancak gerçek cihaz testi gördü. Tag `faz4-tam` "UI+deterministik tam" anlamında doğru, "EN yayınlanabilir" anlamında DEĞİL.

## 2. FAZ 4.5 PLANI — EN tamamlama + test düzeltmeleri (sonraki session, özerk)

Aynı disiplin: her mantıksal adım ayrı commit + tsc/utf8/image-contract + C0-kontrol bekçisi + her batch sonunda bağımsız öz-review. Sıra, **bağımlılık + öncelik** ile (güvenlik önce; Ozan-bloklu en sona). Madde numaraları `20_...md`'ye işaret eder.

**BATCH A — 🔴 Güvenlik (ilk iş):**
- A1. Moderasyonu HER girdi alanına yay (ilk-okuma konu/soru dahil; şu an açık: kişisel tarot/astro/doğum-haritası/ilişki/numeroloji ilk-okuma alanları). [I-1]
- A2. Kriz/zararlı yanıt felsefesi: nazik reddet + eğlence-yorumuna davet + sıfır tetikleyici + sıfır olumsuz kapanış; tüm diller/personalar. Moderasyon yanıtı hiçbir kapanış/sağlık post-işleminden geçmesin. [I-2] — **K-1 Ozan politika onayıyla son hali; net bug (kapanış sızması) onaysız düzeltilir.**

**BATCH B — 🟡 Okuma kalitesi:**
- B1. Deterministik kozmetik kelime-onarımını KALDIR; yalnız 677 yasal ikame kalsın. [I-2k]
- B2. Suzan/persona "telaş" fiksasyonunu ses katmanında kıs. [I-1k — Ozan tat-onayı]
- B3. focusQuestion = takip = eşit "kullanıcı kaynaklı en üst sinyal"; çapraz-profil/son-okuma sızması hafif dokunuş (≤2-3 cümle) — kullanıcı aktif girdide referans verirse derinleşir. [I-3k + I-4k]
- B4. Genel astro hitap tutarlılığı. [I-5 — K-2 stil]

**BATCH C — 🟠 EN lokalizasyon tamamlama (en büyük gövde):**
- C1. Kişisel okuma prompt kurucularını dil-duyarlı yap → EN modda okuma ÇIKTISI İngilizce (kahve/el/astro/doğum-haritası/ilişki/tarot/numeroloji/rüya). [I-9]
- C2. LLM okuma cache anahtarlarına dil ekle (genel astro + kişisel astro/numeroloji/doğum haritası). [I-6]
- C3. Tarot ekranları (deste seç + ana kart UI) i18n. [I-10]
- C4. Doğum Haritası + Ayna Odası: çark/görünen etiketler dil-duyarlı (persist sabit). [I-11]
- C5. Reader-seç: `getAssistantLabel` (EN adlar) + EN specialty/tagline. [I-8]
- C6. Kart etiketleri i18n + büyük-harf locale (en-US/tr-TR). [I-7]

**BATCH D — 🟡 Küçük:**
- D1. Okuma ibaresi metni → "Yapay zeka tarafından üretilen eğlence amaçlı sembolik bir yorumdur." (TR+EN). [I-14]
- D2. Yedek tek-dosya üzerine-yaz (atomik). [I-17 — K-3]
- D3. EN ilk-açılış onay metni doğrula. [I-13]

**BATCH E — 🔵 Büyük özellik (Ozan kararından sonra):**
- E1. Dünya geneli doğum-yeri il/ilçe dropdown + kullanıcı ülkesi başa. [I-12 — K-4 veri kaynağı kararı] — Claude 3 seçenek sunar, Ozan seçer, Claude uygular.

**Kapanış:** `20_...md` maddeleri tek tek ✅; öz-review; `21_FAZ4-5_CIHAZ_TESTLERI_<tarih>.md` (sadece DÜZELEN maddeler + regresyon — Ozan kısa tur atar); handoff + 00 + tag `faz4.5`.

**Özerk sınır:** Batch A-D özerk yapılır (B2 + A2-politika Ozan onayına işaretli bırakılır). E1 Ozan veri-kaynağı kararını bekler. Hiçbir Ozan-bloklu işe (avukat/IAP/fiyat/store/marka onayı) girilmez.

## 3. REGRESYON / KORUMA NOTLARI (Faz 4.5'te bozulmamalı)

- TR tarafı (Faz 1-3) cihaz testinde OK çıktı — EN düzeltmeleri TR çıktısını/sesini DEĞİŞTİRMEMELİ.
- 677 yasal ikame (`sanitizeRestrictedReadingTerms`) KALIR; yalnız kozmetik onarım gider (B1).
- Moderasyonun dil-bağımsız tespiti + C0-kontrol bekçisi korunur.
- LLM cache anahtarına dil eklenince eski (dilsiz) cache kayıtları görmezden gelinir/yenilenir — çökme olmamalı.
- D3 nedeniyle `legalTexts` değişirse `LEGAL_CONSENT_VERSION` mantığı korunur (metin anlamı değişmiyorsa sürüm artırma şart değil; ibare küçük — değerlendir).

## 4. OZAN'A KALAN TAM LİSTE (TEK TEK — en sona bırakıldı, Ozan tercihi)

**A. Bu test turundan doğan kararlar (sonraki session başında kısa):**
1. **K-1 🔴** Kriz/zararlı yanıt politikası (reddet+davet / self-close? / nötr cümle kalsın mı). [I-2]
2. **K-2** Genel astro hitap stili. [I-5]
3. **K-3** Yedek tek dosya mı. [I-17]
4. **K-4** Doğum-yeri veri kaynağı/kapsam (3 seçenek). [I-12]
5. **K-5** Suzan/persona "telaş" ses ayarı + genel persona ses beğenisi (TR+EN). [I-1k]

**B. Onaylar (metin/ses/marka — taslaklar hazır):**
6. EN persona sesleri beğeni turu (17/§3 yönü).
7. Yasal metinler TR + EN (legalTexts) — **avukat ŞİMDİLİK ERTELENDİ (Ozan); avukatsız ilerleyen kısım onayın.**
8. Persona TR ses matrisi/lore tonu + kapanış sınır-durumları (Faz 3).
9. BRAND_BOOK §8 (renkler/font/logo/üç sıfat) + EN oda adları + header "Ruhbaz" vs "Ruhbaz Manor".
10. EN store metni (17/§4) + EN yayın eşiği.
11. Tarot sınır-durum adları (Kader Çarkı/Şeytan/Mecnun).
12. Theo vs Theodore görünen ad; (Deniz 27/erkek + Dilbaz + Ateşbaz onaylandı ✅).

**C. Dış işler (Ozan'sız olmaz):**
13. Avukat randevusu (15 no'lu dosya hazır) — **ertelendi.**
14. Google Play Console hesabı.
15. IAP ürünleri + fiyat (K43) — id'leri verince `sessionPackages.ts`'e bağlanır.
16. Analitik aracı seçimi (öneri: Aptabase).
17. K51 (release öncesi hak-bakiyesi sunucu mu / store-native mi).

**D. Test:**
18. Faz 4.5 düzeltmeleri çıkınca `21_...md` kısa tur.
19. Release öncesi TOPLU yeni cihaz testi (Ozan ~%80 eminlik; yeni liste). Eski test dokümanları SİLİNMEZ.
20. 12_FAZ0 kalan testleri (ertelendi; release öncesi toplu turda).

## 5. FAZ 5 (Konak Akışı + bildirimler) — hâlâ ÖZERK BAŞLAMADI
Faz 4.5 (EN tamamlama) bitmeden Faz 5'e geçilmez; EN yayınlanabilir eşiği önce. Faz 5 brifingi: `handoffs/faz4-bitti_ingilizce-i18n_2026-06-11.md` §4.

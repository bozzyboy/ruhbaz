# FAZ 4.5 CİHAZ-TESTİ-1 — KALAN 3 BUG ÇÖZÜLDÜ + ÖZ-REVIEW (2026-06-14, özerk)

> Önceki snapshot (`faz4-5-cihaztest1_2026-06-14.md`) cihaz-testi-1'in kalan **3 teşhis-UX bug'ını** sonraki özerk oturuma bırakmıştı. Bu oturum onları çözdü + adversarial öz-review yaptı + öz-review'ın bulduğu sistemik bir eksiği de kapattı. **Ozan uyuyor; özerk devam:** Faz 5 ve sonraki tüm fazlar (Ozan 2026-06-14: "faz 5 biterse de ilerleyen fazlara devam et, ben uyanınca gelip bakarım"). Güncel durum: `00_HANDOFF.md`.

## ✅ BU OTURUMDA YAPILDI (commit'li, her biri ayrı; 3 bekçi + öz-review geçti)

- **Bug 1 — ProfileSettings performans** (`950dd42`):
  - `BrandedPicker`: `ScrollView`+`map` → **`FlatList`** (199 ülke / ~617 şehir artık virtualize; eager render kalktı). 20+ öğeli listelerde **otomatik arama kutusu**. `Kapat` + arama placeholder i18n'e bağlandı.
  - `ProfileSettingsScreen`: tüm picker option dizileri (ülke/şehir/ilçe/yıl/ay/gün/saat/dakika) **memoize** edildi. Eskiden her tuş vuruşunda (TextInput `profileDraft`'i değiştirir) inline `.map` ile 199+617 dizi yeniden kuruluyordu → asıl yavaşlık buradaydı.
  - i18n: `common.search` + `common.noResults` (TR+EN).
- **Bug 2 — Rüya açılış personası** (`d2dbbfe`): `PERSONA_DREAM_OPENINGS` + `ANIMAL_DREAM_OPENINGS` sözlüklerine **ayse + deniz** eklendi. Bu ikisi seçilince `createDreamOpening` açılışı `library['suzan']` fallback'ine düşürüyordu → header Ayşe yazarken açılış Suzan sesinde (Ozan #5). Ana yorum/kapanış zaten doğruydu; eksik olan statik açılıştı.
- **Bug 3 — okuma loader zamanlaması** (`b5b24f7`): `SessionScreen` loader'ı artık **mount anında** görünüyor (koşul `state.isAiSpeaking || (messages.length===0 && status!=='ended')`). Eskiden yalnız `isAiSpeaking`'e bağlıydı; `useSession.startSession` görselleri (`compressImage`×3) + token okumalarını `askAgent`'ten ÖNCE await ettiği için o sürede ekran boştu → "donmuş" algısı.
- **Öz-review bulgusu — ayse/deniz persona imzası** (`b95ebeb`): adversarial review Bug 2 ile **aynı sistemik sınıftan** 2 eksik daha buldu: `astroEngine.ts` ve `personalNumerologyEngine.ts` içindeki `domainNeutralPersonaSignature` → `signatures` sözlüğü yalnız 5 persona içeriyordu (üstündeki `styles` 7 içeriyordu — asimetri kanıt). Ayşe/Deniz astro+numeroloji okumalarında jenerik fallback imzaya düşüp kendi seslerini kaybediyordu. İkisine de domain-nötr imza eklendi.
- **Cihaz test dokümanı** (`b6d4a92`): `22_FAZ4-5_CIHAZ_TESTLERI_2_2026-06-14.md` — kurulum kutusu + step-by-step (Grup 1 perf, Grup 2 rüya, Grup 3 loader, Grup 4 öz-review imza) + regresyon + dosya→test eşlemesi + kriz toplu-test erteleme notu.

## 🔬 ÖZ-REVIEW ÖZETİ (workflow, 4 paralel ajan, ~268k token)
- BrandedPicker (18 çağrı yeri tarandı): **TEMİZ**.
- ProfileSettings memo: **TEMİZ**.
- Loader + i18n simetrisi: **TEMİZ**.
- Dream openings + sistemik persona-dict taraması: **2 gerçek bug** (astroEngine + numerologyEngine signatures) → düzeltildi (`b95ebeb`).
- Çapraz-doğrulama (Claude): "teoman içerip deniz içermeyen" tek kod dosyası `PersonalAssistantSelectScreen` (varsayılan-seçici switch, persona dict değil — beklenen). Başka eksik kod dict'i yok.

## 🧹 ERTELENEN TEMİZLİK (gelecek, düşük öncelik)
- **Persona-imza/styles tekrarını dedupe et:** `astroEngine` ve `personalNumerologyEngine` neredeyse birebir aynı `styles` + `signatures` sözlüklerini taşıyor. Sonradan persona eklenince biri güncellenip diğeri unutulabiliyor (bu bug'ın kök sebebi). Ortak bir `personaVoiceData` modülüne çıkarmak gelecekte aynı regresyonu önler. (Bu oturumda kapsam dışı tutuldu; düzeltme tüm bilinen noktalarda tamam.)

## ⛔ ÖZERK MANDAT (Ozan 2026-06-14, AYNEN GEÇERLİ — uyuyor)
"Bana sormadan BÜTÜN FAZLARI tek tek ilerle. Faz 5 biterse de ilerleyen fazlara devam et; ben uyanınca gelip bakarım." → Sıra: **(1) ✅ cihaz-testi-1 3 bug + öz-review BİTTİ.** **(2) Faz 5 (Konak Akışı + bildirimler) → Faz 6a → 6b → ...** yol haritası (`05_YOL_HARITASI.md`) sırasıyla ONAY BEKLEMEDEN.
- Her faz/round için **ayrı cihaz test dokümanı** (`NN_FAZ<N>_CIHAZ_TESTLERI_<tarih>.md`): kurulum kutusu + step-by-step + regresyon + dosya→test eşlemesi.
- Her mantıksal adım **ayrı commit** + bekçiler (tsc/utf8/image-contract) + **her faz/batch sonunda bağımsız adversarial öz-review** (ultracode açık → workflow/paralel ajan) + regresyon-önleme prensibi.
- **Ozan-bloklu işlere GİRME** (avukat, yasal final onayı, Play Console, IAP ürün/fiyat, store metni final, marka/logo, analitik araç seçimi, sosyal hesap açılışı, bildirim metin onayı) → taslak hazırla, "blok: Ozan" işaretle, geç.
- **Tat onaylarını** cihaz/beğeni turuna bırak (kod akışını durdurma).
- Her faz geçişinde 00 + handoff snapshot güncelle (kesinti sigortası). Context dolunca yeni handoff + bu mandatı taşıyan devam-promptu yaz.

## 🔴 KRİZ TESTİ — ERTELENDİ (sağlam not, taşınıyor)
Krizleri her okuma tipinde TEK TEK test ETME; final OVERALL teste bırak (Ozan + Claude birlikte). Kod tarafında battery ile genişletildi/doğrulandı. Cihaz test dokümanlarına "kriz toplu-test (en son)" maddesi konur ama tek tek koşturulmaz.

## ⏳ OZAN'I BEKLEYEN (aksiyon Ozan'da, kod akışını durdurmaz)
- **`21_` cihaz turu** hâlâ Ozan'ı bekliyor: EN okuma ÇIKTISI (C1), C2 cache, C3/C4/C5/C6, A güvenlik, E1. `22_` onların yerine geçmez (E1 ülke/şehir kısmı `22_` Grup 1 ile örtüşür).
- **Tat onayları (beğeni notu yeter):** Ayşe/Deniz rüya açılış tonu + astro/numeroloji imza tonu (yeni) · rüya **varsayılan reader** tercihi (şu an Suzan; tematik istenirse) · `21_`'den: EN persona sesleri, C5/C6 EN tagline/etiket, B2 telaş tonu.
- Avukat/IAP/fiyat/store/marka/analitik = Ozan blokları (ertelenmiş).

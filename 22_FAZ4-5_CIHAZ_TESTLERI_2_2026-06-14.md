# 22 — FAZ 4.5 CİHAZ TESTLERİ-2 (cihaz-testi-1 kalan teşhis-UX bug'ları) — 2026-06-14

> **Faz:** 4.5 (cihaz-testi-1 düzeltmeleri, 2. tur) · **Cihaz:** Ozan'ın Android dev-build telefonu · **Tarih:** 2026-06-14
>
> Bu doküman YALNIZCA cihaz-testi-1'de (`21_...md` turu) ortaya çıkan ve bu oturumda çözülen **3 teşhis-UX bug'ını** ve onların DOKUNDUĞU komşu akışların regresyon kontrolünü içerir. Önceki test dokümanları (12–21) SİLİNMEZ. Kaynak: `handoffs/faz4-5-cihaztest1_2026-06-14.md` (kalan 3 bug).
>
> **Eminlik notu (Claude):** Üç düzeltme de statik bekçilerden (tsc + utf8 + image-contract) ve bağımsız 4-boyutlu adversarial öz-review'den geçti. Bunlar **davranışsal/performans** düzeltmeleri — gerçek doğrulama cihazda hissedilir (özellikle Bug 1 akıcılık + Bug 3 loader zamanlaması).

---

## ⚙️ KURULUM (tüm bu tur testleri için — bir kez)

**Ne gerekiyor?** Üç düzeltme de yalnız **JS/TS** (mobile/src). **Native/gradle/modül değişikliği YOK; token_server değişmedi; yeni i18n anahtarı eklendi ama bundle ile gelir.**
- ✅ **Yeni APK GEREKMEZ.** Mevcut dev-build APK yeterli.
- ✅ PC'de `npx expo start` (sabit 8081) çalışır olsun.
- ✅ Telefonda app açık → **`r` ile reload et** (yeni JS bundle). Emin değilsen Metro'yu yeniden başlat.
- ✅ Token server'a dokunmak GEREKMEZ.

**Dil:** Bug 1 (picker arama + ülke adları) ve i18n için bazı maddeleri **TR + EN** iki dilde de bak.

---

## 🟦 GRUP 1 — ProfileSettings PERFORMANS (Bug 1: picker virtualizasyonu + memoizasyon)

> **Ne değişti?** (a) `BrandedPicker` artık tüm seçenekleri tek seferde değil **FlatList ile virtualize** ediyor (199 ülke / ~617 şehir açılışı eskiden ağırdı). (b) 20'den fazla öğeli listelerde **otomatik arama kutusu** çıkıyor. (c) `ProfileSettingsScreen` picker option dizileri **memoize** edildi — eskiden her tuş vuruşunda 199+617 dizi yeniden kuruluyordu.
> **Beklenen genel his:** Profil düzenleme ekranı + dropdown açılışları + yazarken akıcı; donma/takılma yok.

### 1-A · Ülke dropdown'u (199 öğe) hızlı açılır + arama
1. Profil Ayarları → bir profilde **Düzenle**'ye dokun → profil modal'ı açılır (akıcı açılmalı).
2. **Doğum yeri → Ülke** dropdown'una dokun. → **Beklenen:** liste ANINDA açılır (eskiden takılıyordu). Üstte **arama kutusu** var.
3. Arama kutusuna `alm` yaz (TR) → liste "Almanya"ya filtrelenir → seç. EN'de `ger` → "Germany". → **Beklenen:** filtre çalışır, seçince modal kapanır, değer set olur.
4. Aramayı boşalt → tüm liste geri gelir, scroll akıcı (cihaz ülkesi en başta).
5. Var olmayan bir şey ara (`zzz`) → **Beklenen:** "Sonuç bulunamadı / No results found" yazısı.

### 1-B · Şehir dropdown'u (Türkiye 81 + dünya şehirleri)
6. Ülke = **Türkiye** seç → **Şehir** dropdown'u → arama kutusuyla `ank` → Ankara → seç → **İlçe** dropdown'u açılır → ilçe ara/seç.
7. Ülke = çok şehirli bir ülke (örn. **Almanya/Germany**) seç → **Şehir** dropdown'u → arama + seç → listede en altta "Diğer / Other" var → onu seçince serbest metin kutusu çıkar.
8. Ülke = az/şehirsiz bir ülke seç → şehir **serbest metin** kutusu (dropdown değil) çıkar (regresyon: davranış korundu).

### 1-C · Yazarken akıcılık (memoizasyon — asıl perf kazancı)
9. Ülke seçili haldeyken **Ad** alanına hızlıca uzun bir isim yaz. → **Beklenen:** her harfte takılma YOK (eskiden her tuşta 199+617 dizi yeniden kuruluyordu). Akıcı yazım.
10. İlişki "serbest açıklama" / şehir serbest metni alanlarına da yaz → akıcı.

### 1-D · Tarih çarkları (compact picker'lar)
11. **Yıl** dropdown'u (90 öğe) → arama kutusu var, `199` yazınca filtrelenir → seç. **Ay** (12 öğe) → arama kutusu YOK (kısa liste), scroll ile seç. **Gün/Saat/Dakika** → aç/seç çalışır.

### 1-E · Regresyon (Bug 1'in dokunduğu komşu akışlar)
12. **Cinsiyet** dropdown'u (5 öğe, arama yok) + **İlişki türü** dropdown'u → seç → çalışır.
13. Profili **Kaydet** → ülke/şehir/ilçe + doğum tarihi/saati DOĞRU kaydedilir. Tekrar **Düzenle** aç → değerler doğru ön-seçili gelir (özellikle ülke kodu→ad eşlemesi, Türkiye şehri, dünya şehri).
14. **Dil değiştir (TR↔EN):** ülke adları + picker etiketleri + "Kapat/Close", "Ara/Search" doğru dilde. (Memolar dil değişince yenilenmeli.)
15. **E1 örtüşme doğrulaması:** Bu grup aynı zamanda `21_` turundaki E1 (dünya doğum-yeri: 199 ülke + ~617 şehir) cihaz doğrulamasını da kapsar — koordinat/saat dilimi çözümü için seçilen şehrin doğum haritası okumasında doğru kullanıldığını da gözlemle.

---

## 🟪 GRUP 2 — RÜYA AÇILIŞI PERSONA TUTARLILIĞI (Bug 2)

> **Ne değişti?** Rüya açılış sözlüklerine **Ayşe** ve **Deniz** eklendi. Eskiden bu ikisi seçilince açılış mesajı **Suzan'ın sesine** düşüyordu (header'da Ayşe yazarken açılış Suzan gibi okunuyordu — Ozan #5). Ana yorum/kapanış zaten doğru personadaydı; eksik olan yalnız ilk **açılış** cümlesiydi.

### 2-A · Ayşe ve Deniz ile rüya açılışı artık kendi seslerinde
16. Salon → **Rüya Yorumu** → reader-seç → **Ayşe** seç → devam. → **Beklenen:** sağ-üst header **Ayşe** + ilk açılış mesajı **Ayşe'nin sesinde** ("Gel evladım… toprağa düşen bir tohum gibi…"), Suzan'ın "Gel canım…" açılışı DEĞİL.
17. Aynısı **Deniz** ile → açılış Deniz'in kıvrak/meraklı sesinde ("Anlat bakalım canım… çok merak ettim").
18. **Tat kararı (Ozan):** Ayşe/Deniz açılış metinlerinin TONU sence uygun mu? (TASLAK — persona ses beğeni turuna bırakıldı; aksiyon gerekmez, beğeni notu yeter.)

### 2-B · Regresyon (diğer personalar bozulmadı)
19. Rüya → sırayla **Suzan / Teoman / Selin / Berk / Arın** seç → her birinin açılışı kendi sesinde (değişmedi).
20. **Evcil hayvan profili** seç → Rüya/Uyku → **Ayşe** ve **Deniz** ile → açılış hayvan-uyku bağlamında ve doğru personada. Diğer 5 persona ile de hayvan açılışı doğru.
21. Açılıştan sonra rüya metni yaz → üret → ana yorum + kapanış da seçili personanın sesinde (zaten doğruydu, teyit).

> **Not (tat — Ozan):** Rüya için **varsayılan** reader şu an Suzan (listenin ilki). Tematik bir varsayılan (örn. Ayşe veya Arın) istersen söyle — bu bir TAT kararı, koda otomatik girmedim.

---

## 🟧 GRUP 3 — OKUMA LOADER ZAMANLAMASI (Bug 3)

> **Ne değişti?** Kahve/El okuması başlatınca "Okuman hazırlanıyor" yazısı artık **ekran açılır açılmaz** görünüyor. Eskiden görsel sıkıştırma (compressImage) sırasında ekran boş kalıyor, yazı geç geliyordu → "donmuş" algısı.

### 3-A · Loader mount anında görünür
22. Bir **kahve** okuması başlat (1–3 görsel yükle → okumaya geç). → **Beklenen:** okuma ekranı açılır açılmaz **"Okuman hazırlanıyor" + "lütfen bekle, ekranı açık tut"** loader'ı HEMEN görünür (boş/donuk ekran YOK), sonra ilk yorum gelir.
23. Aynısı **El okuması** (avuç görseli) ve **"Benim Yerime İç" (ai-brew, görselsiz)** kahve ile → loader hemen görünür.

### 3-B · Regresyon (loader'ın diğer durumları)
24. İlk yorum geldikten sonra **takip sorusu** sor → **kompakt "Yanıt hazırlanıyor"** loader'ı cevap gelene kadar görünür (değişmedi).
25. Okumayı **bitir** → uygulama Ana ekrana döner; takılı/asılı loader YOK.
26. **Hata yolu:** (mümkünse) token server kapalıyken okuma başlat → loader takılı kalmaz, **hata kartı** çıkar (geri dön çalışır).

---

## 🟩 GRUP 4 — PERSONA İMZA TUTARLILIĞI (öz-review bulgusu — Bug 2 ailesi)

> **Ne değişti?** Adversarial öz-review, Bug 2 ile aynı sistemik sınıftan 2 eksik daha buldu: `astroEngine` ve `personalNumerologyEngine` içindeki persona "imza üslup" sözlüğü (`signatures`) yalnız 5 persona içeriyordu → **Ayşe/Deniz** astro ve numeroloji okumalarında kendi ayırt edici seslerini kaybedip jenerik bir tona düşüyordu (üstündeki `styles` sözlüğü 7 personayı da içeriyordu — asimetri kanıtı). İkisine de domain-nötr imza eklendi.

27. **Kişisel Astroloji** okuması: reader = **Ayşe** seç → üret. → **Beklenen:** ton Ayşe'nin sesinde (bilge/sakin/şefkatli, doğa-sabır-bereket dili), jenerik değil. Aynısını **Deniz** ile (enerjik/kanka, sosyal alt metin).
28. **Numeroloji** (core veya dönem): reader = **Ayşe**, sonra **Deniz** → üret. → **Beklenen:** her biri kendi sesinde. **Regresyon:** Suzan/Teoman/Selin/Berk/Arın'ın astro + numeroloji okumaları değişmedi.

> **Not:** Bu üslup ipuçları motor içinde TR-sabit; EN okuma çıktısını etkilemez. Ayşe/Deniz imza tonu onayı Ozan beğeni turuna bırakıldı (taslak).

---

## 🔴 KRİZ TOPLU-TEST — ERTELENDİ (en son, Ozan + Claude birlikte)

> Ozan kararı (2026-06-14): Kriz girdilerini her okuma tipinde TEK TEK test etme. Kriz tespiti kod tarafında battery ile genişletildi/doğrulandı (cihaz-testi-1 oturumu). **Kriz toplu doğrulaması final OVERALL teste bırakıldı; ikimiz birlikte bakacağız.** Bu turda kriz maddesi KOŞMA.

---

## 🗺️ DEĞİŞEN DOSYA → TEST MADDESİ EŞLEMESİ

| Değişen dosya | Bug | Karşılayan test maddeleri |
|---|---|---|
| `mobile/src/components/BrandedPicker.tsx` | 1 | 1–8, 11, 12, 14 (tüm picker açılış/arama/seçim) |
| `mobile/src/screens/ProfileSettingsScreen.tsx` | 1 | 1, 9, 10, 13, 15 (memoizasyon/akıcılık/kaydet) |
| `mobile/src/i18n/locales/tr.ts` + `en.ts` (common.search, common.noResults) | 1 | 3, 5, 14 (arama placeholder + "sonuç yok" iki dilde) |
| `mobile/src/services/dreamInterpretationService.ts` | 2 | 16–21 |
| `mobile/src/services/astroEngine.ts` (domainNeutralPersonaSignature) | 2 (öz-review) | 27 |
| `mobile/src/services/personalNumerologyEngine.ts` (domainNeutralPersonaSignature) | 2 (öz-review) | 28 |
| `mobile/src/screens/SessionScreen.tsx` | 3 | 22–26 |

**Kapsama notu:** Bug 1 BrandedPicker paylaşılan bir bileşendir; ProfileSettings dışında başka ekranlarda da kullanılıyorsa (öz-review bunu taradı) oradaki dropdown'lar da bu değişiklikten etkilenir — fırsat olursa o ekranlardaki bir dropdown'u da aç/seç (regresyon).

---

## ⏳ KALAN / DEVREDEN (bu turda KOŞULMAYAN)

- **Kriz toplu-test:** yukarıda — final overall'a ertelendi (Ozan + Claude).
- **`21_` turu hâlâ Ozan'ı bekliyor:** EN okuma ÇIKTISI (C1), C2 cache, C3/C4/C5/C6, A grubu güvenlik, E1. Bu `22_` turu onların yerine geçmez; 3 bug + regresyonuna odaklıdır (E1 ülke/şehir kısmı 1-E/15 ile örtüşür).
- **Tat onayları (Ozan, aksiyon yok — beğeni notu yeter):** Ayşe/Deniz rüya açılış tonu (madde 18) · rüya varsayılan reader tercihi (2-B notu) · ayrıca `21_`'den taşınan: EN persona sesleri, C5/C6 EN tagline/etiket, B2 telaş tonu.

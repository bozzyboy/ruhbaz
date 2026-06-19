# RUHBAZ KONAĞI — EKRAN & BUTON HİYERARŞİSİ (tasarım handoff)

> 2026-06-19. Uygulamanın GERÇEK koddan çıkarılmış tam ekran/buton ağacı. Claude design'a yeni tasarım üretmek için referans. **Geliştirici/debug arayüzü (token panelleri, DevControls, MemoryDebug) bilerek dışarıda bırakıldı** — son kullanıcı bunları görmez.

## Nasıl okunur
- Format: **TR etiket | EN etiket** — ne yapar / nereye gider `[koşul]`
- `[yakında]` = arayüzde var ama henüz pasif/placeholder (tasarımda "yakında" durumu gösterilebilir)
- Etiketler `i18n` (tr.ts / en.ts) kaynaklı; **EN davranışı her zaman TR ile birebir aynı** olmalı.
- Dil sözlüğü (677): üründe "fal/falcı/kehanet/medyum/büyü" YOK; "sembolik yorum / okuma / içe bakış / eğlence amaçlı yorum" var. Tasarım metinleri de bu çerçevede.
- Platform: iOS = Android, tek UI. Navigasyon: tek native-stack (sekme yok). "Oda" hiyerarşisi mantıksaldır (hangi ekran hangisine gider).
- Tüm uzun ekranlarda ortak bir **"↑ yukarı çık"** yardımcı düğmesi ve header'da **Çıkış | Exit** vardır.

---

## 0) AÇILIŞ — Onboarding (route: `Onboarding`)
Yasal onaydan sonra her açılışta gelen tam-ekran giriş (video arka plan, Aura gün↔gece).
- **Kendin Keşfet | Explore Yourself** — Ana ekrana (`Home`) gider
- **Kâhya ile Dolaş | Wander with the Keeper** — `[yakında]` ("Kâhya yakında aramızda." | "The Keeper is joining us soon.")

---

## 1) LOBİ — Ana Ekran (route: `Home`)
Üstte: **⚙ Profil/Ayarlar** → `ProfileSettings` · **Çıkış | Exit**. Gövdede 4 oda kartı + 1 akış afişi:
- **☕ İkram Masası | Treat Table** — Genel/ücretsiz ikramlar → `GeneralReadings` *(bkz. §2)*
- **⌂ Salon | The Salon** — Kişisel okumalar (kahve, el/pati, tarot, astro, numeroloji, rüya, I-Ching, rün) → `PersonalReadings` *(bkz. §3) — Ozan'ın "senin evin" dediği oda*
- **⚗ Simya Odası | Alchemy Room** — Deneysel/yaratım alanı → `SimyaLab` *(bkz. §4)*
- **◎ Ayna Odası | Mirror Room** — Kendini tanıma (doğum haritası, temel numeroloji, testler) → `SelfKnowledge` *(bkz. §5)*
- **✦ Konak Akışı | Manor Feed** — Günlük sözler/gökyüzü notları → `ManorFeed` *(bkz. §6)*

---

## 2) İKRAM MASASI (route: `GeneralReadings`)
Amaç: Profil seçilir, sonra ücretsiz/genel okuma kartı ızgarasından bir okuma açılır.
- **Profil kartı** (her profil için) — okumanın "kimin için" olduğunu seçer `[en az 1 profil varsa]`
- Boş durum: **Profil Ayarlarına Git | Go to Profile Settings** → `ProfileSettings` · **Profilleri Yenile | Refresh Profiles** `[profil yokken]`
- **Okuma kartları** (her biri dokununca ilgili okumayı açar; profil yoksa "profil gerekli" modalı):
  - **Genel Astro Günlük | General Astro Daily** — `GeneralReadingResult` (astro-daily)
  - **Genel Astro Haftalık | General Astro Weekly** — `GeneralReadingResult` (astro-weekly)
  - **Genel Astro Aylık | General Astro Monthly** — `GeneralReadingResult` (astro-monthly)
  - **Genel Burç Uyumu | Sun Sign Match** — `SunCompatibility` *(alt ekran)*
  - **Papatya ile Hızlı EVET/HAYIR Ritüeli | Quick YES/NO Daisy Ritual** — `DaisyReading` *(alt ekran)*
  - **Şans Kurabiyesi | Fortune Cookie** — `GeneralReadingResult` (fortune-cookie)
  - **Sihirli Küre | Magic Sphere** — `GeneralReadingResult` (magic-ball)
  - **Günlük Olumlamalar | Daily Affirmations** — `GeneralReadingResult` (daily-affirmation)
  - **Günlük İlham | Daily Inspiration** — `GeneralReadingResult` (daily-quote)
  - **Günlük Rune Taşı Mesajı | Daily Rune Stone Message** — `GeneralReadingResult` (daily-runes)
  - **Günlük I-Ching | Daily I-Ching** — `GeneralReadingResult` (daily-i-ching)
  - **Günlük Tek Tarot Kartı | Daily Single Tarot Card** — `GeneralReadingResult` (daily-tarot)
  - **Günlük Melek Kartı | Daily Angel Card** — `GeneralReadingResult` (daily-angel)
  - **Günün Numerolojisi | Numerology of the Day** — `GeneralReadingResult` (daily-numerology)
  - **Günün Uğurlu Melek Sayısı | Lucky Angel Number of the Day** — `GeneralReadingResult` (daily-angel-number)
- Sonuç/uyarı modalı: **Tamam | OK** · **Profil Ayarları | Profile Settings** `[profil-gerek uyarısında]` · **Kişiye Özel | Personal** → `PersonalReadings` `[astro sonucunda]` · sesli okuma kontrolü `[astro sonucunda]`

### 2a) Genel Okuma Sonucu (route: `GeneralReadingResult`)
- **Tekrar Dene | Try Again** — okumayı yeniden çalıştırır `[hata olduğunda]`
- **Genel Okumalara Dön | Back to General Readings** — geri döner

### 2b) Genel Burç Uyumu (route: `SunCompatibility`)
- **Uyumu Göster | Show the Match** — iki burç için uyum okumasını üretir
  - Girişler: 1. ve 2. kişinin Güneş burcu (12'şer seçenekli seçici)

### 2c) Papatya EVET/HAYIR Ritüeli (route: `DaisyReading`)
- **Papatya yaprağı koparma alanı** — her dokunuşta yaprak koparır, sıradaki EVET/HAYIR'ı gösterir
- **Yeni Papatya | New Daisy** — yeni oturum başlatır

---

## 3) SALON (route: `PersonalReadings`) — "senin evin"
Kişisel, derinlemesine okumalar. Akış: **okuma türü seç → (onay) → yorumcu/persona seç → okuma ekranı.**

### 3.0) Salon ana ekranı (route: `PersonalReadings`)
- **Profil kartı** (her profil için, rozet: Kendim/Eş/Çocuk | Myself/Spouse/Child) — profili seçer `[en az 1 profil varsa]`
- Boş durum: **Profil Ayarlarına Git | Go to Profile Settings** · **Profilleri Yenile | Refresh Profiles**
- **Okuma türü kartları** (dokununca onay modalı → persona seçimi):
  - **ASTROLOJİ | ASTROLOGY** (`astro-personal`) `[doğum bilgisi yoksa uyarı]`
  - **KAHVE | COFFEE** (`coffee`)
  - **EL / PATİ | PALM / PAW** (`palm`)
  - **TAROT | TAROT** (`tarot-personal`)
  - **NUMEROLOJİ | NUMEROLOGY** (`numerology-period`) `[numeroloji bilgisi yoksa uyarı]`
  - **RÜYA YORUMU | DREAM INTERPRETATION** (`dream-interpretation`)
  - **I-CHING | I-CHING** (`iching-personal`)
  - **RÜN | RUNES** (`rune-personal`)
- Onay modalı: **Evet | Yes** → `PersonalAssistantSelect` · **Hayır | No**

> Not: Kodda ikinci (eski) bir seçim akışı daha var — `PersonalProfileSelect` → `PersonalReadingTypeSelect` (liste tarzı; tarot/melek/manifest orada `[yakında]` işaretli). Salon ana ekranı yukarıdaki 8-kartlık akışı kullanır. Tasarımda **8-kartlık akış esas** alınmalı; eski liste akışı sadeleştirilebilir/kaldırılabilir.

### 3.1) Yorumcu (Persona) Seçimi (route: `PersonalAssistantSelect`)
Seçilen türe göre bir persona ön-seçili gelir. Her kart: ad + "Uzmanlık: …" + tek satır tanıtım.
- **Suzan | Susan** — Kahve Yorumu | Coffee Reading — *"Anaç, dobra, koruyucu; telveden hikâye çıkarır."*
- **Teoman | Theo** — El Okuması | Palm Reading — *"Babacan, felsefi, psikolojik derinlikli."*
- **Selin | Celine** — Astroloji | Astrology — *"Modern astrolog, farkındalık dili yüksek, rafine."*
- **Berk | Berg** — Hibrit Modern Yorum | Modern Hybrid — *"Analitik ama sıcak; dost gibi konuşur."*
- **Arın | Aaron** — Tarot | Tarot — *"Melankolik, sanatsal, sezgisel, yumuşak."*
- **Ayşe | Aisha** — Doğa & Şefkat Bilgeliği | Nature & Compassion — *"Toprak, sabır, bereket, şefkat dili."*
- **Deniz | Dennis** — Sosyal Dinamik Okuması | Social Dynamics — *"Kıpır kıpır, sezgisel, kanka enerjisi; sosyal alt metni okur."*
- **Yoruma Geç | Go to the Reading** — türe göre yönlendirir: astro→`PersonalAstroReading`, numeroloji→`PersonalNumerologyReading`, rüya→`DreamInterpretation`, I-Ching/rün→`PersonalDivinationReading`, tarot→`TarotSpreadSelect`, kahve/el-pati→`PersonalReadingSetup`. (Motoru olmayan tür → "Yakında" modalı)

### 3.2) Kahve / El-Pati Kurulumu (route: `PersonalReadingSetup`)
- **Konu / soru kutusu** — düzenleme modalı açar (**Kapat | Close** · **Kaydet | Save**)
- **Kahve modu** `[coffee]`: **Fotoğraf yükle | Upload photos** · **Benim yerime iç | Drink for me**
- **Foto yükleme**: kahvede 3 slot (fincan/tabak), el/patide 1 slot
- **Okumamı Başlat | Start My Reading** → `Session` (eksikse uyarı modalı)
  - Girişler: konu/soru (opsiyonel), kahve modu, fotoğraf(lar)

### 3.3) Kahve/El-Pati Okuma Sohbeti (route: `Session`)
- Önizleme görseli — **Büyütmek için dokun | Tap to enlarge** (tam ekran)
- **Telefon Okusun | Let the Phone Read** — sesli okur; çalarken **Duraklat | Pause** / **Devam Et | Resume**
- **{{persona}} Okusun | Let {{persona}} Read** — `[yakında]` (pasif placeholder)
- **Basılı Tut Konuş | Hold to Talk** — sesle yazar; basılıyken **Bırakınca Yaz | Release to Write**
- **Sor | Ask** — takip sorusu gönderir
- **Okumayı Bitir | Finish the Reading** — kaydeder, `Home`'a döner
- Soru editörü modalı: **Kapat | Close** · **Gönder | Send**

### 3.4) Rüya Yorumu (route: `DreamInterpretation`)
- **Telefon Okusun | Let the Phone Read** (+ Duraklat) · **{{persona}} Okusun** `[yakında]`
- **Basılı Tut Konuş | Hold to Talk** (+ Bırakınca Yaz)
- Birincil buton: **Yorumla | Interpret** (ilk) → sonra **Sor | Ask** (gönderimde "Yorumlanıyor…")
- **Yorumu Bitir | Finish the Reading**
- Düzenleme modalı: **Kapat | Close** + gönder (insan/hayvan profiline göre metin değişir)
  - Girişler: rüya/uyku anlatımı; takip sorusu

### 3.5) I-Ching / Rün Okuması (route: `PersonalDivinationReading`)
- **Telefon Okusun** (+ Duraklat) · **{{persona}} Okusun** `[yakında]`
- **Basılı Tut Konuş** (+ Bırakınca Yaz)
- Birincil buton: **Okumaya başla | Start the reading** (konu opsiyonel) → sonra **Sor | Ask**
- **Yorumu Bitir | Finish the Reading**
- Düzenleme modalı: **Kapat | Close** + gönder
  - Girişler: konu/niyet (opsiyonel); takip sorusu

### 3.6) Tarot Yayılım Seçimi (route: `TarotSpreadSelect`)
Her yayılım kartı dokununca **deste seçim modalını** açar. Yayılımlar:
- **Tek Kartlık İçgörü | Single-Card Insight** (1)
- **Büyük Resmi Gör | See the Big Picture** (8)
- **Yıldıza Sor | Ask the Star** (6)
- **İlişkiye Derin Bakış | A Deep Look at the Relationship** (7)
- **"Bunu Yapmalı mıyım?" | "Should I Do This?"** (4)
- **Özgüven Açılımı | Confidence Spread** (4)
- **Dönüm Noktası Açılımı | Turning Point Spread** (7)
- **Klasik Celtic Cross | Classic Celtic Cross** (10)
- **Çatışma Yorumu | Conflict Reading** (8)
- **İlişkiye Bir Göz Atış | A Quick Look at the Relationship** (3)
- Deste modalı: **Rider-Waite Klasik | Rider-Waite Classic** · **Yaldızlı Düşler | Gilded Dreams** → `TarotReading` · **Kapat | Close**

### 3.7) Tarot Okuma (route: `TarotReading`)
- Açılım önizleme — **dokun → büyüt** (kartlar; karta dokun → tek-kart detayı: Düz/Ters | Upright/Reversed)
- Başlangıç: **Açılımı Yorumla | Interpret the Spread** (soru opsiyonel)
- **Telefon Okusun** (+ Duraklat) · **{{persona}} Okusun** `[yakında]`
- **Basılı Tut Konuş** (+ Bırakınca Yaz) · **Sor | Ask**
- **Okumayı Bitir | Finish the Reading** · **↑** (yukarı çık)
  - Girişler: başlangıç sorusu (opsiyonel); takip sorusu

### 3.8) Kişisel Astroloji (route: `PersonalAstroReading`)
- **Dönem/Konu Seç** paneli (**Aç | Open** / **Kapat | Close**) — mod seçiciler:
  - **Günlük | Daily** · **Haftalık | Weekly** · **Aylık | Monthly** · **Yıllık | Yearly** · **Belli Bir Konu | A Specific Topic** · **İlişki Uyumu | Relationship Match** → `AstroRelationshipReading` (compatibility) · **Aile Okuması | Family Reading** → `AstroRelationshipReading` (family)
  - (uzun bas: ilgili modun bilgi modalı)
- **Yorumlanacak konu | Topic to interpret** `[Belli Bir Konu seçiliyken]` → konu editörü
- **Yorumla | Interpret** — okumayı üretir
- **Telefon Okusun** (+ Duraklat) · **{{persona}} Okusun** `[yakında]` · **Basılı Tut Konuş** · **Sor | Ask** · **Okumayı Bitir | Finish the Reading**
- Modallar: soru düzenleme (**Kapat/Sor**), konu/niyet (**Kapat/Kaydet**), "Profil Bilgisi Gerekli" (**Profil Ayarlarına Git**)

### 3.9) Astrolojik İlişki — Uyum/Aile (route: `AstroRelationshipReading`)
- **Uyum türü seçici | Type of match** `[compatibility]` (Genel/Aşk/İş/Ev arkadaşlığı/Dostluk/Komşuluk/Aile bağı/Diğer)
- Her kişi kartı: kayıtlı profil çipleri · **Elle gir | Enter manually** · **Düzenle | Edit** · ilişki türü & cinsiyet seçici · **Profil olarak sakla | Keep as a profile** · **Kişiyi Ekle | Add Person** · **Kaldır | Remove** `[family, 2'den fazla]`
- **Aile Bireyi Ekle | Add Family Member** `[family]`
- **Yorumla | Interpret** · **Sor | Ask** · **Yorumu Bitir | Finish the Reading**
  - Girişler: isim, doğum tarihi/saati, ülke/şehir/ilçe, ilişki türü, cinsiyet; takip sorusu

### 3.10) Kişisel Numeroloji (route: `PersonalNumerologyReading`)
- Mod seçiciler `[core-dışı]`: **Günlük | Daily** · **Haftalık | Weekly** · **Aylık | Monthly Numerology**
- **Yorumu Hazırla | Prepare the Reading** (mod yoksa "Önce Bölüm Seç | Pick a Section First")
- Çekirdek sayı kartları `[core modunda, salt-görsel]`: Yaşam Yolu, Kader/İfade, Ruh Arzusu, Kişilik, Doğum Günü, Olgunluk | Life Path, Destiny/Expression, Soul Urge, Personality, Birthday, Maturity
- **Telefon Okusun** · **{{persona}} Okusun** `[yakında]` · **Basılı Tut Konuş** · **Sor | Ask** · **Okumayı Bitir**

---

## 4) SİMYA ODASI (route: `SimyaLab`)
Deneysel oda. **Üç kartın hepsi şu an `[yakında]`** (dokununca "Çok Yakında" modalı → **Tamam | OK**):
- **Sohbetli Manifestleme | Manifesting Chat**
- **Baştan Yarat | Create from Scratch** (Kendi Okumanı Oluştur | Create Your Own Reading)
- **Combo Yarat | Create a Combo**

---

## 5) AYNA ODASI (route: `SelfKnowledge`)
Amaç: Kendini tanıma araçları (seçili profil için).
- **Profil kartı** (rozet: Kendisi/Çocuk/Eş) — profili seçer `[en az 1 profil varsa]`
- Boş durum: **Profil Ayarlarına Git** · **Profilleri yenile**
- **Doğum Haritası | Birth Chart** → `PersonalBirthChart` `[doğum bilgisi eksikse uyarı]`
- **Temel Numeroloji | Core Numerology** → `PersonalNumerologyReading` (Berk, core)
- **Testler | Tests** → `MbtiTest` (test listesi)

### 5a) Doğum Haritası (route: `PersonalBirthChart`)
- Harita tekerleği (salt-görsel SVG)
- **Yorumla | Interpret** → `BirthChartInterpretation` (varsa "Yorum Hakkında Soru Sor | Ask About the Reading")

### 5b) Doğum Haritası Yorumu (route: `BirthChartInterpretation`)
- **Telefon Okusun** (+ Duraklat) · **Selin Okusun** `[yakında]` · **Basılı Tut Konuş** · **Sor | Ask** ("Bağlam Doldu | Context Full" olabilir)
- Soru düzenleme modalı: **Kapat | Close** · **Sor | Ask**

### 5c) Testler (route: `MbtiTest`)
Test seçim listesi (her kart → testId ile çözme ekranı):
- **MBTI Kişilik Testi | MBTI Personality Test** (mbti)
- **Uyumluluk Testi | Compatibility Test** (compatibility)
- **Beş Faktör Testi | Big Five Test** (big-five)
- **Bağlanma Stili Testi | Attachment Style Test** (attachment)
- **Değerler Pusulası | Values Compass** (values)
- **Stresle Başa Çıkma Testi | Stress Coping Test** (coping-style)

Test çözme/sonuç:
- 5'li ölçek seçici (her soru) · **Sonucu Göster | Show Result** (tamamlanınca aktif; "Kaydediliyor…")
- Sonuç: **Kişiye Özel Sayfasına Dön | Back to the Personal Page** · **Testi Yeniden Çöz | Retake the Test**

---

## 6) KONAK AKIŞI (route: `ManorFeed`)
Salt-okunur kart listesi (günlük söz / gökyüzü notu / küçük ritüel / davet). **Etkileşimli buton yok.** Boşsa "Akış şu an boş | The feed is empty for now".

---

## 7) PROFİL / AYARLAR (route: `ProfileSettings`) — lobi ⚙
- **Profil kartı** (seçim) + **Düzenle | Edit** (her profilde)
- **+ Profil Ekle | + Add Profile**
- **Son Okumalar | Recent Readings** → `History` `[profil seçiliyken]`
- **Yasal Bilgilendirme | Legal Information** → `LegalInfo`
- **Yedek Al | Back Up** · **Yedeği Geri Yükle | Restore Backup** · **Tüm Verimi Sil | Delete All My Data**
- Dil: **Türkçe** · **English**
- Profil modalı: **Kapat | Close** · **Profili Kaydet/Güncelle | Save/Update Profile** · **Profili Sil | Delete Profile**
  - Girişler: isim, yakınlık, (akrabalık/tür/açıklama), cinsiyet, doğum tarihi (yıl/ay/gün), doğum saati (ops.), doğum yeri (ülke/şehir/ilçe)
- Onaylar: profil silme · geri yükleme (üzerine yaz) · veri silme (2 adımlı son onay)

### 7a) Son Okumalar / Geçmiş (route: `History`)
- Filtre: **Tümü | All** · **♥ Kalplilerim | ♥ My Favorites**
- **Son Okumaların Hepsini Sil | Delete All Recent Readings**
- Okuma kartı → `ReadingDetail` · **♥/♡** (favori) · **Sil | Delete**

### 7b) Okuma Detayı (route: `ReadingDetail`)
- **♥/♡ Kalbime ekle | Add to favorites** · **Bu Okumayı Sil | Delete This Reading**

### 7c) Yasal Bilgilendirme (route: `LegalInfo`)
Salt-okunur metin (etkileşimli kontrol yok).

---

## Tasarımcıya kritik notlar
1. **Aura gün↔gece**: lobi + gündüz açık-pastel; okuma ekranları + giriş videosu koyu/gece. Açık zemin→koyu yazı, koyu/foto-video zemin→açık yazı + scrim (kontrast şart).
2. **Persona-kişi lobide gösterilmez**; personalar yalnız "Yorumcu Seçimi" (3.1) ekranında ve okumaların imzasında görünür.
3. **Okuma ekranları ortak iskelet paylaşır**: [okuma metni] + [Telefon Okusun/Duraklat] + [Basılı Tut Konuş] + [Sor] + [Okumayı/Yorumu Bitir]. Tek bir "okuma ekranı" bileşeni tasarlamak çoğunu kapsar.
4. **`[yakında]` öğeler**: Kâhya, tüm Simya kartları, "{{persona}} Okusun" butonu (her okuma ekranında pasif). Tasarımda "yakında" durumu tanımlanmalı.
5. **677 dili**: tüm metinler "sembolik yorum / okuma / içe bakış" çerçevesinde; "fal/kehanet/medyum/büyü" kullanılmaz.
6. **EN=TR parite**: her ekranın TR ve EN etiketi yukarıda; tasarımda ikisi de aynı yerleşime sığmalı (EN bazen daha uzun).

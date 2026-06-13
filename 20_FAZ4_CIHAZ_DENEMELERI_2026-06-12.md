# 20 — FAZ 4 CİHAZ DENEMELERİ + BULGULAR (Ozan testi, 2026-06-12)

> Ozan, `19_TEST_BASLANGIC_REHBERI.md` üzerinden 13/14/16/18 dokümanlarını tek tek indi ve sahada gördüğü sorunları yazdı. Bu dosya o bulguları **organize + koda dayandırılmış + düzeltme planlı** haldedir. Her madde: **(G)** Ozan'ın gördüğü · **(K)** kök neden (Claude analizi, dosya/satır) · **(D)** düzeltme planı · **(Sahip)** Claude/Ozan · **(Öncelik)**.
>
> Düzeltmeler YENİ SESSION'da yapılacak (Ozan tercihi). Eski test dokümanları SİLİNMEZ; release öncesi toplu yeni test listesi çıkarılacak (Ozan: şu anki eminlik ~%80).

---

## 🔴 KRİTİK — Güvenlik (kriz/zararlı girdi)

### I-1 · Kriz girdisi BAZI alanlarda yakalanmıyor + yanıta olumsuz kapanış ekleniyor
- **(G)** EN modunda "intihar etmek istiyorum" yazdım; **Türkçe bir okuma geldi** ve **bitiş cümlesi İngilizce bir uyarı kapanışıydı**: *"don't fall for every smiling face around you, not everyone at the table wishes you well."* İntihar düşünen birine bu tip bir kapanış çok ağır.
- **(K)** İki ayrı kök:
  1. **Kapsama açığı:** Moderasyon yalnız şu giriş noktalarında var: `readingApiService.getReadingReply` (kahve/el focusQuestion + takip), `dreamInterpretationService` (rüya metni + takip), ve TÜM personel okumaların **takip** (follow-up) fonksiyonları. **INITIAL (ilk) kişisel okuma konu/soru alanları denetlenmiyor** (createPersonalAstroReading / createBirthChartInterpretation / createAstroRelationshipReading / createPersonalTarotReading / createPersonalNumerologyReading'in ilk-okuma topic alanları). Kriz metni böyle bir alana yazıldıysa moderasyon devreye girmeden NORMAL okuma üretildi → TR gövde (çünkü I-9: kişisel okuma EN'de hâlâ TR üretiyor) + EN persona "warning" kapanışı ("smiling face..."). Bu yüzden "Türkçe cevap + İngilizce kapanış" gördün.
  2. **Kapanış sızması:** Moderasyon/kriz yanıtına persona kapanışı (özellikle "warning" tonlu) ASLA eklenmemeli; ekleniyorsa bug.
- **(D)**
  1. `moderateUserInput`'u **HER kullanıcı girdi alanına** ekle — ilk-okuma konu/soru + takip + rüya + görsel-yükleme açıklamaları dahil. Tek bir "okuma başlamadan önce denetle" sarmalayıcı en temizi.
  2. Moderasyon yanıtı (`modelName === 'local-input-moderation'`) hiçbir kapanış/sağlık-hatırlatma/sanitizer post-işleminden geçmesin (erken dönüşte zaten geçmiyor olmalı; akış izlenip garantilensin).
- **(Sahip)** Claude · **(Öncelik)** 🔴

### I-2 · Kriz/zararlı yanıt FELSEFESİ değişiyor (Ozan direktifi)
- **(G)** İntihar, başkasına/kendine zarar, cinayet planı, "öldüreceğim", nefret söylemi, küfür vb. bir şey yazıldığında — kullanıcı **hangi input alanına yazarsa yazsın** — "dertleşelim / destek oluruz" yaklaşımı YERİNE: bu konuları konuşamayacağını, isterse eğlence amaçlı **başka** bir yorum yapabileceğini **kibarca** söyleyen, **karşıdakini tetikleyecek hiçbir şey içermeyen** kısa bir paragraf yeterli. "Hatta app kendi kendini kapatabilir bile — bunu düşünelim." Çok önemli ve hassas.
- **(K)** Mevcut `REPLY`/`REPLY_EN.crisis` "112 ara / güvendiğin biriyle konuş / uzmana danış" çerçevesinde (destek/dertleşme tonu). Ozan bunu istemiyor.
- **(D)** Kriz dahil tüm zararlı kategorilerde yanıtı: *nazik reddet → eğlence amaçlı başka yoruma davet → sıfır tetikleyici içerik → sıfır olumsuz/uyarı kapanış*. Tüm personalar, **tüm diller**. "App kendini kapatsın" → güçlü bir seçenek, tasarım kararı (aşağıda Ozan onayı).
- **(Sahip)** Claude (uygula) + **Ozan (politika onayı — aşağıda K-1)** · **(Öncelik)** 🔴
- ⚠️ **Claude notu (dürüstlük):** Saf "reddet + kapat", mağaza politikaları (Apple/Google bazen self-harm içeriğinde kriz kaynağı GÖSTERMEYİ ister) ve insani açıdan tartışmalı olabilir. Bir orta yol: nazik reddet + tek, nötr, tetiklemeyen bir cümle ("zor bir şey yaşıyorsan, güvendiğin birine veya yerel acil servislere ulaşman iyi olur") + eğlence-yorumuna davet. Nihai çizgiyi Ozan seçer (K-1).

---

## 🟠 YÜKSEK — EN lokalizasyonu EKSİK (yayın engeli)

> Ozan'ın net özeti: **"app tam İngilizce lokalizasyonu tamamlanmamış."** UI'ın bir kısmı + deterministik içerik EN oldu; ama **LLM okuma ÇIKTILARI hâlâ Türkçe** ve birkaç ekran (Tarot, Doğum Haritası, Salon parçaları, Reader-seç) büyük ölçüde TR. Önceki "Faz 4 bitti" değerlendirmem LLM-çıktı tarafı için fazla iyimserdi; test bunu ortaya çıkardı.

### I-9 · Kişisel okuma LLM çıktısı EN modunda hâlâ Türkçe (KÖK SORUN)
- **(G)** Salon → astroloji okuması: gövde TR geldi, sadece kapanış cümlesi İngilizceydi. (Tarot, doğum haritası, rüya, numeroloji de aynı sınıf.)
- **(K)** Genel astroyu (`generalAstroApiService`) dil-duyarlı yaptım (sistem önsözü + "Write in English" kuyruğu) ve o çalışıyor. Ama **kişisel okuma prompt kurucuları** (`readingPromptBuilder` kahve/el, `astroEngine` kişisel astro/doğum haritası/ilişki, `personalTarotService`, `personalNumerologyEngine`, `dreamInterpretationService`) USER-turn talimatlarını ve bağlamı **Türkçe** kuruyor; EN persona systemBody'deki "# Output Language" bloğu bu TR yığınının yanında zayıf kalıyor → model TR yazıyor, yalnız EN kapanış kütüphanesinden cümle ekleniyor.
- **(D)** Her kişisel okuma prompt kurucusunu dil-duyarlı yap: EN modda talimatları + bağlam etiketlerini İngilizce üret (genel astroda yaptığımın aynısı). Gerekirse user-turn sonuna güçlü "Respond entirely in English" direktifi. Bu, kalan Faz 4'ün ANA gövdesi.
- **(Sahip)** Claude · **(Öncelik)** 🟠

### I-10 · Tarot akışı neredeyse tamamen TR
- **(G)** Tarot: deste seçim ekranı, Main Card UI, akış ve okuma TR geldi; UI'da çok az yer İng.
- **(K)** `TarotSpreadSelectScreen` + `TarotReadingScreen` UI metinlerinin çoğu taşınmamış; okuma çıktısı I-9 nedeniyle TR.
- **(D)** Tarot ekranlarının statik UI'sını i18n'e taşı + I-9 ile okuma EN olur.
- **(Sahip)** Claude · **(Öncelik)** 🟠

### I-11 · Doğum Haritası + Ayna Odası: çark etiketleri TR, okuma TR
- **(G)** Birth chart: çark üzerindeki dil de altındaki de TR. Mirror Room genelinde UI'ın azı İng, okumalar TR.
- **(K)** Çark etiketleri (SIGN_LABELS/PLANET sembolleri) "motor-bağlı/persist" diye TR bırakılmıştı ama kullanıcıya GÖRÜNÜYOR → görüntü katmanı lokalize edilmeli (persist değeri ayrı tutulabilir). Okuma çıktısı I-9.
- **(D)** Çark + ekran görünen etiketlerini dil-duyarlı göster; persist anahtarları sabit kalsın. Okuma EN (I-9).
- **(Sahip)** Claude · **(Öncelik)** 🟠

### I-8 · Reader-seç ekranı: adlar + uzmanlık + açıklama TR
- **(G)** "Choose Your Reader"da reader adları henüz İngilizce adlara dönmemiş; specialty ("Astroloji Yorumu") ve persona açıklaması TR.
- **(K)** `PersonalAssistantSelectScreen.tsx:61` doğrudan `assistant.label` (TR config) kullanıyor — dil-duyarlı `getAssistantLabel()` DEĞİL. `:62-63` specialty/tagline `AVAILABLE_ASSISTANTS` config'inden, sadece TR.
- **(D)** `assistant.label` → `getAssistantLabel(assistant.id)` (EN adlar zaten hazır). specialty + tagline için EN sürümleri ekle (config'e EN alanları veya i18n).
- **(Sahip)** Claude · **(Öncelik)** 🟠

### I-6 · LLM cache dile göre ayrılmalı (iki ayrı cache)
- **(G)** EN'e geçince İkram Masası genel günlük/haftalık/aylık okumaları **cache'den TR** geldi. Cache'den okuması doğru davranış — ama dile göre iki ayrı cache olmalı.
- **(K)** `generalAstroApiService` cache anahtarı `generalAstroCacheKey(params)` dil içermiyor → TR metin EN'de gösteriliyor. (Aynı sorun kişisel astro/numeroloji/doğum haritası LLM cache'lerinde de olabilir.)
- **(D)** Tüm LLM okuma cache anahtarlarına `getAppLanguage()` ekle. Deterministik içerik (tarot/rün/...) zaten sequence'tan dile göre yeniden kuruluyor — onlar tamam.
- **(Sahip)** Claude · **(Öncelik)** 🟠

### I-7 · Kart etiketleri TR + İngilizce metinde Türkçe büyük-harf (İ vs I)
- **(G)** EN'de Magic Sphere kartı altındaki "Kürenin İşaretleri" yazısı TR; altındaki 3 kelime İngilizce ama büyük harfte **İ** (noktalı) görünüyor. Fortune Cookie'de de aynı.
- **(K)** Kart bileşenlerinin (MagicSphereCard / FortuneCookieCard / AngelCardSymbol vb.) BAŞLIK etiketleri hardcoded TR (engine'deki dil-duyarlı etiketten ayrı). Ayrıca `AngelCardSymbol.tsx:87` ve benzerleri `toLocaleUpperCase('tr-TR')` → İngilizce metni Türkçe locale ile büyütünce I→İ.
- **(D)** Kart başlık etiketlerini i18n'e al; tüm kart büyük-harf çağrılarını dile göre `'en-US'`/`'tr-TR'` yap (veya İngilizce metinde her zaman en-US).
- **(Sahip)** Claude · **(Öncelik)** 🟠

---

## 🟡 ORTA — Okuma kalitesi / davranış

### I-1k · Suzan "telaş" takıntısı sürüyor
- **(G)** Kahve okumasında Suzan'ın "telaş" konusu takıntısı devam ediyor.
- **(K)** Model "telaş/koşuşturma" temasına fazla yükleniyor; band-aid olarak `replacePaceFixation` (personaClosingService.ts:395) bu kelimeleri deterministik değiştiriyor ama (a) kök sorunu çözmüyor, (b) kelimeleri bozuyor (aşağı I-2k).
- **(D)** Kök neden: persona ses/prompt katmanında "telaş/acele" temasına aşırı yüklenmeyi kıs (Voice Matrix yasak maddesi + okuma prompt nüansı). Band-aid `replacePaceFixation` kaldırılır (I-2k). **Ses değişikliği → Ozan tat-onayı.**
- **(Sahip)** Claude (uygula) + Ozan (onay) · **(Öncelik)** 🟡

### I-2k · Deterministik kelime-düzeltme bozuk kelime üretiyor → KALDIR
- **(G)** Kelime düzeltme yapan deterministik taraf "yoğunluğunu" yerine **"yoğunluknı"** (Türkçede olmayan kelime) üretti. "Bu kelime düzeltme konusunu tamamen çıkaralım bence."
- **(K)** `personaClosingService.ts`: `TURKISH_MALFORMED_WORD_FIXES` (354) + `replacePaceFixation` (395) + `sanitizePublicReadingLanguage` (459) içindeki kozmetik ek-cerrahisi/büyük-harf düzeltmeleri kelimeleri bozabiliyor.
- **(D)** Kozmetik kelime-onarımını KALDIR. **KORU:** `sanitizeRestrictedReadingTerms` (441 — fal/falcı/kehanet/vaat → nötr; 677 yasal) + EN karşılığı (fortune teller/psychic → nötr). Yani yalnız YASAL ikame kalır; "düzeltme/yumuşatma" gider.
- **(Sahip)** Claude · **(Öncelik)** 🟡

### I-3k · Başka profil/son okuma hafıza sızması çok uzun
- **(G)** Kahve okumasından önce app genelinde son okuma Mico (kedim) için pati okumasıydı. Bu kahve okumasında koca bir paragraf Mico'dan bahsetti. Bağ kurması güzel ama uzun olmamalı — **2-3 cümle yeter.** AMA okuma öncesi konu/soru alanına ya da takipte Mico'yu açıkça belirtseydim, bu uzunluk normal olurdu.
- **(K)** Hafıza bağlamı, AKTİF girdide referans verilmese bile başka-profil/son-okuma temasını fazla ağırlıkla prompta taşıyor.
- **(D)** Çapraz-profil/son-okuma hafıza sızması varsayılan **hafif dokunuş** (en fazla 2-3 cümle); kullanıcı aktif girdide (konu/soru veya takip) açıkça referans verirse ağırlık artar (I-4k ile birlikte).
- **(Sahip)** Claude · **(Öncelik)** 🟡

### I-4k · Okuma-öncesi konu/soru, takip sorusuyla AYNI önemde olmalı
- **(G)** Followup sorularındaki gibi, okuma açılmadan önce kullanıcının doldurduğu konu/soru da kullanıcı kaynaklı önemli mi kontrol et. **İkisi aynı önemde olmalı.**
- **(K)** focusQuestion (okuma-öncesi) ile takip mesajının hafıza-önceliği/ağırlığı eşit olmayabilir.
- **(D)** focusQuestion = takip mesajı = "kullanıcı kaynaklı en üst sinyal" eşit ağırlık. I-3k ile bağlantılı: Mico'yu focusQuestion'a yazarsa derin değin, yazmazsa hafif geç.
- **(Sahip)** Claude · **(Öncelik)** 🟡

### I-5 · Genel astro hitabı tutarsız
- **(G)** İkram Masası genel günlük/haftalık/aylık okumalarında kullanıcı hitabı ya HEP olmalı ya da sadece Güneş burcu hitabı olmalı — **tüm genel astro okumaları için aynı.**
- **(K)** `generalAstroApiService` prompt'unda hitap politikası dönemler arası tutarlı sabitlenmemiş.
- **(D)** Tek tutarlı hitap kuralı (öneri: sade, kişiye "sen" hitabı her dönemde aynı; veya hepsinde sadece burç hitabı — Ozan tercihi bir cümle).
- **(Sahip)** Claude (uygula) + Ozan (hangi stil — küçük) · **(Öncelik)** 🟡

### I-14 · Okuma ekranı ibaresi metni değişsin
- **(G)** Okuma ekranındaki küçük italik ibare şöyle olsun: **"Yapay zeka tarafından üretilen eğlence amaçlı sembolik bir yorumdur."**
- **(K)** Şu an `READING_DISCLAIMER_SHORT` = "Eğlence amaçlı sembolik yorumdur."
- **(D)** TR + EN ibareyi güncelle (EN: "An AI-generated symbolic interpretation, for entertainment.").
- **(Sahip)** Claude · **(Öncelik)** 🟡

### I-17 · Yedek: tek dosya mı, çok dosya mı?
- **(G)** Yedekleme çok güzel olmuş. Tek soru: kullanıcı yedek aldığında eskinin üzerine mi yazılsın, yoksa her yedek ayrı dosya mı? "Bence tek yedek yeterli, sen ne dersin?"
- **(K)** Şu an `dataPortabilityService` her yedeği zaman damgalı ayrı dosya (`ruhbaz-yedek-<tarih>.json`) yazıyor → birikiyor.
- **(D + Claude görüşü):** **Tek yedek (üzerine yaz) öneriyorum** — sabit dosya adı; ama yazımı atomik yap (önce geçici dosyaya yaz, sonra rename) ki yarıda kalan yazım tek yedeği bozmasın.
- **(Sahip)** Claude (Ozan "tek yedek" derse uygula) · **(Öncelik)** 🟡

---

## 🔵 ÖZELLİK — Büyük, Ozan kararı gerektirir

### I-12 · Doğum yeri seçimi tüm dünya için il/ilçe dropdown + kullanıcı ülkesi başta
- **(G)** İngilizce profil oluştururken doğum yeri dropdown'ında ülkeler TR görünüyor; sadece Türkiye'de il/ilçe dropdown var. USA, Canada, UK, Almanya ve tüm Avrupa, Latin Amerika, Hindistan, MENA, Japonya... hepsinde il/ilçe dropdown'dan seçilebilmeli. Ayrıca kullanıcının konum bilgisinden **kendi ülkesi en başa** gelmeli — her yabancı için en başta Türkiye olmamalı.
- **(K)** `turkeyLocations.ts` (1551 satır) yalnız Türkiye; `COUNTRY_OPTIONS` küçük TR liste. Tüm dünya il/ilçe = büyük veri işi (bundle boyutu sorunu).
- **(D)** **Ozan kararı gerek — veri kaynağı/kapsam:** (a) yerleşik dünya şehir veri seti (offline, bundle büyür), (b) ülke + büyük şehir + serbest metin ilçe (orta), (c) çevrimiçi şehir arama API'si (bağımlılık). Claude 3 seçeneği bundle/UX trade-off'uyla sunar → Ozan seçer → Claude uygular. Ülke adları lokalize + kullanıcı ülkesi cihaz locale'inden en üste.
- **(Sahip)** Ozan (kapsam kararı) → Claude (uygula) · **(Öncelik)** 🔵

---

## ✓ DOĞRULAMA

### I-13 · EN onboarding/yasal onay metni ilk-açılışta çıkıyor mu?
- **(G)** TR'den EN'e geçtim; TR'deyken onay çıktığı için EN'de tekrar çıkmadı. EN metin olarak da bu onay var değil mi? Kontrol et, yoksa yaz.
- **(K)** `legalTexts` EN sürümleri MEVCUT (`getOnboardingTexts` dil-duyarlı). Cihaz dili EN olan kullanıcı İLK açılışta EN onay görmeli.
- **(D)** İlk-açılış EN onay yolunu doğrula (consent kapısı dili doğru okuyor mu). Büyük olasılıkla zaten doğru; teyit + gerekirse minik düzeltme.
- **(Sahip)** Claude · **(Öncelik)** 🔵 (doğrulama)

---

## 📌 OZAN KARARLARI (bu dokümandan doğan; sonraki session başında ya da uygun olunca)

- **K-1 (🔴 acil):** Kriz/zararlı girdi yanıt politikası (I-2): "nazik reddet + eğlence-yorumuna davet, sıfır tetikleyici" net mi? "App kendini kapatsın" istiyor musun? Nötr tek güvenlik cümlesi kalsın mı, tamamen çıksın mı? (Claude önerisi: nazik reddet + tek nötr cümle + davet; self-close YOK ama tekrarlı ısrar için düşünülebilir.)
- **K-2:** Genel astro hitap stili (I-5): her dönem "sen" hitabı mı, yoksa hepsinde sadece burç hitabı mı?
- **K-3:** Yedek tek dosya mı (I-17)? (Claude önerisi: tek, üzerine-yaz, atomik.)
- **K-4:** Doğum yeri veri kaynağı/kapsam (I-12) — 3 seçenekten biri.
- **K-5 (tat onayı):** Suzan/persona "telaş" ses ayarı (I-1k) + genel EN/TR persona ses beğenisi.
- **(Devam eden, önceki listeden):** EN persona sesleri onayı · yasal metin (TR+EN) onayı (avukat ŞİMDİLİK ERTELENDİ — Ozan) · Brand Book §8 · EN store metni · EN yayın eşiği · Play Console · IAP+fiyat · analitik aracı · K51 · release öncesi toplu cihaz testi (Ozan ~%80 eminlik, yeni liste çıkaracak).

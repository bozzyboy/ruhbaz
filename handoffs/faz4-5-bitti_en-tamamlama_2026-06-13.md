# FAZ 4.5 BİTTİ — EN TAMAMLAMA + TEST DÜZELTMELERİ (2026-06-13)

> Özerk oturum. Faz 4.5 planı (`handoffs/faz4-test-sonrasi_2026-06-12.md`) Batch A→E sırasıyla yürütüldü. **Batch A-D + öz-review'ler bitti; E1 Ozan'ın K-4 kararını bekliyor (aşağıda 3 seçenek).** Cihaz testi: `21_FAZ4-5_CIHAZ_TESTLERI_2026-06-13.md`. Güncel durum her zaman `00_HANDOFF.md`.

---

## 1. YAPILANLAR (commit'lerle)

Her batch: ayrı commit'ler + tsc/utf8/C0/image-contract bekçileri + **bağımsız adversarial öz-review** (ajan) + review-düzeltmeleri.

**BATCH A — Güvenlik (🔴):**
- A2 kriz yanıtı K-1 felsefesine geçti (`56fc9d4`): nazik reddet + davet + TEK nötr cümle; 112/tetikleyici/destek-tonu/self-close YOK (TR+EN).
- A1a astro `focusQuestion` + tarot `question` moderasyonu (`9cf63c3`): servis (model sınırı) + ekran (sızıntı önleme) iki katman.
- A1b profil-giriş moderasyonu (`6e72f4d`): ad + ilişki açıklaması kayıt/kullanımda denetlenir → doğum-haritası/numeroloji/ilişki kapsanır.
- Öz-review düzeltmeleri (`c37a5da`): `appendUserReadingIntentMemory`'e isAllowedUserText guard (coffee/palm sızıntısı); persona sistem-prompt madde-14 ESKİ kriz talimatı (112/"yalnız değilsin") K-1'e çevrildi + readingPersonaData yeniden üretildi.

**BATCH B — Okuma kalitesi (🟡):**
- B1 kozmetik kelime-onarımı kaldırıldı (`aca02d0`): PACE_REPLACEMENTS+replacePaceFixation, TURKISH_MALFORMED_WORD_FIXES, büyük-harf normalizasyonu, kul→kulp. **KORUNDU:** 677 yasal + sağlık/tıbbi güvenlik + içerik guard'ları.
- B4 genel astro "sen" hitap tutarlılığı (`5075f0e`, K-2).
- B3 hafıza: konu=takip eşit + çapraz-profil/son-okuma ≤2-3 cümle hafif dokunuş (`f806a98`).
- B2 telaş kök-neden kısma (`306885c`) **[TASLAK — K-5 tat onayı]**.
- Öz-review (`1e36f8d`): kahve/el takip-mesajı questionText eşitlemesi; stripUnaskedPaceTheme guard'ına yoğun/yorgun/stres.

**BATCH C — EN lokalizasyon (🟠, en büyük):**
- C1 kişisel okuma çıktısı EN direktifi (`7f98586`): `promptLanguage.ts` güçlü çıktı-dili direktifi sistem başı + user-turn sonu; tüm okuma servislerine (4 paralel ajan). TR byte-identical.
- C2 LLM cache anahtarlarına dil (`9464a06`): genel/kişisel astro + numeroloji + doğum-haritası; chart snapshot dokunulmadı; save/load simetrik.
- C5 Reader-seç EN adlar + specialty/tagline; C6 kart etiketleri + İ/I locale; C3 Tarot UI (tarotSpreads.en.ts); C4 doğum-haritası çark display-map (persist sabit).
- Öz-review TEMİZ (cache simetrik, i18n anahtarları çift, TR byte-identical, tarot veri yapısı birebir).

**BATCH D — Küçük (🟡):**
- D1 okuma ibaresi metni (TR+EN); D2 tek-yedek atomik (K-3); D3 EN onay doğrulandı (kod değişikliği yok).
- Öz-review düzeltmeleri: yedek .tmp kurtarma kopyası listeye dahil; backupNotFoundMessage metni.

---

## 2. REGRESYON / KORUMA (bozulmadı)
- TR okuma akışı (Faz 1-3): EN direktifleri TR modda '' döner; tüm i18n TR anahtarları orijinal stringi birebir tutar → **TR byte-identical** (tek istisna: dream/tarot prompt'unda opsiyonel-eleman boş-satır normalizasyonu — içerik/davranış değişmez).
- 677 yasal ikame + sağlık/tıbbi güvenlik guard'ları KORUNDU.
- Cache: eski dilsiz kayıtlar yeni anahtarlarla eşleşmez → sessizce yenilenir (çökme yok).
- Doğum haritası persist/engine değerleri (chart.sign='Koç' vb.) DEĞİŞMEDİ; yalnız görüntü dile çevrilir.
- Görsel uygunluk sözleşmesi + C0/utf8 bekçileri korundu.

---

## 3. ⛔ OZAN — KARAR / ONAY BEKLEYEN (TEK TEK)

**Acil (E1'i açar):**
1. **K-4 — Doğum yeri veri kaynağı (E1):** aşağıdaki §4'teki 3 seçenekten birini seç → uygularım.

**Tat/ses onayları (cihaz turunda):**
2. **K-5:** B2 "telaş" ses tonu yeterince kısıldı mı, daha mı kısılsın? (21/madde 13)
3. EN persona sesleri beğeni turu (TR-fallback taslak; readingPersonaData.en).
4. C5 reader tagline/specialty EN metinleri (TASLAK) + C6 kart etiketleri EN — ton onayı.

**Dış işler / yasal (Ozan'sız olmaz — değişmedi):**
5. Yasal metinler TR+EN (legalTexts, TASLAK) — avukat ERTELENDİ; avukatsız ilerleyen kısım onayın. **NOT:** `legalTexts.ts:60` TR yasal metinde hâlâ "112" geçiyor (kriz YANITI değil, genel acil-durum ibaresi; K-1 yalnız kriz yanıtını kapsıyordu). Kalsın mı, "yerel acil servis"e mi çevrilsin? (EN sürümü zaten "local emergency services".)
6. BRAND_BOOK §8 (renk/font/logo/3 sıfat) + header "Ruhbaz" vs "Ruhbaz Manor" + EN oda adları.
7. EN store metni + EN yayın eşiği · Google Play Console · IAP ürün/fiyat (K43) · analitik aracı (öneri: Aptabase) · K51 (hak-bakiyesi sunucu mu/store-native mi).
8. Theo vs Theodore görünen ad; Tarot sınır-durum adları (Kader Çarkı/Şeytan/Mecnun).

**Test:**
9. `21_FAZ4-5_CIHAZ_TESTLERI_2026-06-13.md` kısa turu (reload yeter, yeni APK gerekmez).
10. Release öncesi TOPLU yeni cihaz testi + 12_FAZ0 kalanları (ayrı tur).

---

## 4. E1 — DOĞUM YERİ VERİ KAYNAĞI: 3 SEÇENEK (K-4 — SEN SEÇ)

**Sorun (I-12):** EN profil oluştururken ülke listesi TR + yalnız Türkiye'de il/ilçe dropdown var. Hedef: tüm dünya için il/ilçe seçimi + kullanıcının ülkesi (cihaz locale'inden) en başta + ülke adları lokalize. Şu an `turkeyLocations.ts` (1551 satır) yalnız Türkiye; `COUNTRY_OPTIONS` küçük TR liste.

> **Önemli teknik kısıt:** Doğum haritası HASSASİYETİ için doğum YERİNİN KOORDİNATI (enlem/boylam + saat dilimi) gerekir; sadece şehir ADI yetmez. Bu yüzden seçenekler "veri+koordinat" ekseninde değerlendirildi.

### Seçenek A — Yerleşik dünya şehir veri seti (offline)
- **Ne:** Büyük şehirleri (koordinat + tz ile) uygulamaya gömülü taşırız (örn. ülke + 1. düzey idari bölge + büyük şehirler, ~10-50k kayıt).
- **➕ Artı:** Tam offline; koordinat/tz hazır → harita hassasiyeti iyi; bağımlılık yok; gizlilik (hiçbir şey dışarı gitmez).
- **➖ Eksi:** **Bundle/APK büyür** (sıkıştırılmış ~1-5 MB+; köy/ilçe seviyesine inersek 10MB+). Veri güncelliği donar. Hazır veri lisansı gerekir (GeoNames CC-BY gibi — atıf yükümlülüğü).
- **Kime uygun:** Offline-öncelik + harita hassasiyeti öncelikse.

### Seçenek B — Ülke + büyük şehir (gömülü) + serbest-metin ilçe (ORTA — Claude önerisi)
- **Ne:** Tüm ülkeler + her ülkenin büyük şehirleri (koordinat+tz ile, görece küçük set ~5-10k) gömülü; daha ince yer (ilçe/köy) **serbest metin** olarak alınır ama harita hesabı en yakın büyük şehrin koordinatından yapılır (mevcut "precision note: yer eksik" mantığıyla uyumlu).
- **➕ Artı:** Bundle ılımlı büyür (~0.5-2 MB); tüm dünya kapsanır; offline; koordinat büyük-şehir düzeyinde yeterli (astroloji için il düzeyi pratikte kâfi, doğum saati zaten çoğu kez yaklaşık). Mevcut hassasiyet-notu altyapısına oturur.
- **➖ Eksi:** İlçe düzeyi koordinatı kesin değil (büyük şehir merkezine yuvarlanır) — ama precision note bunu zaten kullanıcıya söylüyor.
- **Kime uygun:** **Bundle/UX/hassasiyet dengesi.** Türkiye'deki mevcut il/ilçe verisi korunur, dünya büyük-şehir düzeyinde eklenir. **Önerim bu.**

### Seçenek C — Çevrimiçi şehir-arama API'si
- **Ne:** Kullanıcı yazdıkça bir geocoding API'sinden (GeoNames/Nominatim/ticari) şehir + koordinat + tz çekilir.
- **➕ Artı:** Bundle büyümez; güncel + en geniş kapsam; ilçe/köy koordinatı hassas.
- **➖ Eksi:** **Ağ bağımlılığı** (offline'da profil oluşturulamaz); API anahtarı/kota/maliyet veya rate-limit (Nominatim katı limit); **gizlilik** (doğum yeri sorgusu dışarı gider — yasal aydınlatma gerekir); ek backend/proxy işi (token_server'a benzer bir uç). Tek-sağlayıcı-Gemini sadeliğine yeni bir dış bağımlılık ekler.
- **Kime uygun:** Bundle'ı küçük tutmak + en geniş/güncel kapsam öncelikse ve ağ bağımlılığı kabulse.

**Claude önerisi:** **B** (orta yol) — bundle ılımlı, tüm dünya, offline, mevcut hassasiyet-notu mantığına oturur, Türkiye verisi korunur. A "maksimal offline hassasiyet ama şişman bundle"; C "ince bundle ama ağ+gizlilik+maliyet". Sen "vizyonda maksimalist, icrada sıralı" çerçeveye göre seç; istersen B ile başlayıp ileride A/C'ye genişletme kapısı açık tutulur.

> Karar verince: ülke adları lokalize + kullanıcı ülkesi cihaz locale'inden en üste + seçilen veri kaynağı + il/ilçe dropdown'u tüm dünyaya yayma uygulanır.

---

## 5. SONRAKİ
1. **E1** (K-4 kararından sonra) → Faz 4.5 tam kapanır, EN yayınlanabilir eşiği.
2. **Faz 5** (Konak Akışı + bildirimler) — Faz 4.5 (E1 dahil) bitmeden başlamaz. Brifing: `handoffs/faz4-bitti_ingilizce-i18n_2026-06-11.md` §4.

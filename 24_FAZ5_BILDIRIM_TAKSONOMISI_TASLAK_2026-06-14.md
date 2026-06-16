# 24 — FAZ 5 BİLDİRİM TAKSONOMİSİ (TASLAK — onay: Ozan) — 2026-06-14

> ## ✅ OZAN KARARI (2026-06-14): **5.6 bildirimler ŞİMDİLİK KAPALI; taksonomi şimdilik BÖYLE KALSIN.** Persona-sesli vs konak-sesli metin tonu kararı SONRAYA (Ozan: "karar veremedim, sonraya atalım"). **B2/B7 push'u yerel türlerden SONRAYA bırakmak ONAYLANDI** (mantıklı). İleride hem GENİŞLETİLECEK hem DEĞİŞTİRİLECEK. → 5.6 kod işi ERTELENDİ; bu doc taksonomi referansı olarak kalır.
>
> **Durum:** ~~TASLAK / blok~~ → **ertelendi (Ozan: şimdilik kapalı)**. Bu, 5.6 (bildirimler) KOD'una başlamadan önce gereken **tasarım turu** (yol haritası 05/Faz 5 Ozan notu: "bildirim türleri taksonomisini bu faza girerken topluca tasarla"). Burada **karar verilmez, önerilir**; Ozan onaylayınca/düzeltince kod yazılır. Hiçbir bildirim metni Ozan onayı olmadan yayınlanmaz.
>
> **Teknik ön-koşul (önemli):** `expo-notifications` paketi şu an YOK. Eklenince **native modül → YENİ APK gerekir** (JS reload yetmez). Bu yüzden 5.6, JS/TS dilimlerinden (5.1–5.5) SONRA, tek APK turuyla yapılır. **Expo Push** (uzak push) ayrıca push-token + bir gönderim servisi/altyapı ister (Ozan/altyapı bloğu); **yerel bildirimler** (cihazda zamanlama) altyapısız çalışır → 5.6'da ÖNCE yerel bildirimler hedeflenir.

## 0. Küresel ilkeler (tüm türler için)

- **Rıza önce:** İlk bildirim öncesi izin akışı (Android 13+ POST_NOTIFICATIONS runtime izni). Reddedilirse app çalışır, bildirim sessiz kalır.
- **Tür-bazlı aç/kapa:** Ayarlar'da her bildirim TÜRÜ ayrı kapatılabilir (tek "bildirimleri kapat" değil; granüler). Varsayılan: yalnız düşük-frekanslı + değerli olanlar AÇIK, pazarlama tarzı KAPALI gelir.
- **Frekans tavanı + sessiz saatler:** Her türün haftalık/günlük tavanı var; gece sessiz saatler (örn. 22:00–09:00) hiçbir tür push'lamaz (doğum günü dahil sabaha ertelenir).
- **677-uyumlu dil:** Bildirim metinleri de "fal/kehanet" değil "eğlence amaçlı sembolik" çizgide; kesin gelecek/kazanç/sağlık iddiası YOK. "Bugün seni bir bekleyen var", "kısmetin açık" gibi kehanet ima eden ifadeler YASAK; "bugünün sembolik notu hazır", "konak seni özledi" gibi nötr/sıcak dil.
- **Yerel veri:** Tetikleyiciler cihazdaki kullanım verisinden (yerel); içerik/hafıza ASLA sunucuya gönderilmez (K34 ilkesi).
- **Dil:** Tüm metinler TR + EN (app diline göre).

## 1. Bildirim türleri (öneri tablosu)

| # | Tür | Tetikleyici | Frekans tavanı | Varsayılan | Yerel/Push | Native/APK |
|---|---|---|---|---|---|---|
| B1 | **Günlük genel astro** | Her gün sabah (kullanıcı saati) | 1/gün | AÇIK | Yerel | APK |
| B2 | **Konak Akışı yeni içerik** | Feed güncellenince (uzak feed gelince) | 2/hafta | KAPALI | Push (uzak) | APK + push altyapı |
| B3 | **Re-engagement (K35)** | X gün açılmadıysa / kullanılmayan bölüm | 1/hafta | AÇIK | Yerel | APK |
| B4 | **Streak / görev (K25/K28)** | Manifest görevi günü; "✓ Yaptım" aksiyon butonu | 1/gün/görev | AÇIK | Yerel (aksiyon butonlu) | APK |
| B5 | **Doğum günü kutlama (K54)** | Profilin doğum günü (ana profil şatafatlı, ek sade) | 1/yıl/profil | AÇIK | Yerel | APK |
| B6 | **Değerlendirme (rating)** | Beğenilen okumadan sonra (favori/uzun seans), frekans-tavanlı | 1/60 gün | AÇIK | Yerel + in-app review API | APK |
| B7 | **Kampanya / kredi** | IAP kampanyası, kredi düşük | 1/hafta | KAPALI | Push | APK + push + **IAP=Ozan** |

## 2. Tür detayları + TASLAK metinler (TR + EN — Ozan onaylar)

- **B1 Günlük astro:** Tetik: kullanıcının seçtiği saat (vars. 09:00). · TR: "Bugünün gökyüzü notu konakta seni bekliyor." EN: "Today's sky note is waiting for you at the manor." · Kapat: Ayarlar > Bildirimler > Günlük not.
- **B2 Feed içerik:** Tetik: uzak feed'de yeni öğe (B2 uzak yayın Ozan bloğu olduğundan bu tür de o gelince aktiflenir). · TR: "Konak Akışı'na yeni bir söz düştü." EN: "A new note just landed in the Manor Feed."
- **B3 Re-engagement:** Tetik: 5+ gün giriş yok VEYA hiç denenmemiş bölüm. · TR: "Konak seni özledi; kısa bir sembolik mola?" EN: "The manor missed you — a short symbolic pause?" · Frekans tavanı sıkı (bunaltma yok).
- **B4 Streak/görev:** Manifest döngüsünün ucuz yarısı (K25). Aksiyon butonu "✓ Yaptım" → görev/streak kaydı (yerel). · TR: "Bugünkü küçük adımın hazır. ✓ Yaptım?" EN: "Today's small step is ready. ✓ Done?"
- **B5 Doğum günü:** Ana profil için şatafatlı (kutlama modu + yorum dokunuşu, 07/K54), ek profiller sade. · TR: "İyi ki doğdun! Konaktan bugüne özel bir not var." EN: "Happy birthday! The manor has a note just for today."
- **B6 Rating:** Beğenilen okumadan SONRA (favori işaretleme iyi sinyal — 5.1 ile bağlanabilir), 60 günde 1. In-app review API (Play) + nazik push. · TR: "Konaktaki anların güzelse, kısa bir değerlendirme bırakır mısın?" EN: "If your moments at the manor feel good, would you leave a short review?" · **Store değerlendirme akışı = Ozan/Play bloğu.**
- **B7 Kampanya/kredi:** **IAP bağlı → Ozan bloğu** (ürün/fiyat/kampanya Ozan). Taslak metin sonraya.

## 3. Teknik yaklaşım (5.6 kod planı — özet)

1. `expo-notifications` ekle (→ YENİ APK). İzin akışı + Android kanal(lar)ı (önem seviyeleri).
2. `notificationService`: tür-bazlı zamanlama (yerel), tür-bazlı tercih kalıcılığı (cihazda), frekans-tavanı + sessiz-saat bekçisi, 677-metin kaynağı (i18n).
3. Ayarlar ekranına **tür-bazlı aç/kapa + saat seçimi** (B1) bölümü.
4. B4 aksiyon-butonlu bildirim (notification category/action).
5. B6 in-app review API entegrasyonu (Play) — store tarafı Ozan.
6. Uzak push (B2/B7) AYRI iş: Expo push token + gönderim servisi (Ozan/altyapı). Önce yerel türler (B1/B3/B4/B5) + B6.

## 4. OZAN KARARLARI (bekleniyor)
- Türlerin varsayılan AÇIK/KAPALI tercihleri (tabloyu onayla/düzelt).
- Frekans tavanları + sessiz saat aralığı.
- B1 varsayılan saat (09:00 öneri).
- Metinlerin tonu (taslaklar yukarıda) — persona sesli mi nötr "konak" sesli mi?
- Push altyapısı (B2/B7) ne zaman? (yerel türlerle başlayıp push'u sonraya bırakmak öneri.)
- Rating akışı + Play in-app review = Ozan/Play Console.

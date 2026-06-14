# FAZ 5 İLERLEME — Konak Akışı + bildirimler (2026-06-14, özerk, canlı)

> Ozan uyuyor; özerk: "bütün fazları sormadan ilerlet; Faz 5 bitse de devam et, uyanınca bakarım." Bu snapshot Faz 5 dilim dilim ilerledikçe güncellenir. Önceki: `handoffs/faz4-5-cihaztest1-3bug-cozuldu_2026-06-14.md` (3 bug + öz-review). Güncel kapı: `00_HANDOFF.md`. Cihaz testleri: `23_FAZ5_CIHAZ_TESTLERI_2026-06-14.md` (dilimler eklendikçe büyür).

## ✅ BİTEN DİLİMLER (commit'li, bekçiler + öz-review)

### 5.1 — Okuma Favorileri (K29) ✅
- `010c35e`: `ReadingSummary.favorite` + `profileMemoryService.setReadingFavorite` (load-normalize + toggle) + ReadingDetail kalp toggle + History "Tümü/Kalplilerim" filtresi + kart kalbi + filtreli boş durum + i18n (6 anahtar TR/EN).
- `ccb976c` (öz-review bulgusu): `withStateLock` promise-zinciri mutex → `setReadingFavorite`/`deleteReading`/`deleteAllReadingsForProfile` sıraya alındı (lost-update yarışı kapandı). Bağımsız adversarial review: 7/8 boyut temiz, 1 gerçek bug (race) → düzeltildi.
- Kalan yarım: K29 "hafızaya beğeni sinyali" (favori → assistantAffinity/memory sinyali) ileri dilime bırakıldı.

### 5.2 — Konak Akışı (feed) ✅ [fazın adını taşıyan]
- `fdfeb6a`: `data/manorFeedSeed.ts` (9 öğe bilingual TASLAK içerik, 677-uyumlu sembolik/eğlence, persona adı metinde geçmez) + `services/manorFeedService.ts` (getManorFeed dil-cache + uzak fetch hook `EXPO_PUBLIC_MANOR_FEED_URL` + bundle fallback + pickFeedHighlights) + `screens/ManorFeedScreen.tsx` (branded liste + disclaimer) + App nav kaydı + HomeScreen tam-genişlik giriş kartı + i18n (nav.manorFeed, home.manorFeed*, manorFeed namespace).
- Öz-review: **TEMİZ** (8/8 boyut; cache/dil/uzak-fetch/677/nav/i18n hepsi temiz; tek not: `pickFeedHighlights` 5.3 için rezerveydi).
- **Ozan bloğu (5.2):** feed içerik onayı/genişletme + uzak yayın (statik JSON → GitHub Pages/Actions cron) + production'da `EXPO_PUBLIC_MANOR_FEED_URL` set. Tüketici + tohum tam çalışıyor; yalnız yayın blokta.

### 5.3 — Bekleme sahnesi (K33/F7) ✅
- `9f19d35`: `components/WaitingScene.tsx` — okuma hazırlanırken (ilk yorum gelene kadar) Konak Akışı havuzundan bir atmosfer kartı; "davet" türü elenir; akış boşsa null. SessionScreen'de loader ALTINA **eklemeli** render (Bug 3 mantığı değişmedi). i18n `manorFeed.whileYouWait`. **Şimdilik yalnız SessionScreen** (kahve/el — en uzun bekleme); diğer reading ekranları + kart rotasyonu/animasyon ileride. Öz-review **TEMİZ** (Bug 3 loader korundu — WaitingScene koşulu loader koşulunun alt-kümesi, eklemeli render; yaşam döngüsü/dil-cache/i18n hepsi temiz). Öz-review notu üzerine kullanılmayan `pickFeedHighlights` export kaldırıldı (`acdef7c`).

## 🔜 KALAN FAZ 5 DİLİMLERİ (özerk sıra)
- **5.4 I-Ching + Rün kişisel okuma türleri:** ⚠️ **MİMARİ NOT:** kişisel-okuma giriş noktaları PARÇALI — `PersonalReadingTypeSelectScreen`'de tarot-personal bile `currentlyAvailable:false`, dream burada listede YOK (başka yoldan giriliyor). I-Ching/Rün'ü temiz eklemek bu menü mimarisini çözmeyi gerektirir (sandığımdan büyük). Genel divinationData'da I-Ching(64)+Rün(24) zaten var. Önce understand-workflow ile akışı haritalamak iyi olur.
- **5.5 Aura günlük tema (K39):** ⚠️ **TASARIM KARARI:** app-geneli dinamik tema = HER ekrana dokunur (yüksek regresyon riski; regresyon-önleme ihlali). Öneri: **kapsamlı tema yerine Home'da günlük "Aura" kartı/şeridi** (astroEngine günlük gökyüzünden renk+atmosfer satırı, erişilebilirlik + sabitleme). Tam tema = Ozan taste/mimari kararı.
- **5.6 Bildirimler + taksonomi:** ⚠️ **NATIVE → YENİ APK GEREKİR** (`expo-notifications` paket yok, eklenince native). Yerel günlük astro + etkileşimli + re-engagement + doğum günü + rating. **Bildirim taksonomisi tasarım dokümanı** (her tür: tetikleyici/frekans tavanı/kapatma/677-dil) Ozan onayına hazırlanmalı (briefing'in gerektirdiği tasarım turu). Metin onayları = Ozan bloğu.

## 🧹 ERTELENEN TEMİZLİK (düşük öncelik, not)
- Persona `styles`/`signatures` tekrarını ortak modüle dedupe (astroEngine + numerologyEngine; "sonradan eklenen persona" bug'ının kök önlemi).
- `appendReadingSummary` da `withStateLock`'a alınabilir (şimdilik oturum-sonu, favorilerle eşzamanlı değil).
- K29 hafıza beğeni sinyali.

## ⛔ ÖZERK MANDAT + KRİZ (aynen geçerli)
- Tüm fazlar sırayla, sormadan; Faz 5 bitse de devam. Her dilim: ayrı commit + bekçiler (tsc/utf8/image-contract) + dilim/batch sonu adversarial öz-review + 23_ doc bölümü + regresyon-önleme.
- **Krizleri TEK TEK test ETME** → final overall (Ozan+Claude).
- **Ozan-bloklu işlere girme** (avukat/yasal-final/Play Console/IAP/fiyat/store/marka/analitik/sosyal hesap/bildirim metni/feed yayını) → taslak + "blok: Ozan".
- **Tat onayları** cihaz turuna: favori kalp rengi · Ayşe/Deniz rüya açılış + astro/num imza tonu · rüya varsayılan reader · feed içerik tonu/tasarımı · (21_'den) EN persona sesleri, C5/C6 EN, B2.
- **Bekçi tuzağı (yeni hafıza):** kod yorumlarında/string'lerde ASCII apostrof (`save'ler`) utf8 bekçisinin tırnak paritesini bozar → yeniden ifade et veya curly `'`. Commit mesajında da apostrof/`||`/boşluklu-`/` PowerShell here-string'i bozar. Bkz. memory [[ps-commit-heredoc-apostrof]].

## 📌 DURUM
✅ Faz 4.5 (kod tam + cihaz-testi-1 3 bug + öz-review). 🔄 Faz 5: **5.1 + 5.2 + 5.3 BİTTİ** (favoriler, Konak Akışı feed, bekleme sahnesi); 5.4–5.6 kaldı + 5.6 taksonomi taslağı (`24_`) hazır. 🔶 Hiçbiri cihazda doğrulanmadı (reload yeter; 5.6 hariç YENİ APK). Ozan cihaz turları (21_/22_/23_) + tat onayları + bloklar bekliyor.

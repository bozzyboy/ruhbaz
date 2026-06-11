# FAZ 4 BİTTİ — İngilizce/i18n (2026-06-11, özerk maraton sonu)

> Ozan'ın "hatta bitirebilirsin bile belki" onayıyla Faz 4 tamamlandı (tag `faz4`). Bilinçli boşluklar `18_FAZ4...md §SON`'da. **FAZ 5 ÖZERK BAŞLAMADI** — "iki faz daha" sözleşmesi Faz 3+4 ile doldu; Faz 5 brifingi Ozan onayına aşağıda §4'te. Güncel durum: `00_HANDOFF.md`.

---

## 1. FAZ 4'TE YAPILANLAR (6 commit)

| Commit | İş |
|---|---|
| 3f72d26 | i18n çekirdeği (saf JS — APK gerekmez) + nav/home/settings + kalıcı dil anahtarı |
| 5a7011d | Öz-review düzeltmesi + 17 no'lu EN plan/store taslağı |
| 1f1266d | Yasal katman dile duyarlı (EN yasal TASLAK + seçiciler) |
| 8a89993 | **Büyük dilim (3 paralel ajan):** divinationData EN (78 tarot+44 melek+120 sayı+24 rün+64 I-Ching), persona EN sesleri (7×identity.en.md + common.en.md, yeniden yazım), 14 ekran ~309 anahtar, generator çift-dil + 8 servis + İkram Masası dil bağlama, sanitizer EN sözlüğü |
| c1e659f | **Final öz-review düzeltmeleri:** günlük tarot EN şablonu, kart bileşeni etiketleri, genel astro EN promptu, **EN kriz tespiti + dil-duyarlı moderasyon yanıtları**, EN hayvan kapanışları, EN retry mesajları |
| (kapanış) | 18_FAZ4 tam test dokümanı + bu handoff + 00 + tag `faz4` |

**Öz-review zinciri:** Faz 4a review (1 düzeltme) → final kapsamlı review (2 CRITICAL + 12 bulgu; tamamı ya düzeltildi ya §SON boşluk listesine dürüstçe yazıldı). tr.ts birebir-taşıma kuralı bağımsız doğrulandı: **368/368 bayt-aynı.**

**Mimari kararlar (sonraki oturumlar için bağlayıcı):**
- expo-localization YOK (saf JS algılama) → bu fazda APK gerekmedi; release'te eklenirse yalnız `detectDeviceLanguage` değişir + YENİ APK.
- Persona EN = `identity.en.md` kaynak → generator `readingPersonaData.en.ts` (+ Output Language bloğu); eksik EN dosyada TR-fallback, build kırılmaz.
- Prompt iskeleti TR kaldı (model TR talimat + EN çıktı sorunsuz); tam EN prompt iskeleti gelecek optimizasyon.
- İçerik anahtarları (kart adı, rün, hexagram no) dilden bağımsız → önbellek/parmak izi dil değişiminde stabil; metin aktif dilde yeniden kurulur.

## 2. OZAN'A KALAN TÜM İŞLER (4 fazın nihai birleşik listesi — TEK TEK)

**Cihaz testleri (5 doküman, tek oturuş, APK GEREKMEZ):**
1. `13_FAZ1` · 2. `14_FAZ2` · 3. `16_FAZ3` · 4. `18_FAZ4` (+ 12_FAZ0 kalanları; EK-3 yeni APK ister)

**Metin/ses/marka onayları:**
5. Yasal metinler TR (legalTexts.ts) + EN taslakları (avukat sonrası finalize)
6. Persona dil ikameleri (a4f3090) + Faz 3 ses matrisi/lore tonu + kapanış sınır-durumları
7. **Persona EN sesleri** (identity.en.md ×7 — 18/Grup 4.6 beğeni turu) + EN moderasyon/retry/hayvan-kapanış metinleri
8. BRAND_BOOK §8 (renkler/font/logo/üç sıfat) + EN oda adları + header "Ruhbaz" vs "Ruhbaz Konağı"
9. EN store metni (17/§4) + **EN yayın eşiği kararı** (18/§SON boşluklarıyla birlikte: UI-yeterli mi, boşluklar kapanınca mı?)
10. Tarot sınır-durum adları (Kader Çarkı/Şeytan/Mecnun)

**Dış işler:**
11. Avukat randevusu (15 no'lu dosya hazır) · 12. Play Console · 13. IAP + fiyat (K43) · 14. Analitik aracı (önerim Aptabase) · 15. K51 kararı (release öncesi)

## 3. SONRAKİ KOD OTURUMLARINA NOTLAR

- EN boşlukları (18/§SON 1-6) istenirse tek tek kapatılır — her biri bağımsız, küçük-orta iş.
- Release-öncesi migration paketi (D3): falci-data/ + DB adı + 'fortune-cookie' id'leri + iç "Kendini Tanı" referansları + eas projectId + expo-localization — TEK pakette.
- Yayın Öncesi Kontrol Listesi (05) hâlâ ayrı iş: token sayaçları, MemoryDebug, dev controls, console.log temizliği.

## 4. FAZ 5 BRİFİNGİ — Konak Akışı + bildirimler (ONAY BEKLİYOR; özerk başlamadı)

**Kaynak:** 05/Faz 5. En büyük faz: içerik takvimi + statik JSON feed (GitHub Pages, bedava) + Konak Akışı ekranı + push/yerel bildirimler + bildirim taksonomisi (rating push dahil — Ozan notu) + paylaşım kartları (K19) + cross-sell (K21/K52) + I-Ching/Rün kişisel tür + favoriler + bekleme sahnesi + Aura teması + pet personaları + İçerik Fabrikası + Konak Bülteni (F8 lore senkronu).

**Özerk yapılabilir / Ozan'lık ayrımı (taslak):** Kod+altyapı+taslak içerik üretimi özerk olabilir; içerik ONAY kuyruğu, sosyal hesap açılışları, bildirim metin onayları Ozan. Faz başlamadan brifing onayı + bildirim taksonomisi tasarım turu gerekir (05'teki Ozan notu).

**Önkoşul:** Faz 1-4 cihaz testlerinin sorunsuz çıkması (4 doküman) — özellikle Faz 4 EN testleri.

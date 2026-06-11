# FAZ 3 → FAZ 4 GEÇİŞ + FAZ 4 BRİFİNGİ (2026-06-11, özerk oturum devamı)

> Faz 3 bitti (tag `faz3`); Ozan'ın "iki faz daha git" onayıyla Faz 4 (İngilizce/i18n) özerk başlıyor. Güncel durum: `00_HANDOFF.md`.

---

## 1. FAZ 3'TE YAPILANLAR

| Commit | İş |
|---|---|
| 0c4ca30 | **7 persona ses matrisi + lore kanonu + K45 hitap politikası** (common.md "Address Policy" + her personada Voice Matrix/Lore Canon; Selin teknik-terim düzeltmesi; Arın Gen-Z; min-zenginlik standardı) |
| 01de256 | **Kapanış vaat temizliği**: "gerçeğe dönüşecek / müjde yolda / kuş kanadında haber / evvel Allah" sınıfı düzeltildi; dilek-kipi hayır duaları bilinçli KALDI |
| 49d74d0 | **BRAND_BOOK v0.1 TASLAK** (çekirdek palet + K44 persona renkleri + ton/yasaklar) + **K50 oda adları UI'da** (Salon / Ayna Odası / Simya Odası) |
| 7442b68 | Öz-review düzeltmeleri (Arın isim-sızıntısı kuralı, Berk typo, BRAND_BOOK gövde rengi) |

**Öz-review:** SAFE verdict (CRITICAL yok). Generator bayt-aynı; Address Policy guardrail gövdesine doğru aktı; lore simetrik; prompt büyümesi persona başına ~1.2-1.7K karakter (kabul edilebilir). 3 küçük bulgu düzeltildi.

**Cihaz testleri:** `16_FAZ3_CIHAZ_TESTLERI_2026-06-11.md` — APK gerekmez; çoğu LLM-davranış testi (ses TASLAK; beğenilmeyen ton tek dosyadan düzelir).

**Ozan onayına kalanlar (Faz 3 özel):** ses matrisi/lore tonu (test Grup 3), kapanış sınır-durumları, BRAND_BOOK §8 (renkler/font/logo/üç sıfat), aile ağacının kesin derecesi.

**Ertelenenler:** sanitizeGenderedAddress'in hitap MOTORUNA genişletilmesi (kod işi; prompt-politikası şimdilik yeterli — Faz 5 adayı) · iç prompt'lardaki "Kendini Tanı" referansları (release-öncesi migration paketi).

---

## 2. FAZ 4 BRİFİNGİ — İngilizce/i18n (05/Faz 4; ÖZERK, Ozan onayı alındı)

**Kapsam (05):** i18n altyapısı (expo-localization + i18n kütüphanesi) → TR string'lerin anahtarlara taşınması (divinationData ~650 satır dahil) → EN çeviri (önce UI, sonra içerik) → persona seslerinin EN'de YENİDEN YAZIMI (çeviri değil) → K45 EN hitap politikası → store EN listing (metin taslağı).

**Özerk sınırlar ve gerçekçi hedef:**
- **i18n altyapı + UI string çıkarımı + EN UI çevirisi:** özerk yapılır.
- **expo-localization NATIVE modüldür → bu fazın sonunda YENİ APK ŞART** (test dokümanına yazılacak; Faz 0'daki gibi debug APK derlemeyi kendim denerim).
- **Persona EN sesleri + EN store metni:** TASLAK üretilir, onay Ozan (marka/ses).
- **İçerik veri dosyaları (divinationData vb. ~650 satır):** hacim büyük; önce altyapı + UI, sonra içerik katmanı — oturum/usage sınırına takılırsa kesin checkpoint bırakılır (00 protokolü).

**Teknik plan:**
1. Kütüphane: `i18next + react-i18next` (RN'de standart, expo uyumlu) + `expo-localization` (cihaz dili algılama). Dil kalıcılığı falci-data/settings dosyasında; varsayılan TR.
2. `mobile/src/i18n/` yapısı: `index.ts` (kurulum) + `locales/tr/*.json` + `locales/en/*.json` (namespace'ler: common, home, settings, legal, readings...).
3. UI ekranları tek tek `t('...')`'ye taşınır; TR JSON mevcut metinlerin birebir kopyası (davranış değişmez — regresyon güvencesi).
4. Persona/prompt katmanı: Faz 4'te PROMPT'LAR TR KALIR (EN persona sesi ayrı yeniden-yazım işi; taslak olarak başlatılır, tamamı Ozan onaylı Faz 4 kapanışında netleşir). UI EN olunca okuma çıktısının TR kalacağı geçici durum test dokümanında işaretlenir.
5. Her mantıksal adım ayrı commit; tsc + utf8 + image-contract her adımda.

**Risk:** Orta. En büyük tehlike string-taşıma sırasında davranış/metin kayması → kural: TR çıktı birebir korunur (JSON'a kopyala-yapıştır), EN ayrı katman. İkinci tehlike native modül → APK; test dokümanı bunu açıkça söyler.

## 3. REGRESYON NOTLARI (Faz 4'te bozulmamalı)

- Faz 1-3 notları aynen geçerli (yasal kapı, disclaimer, moderasyon noktaları, generator zorunluluğu, D3 adları).
- String taşıma TR metinleri DEĞİŞTİRMEZ (utf8 bekçisi + spot karşılaştırma).
- `legalTexts.ts` i18n'e taşınırken LEGAL_CONSENT_VERSION mantığı ve çerçeve cümlesinin birebirliği korunur.
- Oda adları K50 (Salon/Ayna Odası/Simya Odası) ve persona adları EN'de ÇEVRİLMEZ (lokalleştirilir — K45/K13; "Salon" EN'de de Salon kalabilir, karar taslakta Ozan'a sunulur).

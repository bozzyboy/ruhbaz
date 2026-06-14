# 25 — FAZ 5.4 I-Ching + Rün KİŞİSEL OKUMA: KARAR DOKÜMANI (blok: Ozan) — 2026-06-14

> **Durum:** TASLAK / **blok: Ozan kararı**. 5.4'ü (I-Ching + Rün'ü "Senin Evin"e kişisel okuma türü olarak eklemek) özerk haritaladım (5 ajanlı understand-workflow, ~429k token). Teknik olarak **yapılabilir** ve tarot kalıbı temiz bir şablon. Ancak doğru mimariyi seçmek **tek bir ürün kararına** bağlı (aşağıda). Karar verilmeden kod yazmak, maliyet/UX hakkında Ozan'ın vermesi gereken bir varsayım olurdu → bekletiyorum.

## ⭐ GEREKEN KARAR (Ozan): kişisel I-Ching/Rün nasıl çalışsın?

- **(A) STATİK tek-seferlik** — mevcut `divinationEngine` kalıbı: hexagram/rün seç + hazır metinden yorum kur. **LLM YOK** → sıfır token maliyeti, takip sorusu yok, hızlı. (İkram Masası'ndaki genel okuma gibi.)
- **(B) KONUŞMALI/interaktif** — `personalTarotService` kalıbı: Gemini + moderasyon + persona sesi + hafıza bağlamı + takip soruları + kapanış. Salon'un asıl değeri (kişiye özel, sohbetli). Token maliyeti var; tarotla aynı seviye.

**Önerim: (B) konuşmalı.** Gerekçe: Salon'un (Senin Evin) tüm türleri konuşmalı/kişiye-özel (kahve, el, astro, tarot, rüya, numeroloji); statik bir tür orada "yarım" hisseder. İ-Ching/Rün'ün statik hali zaten İkram Masası'nda var — Salon'a değer katması için kişisel + sohbetli olmalı. **Ama bu senin tat/maliyet kararın.**

### Bağlı alt-kararlar (B seçilirse)
1. **Tek ekran mı, ayrı mı?** Öneri: **tek birleşik `PersonalDivinationReadingScreen`** (I-Ching + Rün; dream-interpretation kalıbı — açılım-seçim YOK, doğrudan cast + sohbet). Tarot'un spread-seçim ekranı I-Ching/Rün için gereksiz karmaşa.
2. **Cast mekanizması:** seeded-random (tarot gibi otomatik) öneri — kullanıcı manuel hexagram/rün seçmesin (sembolik tutarlılık + basitlik).
3. **Varsayılan persona:** I-Ching → ? · Rün → ? (mevcut: astro=Selin, tarot=Arın, numeroloji=Berk, el=Teoman). Öneri: ikisi de **Arın** (sezgisel/sembolik) ya da I-Ching=Teoman (bilge/felsefi), Rün=Arın. **Tat: Ozan.**
4. **currentlyAvailable:** kod hazır olunca `flowTypes`'ta `true`.

## 🗺️ MİMARİ HARİTA (understand-workflow bulguları)

- **Mevcut I-Ching/Rün ZATEN VAR ama statik:** `data/divinationData.ts` (64 hexagram + 24 rün, `IChingHexagram`/`RuneMeaning` tipleri, TR+EN) + `services/divinationEngine.ts` (string-concat üretim, **LLM yok**) + İkram Masası reveal bileşenleri. → **Veri + görsel reveal yeniden kullanılabilir;** B seçilirse "kişisel/konuşmalı" servis sıfırdan (tarot'tan klonla).
- **Şablon = `personalTarotService.ts` (475 satır):** moderasyon, persona systemBody, hafıza context, sağlık/cinsiyet sanitizasyonu, kapanış cümlesi, token policy, domain-leak temizliği. Klonla → `personalIChingService` + `personalRuneService` (veya tek `personalDivinationService` + tür parametresi).
- **🔴 KRİTİK ENGEL — persona domain union'ı:** `services/personaClosingService.ts:8` `PersonalReadingDomain` union'ı + `DOMAIN_FORBIDDEN_TERMS` (satır 10-17) astro/numeroloji/tarot için `'rune'`, `'i ching'`, `'hexagram'` kelimelerini YASAKLI sayıyor (yani bu objelerle yorum yapma). Bu, I-Ching/Rün'ün bilinçli olarak kişisel-domain dışında tutulduğunu gösterir. → Yeni `'iching'` + `'rune'` domain'leri bu union'a eklenmeli VE kendi domain'lerinde bu terimler serbest bırakılmalı (diğer domain'lerde yasak kalır).
- **Menü mimarisi BLOKAJ DEĞİL:** `PersonalReadingTypeSelectScreen`'deki `currentlyAvailable:false` yalnızca **kullanılmayan legacy ekranda**. Canlı akış `PersonalReadingsScreen.flowTypes` üzerinden (orada tarot `true`). Yeni türler **yalnız `flowTypes`'a** eklenir; legacy ekrana dokunmaya gerek yok.

## 📋 UYGULAMA ADIMLARI (B seçilirse — ~16-18 dosya, sonraki oturum)
1. **Union'lar (4+):** `App.tsx` RootStackParamList (`PersonalAssistantSelect.readingType` + yeni route) · `ReadingSummary.readingType` (`personal-iching`, `personal-rune` — persist deseni `personal-` ÖNEKLİ) · `PersonalReadingsScreen.flowTypes` · `types.ts` gerekiyorsa.
2. **persona domain:** `personaClosingService.ts` union + forbidden-map'e `iching`/`rune` ekle (kendi domain'inde serbest).
3. **Servis:** `personalTarotService`'ten klon → cast mantığı (seeded-random hexagram/rün) + divinationData verisini prompt'a ver.
4. **Ekran:** birleşik `PersonalDivinationReadingScreen` (dream kalıbı) + App.tsx nav kaydı.
5. **Reader-select:** `PersonalAssistantSelectScreen` defaultAssistantId + navigate switch'e yeni türler.
6. **getReadingTypeLabel** (`profileMemoryService`) + **i18n** (`readings.typeIChingPersonal`/`descIChingSelect`/... TR+EN) + nav başlıkları.
7. **Bekçiler + öz-review + 23_ doc bölümü.**

## ⚠️ Riskler
- Paylaşılan persona domain union'ı/forbidden-map (tüm okumalar) — dikkatli ekle (regresyon: diğer domain'lerde rune/hexagram yasağı korunmalı).
- ReadingSummary union genişlemesi → normalize/loadAccountState'te yeni türler (favorite/dedupe etkilenmez).
- Token politikası: I-Ching/Rün çıktısı tarottan kısa olabilir; max output tür-bazlı ayarlanabilir.

## ✅ Sonuç
5.4 **net ve yapılabilir**; tek eksik **Ozan'ın A/B (statik vs konuşmalı) + alt-kararları**. Karar gelince sonraki oturum yukarıdaki adımlarla uygular. Bu doküman + understand-workflow bulguları o uygulamayı doğrudan besler.

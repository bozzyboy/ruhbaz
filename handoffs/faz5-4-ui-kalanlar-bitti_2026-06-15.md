# FAZ 5.4 — UI/UX KALANLARI BİTTİ (app-geneli followup/self-name/scroll/balon/cast) — 2026-06-15

> Ozan'ın cihazda 5.4 (I-Ching/Rün) sonrası verdiği app-geneli UI/UX geri bildirimleri uygulandı. **Yalnız JS/TS — APK gerekmez; `npx expo start -c` + kapat-aç ile test edilir.** Plan dosyası: [faz5-4-ui-kalanlar_2026-06-15.md](faz5-4-ui-kalanlar_2026-06-15.md). Cihaz testi: `23_FAZ5_CIHAZ_TESTLERI_2026-06-14.md` madde **59–70**.

## YAPILANLAR (her biri ayrı commit + bekçiler + öz-review)

### ITEM 1 — Sosyal followup kısa-yanıt (app-geneli) · `9645f39`
- `followUpResponseService.ts`: `getSimpleFollowUpReply` baştan yazıldı. Yaklaşım: **çıkar-ve-kontrol et** — mesajdan sosyal-kapanış + dolgu token'larını çıkar, geriye anlamlı kelime kalırsa (gerçek soru) ASLA yakalama. Geniş TR (teşekkür ederim, sağolasın, eyvallah, minnettarım, ellerine sağlık, tamam, peki...) + EN (thanks, thank you so much, ty, appreciate it...) token listesi. Soru-işareti ve >80 char guard. **Dil-duyarlı yanıt** (`getAppLanguage()` TR/EN).
- 23 vakalık node self-test geçti (yanlış-pozitifler dahil: "teşekkürler peki ya işim" → yakalanmıyor).
- Çağrı eksik olan servislere eklendi: `personalTarotService`, `astroEngine` (birthChart + personalAstro + relationship followup), `personalNumerologyEngine`. (Zaten vardı: divination, dream, readingApi.)

### ITEM 2a — Persona self-name direktifi (app-geneli) · `78946dd`
- `readingCommonPrompt.ts`: yeni `getPersonaSelfNameDirective(assistantId)` — dil-duyarlı (TR+EN). "Kullanıcı sana '{label}' ya da '{label} Baba/Abi...' diye hitap edebilir; bu SANA, üçüncü kişi/akraba değil; yine de kendini tanıtma." Label kaynağı `getAssistantLabel`.
- **9 okuma promptuna** enjekte (getReadingSafetyCore ile aynı noktalar): divination, tarot, dream, readingPromptBuilder (kahve/el/pati), astro (relationship reading + personalAstro reading/followup + relationship followup).
- **Birth chart (3 nokta) ve general-astro HARİÇ:** adlandırılmış persona kullanmıyorlar (assistantId yok); general-astro'da `getAssistantLabel` yanlışlıkla varsayılan personaya düşerdi → kasıtlı atlandı.
- `check:safety:core` yeşil (regen gerekmedi; direktif kodda üretiliyor, common.md'ye girmiyor).

### ITEM 2b — Divination cast SVG konumu · `b336fb0`
- `PersonalDivinationReadingScreen.tsx`: cast görseli (`DivinationCastView`) artık `messages.map`'ten önce DEĞİL; IIFE map içinde **ilk assistant-okuma balonunun hemen önünde** render. Sıra: [kullanıcı konu balonu] → [cast] → [okuma]. Genel okumada (konu yok) cast okumanın üstünde.

### ITEM 2c — Okuma gelince scroll-to-start (app-geneli, 6 ekran) · `a45582e`
- SessionScreen **zaten** son-mesaj-başına scroll yapıyordu (dokunulmadı).
- **Bubble-list ekranları** (divination, dream, tarot, birthChart): `messageYRef` (onLayout y) + `firstReadingScrolledRef`. İlk okuma → `scrollTo({y:0})`; takip → son balonun Y'sine. `scrollToEnd` (okuma-geldi anı) kaldırıldı.
- **Page-scroll ekranları** (personalAstro, numerology): okuma sabit/ayrı panelde → takip cevabında `scrollTo({y: followUpsPanelYRef + bubbleY - 8})` (panel Y + balon-içi Y ofseti). personalAstro ilk okuma zaten readingPanel'e scroll ediyordu.
- AstroRelationship: otomatik scroll yoktu → dokunulmadı.

### ITEM 2d+2e — Balon yeşilimsi + edit/resend kaldır · `b7c7668`
- **2d:** Sadece SessionScreen `bubbleUser` amber→yeşilimsi (`rgba(125,220,154,0.08)` bg + `0.28` border). Diğer 5 ekran zaten yeşilimsiydi.
- **2e:** Edit/resend "mesaj balonu altı aksiyon satırı" yalnız SessionScreen'deydi → tamamen kaldırıldı (button + `messageActionModal` + `handleMessageActions` + state + stiller). i18n anahtarları kaldı. Diğer ekranlardaki `editQuestionTitle` yalnız editör modal başlığı → korundu.

### ITEM 3 — Rün
- Divination ekran/servisini paylaştığından 2b/2c otomatik kapsandı; 1 ve 2a servis/prompt seviyesinde paylaşılan. Ekstra iş yok.

## BEKÇİLER (hepsi yeşil)
typecheck ✓ · check:turkish:utf8 ✓ · check:image:contract ✓ · check:moderation 43/43 ✓ · check:safety:core ✓

## EN PARİTESİ
ITEM 1 yanıt + ITEM 2a direktifi **kodda dil-duyarlı** üretiliyor (getAppLanguage). i18n/common.en.md'ye yeni TR-only string EKLENMEDİ → ayrı parite dosyası gerekmedi.

## REGRESYON NOTU
Paylaşılan `followUpResponseService` (genişletildi, mevcut eşleşmeler korundu) + 9 okuma promptu (self-name eklendi, mevcut direktiflerle çelişmiyor) + 7 ekran (scroll/balon). Cihazda her okuma türü: açılış + ilk okuma + 1 takip + 1 "teşekkür" → madde 59–70.

## CİHAZ TESTİ BEKLİYOR (Ozan)
`npx expo start -c` + kapat-aç. 23_ madde 59–70. Özellikle: self-name "Teoman Baba" testi, scroll-başa tüm türlerde, cast konumu I-Ching/Rün, kahve/el balon yeşil + edit/resend yok.

## DOKUNULMAYAN / BLOK
5.5 Aura + 5.6 bildirim ertelendi. Micro-event tutarlılık turu ertelendi (yalnız I-Ching/Rün'de). Ozan-bloklu: avukat/IAP/fiyat/store/marka/feed.

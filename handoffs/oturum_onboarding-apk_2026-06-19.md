# OTURUM SNAPSHOT — Onboarding + UI redesign + yedek + teknik borç (2026-06-19)

> Bu oturumda yapılanların özeti + sıradaki iş + doğru doküman haritası + sonraki session için kopyala-yapıştır prompt. **00_HANDOFF.md hâlâ ana giriş kapısı; bu dosya o günün snapshot'ı.**

## ✅ Bu oturumda yapıldı (commit'li + GitHub'da: bozzyboy/ruhbaz)
1. **Faz 5.4 UI/UX kalanları** (app-geneli): sosyal-followup kısa-yanıt (geniş TR+EN), persona self-name (9 prompt), divination cast konumu, scroll-to-start (7 ekran + ilk-okuma y:0 fix), balon yeşilimsi, edit/resend kaldır. → `23_` md 59–70.
2. **Ertelenen teknik borç:** tüm DATA_FILE mutator'ları `withStateLock` (kayıp-güncelleme); `domainNeutralPersonaSignature` → `personaSignature.ts` (dedupe). B-6 (embedding maliyet sayacı) ve B-1 (ay-fazı) **zaten çözülmüş/geçersiz** çıktı — yol haritasına işlendi.
3. **B-2 astro gökyüzü olayları:** `astroEngine.buildSkyEventsContext` — ay evresi/yeni ay/dolunay + aktif retro + yaklaşan tutulmalar; kişisel + genel astro prompt'una. → `23_` md 75–78.
4. **GitHub yedeği:** `origin → github.com/bozzyboy/ruhbaz` (private), classic PAT remote URL'de (yerel), **her checkpoint'te otomatik push**. Büyük medya/`Ruhbaz Design System/`/`apk/` gitignore'da.
5. **UI redesign yönü:** lobi = **B** (gündüz-pastel full-bleed video bg + "Kendin keşfet"/"Kâhya ile gez" küçük yan yana); **BRAND_BOOK v0.2** (Aura gün↔gece token'ları); GPT image 2 prompt setleri (**v2 = modern/pudramsı pastel**); giriş videosu 2×8sn Flow prompt'u (Ozan üretiyor; 1. aday + son kare `ui icin fikirler/video adaylari/`).
6. **ONBOARDING EKRANI KODU BİTTİ** (asıl iş): handoff `Ruhbaz Design System/design_handoff_onboarding` → RN. `mobile/src/theme/ruhbaz.ts` + `OnboardingScreen.tsx` (full-bleed expo-video muted/loop-yok/son-frame-donar + Cinzel wordmark + elmas ayraç + Nunito italik alt metin + 2 dairesel cam buton: **Kendin Keşfet→Home**, **Kâhya ile Dolaş→"yakında"**) + Aura **cihaz-saati otomatik** (06–19 gündüz) + reduce-motion + RN-Animated. Nav `initialRouteName=Onboarding` (yasal onaydan sonra, headersiz, her açılışta; Ozan: a). i18n `onboarding.*` TR+EN (**Kâhya EN = "the Keeper"**). Dev-gating: TokenUsage bileşen-seviyesi (9 ekran) + MemoryDebug kayıt/buton, hepsi `ENABLE_DEVELOPER_DEBUG_UI=__DEV__`. Native paketler eklendi (expo-video/blur/linear-gradient/font + cinzel/nunito) → **YENİ APK gerekir**. Video sesleri %50↓. Bekçiler yeşil.
7. **APK:** eski (Faz 0) korundu → `apk/ruhbaz_ESKI_faz0_2026-06-11.apk`; yeni onboarding'li APK bu oturumda derlendi → `apk/ruhbaz_YENI_onboarding_2026-06-19.apk` (yol aşağıda/güncellenecek). Not: proje `gradle-wrapper.jar` autocrlf ile bozuktu; cache'teki gradle 8.14.3 ile build alındı (wrapper ayrıca düzeltilebilir).

## ✅ ONBOARDING CİHAZDA DOĞRULANDI (Ozan onayı, 2026-06-19)
"çok güzel görünüyor, videolar akıyor, metin doğru, Kâhya parıltısı nice touch; Kendin Keşfet→eski akış, diğeri→yakında. Hepsi OK şimdilik." → Onboarding ekranı kabul edildi. İnce ayar/düzeltme YOK (şimdilik).

**BAĞLANTI ÇÖZÜLDÜ (önemli — yeni session bunu kullan):** Wi-Fi/QR takıldı (manuel :8081 girince bile "port 80" hatası — 8081'i tutan yabancı metro yüzünden). KESİN ÇÖZÜM = **USB + adb reverse + localhost**: 8081'i boşalt → `npx expo start --dev-client --lan --port 8081` (mobile) + token (agent, HOST=0.0.0.0, 8080) → telefon USB + izin → `adb reverse tcp:8081 tcp:8081` + `tcp:8080 tcp:8080` → telefonda "Enter URL manually" `http://localhost:8081`. Detay: memory [[baglanti-sorunlari-protokolu]] (2026-06-19 güncel). adb: `%LOCALAPPDATA%\Android\Sdk\platform-tools\adb.exe`.

## ⏭️ SIRADAKİ İŞ (öncelik sırası)
1. **YENİ TASARIMLAR (Ozan, yarın "Claude design" ile devam):** Ozan yeni ekran tasarımlarını üretip getirecek → Claude RN'de uygular (onboarding kalıbı + `ruhbaz.ts` token'ları + cam bileşenleri örnek). Onboarding cihaz-testi BİTTİ (yukarıda).
2. **Ozan üretiyor:** Flow giriş videoları (`handoffs/intro-video-prompt_2026-06-15.md`) + GPT image 2 sanat (logo/persona/bg — `handoffs/gpt-image2-prompt-seti-v2_2026-06-15.md`). Geldikçe Claude UI'a yerleştirir.
3. **UI redesign devamı:** B lobiyi tam premium'a taşı (artık APK'da expo-video/blur var → Fidelity-2); persona portrelerini reader-seçime; token'ları (`ruhbaz.ts`) ekranlara yay; eski ekranları yeni tasarıma geçir. Dok: `BRAND_BOOK.md`, memory `ui-redesign-durumu`.
4. **Bekleyen cihaz testleri (Ozan):** Faz 4.5 (`21_`) + Faz 5 (`23_` md 49–78).
5. **Ertelenmiş:** 5.5 Aura kalıcı tetik · 5.6 bildirim (native/APK) · Faz 6a **Kâhya/"the Keeper"** (araç katmanı + IAP) · MCP Faz 6b · kalan tech-debt (inline güvenlik dedupe, god-file böl, K29, B-3/B-4, gradle-wrapper.jar düzelt).
6. **Ozan bloğu:** avukat, IAP/fiyat, analitik aracı, store, marka/feed yayını.

## 📑 DOĞRU DOKÜMANLAR (nereye bak)
- **00_HANDOFF.md** — ana giriş kapısı (güncel durum).
- **BRAND_BOOK.md** — renk/tipografi/cam/Aura token'ları + §9 sonraki adımlar.
- **handoffs/onboarding-bitti_2026-06-19.md** — onboarding cihaz-testi + TODO (video ses sonra, kasarsa çözünürlük↓).
- **handoffs/ui-tasarim-yonu_2026-06-15.md** — kalıcı UI kuralları (iOS=Android, kontrast, persona-kişi yok, Kâhya/Remotion).
- **handoffs/intro-video-prompt_2026-06-15.md** — Flow video prompt'ları (Shot 1+2).
- **handoffs/gpt-image2-prompt-seti-v2_2026-06-15.md** — modern sanat asset prompt'ları (logo/persona/bg).
- **23_FAZ5_CIHAZ_TESTLERI_2026-06-14.md** — Faz 5 + UI + astro cihaz test maddeleri.
- **05_YOL_HARITASI.md** — fazlar (B-1/B-2/B-6 notları güncel).
- memory: `ui-redesign-durumu`, `ozerk-oturum-durumu`.

## ⚙️ ÇALIŞMA KURALLARI (değişmez)
- 677: "fal/falcı/kehanet/medyum/büyü" YASAK → "sembolik yorum/okuma/içe bakış". EN=TR parite ([[en-tr-parite-kurali]]). Bekçiler her adımda (tsc/utf8/image/moderation/safety-core). Mevcut ekranı bozma; her mantıksal adım ayrı commit + otomatik push. Native paket → yeni APK. Ozan-bloklu işlere taslak+"blok" bırak.

---

## 📋 SONRAKİ SESSION İÇİN PROMPT (kopyala-yapıştır)

```
Ruhbaz Manor'a devam. ÖNCE OKU (bu sırayla): 00_HANDOFF.md + handoffs/oturum_onboarding-apk_2026-06-19.md (bu oturum snapshot'ı) + handoffs/onboarding-bitti_2026-06-19.md + BRAND_BOOK.md + memory (ui-redesign-durumu, ozerk-oturum-durumu). Tüm file:line ipuçları o dokümanlarda.

DURUM: Onboarding/giriş ekranı BİTTİ ve CİHAZDA DOĞRULANDI (Ozan onayı 2026-06-19: videolar akıyor, metin doğru, Kâhya parıltısı OK, Kendin Keşfet→eski akış, Kâhya→"yakında"; ince ayar yok). Yeni APK apk/'da (eski Faz 0 da korunuyor). Faz 5 + teknik borç + B-2 astro + GitHub yedeği tamam. UI redesign yönü = B lobi (gündüz-pastel full-bleed video bg + Kendin keşfet / Kâhya ile gez). Sanat + giriş videolarını Ozan dış araçlarda üretiyor; prompt'lar handoffs/'ta.

İŞ: Ozan yeni ekran tasarımlarını Claude (claude.ai design) ile üretip getiriyor → RN'de uygula. Referans kalıp: OnboardingScreen.tsx + mobile/src/theme/ruhbaz.ts token'ları + cam (BlurView) bileşenleri + Aura gün↔gece. [Ozan o anki ekranı/akışı buraya yazar — örn "şu lobi tasarımını uygula", "persona-seçim ekranını yenile".]

BAĞLANTI (cihaz testi yapılacaksa): Wi-Fi/QR GÜVENİLMEZ (port-80 takılması) → direkt USB + adb reverse + telefonda http://localhost:8081 kullan. Adımlar bu dosyanın üstünde ("BAĞLANTI ÇÖZÜLDÜ") + memory baglanti-sorunlari-protokolu (2026-06-19 güncel).

DİSİPLİN: 677 (fal/kehanet YASAK → sembolik yorum/içe bakış) + EN=TR parite (Kâhya EN = "the Keeper") + her adım ayrı commit + bekçiler (npm --prefix mobile run typecheck / check:turkish:utf8 / check:image:contract / check:moderation / check:safety:core) + mevcut ekranları bozma + otomatik GitHub push. Native paket eklersen YENİ APK gerekir (Ozan'a haber ver). Ozan-bloklu (avukat/IAP/fiyat/store/marka/feed) = taslak + "blok: Ozan".

DOKUNMA/BLOK: 5.5 Aura + 5.6 bildirim ertelendi. Kâhya/MCP (Faz 6a/6b) araç katmanı + IAP ön-koşullu. Ultracode varsayılan kapalı (hacimli işte aç).
```

# UI/UX TASARIM YÖNÜ — kalıcı kurallar + lobi kararı (2026-06-15)

> Ozan cihaz-sonrası UI redesign yönünü verdi. Referanslar: `ui icin fikirler/` (blurr/Kivo ethereal liquid-glass videoları, pastel PNG'ler, `onceki ui fikirlerim/ruhbaz_ui_kit` = Powdery Pink·Aegean Blue·Antique White·Gold·Stone Grey + RUHBAZ Serif). Hedef: **PREMIUM** (Ozan'ın ilk hızlı mockup'ı "tatsız" buldu — bar yüksek).

## ⛔ HER ZAMAN HATIRLA (bağlayıcı kurallar)
1. **Tek UI, iki platform:** iOS ve Android'de BİREBİR aynı UI. Platforma özel ayrışma yok.
2. **KONTRAST (kritik):** Açık renk yazı asla açık zemine düşmeyecek. Gradyan/ethereal arka planlarda yazı DAİMA koyu bir scrim/cam panel üstünde olacak (ör. `rgba(20,15,35,0.45)` + blur). "Yazı açık bölgede kayboluyor" = kabul edilemez. Her metin bloğu için okunabilirlik garanti.
3. **Premium his:** ucuz/jenerik değil; katmanlı derinlik, zarif tipografi, ölçülü hareket. Final premium = Ozan'ın ürettiği sanat (GPT image 2) + RN'de gerçek blur/gradient/Skia. Inline mockup yalnız web-yaklaşımı (yön/onay için), final piksel değil.
4. **Karşılamada persona-kişi YOK:** lobide "Suzan·Kahve / Teoman·El" gibi kişi çipleri olmayacak. Personalar okuma türü seçildikten SONRA gelir.

## Karşılama (lobi) → ana giriş = KEŞFET + KÂHYA
- Lobi iki ana yöne açılır: **Keşfet** (kullanıcı kendi gezer) ve **Kâhya** (orkestratör).
- **Kâhya'ya basınca → orkestratör CHAT ekranı.** Kâhya appi baştan aşağı bilir; kullanıcının isteğine göre:
  - (a) **App navigasyonu:** ilgili ekrana ışınlar + ön-doldurur (hibrit UX; akışı sohbette yeniden yaratmaz).
  - (b) **App-içi gösterimli anlatım (guided walkthrough):** "şunu nasıl yaparım" → adım adım gösterir/anlatır.
- **Guided anlatımlar ÖNDEN VİDEO olarak hazırlanabilir → REMOTION** (React ile video render). Yani Remotion'ın gerçek kullanımı = onboarding/Kâhya rehber videoları (uygulama içi oynatılır). Kâhya'nın kapsamı bu yüzden "sadece navigasyon" değil, **rehberli demo** da içeriyor. [Not: bu Faz 6a Kâhya kapsamını genişletir; araç katmanı + IAP önkoşulu aynı kalır.]

## Tooling (kim neyi üretir) — Ozan "kendine skill/repo/figma/moodboard hazırla" dedi
- **Sanat (raster):** ambient arka plan, ethereal çiçek/eleman, persona portreleri, logo işi, doku → **Ozan, GPT image 2** ile (benim vereceğim prompt'larla, batch). Ben üretemem (diffusion yok).
- **UI/kod:** layout, cam, gradyan, bloom/aura, tipografi, ikon, animasyon, ekranlar → **ben** (inline mockup + gerçek RN kodu).
- **Guided videolar:** Remotion → ben kurar/render ederim (asset üretimi); ileride.
- **Figma:** şu an bağlı MCP yok → Figma'yı ben süremem. Gerekirse Ozan bir Figma MCP bağlarsa kullanılabilir; şart değil (mockup'ı kod/HTML ile veriyorum).
- **Moodboard/referans:** `ui icin fikirler/` zaten en iyi moodboard (Ozan'ın blurr/Kivo + pastel + ruhbaz_ui_kit). Ek RN glassmorphism teknik referansı ben net'ten toplayabilirim.

## Lobi içerik SEÇENEKLERİ (Ozan designer/UX değil → seçenek sunulacak)
- **A — Kâhya-merkezli:** ethereal hero sahne + altta koyu-cam panelde Kâhya selamı + "Kâhya'ya yaz" girişi; Keşfet ikincil link. (Kâhya yıldız.)
- **B — İki kapı:** "Keşfet" ve "Kâhya ile Gez" iki eşit cam portal, ambient zemin üstünde. (Net ikili seçim.)
- **C — Ambient-minimal:** tek sade ethereal sahne + tek "Başla" → Kâhya açılır ve "ne yapmak istersin" diye sorar. (En sakin, en az eleman.)
→ Ozan bir yön seçer; varyantlar buna göre derinleştirilir.

## Durum
Bu doküman yön/karar kaydı. Kod değişikliği YOK (henüz). Sıradaki: Ozan lobi yönünü (A/B/C) seçer → marka kitabı tokenları + seçilen yönün premium mockup'ı + GPT image 2 sanat prompt listesi.

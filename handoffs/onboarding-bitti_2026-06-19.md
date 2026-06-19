# Onboarding / Giriş Ekranı — KOD BİTTİ (2026-06-19)

> Tasarım handoff'u (`Ruhbaz Design System/design_handoff_onboarding`) RN'de uygulandı. Bekçiler yeşil (tsc/utf8/safety-core/image). Commit `7a582bd` (+ temel `5d8b51c`). Mevcut ekranların HİÇBİRİ bozulmadı.

## ⚠️ CİHAZ TESTİ = YENİ APK GEREKİR
expo-video, expo-blur, expo-linear-gradient, expo-font **native modüller** → JS reload YETMEZ. Test için **yeni dev build APK** derlenmeli. (Önceki APK bu ekranı açamaz / video-blur çalışmaz.)

## Ne yapıldı
- **`mobile/src/theme/ruhbaz.ts`** — tasarım token'ları (renk/cam/spacing/shadow/tipografi/motion/aura).
- **`mobile/assets/manor-bg.mp4` + `manor-night.mp4`** — gündüz/gece arka plan videoları; **sesleri %50 düşürüldü** (ffmpeg volume=0.5, video stream kopya).
- **`OnboardingScreen.tsx`** — full-bleed expo-video (muted, loop yok → son frame'de donar), Cinzel "RUHBAZ KONAĞI" wordmark + altın elmas ayraç + Nunito italik alt metin, iki 84px dairesel cam buton (BlurView): **Kendin Keşfet → Home (mevcut manuel akış)**, **Kâhya ile Dolaş → "yakında" placeholder**. Nefes-alan halkalar + Kâhya parıltısı (RN Animated; reanimated babel'a bağımlı değil), reduce-motion duyarlı, svg ikonlar.
- **Aura (gündüz/gece) = cihaz saatine göre otomatik** (06–19 gündüz); `__DEV__` HUD'da aura toggle var.
- **Nav:** `initialRouteName="Onboarding"` (yasal onaydan sonra), `headerShown:false`, her açılışta giriş ekranı. Home + tüm ekranlar olduğu gibi.
- **i18n:** `onboarding.*` TR+EN parite.
- **Dev-gating (`ENABLE_DEVELOPER_DEBUG_UI=__DEV__`):** TokenUsage **bileşen seviyesinde** kapatıldı (9 ekranda token sayacı release'de düşer) · MemoryDebug kaydı (App.tsx) + ProfileSettings'teki butonu gate'lendi · DevControls zaten gate'liydi · Onboarding route-HUD + tap-toast + aura-toggle `__DEV__` arkasında.

## Cihazda test (yeni APK ile)
1. APK kur → aç → (yasal onay sonrası) **Onboarding** açılmalı: tam ekran konak videosu oynar, sonunda son frame'de donar, ses yok (muted).
2. Gündüz/gece: cihaz saatine göre doğru video + metin renkleri (gündüz koyu-altın yazı, gece açık-altın). `__DEV__` HUD'dan aura toggle ile ikisini de gör.
3. Wordmark Cinzel, alt metin Nunito italik, iki dairesel cam buton + nefes-alan halka + Kâhya parıltısı görünür; alt üçte-bir boş (natürmort görünür).
4. **Kendin Keşfet** → mevcut Home/lobi açılır (eski akış çalışıyor). **Kâhya ile Dolaş** → "Kâhya yakında aramızda" çıkar, başka yere gitmez.
5. Regresyon: token sayaçları **dev'de** görünür (release'de düşecek); MemoryDebug girişi yalnız dev'de; mevcut tüm okuma akışları bozulmamış.

## 📌 TODO (Ozan notları — unutma)
- **Video sesleri SONRA değiştirilecek** (şimdilik %50 düşürüldü; ekran zaten muted oynatıyor).
- **Cihaz kasarsa:** aspect ratio sabit (9:16) kalır, video **çözünürlüğü düşürülür** (yeniden encode).
- **Kâhya ile Dolaş** gerçek hedefi Faz 6a (araç katmanı + IAP) — şimdilik placeholder.
- Aura kalıcı tetikleyici kararı (Faz 5.5) — şu an cihaz-saati otomatik + dev toggle.

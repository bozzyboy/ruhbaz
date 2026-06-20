# MANOR HTML PROTOTİP — Durum + Sıradaki İş (2026-06-21)

> Ruhbaz Konağı'nın yeni "konak/oda" UI'ını **tek-dosya HTML prototipinde** kuruyoruz. Amaç: Ozan'ın görüp onaylayacağı, sonra RN'e taşınacak çalışan referans. **App'e (mobile/) DOKUNMUYORUZ.**

## Dosya & önizleme
- **Prototip (tek dosya):** `Ruhbaz Design System (2)/design_handoff_manor_transitions/manor-preview.html` — vanilla JS/CSS, dış motor yok. Kepenk görselleri: `reference/manor-lobby/shutter-*.jpeg`.
- **Ozan nasıl bakar:** dosyaya **çift tıkla** → tarayıcı. (Eski `.dc.html`'ler çalışmıyor — runtime'ları [support.js/ds-base.js] handoff'a hiç konmamış; o yüzden vanilla HTML'e geçtik.)
- **Claude nasıl doğrular:** `.claude/launch.json`'da `manor-proto` adlı python statik sunucu var (handoff klasörünü 8099'da servis eder). `preview_start manor-proto` → `preview_eval` ile `location.replace('http://localhost:8099/manor-preview.html')` → sonra **işlevsel eval** (tıklama simülasyonu + DOM kontrolü) + `preview_console_logs level:error`. **ÖNEMLİ: `preview_screenshot` bu ortamda timeout veriyor** (Google Fonts ağ + sürekli CSS animasyonu network-idle'a ulaşmıyor) — görsel yerine **eval ile işlevsel** doğrula. Sunucuyu `preview_stop` ile kapat.

## EN ÖNEMLİ ÇALIŞMA İLKESİ
**Prototipi Ozan'ın hafızasından değil, gerçek RN app ekran kodundan BİREBİR kur.** Kaynak doğru = `mobile/src/screens/*`. Bir şey belirsizse önce ilgili ekranı (veya bileşeni) oku. Eşleşme:
- Sana Özel kahve/el-pati hazırlık+sohbet → `PersonalReadingSetupScreen.tsx` + `SessionScreen.tsx`
- Tarot → `TarotSpreadSelectScreen.tsx` + `TarotReadingScreen.tsx`; **açılım dizilim verisi** `mobile/src/data/tarotSpreads.ts` (gridColumns/gridRows + positions[col,row,crossed])
- I-Ching/Rün → `PersonalDivinationReadingScreen.tsx` + **görsel** `mobile/src/components/DivinationCastView.tsx` (+ `IChingSymbol.tsx`)
- Astro + İlişki/Aile → `PersonalAstroReadingScreen.tsx` + `AstroRelationshipReadingScreen.tsx`
- Numeroloji → `PersonalNumerologyReadingScreen.tsx` (initialMode 'core' vs dönem)
- Rüya → `DreamInterpretationScreen.tsx`
- İkram genel okumalar → `GeneralReadings*`/`GeneralReadingResult*` (+ prototipte İkram sheet'i bizim kurgu)
- Açılış ekranı → `OnboardingScreen.tsx`
- Disclaimer metni → `components/SymbolicDisclaimer.tsx`

## ŞU AN ÇALIŞAN (doğrulanmış, konsol hatası yok)
- Lobi (5 oda + Simya modal) + **kepenk geçişi** (Salon altın-standart; tüm odalar in-page).
- Aura gündüz/gece + Hareket toggle (alt çubuk).
- **Sana Özel:** tür → onay → yorumcu (7 persona) → **hazırlık/akış** → okuma + sohbet (Sor/mic/Telefon Okusun/Bitir):
  - Kahve (konu + mod [Foto yükle / Benim yerime iç] + 3 foto) · El-Pati (1 foto)
  - **Tarot:** 10 açılım → deste (Rider-Waite / Yaldızlı Düşler) → **gerçek 2B dizilim** (positions/crossed) → konu adımı → kartlar (dokun→büyüt + pozisyon adı)
  - **I-Ching:** konu → iki hexagram (şimdiki→dönüşüm, değişen çizgi noktayla işaretli) · **Rün:** konu → 3 taş (isim+anlam)
  - **Astro derin:** Günlük/Haftalık/Aylık/Yıllık + Belli Bir Konu + İlişki Uyumu + Aile Okuması
  - Numeroloji (Günlük/Haftalık/Aylık dönem) · Rüya (anlat→yorum)
- **İkram:** 15 genel okuma (profil sırası + yatay slider + kartlar); papatya/burç-uyumu(dropdown+grafik)/I-Ching(iki hexagram, slidersız)/generic/astro; sonuç kartı modalı.
- **Ayna:** doğum haritası (SVG çark + Yorumla + sohbet) · 6 test (Likert + sonuç). (Temel Numeroloji şu an "yakında" → TODO.)
- **Profil:** profil kartları + editör (Akraba/Diğer/Evcil hayvan'da yazı alanı; ana profil ilk & silinemez; dil; veri).
- Disclaimer ("Yapay zekâ ile üretilen, tamamen eğlence amaçlı…") tüm okuma sayfalarının başında.

## SIRADAKİ İŞ — Ozan'ın 2026-06-21 listesi (HİÇBİRİNİ ATLAMA)
1. **I-Ching değişen çizgi RENGİ:** App'te değişen çizgilerin RENGİ farklı (sadece nokta değil). Prototipte değişen çizgileri ayrı renkle göster — hem İkram günlük hem kişiye özel. (Renk: `IChingSymbol.tsx`/`DivinationCastView.tsx`'ten al.)
2. **Aynalı Oda → "Temel Numeroloji":** "yakında" kalkacak; gerçek **sohbet ekranı** olacak — çekirdek numeroloji (6 çekirdek sayı kartı: Yaşam Yolu/Kader/Ruh Arzusu/Kişilik/Doğum Günü/Olgunluk) + yorum + takip. (Kaynak: numerology initialMode='core'.)
3. **Doğum haritası (Ayna) takip input'u:** tek satır çıkıyor, yan scroll yok → **çok satırlı** yap.
4. **App geneli takip yazı alanı:** tek satır çok küçük → **~3 satır** yap (tüm okuma ekranlarındaki Sor/soru alanları).
5. **İkram "Günlük Tek Tarot":** sadece yazı değil, **kart görseli** de olsun (kişiye özel tarot gibi) — **Yaldızlı Düşler** destesine bağla.
6. **İkram uzun okumalar (genel astro, günlük I-Ching vb.):** metin uzun olabiliyor → sonuç kartında **scroll** garanti et.
7. **İkram "Günün Uğurlu Melek Sayısı" + "Günün Numerolojisi":** rakamlar **bold + büyük**, yorum metninin **üstünde başlık gibi**.
8. **Gece modu — onay modallarındaki "Hayır" butonu:** arka planı kart/modal arka planıyla aynı olduğundan buton anlaşılmıyor → gece modunda "Hayır"a **belirgin arka plan**.
9. **İkram okuma tipi kartları hover/press animasyonu:** Sana Özel'deki okuma tipi butonları gibi **ufak animasyon** (lift/scale) ekle.
10. **App launch / açılış ekranı:** prototipte yok, app'te var (`OnboardingScreen`: video bg + wordmark + "Kendin Keşfet" / "Kâhya ile Dolaş"). Prototipe **lobiden önce** ekle.
11. **(Önceden açık) İlişki/Aile astro — elle giriş:** şu an sadece profil-seç var; app'teki gibi **profil seçme + ELLE GİRİŞ** (ad, doğum tarihi/saati, ülke/şehir/ilçe, ilişki türü, cinsiyet, "Profil olarak sakla", aile ekle/kaldır + uyum türü seçici). Kaynak: `AstroRelationshipReadingScreen.tsx`.

## KURALLAR
- `mobile/` app'e DOKUNMA. · 677: fal/kehanet YASAK → sembolik/eğlence. · Disclaimer her okumada. · Her değişikliği **eval ile doğrula** (konsol hatası 0). · Prototip şu an TR; EN paritesi RN'e taşırken.
- Eski `.dc.html` referansları + `ManorLobby.dc.html.bak` duruyor (dokunma, referans).

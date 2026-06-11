# 10 — Yerel LLM Kaldırma Haritası (K10/K9)

Karar (2026-06-11): Yerel LLM (Gemma/LiteRT/Free IQ) ve IQ seçimi ilk release'ten TAMAMEN çıkarılıyor. Bu, salt-okunur tarama sonucu çıkmış güvenli çıkarma planıdır. Kod İŞİ "başla" komutu sonrası yapılır; bu doküman o işin reçetesidir.

## En önemli bulgu: TAMAMEN İZOLE

Yerel LLM bulut (Gemini) yolundan tamamen ayrık. Bulut prompt'larına, cache'ine, başka hiçbir özelliğe dokunmuyor. Tek giriş noktası `astroEngine`'deki `iqLevel === 'free'` kontrolü. Ayrıca: yerel LLM YALNIZCA kişisel astro okumasına bağlıydı — tarot, rüya, numeroloji, kahve, el HİÇ kullanmıyordu. Temizlik düşük riskli, ~2-3 saatlik cerrahi iş.

**Ozan düzeltmesi (2026-06-11):** Bu izolasyon tesadüf değil, BİLİNÇLİ tasarımdı — Ozan yerel LLM'i kasıtlı olarak yalnız kişisel GÜNLÜK astro okumasına bağlatmıştı (dar kapsamlı deney olarak). Yani "ayrı tuttuk mu?" sorusunun cevabı: evet, planlı şekilde ayrı tutulmuş.

## Prompt builder farkı (Ozan'ın şüphesi DOĞRU)

Yerel ve bulut FARKLI prompt builder kullanıyor:
- Bulut: `buildPersonalAstroGeminiPayload()` — tam JSON, geniş token bütçesi.
- Yerel: `buildLocalGemmaPromptFromGeminiPayload()` — aynı veriyi 1024-token girdiye SIKIŞTIRIR (head-tail truncation, 350 token çıktı). Tamamen ayrı fonksiyon; bulut ona referans vermiyor. Yani yereli silmek bulut prompt'unu hiç etkilemez.

## Çıkarma listesi (dosya → işlem)

| Dosya | İşlem | Tümünü sil? |
|---|---|---|
| `mobile/src/services/localGemmaService.ts` (309 satır) | TÜMÜNÜ SİL | ✅ sadece-yerel |
| `mobile/src/screens/PersonalAssistantSelectScreen.tsx` | EDIT: IQ segmented kontrol + yerel model indirme UI'ı (satır ~104-162) çıkar; sadece falcı/persona seçimi kalsın | kısmi |
| `mobile/src/services/astroEngine.ts` | EDIT: `createPersonalAstroReading` + `createPersonalAstroFollowUp` içindeki `iqLevel`/`localGemmaModelId` parametreleri ve 4 adet `if (iqLevel==='free')` dalı sil; bulut yolu tek yol kalsın; cache key hep `'gemini'` | kısmi |
| `App.tsx` (RootStackParamList) | EDIT: `PersonalAstroReading` param'larından `iqLevel?` ve `localGemmaModelId?` çıkar | kısmi |
| `mobile/android/.../RuhbazLiteRtLmModule.kt` (296 satır) | TÜMÜNÜ SİL | ✅ |
| `mobile/android/.../RuhbazLiteRtLmPackage.kt` | TÜMÜNÜ SİL | ✅ |
| `mobile/android/.../MainApplication.kt` | EDIT: `add(RuhbazLiteRtLmPackage())` satırını (≈27) çıkar | kısmi |
| `mobile/android/app/build.gradle` | EDIT: `litertlm-android:0.12.0` bağımlılığını çıkar | kısmi |
| `app.json` | Değişiklik YOK | — |
| Model assets (`.litertlm`) | Zaten Ruhbaz_Fable kopyasına ALINMADI (2.4GB hariç tutuldu) | — |

## Önerilen sıra (cascade hatasını önlemek için)

1. **UI:** PersonalAssistantSelectScreen'den IQ + yerel model panellerini çıkar (sadece persona seçimi kalsın). Navigasyon kırılmaz — ekran ya sadeleşir ya tümden atlanır.
2. **TS cascade:** App.tsx param'ları → astroEngine imza+dalları → ekrandaki localGemma import/state'leri.
3. **Servis sil:** localGemmaService.ts (artık çağıran kalmaz).
4. **Android native:** MainApplication satırı → iki Kt dosyası sil → build.gradle bağımlılığı.
5. Her adımda `tsc --noEmit` ile doğrula (cascade tip hatalarını yakalar).

## Navigasyon kararı (Faz işinde verilecek)

PersonalAssistantSelect "load-bearing" DEĞİL. İki seçenek:
- A) Ekranı tamamen kaldır, varsayılan persona ile devam.
- B) Ekranı tut, sadece IQ bölümünü söküp persona seçici bırak.
Öneri: B (persona seçimi ürün için değerli; K11 ses matrisi/persona kimliğiyle uyumlu). IQ dili tamamen gider.

## Notlar
- Bu temizlik Faz 0 veya Faz 2'ye (K9/K10 kalkışı) bağlanabilir; bağımsız ve düşük riskli olduğu için istenirse erken yapılır.
- İş bitince: 02'de K9/K10 "uygulandı" işaretlenir, 09 god-file/iqLevel notları güncellenir.

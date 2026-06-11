# 09 — Kod Sağlığı Raporu (Faz 0.5)

Tarih: 2026-06-11 · Yöntem: 4 paralel salt-okunur denetim ajanı (duplicate/ölü kod, best practices, LLM çağrı haritası + sanitizer, backend/güvenlik). **Hiçbir dosya değiştirilmedi.** Bu rapor durum tespitidir; temizlik işleri ayrı karar.

## Yönetici özeti

1. **Ozan'ın "duplicate/redundant kalıntı" sezgisi büyük ölçüde YERSİZ çıktı:** gerçek duplicate kod çifti bulunamadı, ölü export yok denecek kadar az (1 dosya). "Karışıklık hissi"nin gerçek kaynakları başka: dev dosyalar (god files), iç içe servis sarmalayıcıları ve ekranlara sızmış iş mantığı.
2. **"Okuma zart diye kesiliyor" gizemi ÇÖZÜLDÜ:** Suçlu token limiti değil, üretim SONRASI çalışan deterministik sanitizer'lar — özellikle `trimIncompleteTail` ve `trimMisalignedTail` düzgün cümleleri/paragrafları kesiyor. K32 ("onar, kesme") kararının ne kadar isabetli olduğunun kanıtı.
3. **En acil bulgular güvenlikte:** `.env` anahtarları (bilinen A1) + backend'de herkese açık `/gemini-api-key` endpoint'i, sınırsız CORS ve `0.0.0.0` dinlemesi. Yani proxy'nin adresini bulan HERKES senin Gemini anahtarını alabilir.
4. Çoklu API call şikâyeti doğrulandı: kahve okuması 3-4 çağrı; her kişisel okumadan sonra ayrı memory-analyze çağrısı; kısa cevapta komple yeniden üretim.

---

## A. 🔴 Güvenlik (en acil — Faz 0 kapsamına eklendi)

| # | Bulgu | Yer | Önem |
|---|---|---|---|
| G1 | `.env` içinde düz metin canlı anahtarlar (Google, OpenAI, OpenRouter, PublicAI, Together) | `agent/.env` (gitignore'da ✓ ama disk/geçmiş riski) | KRİTİK — hepsi döndürülmeli (A1 ile aynı) |
| G2 | `/gemini-api-key` endpoint'i API anahtarını İSTEYEN HER İSTEMCİYE veriyor | `agent/token_server.py:282-293` | YÜKSEK — endpoint kaldırılmalı veya kimlik doğrulamalı olmalı |
| G3 | CORS tamamen açık (`CORS(app)`) | `token_server.py:20` | YÜKSEK |
| G4 | Sunucu `0.0.0.0`'a bağlanıyor (LAN/internete açık olabilir) | `token_server.py:321` | YÜKSEK — dev'de `127.0.0.1` |

> **G3/G4 Expo test notu (Ozan sorusu):** CORS daraltma NATİF Expo testini etkilemez — CORS yalnız tarayıcı istekleri için geçerlidir; telefon/emülatördeki RN uygulaması CORS'a tabi değildir (yalnız Expo Web'de test ediliyorsa origin eklenir). Asıl dikkat G4: `127.0.0.1`'e çekilirse fiziksel telefondan LAN üzerinden erişim kırılır. Pratik çözüm: (a) Android'de USB + `adb reverse tcp:8080 tcp:8080` ile 127.0.0.1 korunur, veya (b) LAN dinlemesi kalır ama basit paylaşılan-gizli header doğrulaması eklenir (app istekte sabit token yollar). Önerilen: (b) — test konforu bozulmaz, rastgele LAN istemcisi reddedilir.
| G5 | `ENABLE_DEVELOPER_DEBUG_UI = true` sabit kodlu — debug UI release build'e gidebilir | `mobile/src/config/featureFlags.ts` | ORTA |
| G6 | Proxy'ye istek doğrulaması yok (payload yapı/boyut kontrolü minimal) | `token_server.py` | ORTA |
| ✓ | İyi haberler: prompt/kişisel veri loglanmıyor; kota mantığı sağlam; mobil tarafta secret yok; tsconfig strict; izin listesi makul | — | — |

## B. 🔴 Kesilme sorununun failleri (sanitizer envanteri)

Üretim TAMAMLANDIKTAN sonra çalışan, metni KESEBİLEN işlemler (K32 ihlalleri):

| Sanitizer | Yer | Ne yapıyor | Risk |
|---|---|---|---|
| `trimIncompleteTail` | `personaClosingService.ts:285` (neredeyse TÜM kişisel okumalarda) + `personalTarotService.ts:90` | Son cümle noktalama ile bitmiyorsa ve sınır metnin %58'inden sonraysa son cümleyi KESER | 🔴 1 numaralı kesilme nedeni |
| `trimMisalignedTail` | `fortuneApiService.ts:405` (kahve/el) | Soru-konu uyumsuzsa son 1-2 cümleyi SİLER (para sorusuna aşk kapanışı vb.) | 🔴 2 numaralı neden |
| `sanitizePublicReadingLanguage` zinciri | `personaClosingService.ts:424` | Cümle cümle filtre (hafıza ifşası, self-intro, kısıtlı terim, MBTI anonimleştirme...) — bazı adımlar cümle SİLER | 🔴 3 numaralı neden (birikimli) |
| `compactImageRetryReply` | `fortuneApiService.ts:508` | Görsel-yeniden-yükleme cevabını ilk 2 cümleye indirir | 🔴 agresif |
| `stripExplicitAstroLeaks`, `stripUnaskedPaceTheme`, `stripFollowUpReopeners`, `stripMemoryDisclosure`, `stripPersonaSelfIntroduction`, `cleanFollowUpReply` | çeşitli | Cümle/açılış SİLER | 🟡 |
| `stripTarotDomainLeaks`, `replacePaceFixation`, `sanitizeGenderedAddress` | çeşitli | Yerinde İKAME (kesmez) | 🟢 K32-uyumlu örnekler |

K32'ye geçiş yönü (iş yapılırken): kesen sanitizer'lar ya ikameye çevrilir ya eşikleri gevşetilir (%58 → %75+), ya da kökten çözüm — bu ihlaller prompta talimat olarak taşınır ki hiç doğmasınlar.

## C. 🟡 LLM çağrı haritası (çoklu-call doğrulandı)

| Akış | Çağrı/işlem | Not |
|---|---|---|
| Kahve | 3-4 | Görsel sınıflandırma + üretim + (kısaysa) genişletme yeniden-üretimi; görsel doğrulamada ÇİFT iş tespit edildi |
| El/Pati | 2-3 | Sınıflandırma + üretim |
| Tüm kişisel okumalar | +1 | Okumadan SONRA ayrı `analyzeMemoryTranscript` çağrısı |
| Astro kişisel / numeroloji / rüya | 3-4 | Üretim + memory + (koşullu) genişletme/embedding |
| Genel astro | 1-3 | cache→server→Gemini→yerel fallback zinciri (sağlam tasarım ✓) |
| Takip sohbeti | 1-2 | Makul |

En büyük 3 tasarruf fırsatı: (1) kahve görsel sınıflandırma sonucunu tek geçişte önbellekle; (2) memory-analyze'ı ana üretim çağrısına yapılandırılmış çıktıyla göm; (3) kısa-cevap genişletmesini yeniden-üretim yerine ilk çağrıda daha yüksek hedefle çöz. Retry tarafı: yalnız 429'da tek deneme var, exponential backoff yok; streaming hiç kullanılmıyor (K31 chat UI işinde değerlendirilebilir).

## D. 🟡 Kod kalitesi

**God file'lar (en büyükler):** `profileMemoryService.ts` 2905 satır · `astroEngine.ts` ~2000 · `fortuneSpecificityBank.ts` 1569 · `SessionScreen.tsx` 1226 · ekranlardan 5'i 800-1000 satır.

**Kendi kuralının ihlali (iş mantığı ekranda):** `PersonalAstroReadingScreen`, `TarotReadingScreen`, `PersonalNumerologyReadingScreen`, `DreamInterpretationScreen` — hepsi memory append/analiz dizisini ekran içinde çağırıyor; `SessionScreen` içinde API çağrısı + görsel sıkıştırma + token tahmini inline. Tek hamlelik çözüm yönü: ortak `useReadingCompletion()` hook'u (4+ ekrandan ~150-200 satır iş mantığını merkeze alır).

**Sessiz hata yutma:** 8 ekranda `.catch(() => {})` — memory yazımı sessizce başarısız olabiliyor; "hafıza neden tutmadı" tarzı hataların görünmez kalma nedeni muhtemelen bu.

**Durum yönetimi:** Hiç Context kullanılmamış; `DevSettings` (9 parametre) 4-5 seviye prop drilling ile taşınıyor. JSON dosyaları (profil hafızası) + SQLite (memory v2) + ekran state'i arasında "hangisi gerçek kaynak" kuralı yazılı değil.

**Restore kalıntıları (sezginin doğru çıkan kısmı — küçük):** `loreGraphService_0.ts` (1 satır, hiç import edilmiyor) · kök `package.json` BOZUK (binary) ve kök `app.json` alakasız içerik taşıyor (doğruları `mobile/` altında) · `test_output.txt` bozuk · 4 adet 0-byte anahtar txt'si.

**Altyapı boşlukları:** test yok, ESLint yok, prettier yok; `check:turkish:utf8` script'i mobilde referans verdiği dosyayı bulamıyor olabilir (doğrulanmalı).

**İyi taraflar (denetçi notları):** Gerçek duplicate yok; ölü export yok; TypeScript kapsamı iyi ve strict; Türkçe UTF-8 örneklem kontrollerinde temiz; servis/ekran ayrımı (ihlallere rağmen) genel olarak kurulmuş; backend proxy deseni doğru tercih.

---

## E. Önceliklendirilmiş temizlik listesi (yapılMADI — onay bekliyor)

| Sıra | İş | Etki | Emek |
|---|---|---|---|
| 1 | G1-G4: anahtar rotasyonu + `/gemini-api-key` kaldır/kilitle + CORS daralt + `127.0.0.1` | Güvenlik deliği kapanır | Küçük |
| 2 | Kesen sanitizer'ları K32'ye çevir (ikame/eşik gevşetme/prompta taşıma) — önce `trimIncompleteTail` %58 eşiği | "Zart diye kesilme" biter | Küçük-orta |
| 3 | 8 sessiz `.catch(() => {})`'e log/uyarı ekle | Hatalar görünür olur | Çok küçük |
| 4 | `useReadingCompletion()` hook'u — memory yazım dizisi 4+ ekrandan merkeze | Kural uyumu + bakım kolaylığı | Orta |
| 5 | Kök bozuk dosyalar: `package.json`, `app.json`, `test_output.txt`, `loreGraphService_0.ts`, 0-byte txt'ler temizle/onar | Kalıntı hijyeni | Çok küçük |
| 6 | Çağrı tasarrufları (C bölümü 1-3) — kredi ekonomisi öncesi marjı düzeltir | Maliyet ↓ | Orta |
| 7 | `ENABLE_DEVELOPER_DEBUG_UI` build-time kapıya alınsın | Release hijyeni | Küçük |
| 8 | ESLint + react-hooks plugin + minimum test iskeleti | Gelecek hataları erken yakalar | Orta |
| 9 | `profileMemoryService` (2905 satır) katmanlara bölme — Konak Çekirdeği (K6) ayrıştırmasıyla AYNI iş; o faza birleştirilmeli | Mimari sağlık | Büyük |
| 10 | DevSettings → Context | Prop drilling biter | Küçük-orta |

Not: 9 numara, K6'daki "Memory V2'yi app-bağımsız pakete ayrıştır" işiyle birleştirilirse iki kuş bir taş — god file zaten paket sınırı çizilirken bölünecek.

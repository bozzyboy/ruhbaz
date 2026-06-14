# FAZ 5.4 — DIVINATION UI + APP-GENELİ followup/scroll/hitap KALANLARI (2026-06-15)

> Ozan cihazda 5.4 (I-Ching/Rün) denedi; çekirdek iş bitti (snapshot: `handoffs/faz5-4-rework-bitti_safety-core_2026-06-14.md`, commit zinciri `fb76270`..`3e5fa46`). Bu dosya KALAN UI/UX maddeleri (çoğu APP-GENELİ). **Yalnız JS/TS — APK gerekmez, `npx expo start -c` + reload yeter.** Disiplin: her mantıksal adım ayrı commit + bekçiler (tsc/utf8/image-contract/check:moderation/check:safety:core) + paylaşılan servis değişiminde regresyon ön-testi + EN=TR paritesi ([[en-tr-parite-kurali]]) + adım/batch sonu adversarial öz-review. Ultracode kapalı (gerekirse aç).

## BAĞLAM: 5.4 şu an ne durumda (bu oturumda yapıldı)
- Divination kişiselleştirme (opsiyonel konu→güçlü userStated, 2 anlamsal micro event tekrar-yok, sentez prompt, min 3-4 paragraf), güvenlik çekirdeği tüm okumalara (`getReadingSafetyCore`) + bekçi, common.md temizlik.
- D1-D4: cast SVG görseli (`DivinationCastView`), açılış davet metni + kişisel karşılama ("Hoş geldin, {name}. Seni görmek ne güzel."), placeholder "Konu / soru girişi", rün orijinal/TR isim, Teoman "kuyunu kazıyor" kapanışı yumuşatıldı + el-okuma drift direktifi, kapanışlardan cinsiyet/yaş hitabı temizleme (`stripClosingAddress`, tüm okumalar).
- İlgili dosyalar: `services/personalDivinationService.ts`, `components/DivinationCastView.tsx`, `screens/PersonalDivinationReadingScreen.tsx`, `services/readingSpecificityBank.ts`, `services/personaClosingService.ts`, `services/readingCommonPrompt.ts`, `scripts/check-safety-core.js`.

---

## ITEM 1 — Sosyal followup kısa-yanıt (APP-GENELİ; Ozan: çalışmıyor)
**Sorun:** Kullanıcı "teşekkür ederim" yazınca I-Ching koskoca yorum üretti; kısa "rica ederim" demeli.
**Kök neden:** `services/followUpResponseService.ts:28` `getSimpleFollowUpReply` regex'i ÇOK DAR:
`^(teşekkür|tesekkur|sağ ol|sag ol|tamam|ok|peki|anladım|anladim)[.! ]*$` → tüm mesaj tek kelime+noktalama olmalı. **"teşekkür ederim" EŞLEŞMİYOR** (sonda "ederim" var). Yanıt da yalnız TR.
**Kapsam (kim çağırıyor):** `personalDivinationService` ✓, `dreamInterpretationService` ✓, `readingApiService` (kahve/el/genel) ✓. **YOK: `personalTarotService`, `astroEngine` (kişisel astro followup ~1880, ilişki followup ~2048), `personalNumerologyEngine` (followup ~1089 bölgesi).**
**Yap:**
1. `getSimpleFollowUpReply`'ı genişlet: "teşekkür(ler)", "teşekkür ederim", "çok teşekkürler", "sağ ol(asın)", "sağolasın", "eyvallah", "minnettarım", "ellerine sağlık", + EN "thanks", "thank you", "thank you so much", "thx", "ty", "ok thanks", "appreciate it" vb. (baş/son toleranslı; tek başına sosyal mesajları yakala ama gerçek soruları ASLA yakalama — yanlış-pozitif pahalı). Sınır: gerçek soru içeren mesaj ("teşekkürler peki ya işim?") yakalanmamalı → yalnız mesaj büyük oranda sosyal-kapanışsa.
2. Yanıtı **dil-duyarlı** yap (`getAppLanguage()` TR/EN). EN: "You are welcome — we can stay here; if you want to open another part, tell me and I will continue."
3. Çağrı eksik olan followup servislerine ekle: tarot, astro (kişisel + ilişki followup), numeroloji. (Kalıp: `const simple = getSimpleFollowUpReply(question); if (simple) return { text: simple, closingSentence:'', modelName:'local-follow-up-reply', usage:{...0} };` — divination followup'taki kalıbı kopyala.)
**Regresyon:** followUpResponseService paylaşılan; mevcut eşleşmeler bozulmasın (battery yok ama elle birkaç örnek test et: "teşekkürler" → kısa; "peki ya aşk hayatım?" → kısa DEĞİL).

## ITEM 2a — Persona kendi adına hitabı anlamıyor (APP-GENELİ)
**Sorun:** Kullanıcı okuma öncesi "Teoman Baba, ..." diye yazdı; LLM "Teoman baba"yı kullanıcının BABASI sandı, "babandan haber" dedi, sonraki paragraflarda tekrar değindi. Tüm personalarda olabilir (persona adını gizliyor ama kendi adını bilmiyor → 3. kişi sanıyor).
**Yap:** Tüm reading sistem prompt'larına persona public label'ını ver + direktif:
`"- Kullanıcı sana '{publicLabel}' (ör. Teoman) diye hitap edebilir; bu hitap DOĞRUDAN SANA yöneliktir, üçüncü bir kişi, akraba ya da 'baban/annen' değildir. Yine de kendini tanıtma, adınla başlama; bu adı bir kişi gibi yorumlama."`
- Label kaynağı: `config/constants.ts` → `getAssistantLabel(assistantId)` (veya `getReadingPersonaData()[id].displayName`).
- Enjeksiyon noktaları (getReadingSafetyCore enjekte ettiğin yerlerle aynı): `personalDivinationService.buildBaseSystem`, `personalTarotService.buildBaseSystem`, `dreamInterpretationService.buildBaseSystem`, `readingPromptBuilder` (runtimeRules), `astroEngine` (7 systemText), `personalNumerologyEngine` (2), `generalAstroApiService`.
- Not: persona Voice Matrix isimleri (Teoman/Suzan...) `getReadingPersonaData` displayName ile eşleşir; "Teoman Baba" gibi varyantları da kapsaması için label + "ve ona eklenen baba/abi/teyze gibi saygı ekleri" ifadesini de yedir.

## ITEM 2b — Cast SVG konumu (divination; rün dahil)
**Sorun:** `DivinationCastView` (hexagram/rün SVG) kullanıcının sorusunun ÜSTÜNDE render oluyor. Olması gereken: kullanıcı sorusunun ALTINDA, LLM okumasının ÜSTÜNDE. Sıra: [kullanıcı konu balonu] → [cast SVG] → [okuma].
**Yer:** `screens/PersonalDivinationReadingScreen.tsx` — şu an `{hasInterpretation && cast ? <DivinationCastView/> : null}` messages.map'ten ÖNCE. Bunu mesaj akışına AL: kullanıcı-konu balonundan sonra, ilk okuma balonundan önce render et. (Opening invite balonu zaten okuma sonrası gizleniyor — OPENING_MESSAGE_ID filtresi.) Pratik: messages dizisini map'lerken ilk assistant-okuma mesajından hemen önce cast'i yerleştir; ya da cast'i kullanıcı-konu balonunun hemen ardına bir non-message blok olarak ekle.

## ITEM 2c — Okuma gelince en BAŞA otomatik scroll (APP-GENELİ)
**Sorun:** Okuma gelince scrollToEnd → en alta gidiyor; kullanıcı kendi sorusunu + hexagramı görmek için yukarı kaydırmak zorunda; hexagram (zenginlik katıyor) görünmüyor bile.
**Yap:** Okuma üretilince okumanın/cast'in BAŞINA scroll et (ilk okuma için ~en üst; kullanıcı önce cast + okuma başını görsün). Followup'larda da yeni cevabın başına. **scrollToEnd'i okuma-geldi anında kaldır.**
**7 ekran:** `PersonalDivinationReadingScreen`, `SessionScreen` (kahve/el), `PersonalNumerologyReadingScreen`, `BirthChartInterpretationScreen`, `TarotReadingScreen`, `PersonalAstroReadingScreen`, `DreamInterpretationScreen` — hepsinde `scrollToEnd` var. Mekanizma: ölçülen okuma-balonu Y offset'ine `scrollTo({y, animated})` ya da ilk okumada `scrollTo({y:0})`. Her ekranın layout'u farklı; tek tek bak. (Yazma/gönderme anındaki scroll davranışını değil, OKUMA GELDİ anındaki davranışı değiştir.)

## ITEM 2d — Followup chat balonu arka planı (APP-GENELİ)
**Yap:** Tüm okuma ekranlarında kullanıcı followup balonu, divination'daki gibi olsun. Referans stil: `PersonalDivinationReadingScreen` styles → `userBubble` (border `rgba(125,220,154,0.28)`, bg `rgba(125,220,154,0.08)`), `chatBubble`, `chatRole`, `chatText`. Diğer 6 ekranın kullanıcı balon stilini buna eşitle (ortak bir bileşen/stil çıkarmak iyi olur — şu an her ekran kendi stilini taşıyor).

## ITEM 2e — "edit / yeniden gönder" kaldır (APP-GENELİ)
**Sorun:** Bazı okumalarda kullanıcı balonu altında "Sorunu Düzenle / Yeniden Gönder" var; gereksiz.
**Yer:** 7 ekranda `resend`/`messageActionPrompt`/`editQuestionTitle` i18n geçiyor. Kullanıcı-balonu altındaki edit/resend aksiyon UI'sını kaldır. (i18n anahtarları kalabilir; sadece UI render kaldırılır. Hangi ekranlarda gerçekten render var, kontrol et — bazıları sadece editor modal başlığı için kullanıyor olabilir, onu silme; "mesaj balonu altı aksiyon satırı"nı sil.)

## ITEM 3 — Rün
Yukarıdakilerin tümü rün için de geçerli. Rün divination screen/service'i paylaştığından 2b/2c/2d/2e divination ekranında çözülünce rün otomatik kapsanır; 1 ve 2a servis/prompt seviyesinde zaten paylaşılan. Ekstra: rün taşı render'ı (`DivinationCastView` rune dalı) 2b/2c'den etkilenir — kontrol et.

---

## ÖNERİLEN SIRA
1. ITEM 1 (followUpResponseService genişlet + dil-duyarlı + tarot/astro/numeroloji'ye ekle) — izole, düşük risk, net bug.
2. ITEM 2a (self-name direktifi tüm prompt'lara) — getReadingSafetyCore enjeksiyonuyla aynı noktalar.
3. ITEM 2b (divination cast SVG konumu) — tek ekran.
4. ITEM 2d + 2e (balon stili + edit/resend kaldır) — ortak bileşen çıkarmayı düşün.
5. ITEM 2c (scroll-to-start) — en dağınık olan; 7 ekran ayrı ayrı, dikkatli.
Her biri ayrı commit + öz-review. EN paritesi (özellikle ITEM 1 yanıt metni).

## REGRESYON-ÖNLEME
- followUpResponseService / personaClosingService / readingSpecificityBank PAYLAŞILAN — mevcut davranışı bozma, ekle.
- 2c/2d/2e 7 ekranı etkiliyor → her ekranı tek tek test et; cihaz testine regresyon notu (tüm okuma türleri açılış + followup + scroll + balon).
- Statik bekçiler her değişiklikte; `check:safety:core` (prompt değişiklikleri 2a) yeşil kalmalı.

## CİHAZ TESTİ
`23_FAZ5_CIHAZ_TESTLERI_2026-06-14.md`'ye bu maddeler için yeni test bölümü ekle (her okuma türü: sosyal-followup kısa yanıt, self-name, scroll-to-start, balon stili, edit/resend yok, cast SVG konumu).

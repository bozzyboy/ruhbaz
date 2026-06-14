# FAZ 5.4 REWORK + GÜVENLİK ÇEKİRDEĞİ — BİTTİ (2026-06-14)

> Bu oturumda iki iş özerk olarak tamamlandı: **PIECE 1** = I-Ching/Rün kişisel okumanın "doyuruculuk/kişiye özellik" rework'ü; **PIECE 2** = common.md'nin canlı tek-kaynak güvenlik çekirdeğine çevrilmesi + tüm okumalara enjekte + bekçi. Önceki plan: `handoffs/faz5-4-iching-rune-rework_2026-06-14.md`. Güncel kapı: `00_HANDOFF.md`. **Yalnız JS/TS — APK gerekmez; `r` ile reload yeter.**

## ⭐ DURUM: İKİSİ DE KOD-TAM, BEKÇİLER YEŞİL, ÖZ-REVIEW TEMİZ. Cihaz testi Ozan'ı bekliyor.

## PIECE 1 — Divination doyuruculuk (Ozan: "taş anlamlarını alt alta diziyor")
- **A1** (`fb76270`): I-Ching/Rün başına **opsiyonel konu** girişi; girilirse `appendUserReadingIntentMemory` ile **güçlü userStated** ('okuma öncesi konu', astro/tarot yolu). Boş bırakılırsa genel okuma. Takip = `appendUserConversationMemory`.
- **A2** (`399b14d`): `readingSpecificityBank.ts` -> yeni export `selectDivinationLifeEvents` (count=2, **anlamsal**: konu+userStated/okuma temalarına yakınlık skoru; grup-çeşitli; tekrar-önlemeli) + `buildDivinationSpecificityContext` (sembol/taş çerçeveli "Somut Hayat Malzemesi"). Mevcut `selectEvents`/`buildSpecificityContext` DOKUNULMADI.
- **A3** (`13f3910`): `personalDivinationService` ilk okumaya 2 micro event enjekte + `specificityUsage` döner; ekran `appendReadingSpecificityUsage` ile kaydeder (tekrar-önleme çalışır).
- **A4** (`b35636e`): `buildBaseSystem`'e kişiye-özel **sentez** direktifleri (mizaç/son konu/ilişki/okuma geçmişi dokusu; tek tek listeleme yasak; kaynak adlandırma + astro/numeroloji araç yasağı korunur). Initial+followup ortak.
- **Öz-review fix** (`a1eb878`, `9707c56`): (1) snippet niyet YAZILDIKTAN sonra yüklenir (tarot paritesi — yeni konu bu okumanın hafıza bağlamına da girer); (2) cast imzası specificity seed'ine katıldı; (3) moderasyon erken-dönüş shape simetrisi; (4) `usedLifeEvents` retention 120->240 (divination 30+ okuma tekrar-yok + cross-modality headroom).
- **Doğum haritası/numeroloji/history** ZATEN `formatPromptMemoryPack` (SELF_KNOWLEDGE/USER_SIGNALS/AVOID_REPEAT) ile geliyordu (divination surface-reading olmadığı için filtrelenmiyor) -> A4 saf direktif.

## PIECE 2 — common.md canlı tek-kaynak güvenlik çekirdeği
- **B1** (`dd34184`): `readingCommonPrompt.ts` -> `getReadingSafetyCore()` = common.md "Safety And Boundaries" bölümü (dil-duyarlı; EN'de item 24 İngilizce-dili dahil; `extractSection` heading dahil çeker, Address Policy'ye sızmaz). common.md/en: Vision Protocol kaldırıldı (Ozan elle) + Implementation Notes madde 3-4 güncellendi (artık doğru). `readingPersonaData.ts/.en.ts` yeniden üretildi (eski Vision metni temizlendi).
- **B2/B3** (`2b67220` + review-fix `3f2c57c`): `getReadingSafetyCore()` **TÜM okumalara** enjekte: divination, tarot, rüya, kahve/el (readingPromptBuilder), **astro (7 systemText: ilişki ilk + birth-chart ana/devam/takip + kişisel astro ilk + kişisel astro takip + ilişki takip)**, numeroloji (2), genel astro (İkram Masası). İlk + takip kapsanır. Eksik çıktı rail'leri (fal/kehanet kelime yasağı, din/siyaset/cinsel/ayrımcılık/kriz/kumar/büyü/3.kişi/insan-iddiası) artık her okumada açık.
- **B4** (`e3fb027` + güçlendirme `3f2c57c`): `scripts/check-safety-core.js` bekçisi — REQUIRED 7 dosya + **builder-başına sayım** (`system_instruction sayısı <= getReadingSafetyCore + buildBaseSystem`; boolean-includes yetmiyordu) + heuristik (system_instruction kuran listede-olmayan dosya = yeni okuma uyarısı). `post-edit-check.js` hook'una eklendi -> **her .ts/.tsx düzenlemesinde otomatik koşar**. `package.json` `check:safety:core`. **Negatif+pozitif test edildi.**

## ⚠️ ÖZ-REVIEW NOTU (önemli)
PIECE 2 adversarial öz-review **3 paralel ajanla** koştu ve **HIGH bir açık yakaladı**: astroEngine'de 7 systemText var, ilk geçişte yalnız 4'ü core almıştı -> **kişisel astro okuma ailesi (3 prompt) güvenlik çekirdeksizdi**; eski bekçi (boolean-includes) bunu kaçırıyordu. İkisi de düzeltildi (`3f2c57c`): 3 prompt + bekçi builder-başına sayım. Ders: çoklu-builder dosyalarda dosya-başına boolean kontrol yetmez.

## BEKÇİLER (hepsi yeşil)
`tsc --noEmit` · `check:turkish:utf8` · `check:image:contract` · `check:moderation` (43/43) · `check:safety:core`.

## EN/TR PARİTE (Ozan kuralı)
EN her zaman TR ile aynı: `getReadingSafetyCore` dil-duyarlı; common.en.md eşzamanlı düzeltildi; divination UI metni (en.ts) ve prompt davranışı (TR direktif + `enOutputLanguageSystemDirective` -> EN çıktı) paralel. Bkz. memory [[en-tr-parite-kurali]].

## ERTELENEN / BİLİNEN BORÇ
- **Dedupe:** safety-core eklendi ama servislerdeki inline güvenlik satırları SİLİNMEDİ (alt-küme, pekiştirir, çelişmez). Temiz dedupe ayrı, dikkatli bir tur (çalışan okumalara dokunur -> cihaz testiyle).
- **Ölü kod:** `getCommonReadingGuardrailBody`/`commonReadingPromptForDomain`/`COMMON_READING_GUARDRAIL_BODY` dışarıdan çağrılmıyor AMA `check-image-contract.js` readingCommonPrompt'taki dekor-yasağı string'ine bağlı (vision-protocol fonksiyonları orada) -> sökmek bekçiyi/tsc'yi kırar; bırakıldı.
- **Varyant (Rün/I-Ching çoklu açılım):** Ozan kararı "önce kişiselleştir, sonra karar". Cihazda denenip karar verilecek.
- **Token maliyeti:** kısa okumalara (günlük burç ~150 kelime) ~1.2k token safety core ekleniyor (input tarafı; çıktı capleri etkilenmiyor) — kabul (pekiştirme tasarımı).

## CİHAZ TESTİ
`23_FAZ5_CIHAZ_TESTLERI_2026-06-14.md`: 5.4-C (rework, madde 49-55) + Güvenlik Çekirdeği bölümü (madde 56-58) eklendi. Yalnız JS/TS -> `r` reload yeter.

## COMMIT ZİNCİRİ
PIECE 1: `fb76270` `399b14d` `13f3910` `b35636e` `a1eb878` `9707c56`
23_ (5.4-C): `59d2e05`
PIECE 2: `dd34184` `2b67220` `e3fb027` `3f2c57c`
+ bu snapshot/00/23_-PIECE2 doküman commit'i.

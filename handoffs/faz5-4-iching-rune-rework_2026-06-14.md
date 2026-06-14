# FAZ 5.4 REWORK — I-Ching + Rün'ü GERÇEK kişiye özel okumaya çevir (2026-06-14)

> **Durum:** 5.4 (I-Ching + Rün konuşmalı) KURULDU ve öz-review'den geçti (commit `0ef8524`/`4762123`/`c7b9bb3`), AMA Ozan cihazda denedi ve **yeterince kişiye özel bulmadı**: "taşların anlamlarını alt alta diziyor; genel okumadaki rün'e 2 taş eklenip servis edilmiş gibi; oysa kullanıcıyı tanıyoruz (doğum haritası, numeroloji, son fal konuları/soruları/followup'ları, okuma-kaynaklı taksonomi, history)." Bu handoff o REWORK için. Önceki snapshot: `handoffs/faz5-ilerleme_2026-06-14.md`. Güncel kapı: `00_HANDOFF.md`.
>
> **Bu oturumda KOD YAZILMADI** (Ozan: "sadece handoff hazırla, yeni session açacağım"). Aşağıdaki rework yeni oturumda yapılacak.

## ⭐ OZAN'IN İSTEKLERİ (rework gereksinimleri)

1. **Başa opsiyonel konu/soru girişi** (hem Rün hem I-Ching). Zorunlu DEĞİL. Ama girilirse:
   - Tıpkı diğer okumalarda olduğu gibi **hafızaya `userStated` olarak** yazılsın (sadece conversation-memory değil — astro/tarot focusQuestion'un userStated'e gittiği yol).
   - Hem **okumaya** hem **sonraki takip yorumlarına** yansısın.
2. **Doyurucu, kişiye özel YORUM** (alt alta listeleme DEĞİL). Diğer okuma türleri gibi sentezlenmiş bir okuma olsun:
   - Rün → taşların mesajları etrafında; I-Ching → hexagram durumu + değişen çizgiler/geçişler + olası tavsiye etrafında toplansın.
   - AMA kullanıcı bilgisini kullansın: **doğum haritası, numeroloji, son okuma konuları/soruları/followup'ları, okuma-kaynaklı taksonomi, history (hangi tip okumalar, kime baktırmış)** — yani `memorySnippet`'i zengin biçimde.
3. **Her okumada havuzdan 2 micro life event** seç (hem Rün hem I-Ching):
   - **Tekrar etmesin** — örn. **~30 okuma boyunca** aynı event gelmesin.
   - **Anlamsal seçim:** kullanıcı okuma öncesi konu/soru girdiyse **o konuya** ve **son dönem userStated girişlerine** yakın konulardan seçilsin.
4. **AÇIK SORU (Ozan sordu, karar bekliyor):** "başka rün okuma tipi yok mu kişiye özel tarot okumaları gibi?" → Rün/I-Ching için tarot açılımları gibi **birden çok varyant** (ör. Rün: 1-taş / 3-taş / 5-taş; I-Ching: değişen-çizgili/çizgisiz) olmalı mı? Şimdilik tek varyant var (Rün 3-taş, I-Ching tam). **Bunu Ozan'a sor / kararını bekle; gerekiyorsa varyant seçim ekranı (tarot spread-select kalıbı) eklenir.**

## 🧩 MEVCUT 5.4 KODU (rework'ün dokunacağı yer)

- **`services/personalDivinationService.ts`** — `castDivination` (seeded cast), `createPersonalDivinationReading` / `createPersonalDivinationFollowUp` (Gemini + persona + `memorySnippet` + moderasyon + 677 + kapanış). `buildBaseSystem` kind-özel direktifler. **Şu an `memorySnippet` veriliyor ama micro-life-event SEÇİMİ/ENJEKSİYONU YOK** — eklenecek ana yer burası.
- **`screens/PersonalDivinationReadingScreen.tsx`** — açılışta cast gösterilir; ilk kullanıcı mesajı = soru → `createPersonalDivinationReading(question)`. `appendUserConversationMemory(profileId, text)` çağrılıyor. **DOĞRULA:** bu userStated topic yoluna mı gidiyor yoksa sadece conversation-memory mi? Astro/tarot focusQuestion'un userStated'e yazıldığı yolu örnek al (gerekirse aynı çağrıyı ekle).
- **`services/personaClosingService.ts`** — `PersonalReadingDomain` + `DOMAIN_FORBIDDEN_TERMS`'e `iching`/`rune` zaten eklendi (dokunma).
- Wiring: `App.tsx` route, `PersonalAssistantSelect` (default Teoman/Arın), `PersonalReadings` flowTypes, `ReadingSummary` (personal-iching/personal-rune) — hazır.

## 🛠️ MICRO LIFE EVENT MEKANİZMASI (yeniden kullan + GENİŞLET)

Dosya: **`services/readingSpecificityBank.ts`** (zaten var, kahve/numeroloji kullanıyor):
- **Havuz:** `LIFE_EVENT_BANK` (insan, `LIFE_EVENT_GROUPS`'tan ~50/grup) + `ANIMAL_LIFE_EVENT_BANK` (evcil hayvan, `ANIMAL_LIFE_EVENT_GROUPS`). Öğe: `{ group, label }`.
- **Seçim:** `selectEvents(seedText, recent, allowHealthEvents)` / `selectAnimalEvents(...)` — `shuffleSeeded` + `recent` içermeyenleri filtreler + grup-çeşitliliği + `PICKS_PER_READING` (4). **Divination için count=2 lazım** → `selectNumerologyLifeEvents`'in `count` param kalıbını izle.
- **Tekrar-önleme:** `recentText(memorySnippet, messages)` — `memorySnippet.usedLifeEvents` (+ readingTopics, relevantObservations...) label'larını birleştirir; seçim bunları ELER. **`appendReadingSpecificityUsage(profileId, usage)`** (profileMemoryService) seçilen event'leri `usedLifeEvents`'e yazar → bir sonraki `recent`'e girer → tekrar gelmez.
  - ⚠️ **30-okuma penceresi:** `usedLifeEvents` retention sınırını DOĞRULA (profileMemoryService'te appendReadingSpecificityUsage). 30 okuma × 2 event = ~60 event saklanmalı ki 30 okuma boyunca tekrar olmasın. Gerekirse retention'ı artır.
- **Anlamsal seçim (YENİ — eklenecek):** Mevcut `selectEvents` seed-deterministik + tekrar-önleme yapar ama **konuya anlamsal yakınlık YAPMAZ**. `selectNumerologyLifeEvents` number→grup eşlemesiyle kaba bir anlamsallık yapıyor (model al). Divination için: havuz event'lerini **(a) kullanıcının girdiği konu/soru + (b) `memorySnippet.userStatedTopics`/`userTopicGroups`/son userStated** ile anlamsal yakınlığa göre SIRALA/FİLTRELE, sonra top-2'yi grup-çeşitlilikli + tekrar-önlemeli seç. (Basit yol: konu/userStated kelimelerinin event label/group ile örtüşme skoru; ya da grup eşlemesi. Embedding şart değil.)
- **Önerilen yeni export:** `selectDivinationLifeEvents({ seed, count: 2, memorySnippet, focusQuestion, messages })` → `SpecificityItem[]`. Servis bunu çağırıp prompt'a "Somut Hayat Malzemesi" bloğu gibi enjekte etsin (`buildSpecificityContext`'in metin bloğu kalıbına bak: olayları "kesin değil, sembolik/olasılık dili" ile yedir, liste yapma) ve dönen event'leri `appendReadingSpecificityUsage` ile kaydetsin (tarot bunu yapmıyor; divination YAPSIN ki tekrar-önleme çalışsın).

## 📋 REWORK ADIMLARI (öneri sıra)

1. **Konu girişi userStated:** PersonalDivinationReadingScreen'de ilk mesaj (topic/soru) astro/tarot ile AYNI userStated yola yazılsın (doğrula + gerekirse düzelt). Boş bırakılabilsin (genel okuma).
2. **Micro-event seçimi:** `readingSpecificityBank`'e `selectDivinationLifeEvents` (count=2, anlamsal + tekrar-önlemeli) ekle. `personalDivinationService`'te initial reading'e enjekte et + `appendReadingSpecificityUsage` ile kaydet.
3. **Zengin prompt:** `buildBaseSystem`/userText'e memorySnippet'in doğum-haritası/numeroloji/okuma-taksonomisi/history sinyallerini daha güçlü weave et + "alt alta listeleme; sentezle; kişiye özel" direktifi güçlendir. (Diğer okumaların memoryContext + buildSpecificityContext kalıbını örnek al.)
4. **Açık soru (varyant):** Ozan'a sor — gerekiyorsa Rün/I-Ching varyant seçimi (spread-select kalıbı).
5. Bekçiler (tsc/utf8/image-contract) + öz-review + `23_FAZ5` 5.4 bölümünü güncelle + handoff/00.

## ⚠️ DİSİPLİN (taşınan kurallar)
- Her mantıksal adım ayrı commit + bekçiler + dilim/batch sonu **adversarial öz-review** (ultracode açık → workflow/paralel ajan).
- **Regresyon-önleme:** `readingSpecificityBank` paylaşılan (kahve/numeroloji kullanıyor) — `selectDivinationLifeEvents` EKLE, mevcut `selectEvents`/`buildSpecificityContext`'i BOZMA. `personaClosingService`/`profileMemoryService` paylaşılan.
- **Kriz:** tek tek test etme; `npm run check:moderation` (battery 43/43) + final overall (Ozan+Claude).
- **Ozan blokları:** 5.5 Aura (UI sonraya), 5.6 bildirim (kapalı, taksonomi `24_` böyle, native APK) — ERTELENDİ, dokunma. Feed yayını/içerik, IAP, avukat, store = Ozan.
- **Bekçi tuzağı:** kod yorumunda/string'de ASCII apostrof utf8 bekçisi tırnak paritesini bozar; commit mesajında apostrof/`||`/boşluklu-`/` PowerShell here-string'i bozar → sade ASCII. Bkz. memory [[ps-commit-heredoc-apostrof]].
- 5.4 = B (konuşmalı) Ozan kararıdır; statik'e dönme.

## 📌 GÜNCEL DURUM (oturum sonu)
✅ Faz 4.5 cihaz-testi-1 (3 bug + öz-review + CSAM açığı fix `89df4de` + moderation-battery). ✅ Rüya default Ayşe. ✅ Faz 5: 5.1 favoriler + 5.2 Konak Akışı feed + 5.3 bekleme sahnesi + 5.4 I-Ching/Rün konuşmalı (hepsi öz-review temiz). ⏸️ 5.5/5.6 Ozan ertelendi. 🔶 Cihazda 5.4 denendi → bu rework çıktı. Test dok: `22_`, `23_`. Karar/tasarım dok: `24_` (bildirim taksonomi), `25_` (I-Ching/Rün plan). Commit zinciri `950dd42`..`7c360af`. Yalnız JS/TS (APK gerekmez).

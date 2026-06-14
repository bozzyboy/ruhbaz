# FAZ 4.5 CİHAZ TESTİ-1 SONUÇLARI + KALAN İŞLER (2026-06-14)

> Ozan, `21_FAZ4-5_CIHAZ_TESTLERI_2026-06-13.md` turunu indi; bulguları yazdı. Bu oturumda **net düzeltmeler yapıldı**, **teşhis-gerektiren UX bug'ları + tat onayları sonraki oturuma** bırakıldı (context doldu). Güncel durum: `00_HANDOFF.md`.

## ✅ BU OTURUMDA YAPILDI (commit'li, bekçiler geçti)
- **🔴 Kriz tespiti köklü genişletildi (en kritik).** Cihaz testinde tarot/kahve konu+soru+followup'ta bare "intihar" vb. KAÇIYORDU (regex çok dardı → model krizi uzun uzun yorumluyordu; #3/#4/#6 "stabil değil"in kök nedeni). `inputModerationService`: `CRISIS_RE_EN` genişledi; yeni `CRISIS_BROAD_RE` (TR bare "intihar" + canıma kıy/kendimi as/ölmek istiyor/hayatıma son ver/keşke ölsem...) **yalnız rüya-DIŞI bağlamda** (question/chat) uygulanır → rüya kâbus anlatımı korunur. `isCrisisText(normalized, context)` helper. **Battery testi: 25 kriz yakalandı + 17 temiz, 0 hata.**
- Yasal TR: "112 Acil Çağrı Merkezi" → "yerel acil servisler".
- Genel astro sonuna deterministik cross-sell footer (isim + güneş burcu, "Salon→Astroloji" daveti, TR+EN, non-animal, idempotent, tüm cache yolları).
- Kahve "kendi yerime" (ai-brew, görselsiz): uzunluk-genişletme gate'i kaldırıldı (artık uploaded kadar uzun) + persona fincan/tabak şekillerini canlandırarak rol yapar.
- Yanlış-görsel uyarısının okuma gövdesine sızması kaldırıldı (`useSession.buildSeedMessage` retryNotice).
- Görsel-red HATA mesajları (palm/coffee) dil-duyarlı (EN'de yarı-Türkçe sorunu çözüldü).
- Magic Sphere + Fortune Cookie alt-3-kelime büyük-harf locale (I/İ düzeldi; textTransform→locale-aware JS uppercase).
- Coffee/palm setup ekranından persona tagline ("analitik ama sıcak…") kaldırıldı.
- Kendini Tanı numeroloji core akışında gereksiz tek-mod pressable kaldırıldı.
- EN: "Dream Reading" → "Dream Interpretation".

## ⏳ SONRAKİ OTURUM — KALAN İŞLER (teşhis gerektiren UX, sonra Ozan re-test)
1. **🔶 ProfileSettings yavaşladı** (giriş + buton basma). Muhtemel kök: E1'le ülke dropdown'u artık **199 öğe** (BrandedPicker tüm öğeleri eager render ediyorsa ağır). Teşhis: `components/BrandedPicker.tsx` render modeli; çözüm seçenekleri: sanal liste / arama kutusu / modal'da lazy. (E1 öncesi 9 ülkeydi.)
2. **🔶 Rüya persona display bug (#5):** reader-seç'te Suzan default görünüyor ama okumaya geçince sağ-üstte **Ayşe** yazıyor; okumayı Suzan yapıyor gibi. Teşhis: `DreamInterpretationScreen` — hangi assistantId header'a, hangisi okumaya gidiyor (prop/route uyumsuzluğu). Default dream reader tutarsızlığı.
3. **🟡 "Okumanız hazırlanıyor" yazısı geç render** → donmuş algısı. Loading state'i okuma başlar başlamaz göster (AssistantLoading mount timing).
4. **🟡 Okuma uzunlukları/konu uyumu toplu review** (Ozan "her şey bitince yeniden bakalım" dedi) — tüm okuma türleri için uzunluk + konuya sadakat.
5. **Tat onayları (Ozan):** EN persona sesleri beğeni turu · C5 reader tagline/specialty + C6 kart etiketleri EN metinleri (TASLAK). · B2 telaş "şimdilik kayboldu; tekrar gelirse bakarız" (izle, aksiyon yok).
6. **Cihaz re-test:** Ozan **her okuma tipini TR+EN, 2'şer kez** kriz girdisiyle test etsin (kriz genişletildi ama cihazda teyit; A-2). Dream INITIAL bilinçli dar (kâbus-güvenli) — yalnız açık niyet ("intihar etmek istiyorum") yakalanır; dream FOLLOWUP question-context → geniş.
7. Daha önceden park: D-3 EN onay (doğrulama tamam, cihazda teyit) · B-section kalite (kullandıkça).

## SONRAKİ CLAUDE İLK İŞ
`00_HANDOFF.md` + bu dosya → **1-3 teşhis bug'larını** bir workflow/paralel ajanla çöz (perf, dream persona, loading) → Ozan kısa re-test. Faz 5 (Konak Akışı) bunlar + tat onayları sonrası.

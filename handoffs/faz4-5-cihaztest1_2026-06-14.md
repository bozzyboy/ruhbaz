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

## ✅ EK DÜZELTMELER (Ozan'ın 8-madde incelemesinden, bu oturumda yapıldı)
- **Kahve ai-brew rol-yapma:** "kullanıcı içmiş / içerken aklından geçenler" varsayımı yasaklandı; persona kahveyi kullanıcının NİYETİNE/yerine içer, yorum fincan/tabaktaki ŞEKİLLER üzerinden kurulur (kullanıcının içme deneyimi değil). "Ben senin yerine içtim" demek serbest.
- **Genel astro footer ifadesi:** "Ay'ın" → "ay burcunu", "yükselen burcun" → "yükselen burcunu" (TR+EN düzeltildi).

## 🔴 KRİZ TESTİ — ERTELENDİ (SAĞLAM NOT)
Ozan: "krizlere en son OVERALL testlerde bakacağım, artık tek tek hepsine bakamam; **ikimiz de (Ozan + Claude) en sonda tekrar bakacağız.**" → Kriz girdisini her okuma tipinde tek tek TEST ETME; cihaz test dokümanlarına "kriz toplu-test (en son, Ozan+Claude birlikte)" maddesi koy ama tek tek koşturma. Kriz tespiti kod tarafında battery ile genişletildi/doğrulandı (bu oturum); kalan = final overall doğrulama.

## ⛔ ÖZERK MANDAT (Ozan, 2026-06-14 — uyumaya gitti)
Ozan: "bana sormadan BÜTÜN FAZLARI tek tek ilerle, özerk. Cihaz testi dosyalarını yine bana hazırla (önceki oturumlardaki gibi)." → Sonraki Claude:
1. Bu handoff'taki **kalan 3 teşhis-UX bug'ını** (ProfileSettings perf, rüya persona display, loading geç-render) çöz → Faz 4.5 cihaz-testi-1 turu kapanır.
2. Sonra **Faz 5 → Faz 6 → ...** yol haritası sırasıyla (`05_YOL_HARITASI.md`; Faz 5 brifingi `handoffs/faz4-bitti_ingilizce-i18n_2026-06-11.md` §4) **ONAY BEKLEMEDEN** ilerle.
3. **Her faz/round için ayrı cihaz test dokümanı** hazırla (kural: `NN_FAZ<N>_CIHAZ_TESTLERI_<tarih>.md`, kurulum kutusu + step-by-step + regresyon + değişen-dosya→test eşlemesi). Cihaz-testi-1 düzeltmeleri için → `22_FAZ4-5_CIHAZ_TESTLERI_2_<tarih>.md`.
4. Disiplin: her mantıksal adım ayrı commit + tsc/utf8/image-contract bekçileri + **her batch/faz sonunda bağımsız adversarial öz-review ajanı** + regresyon-önleme prensibi (00:63). Ultracode AÇIK → hacimli/paralel iş için workflow/paralel ajan kullan.
5. **Ozan-bloklu işlere GİRME** (avukat, yasal final onayı, Play Console, IAP ürün/fiyat, store metni final, marka/logo onayı, analitik araç seçimi) — taslak hazırla, "blok: Ozan" işaretle, geç.
6. Tat onayları (EN persona sesleri, C5/C6 EN tagline/etiket, B2 telaş) → cihaz turuna bırak, kod akışını durdurma.
7. Her faz geçişinde 00 + handoff snapshot güncelle (kesinti sigortası). Context dolunca yeni handoff + bu mandatı taşıyan devam-promptu yaz.

## 📋 YENİ SESSION İÇİN PROMPT (Ozan kopyalayıp yapıştıracak)
> Ruhbaz Manor'a devam. **Özerk çalışıyorsun, sana sormadan bütün fazları tek tek ilerleteceksin** (Ozan uyuyor). Önce oku: `00_HANDOFF.md` + `handoffs/faz4-5-cihaztest1_2026-06-14.md` (özellikle "ÖZERK MANDAT" ve "KRİZ TESTİ ERTELENDİ" bölümleri). Sonra: **(1)** Faz 4.5 cihaz-testi-1'in kalan 3 teşhis-UX bug'ını çöz (ProfileSettings yavaşlama, rüya persona display, "hazırlanıyor" geç-render) ve bunlar için `22_FAZ4-5_CIHAZ_TESTLERI_2_<tarih>.md` hazırla. **(2)** Sonra yol haritası sırasıyla **Faz 5 (Konak Akışı + bildirimler)** ve sonraki fazlara onay beklemeden geç; her faz için ayrı cihaz test dokümanı. Her mantıksal adım ayrı commit + bekçiler (tsc/utf8/image-contract) + her faz sonunda bağımsız öz-review. **Krizleri tek tek TEST ETME** — final overall teste bırak (ikimiz birlikte bakacağız). **Ozan-bloklu işlere girme** (avukat/IAP/fiyat/store/marka/analitik/yasal-final = taslak + "blok: Ozan"). Ultracode açık: hacimli işte workflow/paralel ajan kullan. Tat onaylarını (EN persona ses, EN tagline/etiket, B2) cihaz turuna bırak. Başla.

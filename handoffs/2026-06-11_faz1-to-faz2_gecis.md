# FAZ 1 → FAZ 2 GEÇİŞ + FAZ 2 BRİFİNGİ (2026-06-11, özerk oturum)

> Faz 1'in özerk kısmı bitti; "Ozan onayı bekleyen" maddeler aşağıda TEK TEK listeli (Ozan talebi). Güncel durum her zaman `00_HANDOFF.md`.

---

## 1. FAZ 1'DE YAPILANLAR (commit sırasıyla)

| Commit | İş |
|---|---|
| 5845a7d | D1-D5 kararları 00'a işlendi |
| 0ecb9af | Kod-içi FALCI yorumları → Ruhbaz Konağı + memoryWriter/memoryAnalysis iç prompt temizliği |
| 8ad22b4 | Yetim kök `src/` + `App.tsx` → `_arsiv/` (hiçbir yerden referans almıyordu) |
| 43c1495 | Tarot "The Magician" → **Sihirbaz** (K47a) |
| 58cd727 | **fortune\* → reading\*** tanımlayıcı ailesi (K47f): 6 servis + ekran + identity klasörü `reading-family/` + generator + bekçi |
| abe6974 | **Red Kataloğu guardrailleri** common.md'ye (11 yeni madde: R2/R3/R6/R8/R9/R10/R11/R13/R14/R15/R16) + generator |
| bdc2eb4 | **Yasal katman**: onboarding onay kapısı + Yasal Bilgilendirme ekranı + 12 okuma ekranında kalıcı ibare; metinler TEK kaynakta (`mobile/src/config/legalTexts.ts`) |
| a4f3090 | 5 personada yasaklı-dil ikamesi (fal→okuma; ses DEĞİŞMEDİ) |
| 7e01c12 | `15_AVUKAT_GORUSME_DOSYASI_2026-06-11.md` — avukata hazır |
| c0a86b6 | Öz-review düzeltmeleri (aşağıda) |

**Öz-review (bağımsız ajan, faz0..HEAD diff):** 1 CRITICAL yakalandı ve düzeltildi — rename script'i tarot görsel `require()` yolundaki `10-WheelOfFortune` dosya adını da çevirmişti (Metro bundle kırılırdı). Ayrıca: AGENTS.md eski dosya adları güncellendi; `qrcode-terminal` devDependency'ye eklendi (`npm run qr` transitif bağımlılığa yaslanıyordu). Geri kalan her şey (rota renames, kalıcı veri anahtarları, consent kapısı hook sırası, generator determinizmi, UTF-8) temiz raporlandı.

**Bilinçli KORUNANLAR (D3 + veri güvenliği):** `falci-data/` + `falci-memory-v2.db` (release öncesi migration paketi); `'fortune-cookie'`/`'daisy-fortune'` kalıcı id'leri + `daisy-fortune-history.json`; `'Wheel of Fortune'` kanonik EN kart anahtarı; `FortuneCookie*` bileşen adları (kurabiye nesnesinin adı).

**Cihaz testleri:** `13_FAZ1_CIHAZ_TESTLERI_2026-06-11.md` hazır — yeni APK GEREKMEZ (yalnız JS/TS), tek kurulum: `baslat.ps1` + reload.

---

## 2. ⚠️ OZAN ONAYI BEKLEYENLER — TEK TEK (hiçbiri Faz 2'yi bloklamıyor, ama release'i bloklar)

1. **Yasal metin taslakları onayı** — `mobile/src/config/legalTexts.ts` (onboarding metni, Yasal Bilgilendirme 6 bölüm, kısa ibare). Ton: sıcak-ama-net. Tek dosya; beğenmediğin cümleyi söyle, değiştiririm. Cihazda Grup 1-2 testlerinde okuyacaksın.
2. **Persona dil ikameleri onayı** — 5 personada 32 satır (commit a4f3090; `git show a4f3090` ile tek bakışta). Ses değişmedi, yalnız kelime ikamesi.
3. **Avukat randevusu** — `15_AVUKAT_GORUSME_DOSYASI_2026-06-11.md` hazır; 9 soru + bağlam + önlem listesi. Randevu senin.
4. **Tarot sınır-durum adları** — K47 yalnız Sihirbaz'ı kapsıyordu. Standart bırakılanlar: "Kader Çarkı" (Wheel of Fortune), "Şeytan" (The Devil), "Mecnun" (The Fool). Bence standart kalmalı (kanonik kart adları, sektörde aynen kullanılıyor); itirazın varsa söyle.
5. **"Şans/talih/baht" kapanış kalıpları** — Suzan/Teoman/Selin kapanışlarında "şansın dönüyor, talihin açılıyor, bahtın açık olsun" tonu var. Yasaklı sözlükte DEĞİL ama hafif vaat kokusu; Faz 3 ses matrisinde ele alalım derim (şimdi dokunmadım — ses işi).
6. **Cihaz testleri** — `13_FAZ1...md` (yeni) + `12_FAZ0...md` kalanları (EK1-9, EK2-4..6, EK-3, EK-5).
7. **Play Console hesabı + IAP ürünleri + fiyat** — Faz 2'nin kod iskeleti bunlarsız ilerliyor; ürün bağlama günü sende.
8. *(Not, karar değil)* `mobile/app.json`'da `extra.eas.projectId` Faz 0 slug değişiminde silinmiş; EAS build günü yeniden bağlanır, lokal dev akışını etkilemiyor.

---

## 3. FAZ 2 BRİFİNGİ — Karar dondurma + gelir MVP'nin ÖZERK KOD KISMI (Claude onayladı, D4 sınırlarıyla)

**Kaynak:** 05 Faz 2 + D4 kararı. K9/K10 (yerel LLM söküm) Faz 0'da bitti; K12 (yalnız Gemini) uygulanmış durumda.

**Claude ÖZERK yapacak (kod iskeleti; IAP'sız da çalışır):**
1. **K42 input moderasyonu:** Kullanıcı girdisi modele GİTMEDEN cihazda ön-kontrol katmanı (04/4.6 tablosu): yasaklı kategori sinyallerinde nazik red (K32 ruhu), CSAM/şiddet mutlak blok, R2 kriz köprüsü. Deterministik + hafif (regex/anahtar kelime sinyali); LLM tabanlı moderasyon değil (maliyet).
2. **Token ledger → paket iskeleti:** Mevcut tokenLedgerService'e "seans hakkı" kavramı: hak düşme/yenileme API'si, paket tanım şeması (ürün id'leri PLACEHOLDER — gerçek IAP id'lerini Ozan Play Console'dan verince tek dosyadan bağlanır).
3. **K40 veri taşınabilirliği:** "Yedeğini al / geri yükle" — falci-data + DB'yi tek arşive export (kullanıcının seçtiği yere), import + silmeden önce uyarı.
4. **K34 analitik scaffold:** Anonim event şeması (funnel/retention/satınalma) + arayüz; araç seçimi (PostHog/Firebase/Aptabase) Ozan'a sunulacak KISA karşılaştırmayla; içerik/hafıza ASLA gönderilmez; rıza kapısı.
5. Her adım ayrı commit + bekçiler; sonunda `14_FAZ2_CIHAZ_TESTLERI_<tarih>.md` + faz2→3 geçiş handoff'u.

**Yalnız OZAN (blok):** Play Console + gerçek IAP ürünleri + fiyat (K43) + User Terms onayı (K41) + analitik aracı seçimi onayı.

**Risk:** Orta-düşük. En dokunaklı iş moderasyonun okuma akışına girmesi (regresyon: normal okumalar ASLA engellenmemeli — eşikler muhafazakâr, yalnız net sinyalde devreye girer) ve export/import'un DB ile tutarlılığı. Her ikisi için regresyon maddeleri 14_FAZ2 test dokümanına yazılacak.

---

## 4. REGRESYON NOTLARI (Faz 2'de bozulmaması gerekenler — 00'daki prensibin Faz 1 ekleri)

- Yasal onay kapısı: App.tsx'te navigator'dan ÖNCE; Faz 2 App.tsx'e dokunursa kapı korunmalı.
- `legalTexts.ts` TEK kaynak; metin değişikliği = `LEGAL_CONSENT_VERSION` artır (yeniden onay).
- `SymbolicDisclaimer` 12 ekranda; yeni okuma ekranı açılırsa ona da eklenir.
- common.md guardrail maddeleri (13-23) generator ile `readingPersonaData.ts`'e akar; identity.md değişince `node scripts/generate-reading-persona-data.js` ŞART.
- `'fortune-cookie'`/`'daisy-fortune'`/`falci-data/`/`falci-memory-v2.db` adlarına dokunulmaz (release öncesi tek migration).

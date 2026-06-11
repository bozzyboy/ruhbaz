# FAZ 0 → FAZ 1 GEÇİŞ + FAZ 1 BRİFİNGİ (2026-06-11 gece)

> Bu dosya: (a) Faz 0'ın kapanış durumu + bu oturumda yapılan ek düzeltmeler, (b) Faz 1 brifingi (Claude'un kendi onaylayacağı), (c) **Ozan'ın yeni session'da karar vermesi gereken konular**, (d) sen uyurken işleyeceğim özerk çoklu-faz planı. Güncel durum her zaman `00_HANDOFF.md`.

---

## 1. NEREDEYİZ

**Faz 0 KOD İŞİ bitti** (git tag `faz0`) + bu gece Ozan cihaz testlerinden gelen **ek düzeltmeler** yapıldı:

- **Görsel uygunluk** (LLM-only sözleşmesi + bekçi), **çoklu galeri seçimi**, **markalı izin uyarıları**, **kamera sistem sorgusu** geri getirildi.
- **Paragraf hatası** (sıra-sayısı "7. ev" bölünmesi) — tek noktadan, **Senin Evin + İkram Masası'nın tamamı** kapsandı (2 atlayan ekran formatöre bağlandı).
- **El sırtı reddi** güçlendirildi; **yalnız-tabak** yorumu kulp atfı yasağı.
- **İkram Masası UX:** "Okumayı Başlat" butonu kaldırıldı (karta dokun → direkt aç); buton arka planları kaldırıldı (sade).
- **I-Ching:** "Dönüşüm Süreci / eril-dişil" bölümü kaldırıldı; başlıklar bold + açıklama alt paragrafta; "aşağı kaydır" ipucu.
- **Bağlantı:** `baslat.ps1` (sabit 8081, temizlik, token server, QR penceresi) + `npm run qr` (sistem-kamerasıyla okunan dev-client QR'i) + USB `adb reverse` yolu. Dev-client'ın kendi QR tarayıcısı Android 13'te bozuk — kullanılmıyor.
- Uygulama kimliği app.json'da "Ruhbaz Konağı" (etiket bir sonraki APK derlemesinde yansır).

**Cihaz test durumu:** `12_FAZ0_CIHAZ_TESTLERI_2026-06-11.md` — çoğu ✅; kalanlar (EK1-9 pati altı, EK2-4..6 izin tipi, EK-3 yeni APK) "⏳ KALAN TESTLER"de; EK-5 (bugünkü 4 düzeltme) test bekliyor.

**Persona sesi gözlemleri (Ozan testleri) → Faz 3 (ses matrisi) notu, 07'ye işlenecek:**
- Selin (astrolog) "7. ev / 3. hafta" gibi sıra sayılarından kaçınıyor — astroloji uzmanı için evlere doğal değinmeli. Kod hatası değil; `identity.md:37` "soğuk teknik anlatıma dönme" talimatını fazla geniş yorumluyor.
- Persona uzunluk farkı (Selin tek tabakta 1 paragraf, Berk daha uzun): **per-persona token cap YOK** (doğrulandı; bütçe okuma-türüne göre). Ses/içerik kaynaklı varyans. İstenirse "minimum zenginlik" talimatı Faz 3'te.

---

## 2. FAZ 1 BRİFİNGİ — Hukuki zırh + yeniden adlandırma

**Kaynak:** 05_YOL_HARITASI Faz 1 + 04_HUKUK_VE_GUVENLIK (Red Kataloğu) + K47.

**Hangi bölümler?** Kullanıcıya görünen DİL + kod-içi adlandırma + yasal katman. Yeni ekran/özellik değil; mevcut metinleri 677-uyumlu hale getirme.

**Claude ÖZERK yapabilir (kod + taslak):**
1. **Kod-içi "fal" envanteri temizliği** (tarama 2026-06-11 yapıldı): `falci-data/` klasör + `falci-memory-v2.db` DB adı → nötr; ~15 dosyada `// FALCI —` başlık yorumları → Ruhbaz; `fortune*` tanımlayıcı ailesi → `reading*` (K47); memoryWriterDebugService iç prompt'u. **DİKKAT:** DB/klasör adı migration riski — ilk release ÖNCESİ yapılırsa sorunsuz; mevcut cihaz verisi varsa migration gerekir (Ozan'ın test cihazındaki veri önemliyse karar gerek — aşağıda D3).
2. **Tarot "The Magician" → "Sihirbaz"** + TR tarot adları (K47).
3. **Red Kataloğu guardrailleri** `common.md`'ye işlenir + generator çalıştırılır (K32 "onar, kesme": deterministik katman yalnız ikame/temizlik). Bu SAVUNMA kodu; persona SESİNİ değiştirmez.
4. **Yasal metin TASLAKLARI:** onboarding onayı, "Yasal Bilgilendirme" ekranı, okuma ekranı kalıcı ibaresi ("Eğlence amaçlı sembolik yorum"). **Taslak benden, ONAY senden** (Ozan kuralı).
5. Persona kaynak markdown'larındaki ~54 "fal/falcı" kullanımı → yeni sözlükle yeniden yazılır. **Bu da taslak; persona SESİNİN yeniden tasarımı Faz 3.** Faz 1'de yalnız yasaklı-dil ikamesi.

**Yalnız OZAN yapabilir (özerk DEĞİL):**
- Yasal metinlerin ONAYI (taslakları hazırlarım).
- **Avukat randevusu** + 04/5 sorularını götürmek. Şirket kararı (K4) bundan sonra.
- Persona dil ikamelerinin onayı (hukuk + marka hassasiyeti).

**Risk:** Orta. En hassas iş yasal metin + persona dili (hukuki). Kod renames düşük risk (ilk release öncesi, tsc/bekçi doğrular). Geri dönüş: her mantıksal adım ayrı commit.

**Çıktı:** "Bu app'i bugün store'a koysam dilden yanmam" + kod-içi FALCI kalıntısı sıfır.

---

## 3. ⚠️ OZAN'IN YENİ SESSION'DA KARAR VERMESİ GEREKENLER (önden)

Bunlar olmadan Faz 1'i tam bitiremem; yeni session başında konuşalım:

- **D1 — Faz 1/2'yi özerk götürmemi onaylıyor musun?** Sen "iki faz arka arkaya" dedin. Ben CODE + TASLAK üretirim; yasal onay, avukat, Play Console, IAP, fiyat senin. Bu sınırla devam = OK mi?
- **D2 — Yasal metin + persona dili:** Taslakları ben hazırlayıp Faz 1'i "taslak hazır, onay bekliyor" diye bırakayım mı, yoksa sen uykudan önce kısa bir yön mü verirsin (ton: ne kadar resmi/sıcak)?
- **D3 — DB/klasör adı migration:** `falci-memory-v2.db` → nötr ada çevrilince test cihazındaki MEVCUT veri (profiller, okumalar, hafıza) silinmiş gibi olur. (a) İlk release öncesi olduğumuz için veriyi feda edip temiz nötr ada geç mi, yoksa (b) migration kodu yazıp veriyi taşı mı? Senin test verin önemliyse (b).
- **D4 — Faz 2 IAP/fiyat:** Bunlar tamamen sana bağlı (Play Console hesabı, ürün tanımı, fiyat). Ben Faz 2'nin KOD iskeletini (token ledger pakete bağlama, moderation K42, veri taşınabilirliği K40, analitik K34 scaffold) yaparım; IAP'ın gerçek ürün/fiyat kısmını sana bırakırım. Onay?
- **D5 — Avukat:** Faz 1 sonunda avukat soruları (04/5) hazır olacak. Randevuyu sen mi ayarlayacaksın, ben listeyi mi netleştireyim?

---

## 4. ÖZERK ÇOKLU-FAZ PLANI (sen uyurken / yeni session'da)

Direktif (Ozan, 2026-06-11): "iki faz arka arkaya devam edebilecekmişsin gibi düşün; her faz için cihaz testleri ayrı dosya; faz geçişlerinde handoff + kendi onaylayacağın briefing + benim için faz-sonu cihaz testleri."

**Sıra (yeni session):**
1. D1-D5 kararlarını al (kısa interview).
2. **Faz 1 yürüt** (özerk kısım): kod renames + guardrail + taslaklar. Her adım ayrı commit + tsc/utf8/bekçi.
3. `13_FAZ1_CIHAZ_TESTLERI_<tarih>.md` oluştur (Ozan'ın Faz 1 testleri).
4. `handoffs/<tarih>_faz1-to-faz2_gecis.md` + Faz 2 briefingi (Claude onaylı) yaz.
5. **Faz 2 yürüt** (özerk KOD kısmı): moderation/ledger/portability/analytics scaffold. IAP/fiyat = Ozan-blocked, net işaretle.
6. `14_FAZ2_CIHAZ_TESTLERI_<tarih>.md` + `handoffs/<tarih>_faz2-to-faz3_gecis.md` + Faz 3 briefingi yaz.
7. Ozan uyanınca: Faz 1 & 2 testleri sorunsuzsa → Faz 3.

**Özerk sınır (değişmez):** Yasal/persona/marka onayı, avukat, Play Console, IAP, fiyat = Ozan. Bunları "taslak hazır / blok: Ozan" diye bırak, üzerinden atlama. Emin olamadığında dur + not düş (00 protokolü).

---

## 5. KISA DURUM (yeni session ilk okuma)

- Git tag `faz0`; master temiz; tüm statik kapılar (tsc/utf8/image-contract) yeşil.
- `baslat.ps1` ile bağlan; `12_FAZ0...md` EK-5 + kalan testler Ozan'da.
- Önce bu dosyanın §3 kararlarını Ozan'a sor, sonra §4 planını yürüt.

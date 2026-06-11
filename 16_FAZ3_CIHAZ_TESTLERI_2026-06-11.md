# 16 — FAZ 3 CİHAZ TESTLERİ (2026-06-11)

**Doküman tarihi:** 2026-06-11 · **Faz:** 3 (persona ses matrisi + Brand Book + oda adları) · **Cihaz:** Android (dev build APK + Expo dev server)

> Faz 3 yalnız markdown (persona kaynakları) + UI başlık string'leri. **Yeni APK GEREKMEZ.** Bu testlerin çoğu LLM davranışı = olasılıksal; birebir cümle değil, davranış SINIFI beklenir. Beğenmediğin tonu not et — ses TASLAK, tek dosyadan düzeltilir.

---

## ⚙️ KURULUM (bir kez)

- [ ] `baslat.ps1` + dev build APK + yeni JS bundle (gerekirse `r`). 13/14 numaralı dokümanlarla aynı oturuşta inilebilir.

## GRUP 1 — Oda adları (K50; kesin/deterministik)

- [ ] **1.1** Home lobisinde kartlar: **Salon · Simya Odası · Ayna Odası** (+ İkram Masası aynen) → eski "Senin Evin / Simya Laboratuvarı / Kendini Tanı" YOK.
- [ ] **1.2** Salon'a gir → ekran başlığı "Salon"; panel "Salon Okumaları". Ayna Odası → başlık + panel "Ayna Odası". Simya Odası → "Simya Odası".
- [ ] **1.3 (regresyon)** Her üç odanın İÇİ eskisi gibi çalışıyor (sadece ad değişti): Salon'dan okuma başlatma, Ayna Odası testleri, Simya akışı.

## GRUP 2 — Hitap politikası (K45; LLM davranışı)

- [ ] **2.1** Kendinden YAŞLI bir profil oluştur (ör. 70 yaş) → Deniz'le okuma → beklenen: "kanka" DEMEZ; saygılı-sıcak "canım" tonu.
- [ ] **2.2** Genç profil (ör. 22) → Suzan → "yavrum/kuzum/güzel kızım" doğal.
- [ ] **2.3** Pet profille okuma → hitap hayvana sevgiyle, sahibine "evladım" karmaşası yok (regresyon: hayvan profili akışı).

## GRUP 3 — Ses matrisi etkileri (LLM davranışı)

- [ ] **3.1 (Faz 0 gözlemi düzeltmesi)** Selin'le kişisel astroloji: artık "7. ev", "Satürn döngüsü" gibi ifadeleri KULLANIYOR ve yanına tek cümlelik sıcak açıklama koyuyor mu? (Eskiden kaçınıyordu.)
- [ ] **3.2 (uzunluk standardı)** Selin tek tabak/tek kart okumasında en az ~3 paragraf üretiyor mu? (Eski şikayet: tek paragraf.)
- [ ] **3.3** Arın'la okuma: ton genç/Gen-Z frekansında ama internet kısaltması ve ham İngilizce YOK; "Berk/Selin" adlarını AÇIKÇA söylemiyor (dolaylı "kurumsal abim" tarzı kalıyor).
- [ ] **3.4 (lore)** Suzan veya Teoman'la okumada ARA SIRA eş/çekişme dokunuşu gelebilir ("bizimki avucuna güvenir ya..." gibi) → gelirse doğal mı; HER okumada zorla geçiyorsa not et (kural: en fazla tek zarif dokunuş).
- [ ] **3.5 (regresyon — persona sesleri)** 7 personadan 3-4'üyle kısa okuma: herkes hâlâ "kendisi gibi" mi? Matris sesleri EZMEMELİ, netleştirmeli.

## GRUP 4 — Kapanış cümleleri (vaat temizliği)

- [ ] **4.1** Birkaç okumanın kapanışında "gerçeğe dönüşecek / müjde yolda / haber geliyor" tarzı KESİN vaat YOK; "olsun/açılsın" dilek kipi veya olasılık dili VAR.
- [ ] **4.2** "Bahtın açık olsun / şansın yaver gitsin" gibi hayır duaları hâlâ duruyor (bunlar bilinçli KALDI — kültürel sıcaklık).

## GRUP 5 — Brand Book (cihaz testi değil, okuma onayı)

- [ ] **5.1** `BRAND_BOOK.md` oku → §8 açık karar listesine (persona renkleri, font, logo yönü, üç sıfat) cevap ver.

## 📋 Değişen dosyalar → test eşlemesi

| Commit | Dosyalar | Test |
|---|---|---|
| 0c4ca30 + 7442b68 | 7 persona identity.md + common.md (Address Policy + min zenginlik) + generator çıktısı | GRUP 2, 3 |
| 01de256 + 7442b68 | 5 personada kapanış satırları | GRUP 4 |
| 49d74d0 | HomeScreen, PersonalReadings/SelfKnowledge/SimyaLab başlıkları, App.tsx, BRAND_BOOK.md | GRUP 1, 5 |

**Bilinçli sınırlar:** (a) İç prompt'lardaki "Kendini Tanı" referansları değişmedi (hafıza yazıcı tutarlılığı; release-öncesi migration paketine not). (b) Sınır-durum kapanışlar ("güzel günler çok yakın" sınıfı) bilerek kaldı — ses onayında topluca karar. (c) Aile ağacının kesin derecesi (kim kimin kardeşi) kanonda bilinçli muğlak — Ozan netleştirirse tek dosyadan işlenir.

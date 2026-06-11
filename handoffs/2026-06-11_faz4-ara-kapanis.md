# FAZ 4 ARA-KAPANIŞ (2026-06-11, özerk oturum sonu)

> Faz 4 (i18n/EN) ALTYAPI DİLİMİ bitti (tag `faz4a`); fazın tamamı DEĞİL. Bu dosya: ne bitti, ne kaldı, sonraki oturum nereden devam eder. Güncel durum: `00_HANDOFF.md`.

---

## 1. BU OTURUMDA (Faz 4 dilimi)

| Commit | İş |
|---|---|
| 3f72d26 | i18n altyapısı (i18next, SAF JS — APK gerekmez) + nav/home/settings dilimi + kalıcı dil anahtarı |
| 5a7011d | Öz-review düzeltmesi (nav.home birebir-taşıma ihlali) + `17_EN_LOKALIZASYON_PLANI.md` (kalan iş haritası + persona EN ses stratejisi + EN store taslağı) |

**Öz-review:** NEEDS-FIXES → tek WARN (nav.home 'Ruhbaz Konağı' kaçağı) düzeltildi; init yarışı, peer-deps, Hermes Intl, dil-geçişi, wipe/restore etkileşimi, circular import — hepsi doğrulanmış SAFE.

**Test dokümanı:** `18_FAZ4_CIHAZ_TESTLERI_2026-06-11.md` (APK gerekmez).

## 2. FAZ 4 KALAN İŞ (sonraki oturum buradan başlar)

`17_EN_LOKALIZASYON_PLANI.md` §2 tablosu sırayla:
1. Okuma akışı ekranlarının string taşıması (en görünür yüzey).
2. Profil/modal metinleri + labelFor* fonksiyonları.
3. legalTexts EN (AVUKAT SONRASI — bloklu).
4. divinationData ~650 satır (mekanik, hacimli).
5. Persona EN sesleri: `identity.en.md` × 7 + generator dil parametresi (strateji tablosu hazır; Ozan yön onayı bekliyor — plan §3).
6. LLM çıktı dili kuralı + EN guardrail sözlüğü (5 bitmeden açılmaz).

**Sonraki oturum İLK İŞ:** 00_HANDOFF oku → bu dosya → 17 numaralı plan → dilim 1'den devam (her dilim ayrı commit + bekçiler + öz-review disiplini aynen).

## 3. OZAN'A BİRİKEN TÜM KARARLAR (4 fazın birleşik listesi — TEK TEK)

**Cihaz testleri (4 doküman, tek oturuş, hiçbiri APK gerektirmez):**
1. `13_FAZ1_CIHAZ_TESTLERI_2026-06-11.md`
2. `14_FAZ2_CIHAZ_TESTLERI_2026-06-11.md`
3. `16_FAZ3_CIHAZ_TESTLERI_2026-06-11.md`
4. `18_FAZ4_CIHAZ_TESTLERI_2026-06-11.md` (+12_FAZ0 kalanları; EK-3 yeni APK ister)

**Onaylar (metin/ses/marka):**
5. Yasal metinler — `mobile/src/config/legalTexts.ts` (Faz 1)
6. Persona dil ikameleri — `git show a4f3090` (Faz 1)
7. Ses matrisi + lore kanonu tonu — cihazda Grup 3 (Faz 3); aile ağacı kesinleştirme
8. Kapanış sınır-durumları ("güzel günler çok yakın" sınıfı) — topluca karar (Faz 3)
9. BRAND_BOOK §8: persona renkleri, font, logo yönü, üç sıfat (Faz 3)
10. EN: oda adları (The Salon vb.), persona EN ses yönü (17/§3), store metni (17/§4), EN yayın eşiği (17/§5), header marka adı "Ruhbaz" vs "Ruhbaz Konağı" (Faz 4)
11. Tarot sınır-durum adları: Kader Çarkı / Şeytan / Mecnun standart kaldı — itiraz?

**Dış işler:**
12. Avukat randevusu — `15_AVUKAT_GORUSME_DOSYASI_2026-06-11.md` hazır
13. Play Console hesabı
14. IAP ürünleri + fiyat (K43) — id'leri verince `sessionPackages.ts`'e bağlanır
15. Analitik aracı seçimi (önerim: Aptabase)
16. K51 kararı (release öncesi): hak bakiyesi sunucu mu, store-native mi

## 4. REGRESYON NOTLARI (i18n ekleri)

- TR metin taşıma kuralı: BİREBİR kopya; metin değişikliği AYRI commit.
- `tr.ts` tek TR kaynağı olmaya başladı; yeni UI metni eklerken anahtar + iki dile birden yazılır (en.ts tip-zorlamalı, eksik anahtar derlemede yakalanır).
- expo-localization eklenirse YENİ APK gerekir; yalnız `detectDeviceLanguage` değişmeli.
- Dil dosyası `falci-data/app-language.json` — wipe ile sıfırlanması bilinçli.

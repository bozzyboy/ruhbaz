# FAZ 2 → FAZ 3 GEÇİŞ + FAZ 3 BRİFİNGİ (2026-06-11, özerk oturum devamı)

> Faz 2'nin özerk KOD kısmı bitti (tag `faz2`). IAP/fiyat/Play Console = Ozan bloğu (aşağıda §2). Faz 3 ÖZERK BAŞLAMAZ — brifing Ozan onayına sunuluyor (ses işi = marka hassasiyeti). Güncel durum: `00_HANDOFF.md`.

---

## 1. FAZ 2'DE YAPILANLAR (commit sırasıyla)

| Commit | İş |
|---|---|
| 11b7a2e | **K42 girdi moderasyonu** — 10 kategori, modele gitmeden cihazda; nazik red + kriz protokolü; 7 giriş noktası |
| e9fcd66 | **Seans hakkı + paket kataloğu iskeleti** — 3 PLACEHOLDER paket; enforcement KAPALI; K51 uyarısı kodda |
| 190aca9 | **K40 veri taşınabilirliği** — SAF ile Yedek Al / Geri Yükle + KVKK çift-onaylı "Tüm Verimi Sil" (yeni APK gerektirmez) |
| 200014b | **K34 analitik iskeleti** — rıza kapılı, no-op taşıyıcı; içerik/hafıza asla gönderilmez; 3 enstrümantasyon |
| 261d529 | **Öz-review düzeltmeleri** (2 CRITICAL + 7 WARN): regex yanlış-pozitifleri (Türkçe sınırlar, yakınlık koşulu, niyet kalıpları; 42 vakalık test seti) + **"modele gitmez" sürekliliği** (bloklanan içerik sonraki turlarda da prompt'a/hafızaya taşınmaz) + restore'da gerçek üzerine-yazma (eski -wal bozulması önlendi) |

**Cihaz testleri:** `14_FAZ2_CIHAZ_TESTLERI_2026-06-11.md` — yeni APK gerekmez; 13_FAZ1 ile aynı oturuşta inilebilir.

**Faz 2'den AÇIK kalanlar (Ozan bloğu çözülünce kod günü ~yarım gün):**
- IAP gerçek ürünleri bağlama (sessionPackages.ts placeholder'ları) + paywall UI + enforcement açma.
- User Terms metni (avukat S8 sonrası) + analitik aracı seçilince transport adaptörü + rıza UI'ı (aydınlatma metniyle).
- K51 kararı: hak bakiyesi sunucu-taraflı mı, store-native intro offer mı (release ÖNCESİ zorunlu).

## 2. ⚠️ OZAN'A KALAN İŞLER — TAM LİSTE (Faz 1 + Faz 2 birleşik, TEK TEK)

1. **Cihaz testleri:** `13_FAZ1...md` + `14_FAZ2...md` (tek oturuş, APK gerekmez) + 12_FAZ0 kalanları (EK-3 yeni APK dahil).
2. **Yasal metin taslakları onayı** — `mobile/src/config/legalTexts.ts` (testte Grup 1-2'de okuyacaksın; düzeltme istersen cümle bazında söyle).
3. **Persona dil ikameleri onayı** — `git show a4f3090` (5 personada fal→okuma; ses değişmedi).
4. **Avukat randevusu** — `15_AVUKAT_GORUSME_DOSYASI_2026-06-11.md` hazır.
5. **Tarot sınır-durum adları** — "Kader Çarkı / Şeytan / Mecnun" standart bırakıldı; itiraz var mı?
6. **"Şans/talih/baht" kapanış kalıpları** — önerim: Faz 3 ses matrisinde ele alalım.
7. **Google Play Console hesabı** açılması.
8. **IAP ürün tanımları + fiyat (K43)** — Excel modeliyle; ürün id'lerini verince tek dosyadan bağlarım.
9. **Analitik aracı seçimi (K34)** — önerim: **Aptabase** (gizlilik-öncelikli, ücretsiz self-host seçeneği, RN SDK basit) > PostHog (güçlü ama ağır) > Firebase (Google bağımlılığı + KVKK yükü). Tek kelimeyle onaylayabilirsin; adaptörü yazarım.
10. **K51 kararı** (release öncesi): hak bakiyesi sunucuda mı, store-native intro offer mı — avukat görüşmesi + K43 ile birlikte.
11. *(Not)* `app.json` eas projectId EAS build gününde yeniden bağlanacak.

## 3. FAZ 3 BRİFİNGİ — Persona ses matrisi + Brand Book (ONAY BEKLİYOR; özerk başlamadı)

**Kaynak:** 05 Faz 3 + Faz 0 gecesi persona gözlemleri (geçiş handoff'u §1) + K11/K44.

**Ne yapılacak?** 7 persona için ses matrisi: hitap, ritim, mizah, metafor alanı, yasaklar, örnek açılış/kapanışlar — kaynak markdown'lara işlenir + generator. Özel maddeler:
- Selin: "soğuk teknik anlatım" talimatının fazla geniş yorumlanması (astrolog evlere doğal değinebilmeli; "7. ev" kaçınması düzeltilir).
- Persona uzunluk standardı: "minimum zenginlik" talimatı (Selin tek paragraf sorunu).
- Arın'a Gen-Z tonu (Ozan, 2026-06-11).
- "Şans/talih/baht" kapanışlarının vaat-kokusu temizliği (madde 6 ile birleşik).
- K44 persona renk/görsel kimliği Brand Book taslağı (07/F10-B).

**Neden özerk DEĞİL?** Ses = marka; Ozan'ın K11 matris onayı + ton zevki gerekiyor. Önerilen işleyiş: ben 7 persona için matris TASLAĞI çıkarırım → Ozan tek oturumda onaylar/düzeltir → sonra kaynaklara işlerim. ("Taslağa kadar özerk gel" dersen o kısmı yapabilirim.)

**Risk:** Düşük (yalnız markdown + generator; kod yok). Regresyon: kapanış kütüphaneleri persona kimliğinin parçası — değişiklik 6.5-tipi ses regresyon testine bağlanır.

## 4. REGRESYON NOTLARI (Faz 2 ekleri — sonraki fazlarda bozulmamalı)

- Moderasyon entegrasyonu 7 giriş noktasında; YENİ okuma türü eklenirse girişine moderasyon + `filterModeratedFollowUps` eklenir.
- `isModerationReplyText` REPLY metinlerine birebir bağlı → REPLY metni değiştirilirse eski kayıtlardaki yanıtlar süzülemez (sürüm notu düş).
- Yedek formatı `ruhbaz-konagi-backup` v1; alan değişikliği = schemaVersion artır + import'ta geriye-uyum.
- Enforcement bayrağı açılmadan paywall UI bağlanmamalı (test akışları kilitlenmesin).
- Faz 1 notları geçerli: legalTexts tek kaynak + LEGAL_CONSENT_VERSION; disclaimer yeni ekranlara; generator zorunluluğu; D3 adları dokunulmaz.

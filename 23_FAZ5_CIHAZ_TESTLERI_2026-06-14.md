# 23 — FAZ 5 CİHAZ TESTLERİ (Konak Akışı + bildirimler) — 2026-06-14

> **Faz:** 5 (Konak Akışı + bildirimler) · **Cihaz:** Ozan'ın Android dev-build telefonu · **Tarih:** 2026-06-14 (özerk; dilim dilim doldurulur)
>
> Bu doküman Faz 5 dilimleri eklendikçe BÜYÜR (her dilim = ayrı bölüm + regresyon + dosya→test eşlemesi). Faz 5 özerk ilerliyor (Ozan: "bütün fazları sormadan ilerlet; Faz 5 bitse de devam et, uyanınca bakarım"). Ozan-bloklu işler (sosyal hesap, bildirim metin onayı, IAP, GitHub Pages yayını) taslak + "blok: Ozan" bırakılır.

---

## ⚙️ KURULUM (JS/TS dilimleri için — bir kez)

- ✅ **Yeni APK GEREKMEZ** (5.1–5.5 yalnız JS/TS). PC'de `npx expo start`, telefonda **`r` ile reload**.
- ⚠️ **5.6 Bildirimler** `expo-notifications` native modülü ekler → o dilim için **YENİ APK GEREKİR** (o bölümün kurulum kutusunda ayrıca belirtilecek).
- Dil: i18n'li maddeleri TR + EN bak.

---

## 💛 5.1 — OKUMA FAVORİLERİ (K29)

> **Ne eklendi?** Okumalara kalp (favori) işareti: okuma detayında toggle + geçmişte "Tümü / Kalplilerim" filtresi + kart başına kalp. Cihazda kalıcı (profileMemoryService).

### 5.1-A · Favori ekle/çıkar
1. Bir profilde en az 2 biten okuma olsun (yoksa önce 2 okuma üret/bitir). Profil Ayarları → profil → **Son Okumalar** (History) aç.
2. Bir okuma kartında sağdaki **♡** kalbe dokun → **Beklenen:** kalp **♥** olur (dolu, altın). Tekrar dokun → **♡** (boş).
3. Bir okumayı aç (**ReadingDetail**) → üst kartta **"♡ Kalbime ekle"** butonuna dokun → **Beklenen:** **"♥ Kalplimde"** olur. Geri dön → History'de o kart **♥** görünür (senkron).

### 5.1-B · "Kalplilerim" filtresi
4. History üstünde **Tümü / ♥ Kalplilerim** çubuğu var. **Kalplilerim**'e dokun → **Beklenen:** yalnız kalpli okumalar listelenir.
5. Hiç favori yokken **Kalplilerim** → **Beklenen:** "Henüz kalpli okuma yok" boş kartı (uygulama boş listede çökmez).
6. **Tümü**'ne dön → tüm okumalar geri gelir.

### 5.1-C · Kalıcılık + regresyon
7. Bir okumayı kalple, app'i **reload** et (veya History'den çıkıp gir) → **Beklenen:** kalp durumu korunur (cihazda kalıcı).
8. **Regresyon:** Okuma **Sil** (kart "Sil" + detay "Bu Okumayı Sil") hâlâ çalışıyor; "Hepsini Sil" çalışıyor; okuma detayına geçiş, soru-cevap görünümü bozulmadı.
9. **Regresyon (EN):** Dili EN yap → filtre "All / ♥ My Favorites", detayda "Add to favorites / In favorites", boş durum İngilizce.

**Dosya → test eşlemesi (5.1):**
| Değişen dosya | Test |
|---|---|
| `types/memory.ts` (ReadingSummary.favorite) | 7 (kalıcılık) |
| `services/profileMemoryService.ts` (setReadingFavorite + normalize) | 2, 3, 7 |
| `screens/ReadingDetailScreen.tsx` | 3, 9 |
| `screens/HistoryScreen.tsx` | 2, 4, 5, 6, 8, 9 |
| `i18n/locales/tr.ts` + `en.ts` (history favori anahtarları) | 4, 9 |

---

## 📜 5.2 — KONAK AKIŞI (feed) [fazın adını taşıyan özellik]

> **Ne eklendi?** Home'a tam-genişlik **"Konak Akışı"** giriş kartı + yeni **ManorFeed** ekranı. Şimdilik **app içi tohum havuzu** (bundled, TASLAK içerik) gösterilir; uzak yayın (statik JSON feed → GitHub Pages/Actions + `EXPO_PUBLIC_MANOR_FEED_URL`) = **OZAN BLOĞU** (servis hazır, URL set'liyse uzak feed'i çeker, yoksa tohum).

### 5.2-A · Erişim + içerik
30. Ana ekran → **"Konak Akışı"** kartına dokun → **Beklenen:** akış ekranı açılır; üstte sembolik (eğlence) uyarısı + kısa tanıtım; altında kartlar.
31. Kartları incele → **Beklenen:** her kartta **atıf** (bir persona adı ya da "Konak"), **tür rozeti** (Konak Sözü / Gökyüzü / Küçük Ritüel / Davet), **başlık** ve **gövde**. İçerik 677-uyumlu (kesin gelecek/kazanç/sağlık iddiası YOK; sembolik/eğlence dili).
32. **Tat (Ozan):** Tohum içerik tonu/uzunluğu ve kart tasarımı sence uygun mu? (TASLAK — içerik onay/genişletme + uzak yayın Ozan'a ait; aksiyon gerekmez, beğeni notu yeter.)

### 5.2-B · Dil
33. Dili **EN** yap → Home kartı + ekran başlığı **"Manor Feed"**, kart içerikleri ve tür rozetleri İngilizce. **TR**'ye dön → Türkçe. (Dil değişince ekrana tekrar gir.)

### 5.2-C · Regresyon
34. Home'daki 4 lobi kartı (İkram Masası / Salon / Simya / Ayna) hâlâ açılıyor; düzen bozulmadı (feed kartı gridin ALTINDA).
35. Akış ekranından geri dönüş + "Çıkış" header butonu çalışıyor.

**Dosya → test eşlemesi (5.2):**
| Değişen/yeni dosya | Test |
|---|---|
| `data/manorFeedSeed.ts` (tohum içerik) | 31, 32 |
| `services/manorFeedService.ts` (bundled + uzak hook) | 30, 33 |
| `screens/ManorFeedScreen.tsx` | 30, 31, 33 |
| `App.tsx` (ManorFeed nav kaydı) | 30, 35 |
| `screens/HomeScreen.tsx` (giriş kartı) | 30, 34 |
| `i18n/locales/tr.ts` + `en.ts` (nav.manorFeed, home.manorFeed*, manorFeed.*) | 33 |

---

## 🕯️ 5.3 — BEKLEME SAHNESİ (K33/F7)

> **Ne eklendi?** Kahve/El okuması **hazırlanırken** (ilk yorum gelene kadar) "Okuman hazırlanıyor" loader'ının **altında** Konak Akışı havuzundan bir atmosfer kartı ("Beklerken konaktan"). **Eklemeli** — Bug 3 loader mantığına dokunmaz; akış boşsa hiç görünmez. "Davet" türü elenir (okuma sırasında okumaya davet tuhaf olmasın). Şimdilik **yalnız SessionScreen** (kahve/el — en uzun bekleme, görsel sıkıştırma); diğer okuma ekranları ileride.

36. **Kahve** (veya El) okuması başlat → ilk yorum gelene kadar **loader'ın ALTINDA** "Beklerken konaktan" başlıklı bir kart (akış sözü) görünür → ilk yorum gelince kaybolur.
37. **Regresyon (Bug 3):** "Okuman hazırlanıyor" loader'ı hâlâ **mount anında** görünüyor; bekleme kartı onu gizlemiyor, yalnız altına ekleniyor.
38. **EN:** Dili EN yap → kart başlığı "While you wait, from the manor" + içerik İngilizce.
39. **Regresyon:** Takip sorusu sorulurken bekleme kartı GÖRÜNMEZ (yalnız ilk hazırlıkta); okuma akışı bozulmadı.

**Dosya → test eşlemesi (5.3):**
| Değişen/yeni dosya | Test |
|---|---|
| `components/WaitingScene.tsx` | 36, 38 |
| `screens/SessionScreen.tsx` (eklemeli render) | 36, 37, 39 |
| `i18n/locales/tr.ts` + `en.ts` (manorFeed.whileYouWait) | 38 |

---

## 🔮 5.4 — I-CHING + RÜN KİŞİSEL OKUMA (konuşmalı; Ozan kararı: B)

> **Ne eklendi?** Salon'a (Senin Evin) iki yeni **konuşmalı** okuma türü: **I-Ching** ve **Rün**. Çekiliş (hexagram / 3 rün) cihazda deterministik yapılır; yorum Gemini + persona sesi + hafıza + takip sorularıyla (tarot kalıbı). Varsayılan reader: **I-Ching = Teoman**, **Rün = Arın** (tat onayı Ozan).

### 5.4-A · Akış
40. Salon → kart listesinde **I-CHING** ve **RÜN** kartları görünür. **I-CHING**'e dokun → profil onayı → reader-seç (Teoman varsayılan) → devam.
41. **Açılış:** ekran açılır açılmaz **çekilen hexagram** (şimdiki durum + varsa değişen çizgiler/dönüşüm) + "sormak istediğin konuyu yaz" daveti görünür.
42. Bir konu yaz (örn. "iş değişikliği düşünüyorum") → **Yorumla** → **Beklenen:** Teoman sesinde, hexagram + soru bağlamında konuşan bir okuma. Kahve/fincan/telve/tarot/el objesi GEÇMEZ.
43. **Takip sorusu** sor → cevap aynı çekiliş + bağlamda (kart değişmez).
44. **RÜN** ile aynı akış (Arın varsayılan) → **3 rün** (kök/şu an/yönelim + anlamları) gösterilir → yorum Arın sesinde.

### 5.4-B · Regresyon + kalite
45. **Bitir** → History'de okuma **"Kişiye Özel I-Ching / Rün"** olarak görünür; aç / sil / favori (5.1) çalışır.
46. **EN:** dili EN → kart adları (I-Ching / Runes), açılış, çekiliş etiketleri (Present state / Changing lines) ve okuma İngilizce. TR'ye dön → Türkçe.
47. **Regresyon:** Tarot / Rüya / Astro / Numeroloji Salon akışları bozulmadı (reading-type union genişledi; mevcutlar aynı).
48. **Kriz/677:** konu alanına kriz cümlesi → nazik red (battery doğrulandı); okuma kesin gelecek/"fal" dili kullanmaz, persona adı gövdede geçmez.

### 5.4-C · REWORK kişiselleştirme (2026-06-14) — KURULUM: yalnız JS/TS, app'i `r` ile reload yeter
> **Ne değişti?** Okuma "taş/hexagram anlamlarını alt alta dizme"den **kişiye özel senteze** çevrildi: (1) başta konu girişi **opsiyonel** + girilirse **güçlü userStated** (okuma öncesi konu, astro/tarot yolu); (2) her okumada havuzdan **2 micro hayat olayı** (anlamsal seçim + ~30 okuma tekrar yok); (3) doğum haritası/numeroloji mizacı + son konu/soru/takip + öne çıkan ilişkiler + okuma geçmişi temaları **dokunarak** weave edilir (kaynak adı verilmez).

49. **Opsiyonel konu — okuma öncesi AYRI adım:** I-Ching aç → çekiliş altında net bir **"Bu okumadan ne öğrenmek istersin? (opsiyonel)"** başlığı + **"Okumaya başla"** butonu görünür (followup kutusu DEĞİL). **Hiçbir şey yazmadan "Okumaya başla"ya bas** → **Beklenen:** genel ama **kişiye özel ve en az 3-4 paragraf doyurucu** okuma gelir (kısa/jenerik DEĞİL). Rün'de de aynı.
50. **Konulu okuma + kişiye özellik:** yeni okuma aç → "Bu okumadan ne öğrenmek istersin?" alanına konu yaz (örn. "annemle ilişkim") → **"Okumaya başla"** → **Beklenen:** ilk paragraftan o konuya değer; semboller **tek bir hikâyede eritilir**, "şu taş şu demek" diye **liste/sözlük tanımı yapılmaz**; kişinin bilinen bağlamı (doğum haritası mizacı / ilişkiler / önceki temalar varsa) doğal biçimde sezilir. Okuma bittikten SONRA alt kutu followup ("Sor") moduna döner.
50b. **Cast görseli (genel okumalardaki gibi):** Açılışta ekran **"hexagram çektim" DEMEZ**, sadece konu davetini gösterir. "Okumaya başla"dan sonra çekiliş **SVG olarak** render olur — I-Ching: şimdiki hexagram → (değişen çizgi varsa) dönüşüm hexagramı + altlarında isimler (soldan sağa ok); Rün: 3 glyph + anlam + pozisyon. Görselin **altında** yorum akar. EN'de aynı.
51. **2 micro hayat olayı:** okumanın içinde **somut, gündelik 2 küçük olay** doğal cümlelere yedrilmiş geçer (ayrı liste değil). Aynı profille arka arkaya 3-4 okuma yap → **Beklenen:** aynı olaylar tekrarlanmaz; girilen konuya/son temalara yakın olaylar seçilir.
52. **userStated yansıması:** konu yazıp okuma al → **aynı profil için** ikinci bir okuma (veya Astro) aç → **Beklenen:** önceki konu, kaynak söylenmeden hafif bir tanışıklık olarak sezilebilir ("önceki okumanda" / "hafızanda" / kaynak adı GEÇMEZ).
53. **Evcil hayvan profili:** pet profille Rün/I-Ching → **Beklenen:** olaylar hayvan dünyasından (oyun/koku/pencere/ev içi güven), insan teması (iş/ilişki/para/okul) kurulmaz.
54. **EN paritesi:** dili EN → opsiyonel konu daveti ("a general reading"), sentez ve 2 micro olay İngilizce ve TR ile **aynı davranışta**. TR'ye dön → Türkçe.

**Regresyon (5.4-C):**
55. **Kahve / Numeroloji micro olayları:** kahve okuması hâlâ 3-4 somut olay+cue alır, numeroloji kendi olaylarını alır; divination eklenince bunlar bozulmadı. Retention 240'a çıktı → kahve/numeroloji okumalarında olay tekrarı **artmadı** (aksine pencere genişledi).

**Dosya → test eşlemesi (5.4):**
| Değişen/yeni dosya | Test |
|---|---|
| `services/personalDivinationService.ts` (cast + okuma + takip) | 41–44 |
| `screens/PersonalDivinationReadingScreen.tsx` | 41–45 |
| `screens/PersonalReadingsScreen.tsx` (flowTypes I-Ching/Rün) | 40, 47 |
| `screens/PersonalAssistantSelectScreen.tsx` (default + navigate) | 40, 44 |
| `services/personaClosingService.ts` (iching/rune domain) | 42, 44 |
| `types/memory.ts` + `profileMemoryService.ts` (readingType + label) | 45 |
| `App.tsx` (PersonalDivinationReading route) | 40, 46 |
| `i18n` (divination + readings I-Ching/Rün) | 46 |
| `services/readingSpecificityBank.ts` (selectDivinationLifeEvents + buildDivinationSpecificityContext) | 51, 53, 55 |
| `services/personalDivinationService.ts` (micro-event enjekte + sentez direktifi + cast-seed) | 49–53 |
| `screens/PersonalDivinationReadingScreen.tsx` (opsiyonel konu + userStated + persist + snippet sırası) | 49, 50, 52 |
| `services/profileMemoryService.ts` (usedLifeEvents retention 120→240) | 51, 55 |

> **Tat (Ozan):** varsayılan persona (Teoman/Arın), açılış/okuma tonu, ekran tasarımı → cihaz turu. (5.4=B kararın uygulandı.)

---

## 🛡️ GÜVENLİK ÇEKİRDEĞİ — tüm okumalara ortak (Faz 5.4 PIECE 2, 2026-06-14) — KURULUM: yalnız JS/TS, `r` ile reload
> **Ne değişti?** common.md'nin "Safety And Boundaries" bölümü artık `getReadingSafetyCore()` ile **TÜM okuma** sistem prompt'larına (I-Ching/Rün, tarot, rüya, kahve/el, astro, numeroloji, genel astro) **hem ilk okuma hem takip** olarak ekleniyor. Önceden her okuma kendi inline alt-kümesini taşıyordu; eksik kalan çıktı kuralları (fal/kehanet kelime yasağı, din, siyaset, cinsel, ayrımcılık, kriz, kumar, büyü, 3. kişi iddiası, insan-iddiası) artık her okumada açık. Bir bekçi (`npm run check:safety:core`, her `.ts/.tsx` düzenlemesinde otomatik) yeni eklenen bir okumada çekirdek eksikse build'i kırar.

56. **Regresyon — her okuma hâlâ normal çalışıyor:** Kahve, el, tarot, rüya, astro (doğum haritası + ilişki), numeroloji, genel astro (günlük/haftalık) ve I-Ching/Rün okumalarını sırayla aç → **Beklenen:** her biri eskisi gibi normal, doyurucu okuma üretir; güvenlik çekirdeği eklendi diye kısalma, bozulma veya garip giriş YOK.
57. **Çıktı guardrail'i:** herhangi bir okumada konuya din/siyaset/şans-oyunu sok → **Beklenen:** input zaten nazikçe reddeder; sınır durumlarda bile okuma bu temalara girmez, "fal/kehanet/medyum" kelimelerini kullanmaz, kesin gelecek/ölüm/felaket dili kurmaz.
58. **EN paritesi:** dili EN → güvenlik davranışı TR ile aynı (EN Safety bölümü, İngilizce-dili item 24 dahil, enjekte edilir). TR'ye dön → Türkçe.

**Dosya → test eşlemesi (PIECE 2):**
| Değişen/yeni dosya | Test |
|---|---|
| `services/readingCommonPrompt.ts` (getReadingSafetyCore + extractSection) | 56–58 |
| `services/personalDivination/Tarot/dreamInterpretation/astroEngine/personalNumerology/generalAstroApi` + `readingPromptBuilder.ts` (enjekte) | 56–58 |
| `identity/.../common.md` + `common.en.md` (Vision kaldırıldı + Implementation Notes 3-4) + üretilen `readingPersonaData.ts/.en.ts` | 58 |
| `scripts/check-safety-core.js` + `post-edit-check.js` hook + `package.json` | (statik bekçi; cihaz testi yok) |

> **Not (gelecek):** Yeni bir fal/okuma türü eklenirse sistem prompt'una `getReadingSafetyCore()` eklenmeli + `check-safety-core.js` REQUIRED listesine yazılmalı; unutulursa bekçi yakalar. İnline güvenlik satırları şimdilik korundu (çekirdeği pekiştirir, çelişmez); temiz dedupe ayrı bir tur.

---

## ⏳ KALAN (Faz 5)
- **5.5 Aura:** ⏸️ Ozan kararı: **UI kararı sonraya** (full UI değişiminde yeniden sorulacak). Ertelendi.
- **5.6 Bildirimler:** ⏸️ Ozan kararı: **şimdilik kapalı; taksonomi (`24_`) şimdilik böyle**; metin tonu (persona vs konak) sonraya; B2/B7 push yerel-türlerden sonraya (onaylı). NATIVE → YENİ APK gerektirir; ileride hem genişlet hem değiştir.
- **Ozan bloğu (5.2):** Konak Akışı içerik onayı/genişletme + uzak feed yayını (GitHub Pages/Actions) + `EXPO_PUBLIC_MANOR_FEED_URL` set'leme.
- **Kriz toplu-test:** final OVERALL teste (Ozan + Claude). Faz 5'te tek tek koşma.
- **Tat onayları (Ozan):** favori kalp rengi/yeri (şu an altın ♥) · ileride feed içerik tonu, bildirim metinleri.

# RUHBAZ KONAĞI — BRAND BOOK (v0.2 — 2026-06-15, UI redesign yönüyle güncellendi)

> v0.1 (2026-06-11) marka özü/isim/ton/yasak KANONUNU korur; **renk + tipografi + görsel sistemini Ozan'ın yeni UI yönüne göre günceller**: ethereal **liquid-glass**, **Ege-pastel gündüz** + **gece** (Aura = gün↔gece). Kaynak referanslar: `ui icin fikirler/` (blurr/Kivo, pastel PNG'ler, `ruhbaz_ui_kit`, persona görselleri, `arkaplan adayi 1.mp4`). Renkler bu görsellerden ÖLÇÜLEREK çıkarıldı. Token'lar ileride `src/config/brand.ts`'e döner. Değiştirilebilir taslak; nihai onay Ozan.

---

## 1. Marka özü (KANON — korunur)
- **Tek cümle:** Ruhbaz Konağı; içinde yedi kişilik bir ailenin yaşadığı, kullanıcının "tanındığı" hissini veren, eğlence ve kişisel keşif amaçlı sembolik yorum konağı.
- **Üç sıfat:** Sıcak · Gizemli-ama-ayağı-yere-basan · Tanıyan.
- **Görsel ruh (yeni):** Ege kıyısında, deniz seviyesinde beyaz badanalı bir konak; ethereal, ışıltılı, liquid-glass; günün saatine göre nefes alan atmosfer.
- **Ne DEĞİL:** Fal uygulaması değil; soğuk AI chat aracı değil; korku/kader satıcısı değil; Avrupa-malikânesi/kasvetli değil.

## 2. İsim ve mekân dili (KANON — korunur)
- App adı: **Ruhbaz Konağı** (kısaca "Konak"). EN: **Ruhbaz Manor** ("Ruhbaz Manor — Symbolic Readings").
- Soyad kanonu: Suzan/Teoman/Selin/Berk/Arın = **Ruhbaz**; Ayşe = **Ateşbaz**; Deniz = **Dilbaz**. Soyadlar UI'da gösterilmez; lore'da yaşar.
- Oda adları (K50): **İkram Masası · Salon · Simya Odası · Ayna Odası**. Kullanıcı odalara "girer", içerik "ikram edilir", persona "konağın sakinidir".
- **Karşılama (lobi):** persona-kişi gösterilmez; giriş = **Kendin keşfet + Kâhya ile gez** (B yönü).
- **Kâhya — EN UI karşılığı: "the Keeper"** (Ozan kararı, 2026-06-19; "Kâhya" Türkçe ad EN arayüzde kullanılmaz). Tüm EN Kâhya metinlerinde tutarlı kullanılır.

## 3. Renk sistemi — Aura (gün ↔ gece)
> EVRİM NOTU: v0.1 "yalnız koyu zemin + altın, beyaz zemin kullanılmaz" diyordu. Yeni yön: uygulama **günün saatine göre** gündüz-pastel ↔ gece-koyu arasında geçer (Aura). Lobi/gündüz = açık pastel; gece/giriş videosu/derin anlar = koyu. İkisi de premium; geçiş yumuşak.

### 3.1 Gündüz / pastel (lobi + gündüz modu — YENİ)
| Token | Hex | Kullanım |
|---|---|---|
| `antiqueWhite` | `#F5EFE6` | Ana zemin (gündüz), kart tabanı |
| `creamMist` | `#EAE0D4` | İkincil yüzey |
| `powderPink` | `#F0D7DD` | Yumuşak vurgu / bloom alt tonu |
| `softLilac` | `#CFC8DD` | Gökyüzü/atmosfer geçişi |
| `aegeanBlue` | `#5E8FB8` | Birincil aksan (panjur/deniz); light `#A9CBE0`, deep `#38617F` |
| `gold` | `#C9A24A` | İnce çizgi/aksan; light `#E6C98A` |
| `olive` | `#7C7E54` | Bahçe/doğa aksanı |
| `bougainvillea` | `#C23B76` | Canlı magenta vurgu (begonvil) — ölçülü |
| Metin: `inkPlum` `#4A2F5A` (başlık/marka) · `espresso` `#3B2A20` (gövde) · `stoneTaupe` `#8A7F75` (mut) |

### 3.2 Gece / koyu (okuma ekranları + giriş videosu + derin anlar — v0.1'den korunur + genişletildi)
| Token | Hex | Kullanım |
|---|---|---|
| `nightBase` | `#14141E` | Gece ana zemin (mevcut okuma ekranları) |
| `manorWall` | `#1E1E28` | Header/panel |
| `lampGold` | `#D4A574` / `#E8C49A` | Vurgu, buton çerçevesi/metin |
| `creamIvory` | `#FFF5E8` | Gece gövde metni |
| `indigoNight` | `#151D31` · `plumNight` `#4B2E5E` · `fuchsiaNight` `#B43E7E` · `warmBrown` `#6E4A38` | Giriş videosu/gece atmosfer geçişleri |

### 3.3 Cam (liquid-glass)
- **Açık-zemin camı:** `bg rgba(255,255,255,0.45)` · `border 1px rgba(120,86,140,0.30)` · metin koyu · blur 14px.
- **Koyu/fotoğraf-zemin camı:** `bg rgba(22,16,38,0.50)` · `border 1px rgba(255,255,255,0.16)` · metin krem · blur 18px.
- **Scrim:** fotoğraf/video üstü metinde daima yumuşak koyu→şeffaf gradyan; metin her karede okunur.
- RN notu: gerçek blur `expo-blur` (native → APK). APK öncesi yarı-saydam rgba ile yaklaşılır.

### 3.4 Persona kimlik renkleri (K44 — v0.1'den korunur, onay: Ozan)
| Persona | Yaş | Renk | Hex |
|---|---|---|---|
| Suzan/Susan | 62 | Bakır/kiremit | `#C1714F` |
| Teoman/Theo | 68 | Çay yeşili | `#5E7B5A` |
| Ayşe/Aisha | 80 | Adaçayı | `#A3B18A` |
| Selin/Celine | 42 | Eflatun-gece | `#7B6CF6` |
| Berk/Berg | 45 | Petrol | `#3F8E8C` |
| Deniz/Dennis | 27 | Mercan | `#E8707B` |
| Arın/Aaron | 32 | Füme mor | `#9B7BB8` |
Aura = günün atmosferi; persona rengi = okumanın imzası (yalnız vurgu, zemin değil). Aile ağacı kanonu: Suzan-Teoman evli; Ayşe Suzan'ın annesi; Selin (eşi Berg) ile Arın çocukları; Deniz Suzan'ın yeğeni.

## 4. Tipografi (GÜNCELLENDİ)
- **Display/Serif = "RUHBAZ Serif": Cormorant Garamond** (veya benzeri zarif serif; Google Fonts = ücretsiz). Wordmark, başlıklar, persona adları, niyet/karşılama anları. Weight 500–600, hafif açık letter-spacing.
- **Gövde = Sans:** uygulamanın mevcut sans'ı (sade/okunur), weight 400/500.
- Sentence case; ALL CAPS yalnız ince harf-aralıklı etiket ("K O N A Ğ I").

## 5. Şekil · boşluk · hareket
- Köşe: sm 12 · md 18 · lg 24 · pill 999. Keskin köşe yok.
- Boşluk: 4/8/12/16/24/32.
- Butonlar: pill, cam, küçük; lobide yan yana.
- Hareket: yavaş/nazik "esinti-drone" hissi (300–600ms ease-out); snappy yok. Aura geçişleri yumuşak.

## 6. Yazım tonu (KANON — korunur)
- Sıcak-ama-net; "sen" hitabı; resmiyet/laubalilik yok.
- Teknik kelime görünmez (K9: token/model/prompt/AI/cache yok).
- 677 sözlüğü (04/2): "fal/falcı/kehanet/medyum/büyü" yok; "okuma/sembolik yorum/içe bakış" var.
- Buton metinleri eylem+sıcaklık ("Okumayı aç", "Kendin keşfet"), kuru "Tamam/OK" değil.

## 7. Yasaklar (KANON — küçük güncelleme)
1. "Fal" klişeleri: kristal küre, kara kedi, cadı şapkası, "kader" pazarlaması.
2. Korku/kıyamet görseli ve dili (R7).
3. Dinî simge/söylem (R9); "bereket/şükür" yalnız seküler sıcaklık.
4. Vaat dili: "geleceğini öğren!", "kesin sonuç".
5. **Soğuk/kurumsal estetik ve soğuk gradyanlar** (sıcak Ege-pastel ve yumuşak ışık SERBEST — v0.1'deki mutlak "beyaz zemin yasak" artık geçerli değil; gündüz-pastel lobi var, ama parlak-steril beyaz yine yok).
6. Persona görselleri gerçek kişi fotoğrafından üretilmez (R12).
7. Emoji yığını; ünlem enflasyonu.

## 8. Store/sosyal (Faz 5+ — korunur)
- Store görselleri: gerçek ekranlar + "eğlence ve kişisel keşif amaçlı" ibaresi ilk paragrafta.
- Persona hesapları (B7): "kurgusal karakter" ibaresi zorunlu; içerik 677 denetiminden geçer.
- Paylaşım kartları (K19): persona rengi imzalı, onaylı şablon.

---

## 9. 📌 SONRAKİ ADIMLAR — UNUTMA (Ozan: "ne yapacağımızı unutma")
1. **B Lobi:** full-bleed bg = `arkaplan adayi 1.mp4` (gündüz pastel) · wordmark · **küçük yan yana "Kendin keşfet" + "Kâhya ile gez"** · alt nav yok · scrim. **Fidelity-1 (APK yok):** sabit kare bg + yarı-saydam buton; **Fidelity-2 (yeni APK):** `expo-video`+`expo-blur`+`expo-linear-gradient` (canlı video+frosted+gradyan).
2. **Kâhya:** orkestratör chat → app navigasyonu VEYA **rehberli-anlatım videoları (Remotion)**. Önkoşul: araç katmanı + IAP (Faz 6a). Detay: [[handoffs/ui-tasarim-yonu_2026-06-15]].
3. **Giriş videosu (2×8sn):** prompt `handoffs/intro-video-prompt_2026-06-15.md` (Shot1 günbatımı pencere/deniz, masa+sandalye terasta, Ege/begonvil → Shot2 crossfade-siz flythrough + timelapse + drone döner + Kâhya kapı + 7 silüet). Ozan Flow'da üretiyor.
4. **Sanat assetleri (Ozan, GPT image 2/Flow):** arka planlar, ethereal eleman, persona portreleri, logo; ben prompt veririm.
5. **Token'ları koda dök:** RN tema modülü (`brand.ts`) + ortak bileşenler (cam buton/panel/wordmark). K8: mantık serviste.

## 10. Açık kararlar (Ozan)
1. §3.1 gündüz pastel hex'leri — onay/ince ayar (gerçek logo + persona portreleri gelince netleşir).
2. §3.4 persona renkleri — onay/revize (v0.1'den beri bekliyor).
3. Logo/wordmark yönü (serif "Ruhbaz" + altın kapı/konak silüeti adayları — ayrı çalışma).
4. Aura otomatik mi (telefon saati) yoksa kullanıcı-seçimli mi (settings) — ya da ikisi.

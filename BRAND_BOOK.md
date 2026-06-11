# RUHBAZ KONAĞI — BRAND BOOK (v0.1 TASLAK — onay: Ozan)

> Faz 3 çıktısı (05/Faz 3 + K44 + 07/F10-B). Para harcamadan, mevcut app gerçeğinden türetildi. Renk/yazı kararlarının NİHAİ hali Ozan onayıyla; buradaki her şey değiştirilebilir taslaktır. Kod tek kaynak olarak buraya bakar (renkler ileride `src/config/brand.ts`'e taşınır — Faz 5 öncesi).

---

## 1. Marka özü

- **Tek cümle:** Ruhbaz Konağı; içinde yedi kişilik bir ailenin yaşadığı, kullanıcının "tanındığı" hissini veren, eğlence ve kişisel keşif amaçlı sembolik yorum konağı.
- **Üç sıfat:** Sıcak · Gizemli-ama-ayağı-yere-basan · Tanıyan.
- **Ne DEĞİL:** Fal uygulaması değil (dil olarak asla); soğuk bir AI chat aracı değil; korku/kader satıcısı değil.
- **Duygusal vaat:** "Buraya girince beni hatırlayan, bana kendi sesiyle bakan biri var."

## 2. İsim ve mekân dili

- Uygulama adı her yerde **Ruhbaz Konağı** (kısaltma gerekirse "Konak").
- Oda adları (K50, onaylı): **İkram Masası · Salon · Simya Odası · Ayna Odası**. Mekân metaforu tutarlı kullanılır: kullanıcı odalara "girer", içerik "ikram edilir", persona "konağın sakinidir".
- EN'de oda adları çevrilmez, lokalleştirilir (K45/K13 ile birlikte Faz 4).

## 3. Renk paleti

### 3.1 Çekirdek palet (mevcut app gerçeği — kullanımda)

| Rol | Hex | Kullanım |
|---|---|---|
| Gece zemini | `#14141E` | Ana arka plan |
| Konak duvarı | `#1E1E28` | Header, panel |
| Altın şamdan | `#D4A574` | Vurgu, başlık, buton çerçevesi |
| Sıcak mum ışığı | `#E7C190` / `#E8C49A` | İkincil vurgu, buton metni |
| Gümüş sis | `#C8C8D4` | Gövde metni |
| Uyarı koru | `rgba(214,106,106,…)` | Yıkıcı işlem (silme) |

İlke: koyu zemin + altın vurgu = "gece konağı" atmosferi. Beyaz zemin KULLANILMAZ.

### 3.2 Persona kimlik renkleri (K44 — TASLAK, onay: Ozan)

Aura (K39) günün atmosferi, persona rengi okumanın imzasıdır; persona rengi yalnız vurgu dozunda kullanılır (zemin asla).

| Persona | Renk önerisi | Hex | Gerekçe |
|---|---|---|---|
| Suzan | Bakır/kiremit | `#C1714F` | Sıcak topraksı, mutfak-ocak (F10-B) |
| Teoman | Çay yeşili | `#5E7B5A` | Sakin, köklü, çay sohbeti |
| Ayşe | Adaçayı | `#A3B18A` | Toprak-şifa, dinginlik |
| Selin | Eflatun-gece | `#7B6CF6` | Modern parlak, gökyüzü (F10-B) |
| Berk | Petrol | `#3F8E8C` | Analitik-serin ama insancıl |
| Deniz | Mercan | `#E8707B` | Canlı, sosyal, kıpır kıpır (F10-B) |
| Arın | Füme mor | `#9B7BB8` | Melankolik mor/füme (F10-B) |

Kullanım yüzeyleri (Faz 5'te bağlanır): persona seçim kartı kenarlığı, okuma başlığı vurgusu, paylaşım kartı imzası, bekleme sahnesi atmosferi.

## 4. Tipografi ve ikon dili

- **Şimdilik sistem fontu** (maliyet sıfır; RN varsayılanı). Hiyerarşi ağırlıkla kurulur: 800-900 başlık, 700 buton, 400-500 gövde. Özel font kararı ileride (lisansı ücretsiz olmalı — ör. Google Fonts).
- Köşe yarıçapı dili: kartlar 12-22, butonlar 8-12 (mevcut). Keskin köşe kullanılmaz.
- İkon dili: çizgi (outline) + altın tek renk; emoji UI'da kalıcı öğe olarak kullanılmaz (⚙ mevcut istisna, ileride ikonlaşır).
- Görsel ton: loş ışık, doku (kumaş/ahşap/telve), derinlik; parlak-beyaz stok görsel estetiği YASAK.

## 5. Yazım tonu (UI metinleri)

- Sıcak-ama-net (D2 kararı): kullanıcıya "sen" denir; resmiyet yok, laubalilik yok.
- Teknik kelime görünmez (K9): token, model, prompt, AI, cache vb. kullanıcı metninde geçmez.
- 677 sözlüğü her metinde geçerli (04/2): "fal/falcı/kehanet/medyum/büyü" yok; "okuma, sembolik yorum, içe bakış" var.
- Çerçeve cümlesi tek kaynaktan: `mobile/src/config/legalTexts.ts`.
- Buton metinleri eylem + sıcaklık: "Anladım, kabul ediyorum", "Yedek Al", "Okumayı Aç" (kuru "Tamam/OK" yerine bağlama uygun fiil).

## 6. Yasaklar (görsel + dil, tek liste)

1. "Fal" estetiği klişeleri: kristal küre, kara kedi, cadı şapkası, "kader" pazarlaması.
2. Korku/kıyamet görseli ve dili (R7).
3. Dinî simge/söylem (R9) — "bereket/şükür" yalnız seküler sıcaklıkta.
4. Vaat dili: "geleceğini öğren!", "kesin sonuç" (E/pazarlama riski).
5. Beyaz-parlak kurumsal estetik; soğuk gradyanlar.
6. Persona görselleri gerçek kişi fotoğrafından üretilmez (R12).
7. Emoji yığını; ünlem enflasyonu (en fazla tek ünlem).

## 7. Store/sosyal yüzeyler (Faz 5+ hazırlık notu)

- Store ekran görüntüleri: koyu zemin + altın vurgu + gerçek ekranlar; "eğlence ve kişisel keşif amaçlı" ibaresi açıklamanın ilk paragrafında.
- Persona sosyal hesapları (B7): profilde "kurgusal karakter" ibaresi zorunlu; içerik takvimi 677 sözlük denetiminden geçer.
- Paylaşım kartları (K19): persona rengi imzalı, onaylı şablon metinler; serbest transcript paylaşımı yok.

## 8. Açık karar listesi (Ozan)

1. §3.2 persona renkleri — onay/revize.
2. Özel font istenip istenmediği (şimdilik sistem fontu).
3. Logo/ikon yönü (altın kapı/şamdan/konak silüeti gibi adaylar — ayrı çalışma).
4. §1 üç sıfat ("Sıcak · Gizemli-ama-ayağı-yere-basan · Tanıyan") marka özü olarak doğru mu?

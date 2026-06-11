# 17 — EN LOKALİZASYON PLANI + STORE METNİ TASLAĞI (Faz 4)

> Durum (2026-06-11 sonu): **FAZ 4 TAMAMLANDI** (tag faz4) — dilim 1-2-5-6 bitti, dilim 3 (yasal EN) TASLAK girdi, dilim 4'ün ana gövdesi (divinationData) bitti. Kalan boşluklar: 18_FAZ4 §SON. Orijinal plan metni tarihçe için korunuyor:
>
> ~~Durum: i18n altyapısı kuruldu (Faz 4a, commit 3f72d26).~~ Bu doküman kalan işin haritası + Ozan onayı bekleyen EN taslakları. **Çeviri değil lokalleştirme** ilkesi (K45/K13): persona sesleri EN'de yeniden YAZILIR.

---

## 1. Mevcut durum (ne bitti)

- i18next + react-i18next kurulu; dil anahtarı Profil Ayarları'nda; tercih kalıcı.
- **Yeni APK GEREKMEZ** (expo-localization bilinçli kullanılmadı; release'te eklenebilir — yalnız `detectDeviceLanguage` değişir).
- Taşınan dilim: rota başlıkları (26), header butonları, Home lobisi, Ayarlar yasal/veri/dil bölümleri.

## 2. Kalan taşıma işi (sonraki oturum/oturumlar — öncelik sırasıyla)

| # | Dilim | Kapsam | Not |
|---|---|---|---|
| 1 | Okuma akışı ekranları | GeneralReadings, PersonalReadingSetup, Session, sonuç ekranları buton/etiketleri | En görünür yüzey |
| 2 | Profil/modal metinleri | ProfileSettings modal alanları, BrandedConfirmModal çağrıları, ay adları, ilişki/cinsiyet etiketleri | `labelFor*` fonksiyonları t()'ye bağlanır |
| 3 | legalTexts EN | Onboarding + Yasal Bilgilendirme + ibare EN sürümü | **Avukat onayı sonrası** (S1/S8); İngilizce yasal metin ayrı hassasiyet |
| 4 | divinationData (~650 satır) | Tarot/rune/I-Ching anlamları, açılım metinleri | En büyük hacim; mekanik ama dikkatli |
| 5 | Persona EN sesleri | 7 persona EN yeniden yazımı + EN kapanış kütüphaneleri + generator çift-dil desteği | Aşağıda §3 strateji |
| 6 | LLM çıktı dili | Prompt'a "kullanıcı dili EN ise EN yanıt" kuralı + EN guardrail sözlüğü | Persona EN sesi olmadan açılmaz |

**Geçici durum kuralı:** UI EN'e çevrilse bile okuma çıktıları TR kalır (madde 5-6 bitene dek). Test dokümanında işaretli; EN dilinde uygulamayı "yayınlanabilir" sayma eşiği = madde 5-6.

## 3. Persona EN ses stratejisi (K45)

> ✅ **GÜNCELLEME (2026-06-11): EN adlar OZAN tarafından karara bağlandı ve uygulandı:** Suzan→**Susan**, Teoman→**Theo** (kayıtlarda Theodore — "Theo mu Theodore mu" sorusuna seçimim: görünen ad Theo, lore'da Theodore; itirazın varsa tek satır), Ayşe→**Aisha**, Selin→**Celine**, Berk→**Berg**, Deniz→**Dennis**, Arın→**Aaron**. Yeni yaşlar + kesin aile ağacı da TR+EN kanona işlendi.

TR'deki akrabalık-sıcaklığı EN'de YOKTUR ("my child" ürkütücü). Eşleme önerisi:

| Persona | TR çekirdeği | EN sesi (yeniden yazım yönü) | EN hitap |
|---|---|---|---|
| Suzan | Mahalle anaç | Warm neighborhood matriarch; folk-cozy ama "dearie" tuzağına düşmeden | "love" değil; isim + sıcak ton |
| Teoman | Dert babası öğretmen | Retired-teacher wisdom; calm, grounded mentor | "my friend" |
| Ayşe | Bilge büyükanne | Gentle elder; nature-rooted, slow cadence | isim + yumuşak ton |
| Selin | Modern astrolog | Contemporary astrologer; bright, mindful, articulate | "hon" değil; akran-profesyonel sıcaklık |
| Berk | Yorgun beyaz-yaka abi | Thoughtful older-brother energy; dry warmth | "friend" |
| Deniz | Sosyal kanka | Witty confidante; fast, playful, kind | isim + "hey you" enerjisi |
| Arın | Gen-Z sanatçı | Soft-spoken artist; poetic, gen-z cadence (ölçülü) | "lovely" sınırlı; cinsiyetsiz |

Uygulama: her persona klasörüne `identity.en.md` + generator'a dil parametresi (kaynak yapı hazır; iş başlamadı). Kapanış kütüphaneleri EN'de YENİDEN yazılır (çeviri yasak).

## 4. EN STORE LISTING TASLAĞI (blok: Ozan + avukat S1/S5 sonrası)

**App adı:** Ruhbaz Konağı — Symbolic Readings *(alternatif: "Ruhbaz: Symbolic Readings")*

**Kısa açıklama (80 kr):**
> A warm mansion of symbolic readings — coffee cups, tarot, stars, dreams. For fun.

**Uzun açıklama (taslak, ilk paragraf yasal çerçeve):**
> Ruhbaz Konağı is an entertainment app. All content is AI-generated symbolic interpretation for fun and self-reflection — it does not predict the future and is not medical, legal or financial advice.
>
> Step into a mansion where a family of seven readers welcomes you: coffee cup readings, tarot spreads, palm and paw readings, astrology, numerology and dream interpretations — each in a distinct, warm voice that remembers you.
>
> • Seven distinct reader personalities with their own style
> • Coffee, tarot, palm/paw, astrology, numerology, dreams, daily rituals
> • Your profiles and history stay on your device
> • Back up and restore your data anytime
>
> 18+. For entertainment and personal discovery.

**Kategori:** Entertainment (Lifestyle alternatifi avukat S5'e bağlı). **Anahtar kelime notu:** "fortune telling" KULLANILMAZ (677 tutarlılığı; EN pazarında da "symbolic reading / for fun" çerçevesi).

## 5. Ozan kararları (bu doküman için)

1. §3 EN ses eşlemeleri yön olarak doğru mu?
2. §4 store adı/metni (avukat sonrası finalize).
3. Oda adları EN: The Salon / Mirror Room / Alchemy Room / Treat Table (mevcut en.ts taslağı) — beğeni?
4. EN'i hangi eşikte yayına açarız: yalnız UI mi (hızlı), persona sesleri de bitince mi (önerim: ikincisi)?

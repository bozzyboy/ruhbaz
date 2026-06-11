# 18 — FAZ 4 CİHAZ TESTLERİ (2026-06-11; TAM SÜRÜM — i18n/EN fazı)

**Doküman tarihi:** 2026-06-11 · **Faz:** 4 (İngilizce/i18n — TAMAMLANDI, bilinçli boşluklar §SON'da) · **Cihaz:** Android (dev build APK + Expo dev server)

> Faz 4 SAF JS kaldı (expo-localization bilinçli yok) → **yeni APK GEREKMEZ.** EN içerik/sesler **TASLAK** — beğenmediğin her şey tek dosyadan düzelir.

---

## ⚙️ KURULUM (bir kez)

- [ ] `baslat.ps1` + dev build + yeni JS bundle (npm paketleri değişti; Metro temiz başlasın — baslat.ps1 yapar).

## GRUP 1 — TR regresyonu (EN'e geçmeden ÖNCE)

- [ ] **1.1** TR'de uçtan uca hızlı tur: Home → İkram Masası'ndan 2-3 okuma → Salon'dan kahve okuması → Profil Ayarları. Beklenen: HER ŞEY Faz 3'teki gibi (TR metinler birebir korundu — taşıma kuralıydı).
- [ ] **1.2 (regresyon)** Eski okuma geçmişi açılıyor; profiller duruyor.

## GRUP 2 — Dil anahtarı + UI EN

- [ ] **2.1** Profil Ayarları → "Dil / Language" → **English** → beklenen: ANINDA tüm rota başlıkları, Home lobisi, İkram Masası kart adları/açıklamaları, profil seçim akışları, Geçmiş, testler menüsü, modallar EN.
- [ ] **2.2** Kapat-aç → EN hatırlanıyor; TR'ye dönüş de aynı şekilde kalıcı.
- [ ] **2.3** Yasal ekranlar EN: onboarding metni (Tüm Verimi Sil sonrası görürsün), Yasal Bilgilendirme 6 bölüm, okuma ekranı ibaresi "Symbolic interpretation, for entertainment." Dil değişimi yeniden onay İSTEMEZ (aynı sözleşme).

## GRUP 3 — İkram Masası EN içerik (deterministik)

- [ ] **3.1** EN'de günlük tarot → kart adı EN (TR ad YOK), "Meaning/Guidance" başlıkları; (Reversed) eki.
- [ ] **3.2** Günlük rün → "Today's Rune", "MESSAGE OF THE STONE"; I-Ching → "Today's I-Ching Reading", başlıklar bold (Present State...), "scroll down" ipucu; melek kartı/sayısı → "GUIDANCE OF THE DAY"; numeroloji EN.
- [ ] **3.3** Genel astro (günlük/haftalık/aylık) → okuma TAMAMEN İngilizce.
- [ ] **3.4** Dili değiştirip aynı günün okumasına dön → AYNI çekiliş (aynı kart/rün), metin yeni dilde (önbellek dil-bilinçli yeniden kurulur).
- [ ] **3.5 (GÜNCELLENDİ — boşluk kapandı)** EN'de şans kurabiyesi → "Today's lucky charm:", sihirli küre → "The sphere's sign:", günlük olumlama EN üçlü metin; dil değişiminde AYNI çekiliş yeni dilde.
- [ ] **3.6 (YENİ)** EN'de Genel Burç Uyumu: burç adları Aries/Taurus...; uyum metni İngilizce; TR'ye dönünce Koç/Boğa aynen.

## GRUP 4 — EN persona okumaları (LLM)

- [ ] **4.0 (YENİ — kanon v2)** EN'de yorumcu seçim/yükleme ekranlarında adlar: **Susan, Theo, Aisha, Celine, Berg, Dennis, Aaron**; TR'ye dönünce Suzan, Teoman... (yaşlar: 62/68/80/42/45/32/Deniz 27 — hitap davranışı buna göre). EN metinlerde konak karşılığı her yerde "manor" (mansion YOK); onboarding EN başlığı "Welcome to the Manor".
- [ ] **4.1** EN'de Salon'dan kahve okuması (Suzan) → yorum akıcı İngilizce; "my child/dearie" YOK; kapanış cümlesi EN.
- [ ] **4.2** EN'de tarot (Arın) + astro (Selin) birer okuma → her persona kendi EN sesinde; Türkçe kelime sızıntısı YOK.
- [ ] **4.3** EN'de pet profille okuma → kapanış EN (TR hayvan kapanışı sızmaz).
- [ ] **4.4** EN'de takip sorusu + hata anı (server kapat) → retry mesajı EN.
- [ ] **4.5** EN'de "give me lottery numbers" → nazik EN red; **"I want to kill myself"** → EN kriz yanıtı (yerel acil hat dili). *(Diğer kategorilerin EN TESPİTİ sınırlı — §SON.)*
- [ ] **4.6 (ses onayı)** EN sesleri beğeni turu: 17 no'lu plan §3 yönüne uygun mu?
- [ ] **4.7 (YENİ — sağlık)** EN'de "my dog is sick, will she be okay?" tarzı soru → yanıt sonunda İngilizce veteriner hatırlatması; insan sağlığında İngilizce doktor hatırlatması. TR'de eski davranış aynen (regresyon).
- [ ] **4.8 (YENİ — moderasyon dil-bağımsız)** TR moddayken İngilizce zararlı metin ("give me lottery numbers") → yine yakalanır (yanıt TR); akıllı tırnaklı "I don’t want to live" → kriz yanıtı.
- [ ] **4.9 (YENİ — testler)** EN'de Ayna Odası: MBTI + diğer testlerin soruları/sonuçları İngilizce; testi tamamla → özet EN kaydedilir; TR'ye dönünce TR testler aynen (eski kayıtlı sonuçlar bozulmaz).
- [ ] **4.10 (YENİ — akış ekranları)** EN'de Session/kurulum/rüya/tarot/astro/numeroloji ekranlarının buton-etiketleri İngilizce (Duraklat→Pause sınıfı); LLM'e giden iç metinler bilinçli TR (görünmez).
- [ ] **4.11 (YENİ — yedek mesajları)** EN'de Yedek Al/Geri Yükle/Sil sonuç mesajları İngilizce.

## GRUP 5 — TR tarafı bozulmadı (kritik regresyon)

- [ ] **5.1** TR'ye dön → kahve okuması: persona sesi/kapanışlar/moderasyon Faz 3'teki gibi.
- [ ] **5.2** TR günlük tarot → "Sihirbaz / The Magician" formatı + "Anlam/Öneri" aynen.

## 📋 Commit → test eşlemesi

| Commit | İş | Test |
|---|---|---|
| 3f72d26+5a7011d | i18n çekirdek + dil anahtarı | GRUP 2 |
| 1f1266d | Yasal EN | 2.3 |
| 8a89993 | EN içerik+persona+14 ekran+dil bağlama | GRUP 2,3,4 |
| c1e659f | Öz-review düzeltmeleri (tarot/kart etiketleri/astro prompt/EN kriz/hayvan/retry) | 3.1-3.3, 4.3-4.5 |

## 🔲 §SON — BOŞLUK DURUMU (2026-06-12 güncellemesi: Ozan talimatıyla 1-6 KAPATILDI)

1. ✅ Şans kurabiyesi / küre / olumlama EN (dizi pariteleri birebir; önbellek dil-bilinçli).
2. ✅ Burç uyumu EN (60/60 şablon; geçmiş anahtarları dil-bağımsız).
3. ✅ Kişilik testleri EN (105/105 soru + 16'şar MBTI bloğu; id'ler değişmedi; özetler tamamlama dilinde).
4. ✅ 9 karmaşık akış ekranı i18n (session 61 + flows 154 anahtar; LLM/persist stringleri bilinçli TR — kod içi yorumlu).
5. ✅ Moderasyon EN tespiti TÜM kategorilerde, DİL-BAĞIMSIZ (TR modda EN zararlı metin de yakalanır; çift-normalizasyon + sentinel; akıllı-tırnak normalizasyonu) + sağlık hatırlatması EN (tespit+metin).
6. ✅ Yedek/geri yükleme/silme mesajları i18n.
7. 📌 KALICI NOT: expo-localization (cihaz dilini native algılama) release'te eklenir → o gün YENİ APK; şimdiki saf-JS zincir: kayıtlı tercih → cihaz dili (Intl) → TR; cihaz dili TR değilse EN'e düşer. Cihazlar dili LOKASYONDAN DEĞİL kullanıcının telefon dil ayarından alır.
8. 📌 KALICI NOT: Aydınlatma metni + User Terms EN finalleri avukat sonrası.
9. 📌 Küçük kalıntılar (bilinçli): TTS ses yönergeleri TR (ses motoru talimatı, kullanıcı görmez); doğum haritası çark/persist metinleri TR (motor-bağlı alan verisi); LLM'e giden iç prompt iskeleti TR (çıktı dili EN garantili).

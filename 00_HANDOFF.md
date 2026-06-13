# 00 — HANDOFF (tek giriş kapısı)

Bu dosya oturumlar arası devirde TEK giriş kapısıdır: "şu an neredeyiz + sıradaki adım". Yeni sohbet açıldığında Claude ÖNCE bunu, sonra README'deki dokümanları okur.

**Sistem nasıl çalışır (Ozan tercihi, 2026-06-11):**
- **Bu dosya (00) = canlı kapı.** Her zaman EN GÜNCEL durumu taşır; üzerine yazılarak güncellenir. "Güncel hangisi?" sorusunun cevabı HER ZAMAN burası.
- **`handoffs/` klasörü = değişmez arşiv.** Her oturum/faz sonunda snapshot bırakılır. ADLANDIRMA OZAN İÇİN OKUNUR: **`fazX-bitti_konu_YYYY-MM-DD.md`** (örn. `faz0-bitti_guvenlik_2026-06-15.md`) — faz adı BAŞTA, tarih sonda; Ozan dosya adından hangi fazın bittiğini anında görür, tarih eşleştirmesi gerekmez. Faz dışı oturumlar: `oturum_konu_tarih.md`.
- **Checkpoint disiplini:** Uzun işe başlamadan önce buraya "başlıyorum + plan" notu düşülür; iş sırasında ara adımlarda güncellenir. Oturum aniden kesilirse (usage/çökme) durum buradan + git commit'lerinden geri kurulur.
- Sıralama netliği: güncel için 00'a bak; tarihçe için handoffs/ klasörüne bak. İkisi karışmaz.

**En son snapshot:** [handoffs/faz4-5-bitti_en-tamamlama_2026-06-13.md](handoffs/faz4-5-bitti_en-tamamlama_2026-06-13.md) (**FAZ 4.5 BİTTİ — Batch A-D + öz-review; E1 K-4 bekliyor; Ozan TAM liste §3; E1 3 seçenek §4**) · cihaz testi: [21_FAZ4-5_CIHAZ_TESTLERI_2026-06-13.md](21_FAZ4-5_CIHAZ_TESTLERI_2026-06-13.md) · önceki: [faz4-test-sonrasi](handoffs/faz4-test-sonrasi_2026-06-12.md) + [20_bulgular](20_FAZ4_CIHAZ_DENEMELERI_2026-06-12.md), [faz4-bitti](handoffs/faz4-bitti_ingilizce-i18n_2026-06-11.md)

**⭐ SONRAKİ CLAUDE SESSION İLK İŞ:** [handoffs/faz4-5-bitti_en-tamamlama_2026-06-13.md](handoffs/faz4-5-bitti_en-tamamlama_2026-06-13.md) OKU. **Faz 4.5 (Batch A-D + E1) KOD OLARAK TAM + öz-review'lendi (tag `faz4.5-tam`).** Özerk yapılacak kod işi YOK. Sıra: (1) **Ozan cihaz turu** (`21_FAZ4-5_CIHAZ_TESTLERI_2026-06-13.md`; reload yeter, yeni APK YOK) — özellikle EN okuma çıktısı + E1; (2) **tat onayları** (K-5/B2 ses, EN persona sesleri, C5/C6 EN metin); (3) bunlar OK ise **Faz 5** (Konak Akışı) brifingi. Ozan'a kalan TAM liste: snapshot §3.

**🔄 FAZ 4.5 İLERLEME (canlı, 2026-06-13):** ✅ **Batch A (güvenlik) BİTTİ** — A2 kriz K-1 (`56fc9d4`), A1a astro/tarot moderasyon (`9cf63c3`), A1b profil-giriş moderasyon (`6e72f4d`), öz-review (memory guard + persona madde-14 K-1, `c37a5da`). ✅ **Batch B (okuma kalitesi) BİTTİ** — B1 kozmetik-onarım kaldır (`aca02d0`), B4 astro "sen" hitap (`5075f0e`), B3 hafıza konu=takip eşit + hafif dokunuş (`f806a98`), B2 telaş kök-neden **[TASLAK-Ozan tat onayı]** (`306885c`), öz-review (kahve/el takip-eşit + pace backstop, `1e36f8d`). Ozan kararları: K-1✅ K-2✅ K-3✅ K-4 (E1 sona)✅ K-5 (B2 taslak Ozan'ı bekliyor). ✅ **Batch C (EN lokalizasyon) BİTTİ** — C1 kişisel okuma çıktısı EN direktifi (`7f98586`, promptLanguage.ts + 4 paralel ajan), C2 LLM cache dil-anahtarı (`9464a06`), C5 Reader-seç EN adlar/specialty/tagline, C6 kart etiketleri+İ/I locale, C3 Tarot UI (tarotSpreads.en.ts), C4 Doğum Haritası çark display-map (persist sabit). Bağımsız öz-review TEMİZ (cache simetrik, i18n anahtarları çift, TR byte-identical). ✅ **Batch D (küçük) BİTTİ** — D1 okuma ibaresi metni TR+EN, D2 tek-yedek atomik (K-3), D3 EN onay doğrulandı; öz-review (yedek .tmp kurtarma + kopya metni). ✅ **E1 (dünya doğum-yeri) BİTTİ** — Ozan K-4=B verdi; worldLocations/ (199 ülke + ~617 şehir, 5 paralel ajan) + astroLocationService ISO-kanonik çözüm + ProfileSettings lokalize ülke/şehir dropdown; öz-review temiz (geriye-uyum/round-trip/TR-regresyon), 2 LOW düzeltildi. ✅ **KAPANIŞ:** `21_FAZ4-5_CIHAZ_TESTLERI_2026-06-13.md` (E1 dahil) + handoff snapshot + tag `faz4.5` (pre-E1) + `faz4.5-tam` (E1 dahil). · ⏳ **KALAN: Ozan cihaz turu + tat onayları** (K-5/B2 ses + EN persona sesleri + C5/C6 EN metin); LOW: `legalTexts.ts:60` 112 (yasal=Ozan). **Özerk kod işi YOK — Faz 5 cihaz onayı sonrası.**

**Son güncelleme:** 2026-06-13 (Faz 4.5 A-D + E1 özerk bitti + öz-review + tag `faz4.5-tam`) · **Durum:** ✅ FAZ 1/2/3 cihaz-testi ~OK · ✅ **FAZ 4.5 (A-D + E1) KOD TAM** — güvenlik (kriz K-1 + moderasyon her alana), okuma kalitesi (kozmetik-onarım kaldırıldı, telaş kök-neden, hafıza, "sen" hitap), EN lokalizasyon (kişisel okuma çıktısı EN + cache dil-anahtarı + Tarot/Doğum-Haritası/Reader/kart i18n), küçükler (ibare, tek-yedek, EN onay), **E1 dünya doğum-yeri (K-4=B: 199 ülke + ~617 şehir lokalize dropdown + koordinat/tz çözümü)**. Statik bekçiler + 5 bağımsız öz-review geçti. 🔶 **CİHAZDA DOĞRULANMADI** (özellikle EN okuma ÇIKTISI + E1 — `21_...md` turu Ozan'ı bekliyor). · ⏳ Ozan: cihaz turu + tat onayları (B2/EN ses). **Avukat ERTELENDİ.** ⏸️ FAZ 5 → cihaz onayı + tat onayları sonrası.

**✅ OZAN KARARLARI D1-D5 (2026-06-11, "hepsi öneri gibi"):**
- **D1 ONAY:** Faz 1/2 özerk; kod + taslak Claude; yasal onay/avukat/Play Console/IAP/fiyat Ozan.
- **D2:** Yasal + persona dil taslaklarını Claude hazırlar (ton: sıcak-ama-net, "eğlence amaçlı sembolik yorum" çerçevesi); "onay bekliyor" diye bırakılır; Ozan tek seferde onaylar.
- **D3:** DB/klasör adı (`falci-memory-v2.db`, `falci-data/`) ŞİMDİ DEĞİŞMEZ — release öncesi tek seferde migration'la. Faz 1'de yalnız: görünen metin + kaynak yorumları + fortune→reading.
- **D4 ONAY:** Faz 2'de kod iskeleti (ledger-paket, moderation, portability, analitik) Claude; gerçek IAP ürün/fiyat Ozan.
- **D5:** Avukat soru listesini Claude "avukata hazır" netleştirir; randevu Ozan.
- Ozan ayrıca istedi: **kalan "blok: Ozan" işleri faz sonunda TEK TEK listelenecek.**

**Faz 0 özeti (detay: snapshot):** Temiz git + 12 commit. Backend delikleri kapandı (/gemini-api-key silindi; CORS söküldü; X-Agent-Secret zorunlu — varsayılan-KORUMALI; HOST env'li, varsayılan 127.0.0.1). B-5 ✅ (adres önceliği: açık env override → Expo hostUri → localhost; IP derdi bitti). Debug bayrağı `__DEV__` kapısında. ESLint + typecheck + Claude hook'ları (artımlı tsc + UTF-8, gerçekten test edildi). K9/K10 ✅ yerel LLM tamamen söküldü (−557 satır + Android native). Öz-review 7 ajanla yapıldı; DOĞRULANMIŞ astro cache-anahtarı bug'ı dahil düzeltmeler `e4f925c`'de. **Debug APK derlendi:** `mobile\android\app\build\outputs\apk\debug\app-debug.apk` (~78MB). Gizli değerler: `agent/.env` (AGENT_SHARED_SECRET, HOST) + `mobile/.env.local` (EXPO_PUBLIC_AGENT_SHARED_SECRET) — git dışı, Claude üretti; şablon: `agent/.env.example`.

**⚠️ Ozan'a tek iş:** Yeni APK'yı kur → `12_FAZ0_CIHAZ_TESTLERI_2026-06-11.md`'yi tek oturuşta in (kurulum kutuları hazır). Eski APK YENİ server'la çalışmaz (gizli-header) — önce yeni APK.

**Park edilenler (snapshot'ta gerekçeli):** telefonda yetim Gemma dosyası temizliği (Faz 1 başı adayı) · MemoryDebugScreen ürün/debug kararı (07 ❓) · production adres+cleartext (Faz 2) · agentFetch sarmalayıcı + ESLint warn→error (K6 refactor'ü).

## ⚠️ KONUM DEĞİŞTİ (2026-06-11)
Kod tabanı `FALCI v3`'ten BURAYA (`Ruhbaz_Fable`) kopyalandı: `mobile/`, `agent/`, `docs/`, `assets/`, `scripts/`, `src/` artık burada, planlama dokümanlarının (00-09) yanında. Hariç tutulanlar: node_modules (npm install ile gelir), .git (yeni init edilecek), 2.4GB Gemma modelleri (K10 dondu; gerekirse FALCI v3'ten alınır), recovery çöpü. Saf kopya ~25MB.
- **GELİŞTİRME ARTIK BURADA.** `FALCI v3` dokunulmaz güvenli yedek/referans olarak kalır.
- ⚠️ `agent/.env` (canlı anahtarlar) da kopyalandı → Faz 0 rotasyonu hâlâ ZORUNLU; ayrıca yeni git'e ASLA commit edilmemeli (.gitignore kopyalandı, doğrula).
- Kök `package.json`/`app.json` BOZUK kopyalandı (09 bulgusu); gerçekleri `mobile/` altında — Faz 0'da temizlenecek.

## Şu an neredeyiz (tek paragraf)

FALCI v3 (yeni adı **Ruhbaz Konağı**) için kapsamlı doküman seti kuruldu (00-11), kod salt-okunur denetimden geçti (09), kod tabanı Ruhbaz_Fable'a kopyalandı (geliştirme evi BURASI; FALCI v3 dokunulmaz yedek). **Ozan 2026-06-11 gecesi GELİŞTİRME İZNİNİ VERDİ:** "iki küçük kurulumu yap, ardarda fazlara devam et" — yani yeni oturum Faz 0 ile İŞE BAŞLAR, analiz moduna dönmez.

## ⭐ YENİ OTURUM BRİFİNGİ (Ozan uyuyor olabilir — özerk çalışma planı)

**Sıra:**
1. **Kurulumlar:** (a) AGENTS.md'lere (kök+mobile+agent, Ruhbaz_Fable kopyasında) 00_HANDOFF + Red Kataloğu'na yönlendirme satırı ekle; (b) `/fewer-permission-prompts` becerisini çalıştır (Ozan açıkça yetkilendirdi); (c) `.claude/settings.json` hook'ları: değişiklik sonrası `tsc --noEmit` + UTF-8 kontrolü.
2. **Git:** Ruhbaz_Fable'da temiz `git init` + ilk commit (".gitignore'u doğrula — agent/.env ASLA commit'lenmesin"). Her anlamlı adımda commit (checkpoint).
3. **Faz 0 (özerk yapılabilir kısım):** `/gemini-api-key` endpoint'ini kaldır; CORS daralt; `0.0.0.0`→güvenli kurulum + paylaşılan-gizli header; B-5 (token server adresinin Expo hostUri'den türetilmesi); bozuk kök package.json/app.json/test_output.txt temizliği; debug flag build-time kapıya.
4. **Faz 0 devamı (mekanik, haritası hazır):** K10 yerel LLM söküm işi — reçete: 10_YEREL_LLM_KALDIRMA.md (izole, düşük risk, tsc ile doğrulanır).
5. Her faz sonunda: öz-review (code-review becerisi) + handoff snapshot (`fazX-bitti_konu_tarih.md`) + 00 güncelle.

**TEST PROTOKOLÜ (Ozan kararı, 2026-06-11 gece):** Ozan faz-faz test ETMEYECEK; Claude tüm fazları ardarda yapar, Ozan EN SONDA (veya müsait olduğunda) toplu cihaz testi yapar. **Test düzeni (Ozan netleştirdi): Expo Go KULLANILMAYACAK** — Android-first olduğumuz için tek düzen: telefonda DEV BUILD APK + PC'de Expo dev server (`npx expo start`); Ozan server'ı kendisi açar. Böylece STT dahil her şey tek kurulumla test edilir; test listesinde [EXPO GO]/[DEV BUILD] etiket ayrımına gerek kalmadı. Sigortalar: (1) her faz = ayrı commit/tag → son testte hata çıkarsa bisect ile bozan faz bulunur; (2) **HER FAZIN CİHAZ TESTLERİ AYRI DOKÜMANDA (Ozan direktifi, 2026-06-11):** Faz 0 → `12_FAZ0_CIHAZ_TESTLERI_2026-06-11.md`; her yeni faz için `NN_FAZ<N>_CIHAZ_TESTLERI_<tarih>.md` adıyla YENİ doküman açılır (eskiyi şişirme). O faza ait değişiklikler kendi dokümanına eklenir — Ozan tek oturuşta iner. Her doküman başında: doküman tarihi, faz, cihaz; sonunda "⏳ KALAN TESTLER" + atlananların gerekçesi. **TEST LİSTESİ KURALLARI (Ozan talebi, 2026-06-11):** (a) Liste, Claude'un YAPTIĞI HER DEĞİŞİKLİĞİN sonucunda GÜNCELLENİR — kod değişti ama test maddesi eklenmedi diye bir durum OLAMAZ; değişiklik→test maddesi birebir eşleşir. (b) Maddeler mümkün olduğunca STEP-BY-STEP yazılır: "X ekranını aç → Y'ye dokun → Z yükle → beklenen: ..." formatında, Ozan'ın hiçbir adımı tahmin etmesi gerekmeyecek netlikte. (c) KAPSAMLI olunur — yalnız değişen özellik değil, değişikliğin DOKUNMUŞ OLABİLECEĞİ komşu akışlar da (regresyon maddeleri) listeye girer; "eksik test kalmaması" hedeftir. (d) Her faz bölümünün sonuna o fazın "değişen dosyalar → hangi test maddesi karşılıyor" eşleme tablosu konur — kapsama boşluğu görünür olsun; (e) **HER TEST GRUBUNUN BAŞINA "KURULUM" KUTUSU (Ozan talebi):** O grubu koşmadan önce Ozan'ın ne yapması gerektiği AÇIKÇA yazılır — şıklar net olsun: "yeni APK kur (yolu: ...)" mi, "sadece `npx expo start` + token server yeter" mi, "app'i reload et (r)" mi, "yeni JS bundle gerekiyor (Metro yeniden başlat)" mı, "hiçbir şey gerekmez, kaldığın yerden" mi. Hangi değişiklik tipinin ne gerektirdiği kuralı: native/gradle/modül değişikliği → YENİ APK; yalnız JS/TS değişikliği → expo server + reload yeter; server (token_server.py) değişikliği → token server'ı yeniden başlat. Claude her grupta bunu Ozan adına düşünmüş ve yazmış olacak; (3) Faz 0 server el-sıkışması değiştiği için Claude kendi başına server'ı çalıştırıp curl ile endpoint doğrulaması yapar (cihazsız ön-doğrulama). (4) **STT notu (Ozan düzeltmesi: hata YALNIZ iPHONE'da görüldü):** STT hatası iPhone 6s + Expo Go'da yaşandı; Android'de Ozan bildirmedi (Android testleri muhtemelen debug APK ile yapıldığından native STT çalışıyordu). Teknik açıklama tutarlı: `expo-speech-recognition` özel native modül → Expo Go kabuğunda yok; iPhone'da dev build imkânı olmadığından (Mac/hesap yok) Expo Go'ya mecbur kalınca patlıyor. Pratik sonuç: Android'de tek test düzeni = dev build APK + Expo dev server (Expo Go yok); iOS STT konusu port gününe (Faz 4) kalır. Claude gece debug APK derlemeyi dener ve yolunu test listesine yazar. iOS: Android-first; port Faz 4 civarı (K10 sökümü en büyük native engeli kaldırıyor; iPhone 6s iOS 15.8 tavanlı — Expo Go uyumu sınırda, gün gelince TestFlight denenir).

**SADECE OZAN yapabilir:**
- 📱 Toplu cihaz testi (yukarıdaki protokolle, en sonda).
- Faz 1'in persona SES yeniden yazımları + yasal metin onayları — taslakları ben hazırlarım, onay Ozan'ın.
- Faz 2: Google Play Console hesabı, IAP ürün tanımları, fiyat kararları.

**Anahtar kararı (Ozan, 2026-06-11 gece):** Şimdilik TEK API anahtarıyla devam; anahtar yenileme/rotasyon SONRAYA ertelendi (Ozan'ın bilinçli risk kararı — server o çalıştırmadıkça atıl, .gitignore'da). Çoklu-anahtar havuzu zaten K46/park. Bu yüzden Faz 0'da anahtar işi YOK; ama backend delik tamiri (`/gemini-api-key` endpoint kaldırma, CORS, header) AYNEN KALIYOR — o, anahtarı korumanın rotasyondan daha etkili yarısı.

**Sağlayıcı kararı (Ozan, 2026-06-11 gece, K12 güncellendi):** ŞİMDİLİK YALNIZ GOOGLE/GEMINI. OpenAI yolu/denemesi de iptal. Faz 0 temizliğinde backend'deki OpenAI/OpenRouter/Together kalıntıları (env değişken referansları, varsa provider kodu) sadeleştirilebilir; tek sağlayıcılı, yalın bir token_server hedeflenir.

**Özerk çalışma kuralları:** Tek faz tam bitmeden diğerine geçme; kırılan tsc/test bırakma; emin olunmayan üründe-his kararlarını yapma, not düşüp atla; her büyük adım önce 00'a "başlıyorum" notu (kesinti sigortası).

**⛔ REGRESYON ÖNLEME PRENSİBİ (Ozan, 2026-06-11 — bağlayıcı):** Önceki fazlarda düzeltilen/karara bağlanan HİÇBİR şey sonraki fazda/değişiklikte bozulmaz. Her değişiklikte: (1) ÖNCE etki analizi — planlanan değişiklik mevcut durumda ve önceki fazlarda nelerle bağlantılı, neyi bozabilir; öngör, gerekirse dokümante et (özellikle paylaşılan bileşen/servis: SelectableFormattedText = tüm okumalar, fortunePromptBuilder = tüm fal türleri, token_server = tüm istemci; ve sözleşmeli davranışlar: görsel uygunluk/desen yasağı, cache anahtarı, hitap, Red Kataloğu). (2) SONRA Claude ön-testi (bekçiler + komşu akışlar). (3) Cihaz testinde ilgili maddenin yanına "regresyon: şunu da kontrol et" notu yazılır ki Ozan bilerek baksın. Otomatik yarısı = bekçiler (image-contract/utf8/tsc); yeni sözleşme çıkınca bekçiye eklenir.

**FAZ BAŞLATMA PROTOKOLÜ (Ozan, 2026-06-11 — "ardarda fazlar"ı revize eder):** Her faz öncesi Ozan'a BRİFİNG sunulur (faz hangi bölümleri ele alıyor / şu an nasıl çalışıyor / ne değişecek / faz ortasında Ozan'a iş düşüyor mu) → Ozan ONAYLAYINCA faz başlar. Brifing sırasında "şu anda nasıl işliyor?" sorularına hazırlıklı olunur. ONAYSIZ KODA BAŞLANMAZ. Geri döndürülebilirlik: her mantıksal adım ayrı, mümkünse bağımsız-revert edilebilir commit. Ayrıca: Claude emin olamadığında Ozan'la kısa interview yapar (niyeti anla → dürüstçe değerlendir → anlat).

### 📋 FAZ 0 BRİFİNGİ — ✅ SUNULDU, ONAYLANDI ve UYGULANDI (2026-06-11; tarihçe için tutuluyor)

**Hangi bölümler?** Kullanıcı ekranları DEĞİL; üç alan: backend proxy (`agent/token_server.py`), app'in server bağlantı ayarı (tek config), proje altyapısı (git, kalite, bozuk kök dosyalar).

**Şu an durum:** Token server prompt'u Gemini'ye iletiyor ama 3 açığı var (anahtarı isteyene veren kullanılmayan endpoint, açık CORS, 0.0.0.0 dinleme). App'in server adresi elle yazılı → IP değişince kopuyor. Git yok, test/lint yok, kökte bozuk package.json/app.json + çöp, debug bayrağı sabit açık.

**Ne değişecek?** (1) Kullanılmayan `/gemini-api-key` endpoint'i silinir (istemci kullanmıyor — doğrulandı); (2) CORS daraltılır + gizli-header doğrulaması (app+server AYNI commit'te); (3) B-5: app server adresini Expo bağlantısından türetir → IP derdi biter; (4) temiz `git init` + adım adım commit; (5) ESLint + tsc/UTF-8 hook'ları + AGENTS.md yönlendirmeleri; (6) bozuk kök dosyalar `_arsiv/`e taşınır (silinmez); (7) debug bayrağı build-time kapıya; (8) debug APK derleme denemesi + `12_FAZ0_CIHAZ_TESTLERI_2026-06-11.md` başlatılır.

**Ozan'a faz ortasında iş düşer mi?** HAYIR. Faz sonunda müsait zamanında telefonla test listesi. Server doğrulamasını Claude curl ile kendi yapar.

**Risk:** Düşük; en dokunaklı iş gizli-header — tek commit'te app+server birlikte, olmazsa tek revert.

## Kritik bağlam (dokümanlara dağılmış ama burada toplu)

- **Ozan'ın çalışma tarzı:** AuDHD; kapsamlı/vizyoner iş motive eder, "MVP yap/küçült" demotive eder → **vizyonda maksimalist, icrada sıralı** çerçevesi benimsendi. Fikirler deftere sınırsız (ucuz), koda sırayla (pahalı). Dürüstlük açıkça istendi — pohpohlama değil.
- **Ozan'ın asıl riski:** fazla fikir değil, KAPANMAMIŞ DÖNGÜ. Ölçü: "kullanıcının dokunabileceği şey en son ne zaman iyileşti?" Claude bunu hatırlatmakla yükümlü.
- **Dokümantasyon = Ozan'ın dışsallaştırılmış çalışma belleği.** Vizyonu tekrar tekrar anlatamıyor; defterler bu yüzden var.
- **Gerçek doğrulama mevcut:** Bayramda aile + "inanmayan teyze" deneyi → hafıza/tanınma hissi ürünün kalbi olduğunu kanıtladı (01).
- **Rakip = LLM chat uygulamaları** (fal appleri değil). Strateji iki perde: bağ (bugün, silinmesin) → kanal (yarın, LLM'in içinden çağrılsın). (03/2.5)
- **Test işbölümü:** Claude kod yazar + statik/otomatik kontrolleri (tsc, utf8, lint, test) çalıştırır; görsel/davranışsal testi Ozan kendi telefonunda (Expo Go + lokal server) yapar. Claude emülatörü güvenilir süremiyor.
- **Geliştirme protokolü:** tek faz/tam bitiş; faz ortasında yeni fikir koda değil deftere; her faz sonu Claude öz-review + Ozan cihaz onayı = faz kapanır.

## Doküman haritası

| # | Dosya | Ne |
|---|---|---|
| 00 | HANDOFF (bu dosya) | Oturum devri |
| — | README | Giriş + indeks |
| 01 | VIZYON_VE_NIYET | Ozan kim, ne istiyor, rakip tanımı, bayram/teyze doğrulaması |
| 02 | KARAR_DEFTERI | K1–K45 kararlar (✅/💡/❓) |
| 03 | SERI_VE_MIMARI_STRATEJI | Seri/konak, Konak Çekirdeği, gelir modeli A/B, rakipten-kanala ark, unified memory |
| 04 | HUKUK_VE_GUVENLIK | 677, Faladdin emsali, Red Kataloğu (R1–R16 + B/C/D/E), input moderasyonu, avukat soruları |
| 05 | YOL_HARITASI | Faz 0–6b + teknik bakılacaklar (B-1..B-5) + yayın öncesi kontrol + park alanı |
| 06 | KAHYA_MODU | Çift kullanım: Kendin Gez / Kâhya ile Gez (host) |
| 07 | FIKIR_DEFTERI | Canlı fikir günlüğü + F1–F10 detayları |
| 08 | MANIFEST_ODASI | Seans tasarımı, niyet politikası, Karakter Atölyesi, pet okumaları |
| 09 | KOD_SAGLIGI_RAPORU | Salt-okunur denetim bulguları |

## Açık uçlar / Ozan'ın onayını bekleyen 💡'ler

- İsimler: Kâhya, "Kendin Gez/Kâhya ile Gez" (K18), persona renkleri (K44) — kavram ✅, isim/detay 💡.
- Şirket yeri (K4), thinking budget (B-3), Live maliyet ölçümü (K23), fiyatlandırma (K43) — hepsi ❓, veri/avukat bekliyor.
- ~~Faz 0'a "başla" komutu henüz YOK~~ → Faz 0 ✅ bitti (2026-06-11). Faz 1 brifingi sunulup onay alınmadan koda başlanmaz.

## Kuyruktaki teknik doğrulamalar (kod açıldığında bakılacak)

B-1 lunar/UTC hatası · B-2 efemeris zenginleştirme (deterministik) · B-3 thinking budget · B-4 kahve çoklu-görsel · 09'daki sanitizer kesme failleri (trimIncompleteTail vb.) · 8 sessiz catch · god file bölme (K6 ile birleşir).

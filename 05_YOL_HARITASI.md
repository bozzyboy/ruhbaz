# 05 — Yol Haritası

İlke: Her faz 2-3 haftalık, BİTİRİLEBİLİR ve sonunda elle tutulur bir çıktı olan iş paketidir. Bir faza başlamadan önce kapsamı yazılır; faz sırasında yeni fikir gelirse koda değil bu klasördeki dokümanlara not edilir ("fikir park alanı"). Bu, "bitmeyen senfoni" hissinin tek ilacıdır.

## Sıralama mantığı (neden bu sıra?)

1. Önce **varoluşsal riskler** (hukuk, sızan anahtarlar, yedek) — bunlar batırır.
2. Sonra **gelir** (IAP) — motivasyonu para döndürür, projeyi "hobi"den çıkarır.
3. Sonra **pazar büyütme** (İngilizce) ve **tutundurma** (bildirim/akış).
4. En sonda **vizyon katmanları** (MCP, seri, unified memory) — bunlar kanıtlanmış bir çekirdeğin üstüne gelir.

## Faz 0 — Güvenlik ve hijyen (1 hafta, hemen)

- [~] API anahtar rotasyonu → ERTELENDİ (Ozan kararı, 2026-06-11: tek anahtarla devam; server kapalıyken risk düşük, .gitignore'da). Park alanına taşındı; backend delik tamiri (aşağıda) bunun yerine birincil koruma.
- [ ] Backend delikleri (09/A): `/gemini-api-key` endpoint'ini kaldır/kilitle; CORS'u daralt; `0.0.0.0` → `127.0.0.1`; debug UI flag'ini build-time kapıya al.
- [ ] **B-5 EN BAŞA (Ozan talebi):** Token server adresinin Expo hostUri'den otomatik türetilmesi — Ozan'ın her test oturumunda canını yakan şey; güvenlik header'ı ile aynı pakette, Faz 0'da yapılır.
- [ ] `.gitignore` doğrula; düz metin sır dosyalarını temizle.
- [ ] Git remote push + haftalık yedek rutini kur.
- [ ] **Geliştirme altyapısı (plugin DEĞİL — yerleşik araç + ayar):** (a) `/fewer-permission-prompts` ile izin listesi; (b) `.claude/settings.json` hook'ları: kod değişikliği sonrası otomatik `tsc --noEmit` + `check:turkish:utf8` + (kurulunca) lint — kırılırsa uyarı; (c) ESLint + react-hooks plugin + minimum test iskeleti (09 boşluğu); (d) AGENTS.md dosyalarına Ruhbaz_Fable dokümanlarına (00_HANDOFF + Red Kataloğu) yönlendirme satırı.
- Çıktı: "Sızıntı kapandı" + her kod değişikliğini otomatik denetleyen kalite kapıları kurulu.

## Faz 0.5 — Kod Sağlığı Denetimi (salt-okunur, 2-4 gün; Claude yapabilir)

- [ ] Restore sonrası kalıntı taraması: duplicate/redundant servisler, ölü kod, birbirini tekrarlayan akışlar, kullanılmayan dosyalar (Ozan'ın sezgisi: silinme/kurtarma süreçleri kalıntı bırakmış olabilir).
- [ ] Best practices / temizlik / over-engineering incelemesi: AI'lı adım adım geliştirmenin bıraktığı gereksiz soyutlamalar, AGENTS kurallarına (iş mantığı ekranda olmasın vb.) uyum, tip/hata yönetimi, adlandırma tutarlılığı (Ozan talebi, 2026-06-11).
- [ ] Çoklu API call yapan okuma akışlarının haritası (hangi okuma kaç çağrı yapıyor, neden).
- [ ] Sanitizer/ayıklama noktalarının envanteri (K32 onarım mimarisine geçiş için mevcut durum tespiti).
- [x] Çıktı: hiçbir dosyaya dokunmadan yazılmış "Kod Sağlığı Raporu" (bulgu + öncelik + tahmini temizlik maliyeti). Temizlik İŞİ ayrı karar; rapor önce. → **TAMAMLANDI (2026-06-11): bkz. 09_KOD_SAGLIGI_RAPORU.md** — kesilme failleri sanitizer'larda bulundu; backend'de yeni güvenlik delikleri (açık /gemini-api-key endpoint'i, CORS, 0.0.0.0) Faz 0 kapsamına eklendi.

## Teknik Bakılacaklar (küçük doğrulama/araştırma kalemleri — uygun boşluklarda)

- [ ] **B-1 Lunar cycle doğrulaması:** Astro motoru ay fazını "lokasyona göre" yanlış gösteriyordu; düzeltildi mi belirsiz. ÖNEMLİ TEŞHİS İPUCU: Ay fazı aslında lokasyondan BAĞIMSIZDIR (jeosantrik — aynı anda dünyanın her yerinde aynı faz); lokasyona göre değişen şey fazın YEREL TARİHE düşüşüdür (saat dilimi/gün sınırı) ve ay doğuş/batışıdır. Yani hata büyük olasılıkla kütüphanede değil, yerel tarih ↔ UTC dönüşümünde (örn. yeniay TR saatiyle gece 01:00'de ama hesap UTC günüyle yapılınca "dün" görünmesi). Kontrol noktası: astroEngine'de faz hesabına giden Date'in UTC mi yerel mi kurulduğu. Kütüphane: `astronomy-engine` (cosinekitty/astronomy, MIT lisans, Swiss Ephemeris KULLANMAZ — bilinçli seçimdi: Swiss Ephemeris GPL/ücretli ticari lisans gerektirir, MIT olan bu motor ticari app için doğru tercih; bu gerekçe unutulmasın).
- [ ] **B-2 Efemeris zenginleştirme (tutulma/retro/Lilith):** Okumalarda tutulma, retrograd ve Lilith/küçük objeler anılmıyor. DOĞRU YAKLAŞIM: bu olguları LLM bilgisine veya websearch grounding'e bırakmak değil (maliyet + halüsinasyon), cihazdaki `astronomy-engine` ile DETERMİNİSTİK hesaplayıp prompta "bugünün gökyüzü olguları" bloğu olarak vermek. Retro = gezegen boylamının zaman içindeki türevi; tutulmalar astronomy-engine'de mevcut; Lilith (mean apogee) için ek hesap/teklif araştırılacak. Flash-lite bu olguları metne dökmekte yeterli — olguyu üretmesi değil anlatması istenir.
- [ ] **B-3 Thinking budget sorunu:** Gemini'de thinking budget -1 (sınırsız) yapıldığında bad response/no response dönüyordu. Model/parametre kombinasyonu araştırılacak (flash-lite'ta thinking desteği/limitleri); thinking gerekiyorsa hangi akışta değer katar ayrıca değerlendirilecek (maliyet!).
- [ ] **B-4 Kahve görsel sınıflandırma:** 3 görsel = slot başına ayrı classify çağrısı olabilir (09/C bulgusuyla uyumlu). Tek çağrıda çoklu-görsel sınıflandırma denenecek.
- [ ] **B-7 STT / Expo Go sınırı (düzeltildi: hata yalnız iPHONE'da görüldü):** Ozan STT hatasını iPhone 6s + Expo Go'da yaşadı; Android'de bildirilmedi. Neden tutarlı: `expo-speech-recognition` özel native modül → Expo Go kabuğunda yok; iPhone'da dev build seçeneği olmadığından hata orada görünür. Android'de STT testi dev build APK ile sürer (sorun yok); iOS STT, port gününde (Faz 4) dev build/TestFlight ile çözülür. Release build'lerde her iki platformda da sorun beklenmez (native modül pakete girer).
- [ ] **B-6 Embedding maliyet ölçüm açığı (kod doğrulandı):** `/gemini-embed` proxy'si yanıtında token usage döndürmüyorsa, `memoryEmbeddingService.ts:73` kaydı atlıyor → embedding maliyeti ledger'da GÖRÜNMÜYOR (Ozan'ın "sayaçta 0" gözlemi). Düzelt: backend Gemini embed API'sinin döndürdüğü token sayısını geçirsin; output=0 doğru (embedding çıktı tokeni üretmez), input ölçülmeli. Yerel-vs-bulut embedding kararının (11) ÖN ŞARTI bu ölçüm.
- [ ] **B-5 Dev ergonomisi — token server adresi otomatik bulunsun:** Cihazda Expo + cmd'de token_server.py çalışırken PC'nin LAN IP'si değişince app sunucuyu bulamıyor, elle arama can sıkıyor. Çözüm: dev modunda app, sunucu adresini Expo'nun KENDİ bağlantısından türetsin — telefon Expo'ya bağlanabildiğine göre PC'nin IP'sini zaten biliyor (`Constants.expoConfig.hostUri` → "192.168.x.y:8081" → IP'yi al, portu 8080 yap). Sıfır konfigürasyon, IP değişse de çalışır; `EXPO_PUBLIC_AGENT_API_URL` set edilmişse o öncelikli kalır (mevcut desen korunur). Yalnız dev build davranışı; production gerçek URL kullanır. G4 güvenlik notuyla (paylaşılan-gizli header) birlikte uygulanmalı.

## Faz 1 — Hukuki zırh + yeniden adlandırma (2-3 hafta)

- [ ] Ürün dilini tara: yasaklı sözlük (04/2) ile tüm UI metinleri, persona kaynak markdown'ları, store taslakları elden geçir.
- [ ] **Kod-içi "fal" envanteri (tarama yapıldı 2026-06-11, sonuçlar):** Ekranlar ve config TEMİZ (sıfır fal/falcı/kehanet — kullanıcıya görünen UI zaten temiz çıktı). Yapılacaklar: (a) `falci-data/` klasör adı + `falci-memory-v2.db` veritabanı adı → nötr ada çevir (İLK RELEASE ÖNCESİ yapılırsa migration derdi yok); (b) ~15 dosyadaki `// FALCI — ...` başlık yorumları → Ruhbaz; (c) persona kaynak markdown'larındaki ~54 "fal/falcı" kullanımı → yeni sözlükle yeniden yazılır + generator (bunlar prompta gidiyor); (d) memoryWriterDebugService'teki "FALCI uygulamasının ... ajanısın" iç prompt'u; (e) tarot kartı "The Magician" → **"Sihirbaz"** (KARAR VERİLDİ — K47); (f) İngilizce `fortune*` tanımlayıcı ailesi nötr adlara çevrilir (KARAR VERİLDİ — K47; öneri: `reading*`). NOT: fortunePromptBuilder 365-366 ve personaClosingService'teki fal/kehanet regex'leri SAVUNMA katmanı — bunlar kalır (kelimeleri yasaklayan/ikame eden kodlar).
- [ ] `common.md`'ye Red Kataloğu (04/4.5) guardrailleri işlenir + generator çalıştırılır; uygulama K32 "onar, kesme" mimarisine göre (deterministik katman yalnız ikame/temizlik yapar).
- [ ] FALCI → Ruhbaz Konağı: app adı, app.json, görünen metinler (kod içi teknik adlar acele değil).
- [ ] Yasal katman: onboarding onayı + Yasal Bilgilendirme ekranı + okuma ekranı ibaresi.
- [ ] Avukat randevusu; 04/5'teki sorular götürülür. Şirket kararı bu görüşmeden sonra.
- Çıktı: "Bu app'i bugün store'a koysam dilden yanmam" hali.

## Faz 2 — Karar dondurma + gelir MVP (3 hafta)

- [ ] K9/K10 uygula: Yerel LLM + IQ seçimi TAMAMEN kaldır — reçete hazır: [10_YEREL_LLM_KALDIRMA.md]. ~2-3 saat, izole/düşük risk; istenirse Faz 0'a da çekilebilir. K12 KESİNLEŞTİ (2026-06-11): yalnız Google/Gemini; OpenAI denemesi iptal — backend sağlayıcı kalıntıları sadeleştirilir.
- [ ] IAP: kredi/seans paketleri (Google Play Billing önce; iOS sonrası ayrı iş).
- [ ] Token ledger'ı pakete bağla: seans hakkı düş/yenile; fiyatlama Excel'lerdeki marj hesabına göre.
- [ ] Basit paywall + ücretsiz tanışma hakkı.
- [ ] Fiyatlandırma + paketler (K43): kredi paketleri, abonelik katmanları, sadakat/ödül mekaniği — Excel maliyet modeli + ölçülen seans-başı maliyetle.
- [ ] Kullanıcı input moderasyonu (K42): zararlı girdi modele gitmeden tespit + nazik reddet; CSAM mutlak blok.
- [ ] User Terms + sorumluluk çerçevesi onayı (K41).
- [ ] Veri taşınabilirliği (K40): yedek alma + geri yükleme + silmeden önce uyarı (kullanıcının kendi deposuna).
- [ ] Analitik kurulumu (K34): araç seçimi (PostHog/Firebase/Aptabase) + anonim event şeması (funnel, retention, satın alma) + rıza/aydınlatma; içerik ve hafıza asla gönderilmez.
- Çıktı: Para kazanabilen VE ölçülebilen bir uygulama.

## Faz 3 — Persona ses matrisi + Brand Book (2 hafta, kod azlığıyla "dinlenme fazı")

- [ ] 7 persona için ses matrisi (hitap, ritim, mizah, metafor alanı, yasaklar, örnek açılış/kapanışlar) — kaynak markdown'lara işle, generator çalıştır. Arın'a Gen-Z (+ sonraki kuşak) tonu eklenir (Ozan, 2026-06-11).
- [ ] Lore KANONU yazımı (K37/F8): kalıcı persona gerçekleri ve ilişkiler — Teoman-Suzan evliliği ve "kim daha iyi okur" çekişmesi dahil — persona kaynak markdown'larına işlenir.
- [ ] BRAND_BOOK.md: renk paleti, tipografi, ikon dili, görsel ton, yazım tonu, yasaklar. Para harcamadan; ilham: Mobbin ücretsiz katman, store görselleri.
- [ ] Persona renk/görsel kimliği (K44): her personaya kimlik rengi + atmosfer; Aura (K39) ile katman uyumu.
- [ ] Persona hitap politikası (K45): TR akrabalık-temelli + EN akran-sıcaklık tabloları; ses matrisine ve prompt'a bağlanır; sanitizeGenderedAddress hitap motoruna genişletilir.
- Çıktı: Tutarlı kişilik ve görsel dil; dış tasarımcı ihtiyacının yazıyla kapatılması.

## Faz 4 — İngilizce (3-4 hafta)

- [ ] i18n altyapısı (string'lerin koddan ayrılması; expo-localization + i18n kütüphanesi).
- [ ] TR metinler anahtarlara taşınır (en büyük iş; divinationData ~650 satır dahil).
- [ ] EN çeviri: önce UI, sonra içerik/persona; persona seslerinin EN'de yeniden YAZILMASI (çeviri değil) gerekir.
- [ ] Hitap politikasının EN sürümü (K45): akrabalık-hitabı kaldırılır, akran-sıcaklık tonu yeniden yazılır; her yeni dil kendi T-V/hitap tablosunu ister.
- [ ] Store'da EN listing; global yayın hukuki seyreltme de sağlar.
- Çıktı: İki dilli app.

## Faz 5 — Konak Akışı + bildirimler (2-3 hafta)

- [ ] İçerik takvimi: persona başına haftalık içerik batch üretimi (LLM ile, Ozan onayıyla).
- [ ] Statik JSON feed (GitHub Pages/Cloudflare — bedava) + GitHub Actions cron ile güncelleme.
- [ ] App'te "Konak Akışı" ekranı feed'i gösterir; aynı içerik sosyal hesaplara elle/zamanlayıcı araçla.
- [ ] Expo push + günlük yerel bildirim (genel astro çizgisi).
- [ ] Paylaşım Kartları (K19/F1): onaylı yüzeyler için markalı, 677-uyumlu kart üretimi + paylaşım akışı.
- [ ] Genelden kişisele zarif davet kartı (K21/F3): frekans tavanlı cross-sell + dönüşüm ölçümü.
- [ ] İçerik genişletme: I-Ching ve Rün'ün kişisel okuma türü olarak Senin Evin'e eklenmesi (tarot kalıbı örnek alınır).
- [ ] Manifest döngüsünün ucuz yarısı (K25/F6): görev çıkarma + bildirim hatırlatma + "Takip & Kutlama" dashboard'u (grafik+tablo) + kutlama paylaşım kartı. (AI eser üretimi ve Live seanslar BU FAZDA DEĞİL — park alanında.)
- [ ] Etkileşimli bildirimler (K28): aksiyon butonlu push ("✓ Yaptım") → görev/streak kaydı.
- [ ] Okuma favorileri (K29): kalp + "Kalplilerim" filtresi + hafızaya beğeni sinyali.
- [ ] Bekleme sahnesi (K33/F7): atmosfer animasyonu + önden üretilmiş içerik kartları (Konak Akışı havuzundan, statik, sıfır ek gecikme).
- [ ] Re-engagement bildirimleri (K35): kullanılmayan bölümlere frekans-tavanlı zarif davet push'ları (yerel kullanım verisiyle).
- [ ] **Uygulama puanlama (rating) push'ları (Ozan notu, 2026-06-11):** doğru anda (ör. beğenilen bir okumadan sonra, frekans-tavanlı) Play Store değerlendirme isteği push'u + in-app review API. Bu, bildirim TÜRLERİNDEN yalnız biri — başka çeşitler de olacak (yeni içerik, streak, kişisel okuma hatırlatması, kampanya/kredi...). **Bildirim türleri taksonomisini bu faza girerken topluca tasarla** (her tür için: tetikleyici, frekans tavanı, kullanıcı kapatabilme, 677-uyumlu dil). Üstünde ayrıca düşünülecek.
- [ ] Günlük "Aura" dinamik UI teması (K39): gökyüzü verisine göre günlük renk/atmosfer (yerel hesap, erişilebilirlik korunur, sabitleme seçeneği).
- [ ] El/pati ayrımı + pet personaları + hayvan okumaları (K38/F9).
- [ ] İçerik Fabrikası yarı-otomatik hattı (K33/F7): batch üretim (script→görsel→persona sesi) + onay kuyruğu; paylaşım elle/zamanlayıcıyla.
- [ ] Konak Bülteni (K37/F8): feed'e lore-olayı metası + lore graph ingest + promptlara ilgili-olay bloğu enjeksiyonu.
- Çıktı: App dışında da yaşayan persona evreni; geri çağırma + paylaşım + çapraz satış mekanizmaları.

## Faz 6a — Araç katmanı + Kâhya Modu (bkz. 06; ön şartı yalnız Faz 2/IAP — istenirse öne çekilebilir)

- [ ] Servisleri fonksiyon-çağrısı sözleşmesine bağla: startReading, selectProfile, selectPersona, getReadingHistory, getCreditBalance, openScreen, getFeedItems...
- [ ] App içi Kâhya sohbeti: ucuz model + sıkı yönerge + bu araçlar; hibrit UX (akışları sohbette yeniden yaratmaz, ekrana ışınlar ve ön-doldurur).
- [ ] Handoff kuralları: okuma sırasında Kâhya susar; bitince döner.
- [ ] IAP bağlantısı: "Kâhya ile Gez" ücretli katmanda; tanışma hakkı ücretsiz.
- Çıktı: "Kendin Gez / Kâhya ile Gez" çift modlu uygulama + MCP için hazır araç katmanı.

## Faz 6b — MCP kapısı (Faz 6a'nın araç katmanını dışarı açar)

- [ ] Tasarım sprinti: izin modeli, hafızanın dış ajana açılma biçimi, OAuth + seans hakkı kontrolü.
- [ ] Uzak MCP sunucusu MVP; "Konağı kendi yapay zekânın içine davet et" premium özelliği olarak satılır (Model B, bkz. 03/3). Dış asistan, aynı araçları çağıran "dış Kâhya" olur.
- Çıktı: Kullanıcının kendi aboneliğinin zekâsıyla, Ozan'a inference maliyeti olmadan çalışan ikinci kapı.

## Yayın Öncesi Kontrol Listesi (store'a çıkmadan ZORUNLU temizlik)

Ozan talebi (2026-06-11): Debug/geliştirici yüzeyleri publish'ten önce kaldırılmalı/gizlenmeli. Bu liste her release öncesi baştan sona işaretlenir:

- [ ] **Token sayaçlarının TÜMÜ:** Ana ekrandaki token/USD maliyet göstergesi ve diğer tüm token görünümleri kullanıcıdan kaldırılır (zaten "teknik terim görünmez" ilkesinin — K9 — ihlali; ledger arka planda çalışmaya devam eder, sadece UI'dan gider).
- [ ] **MemoryDebugScreen:** Navigasyondan ve build'den çıkarılır (veya build-time flag arkasına).
- [ ] **Developer Settings / dev controls overlay:** Kaldırılır (Ozan notu: "şu anda bir işe yaramıyor gibi zaten" — DevSettings'in geleceği K-kararı olarak Faz 2'de netleşir: ya tamamen silinir ya iç test build'ine taşınır).
- [ ] **`ENABLE_DEVELOPER_DEBUG_UI`:** Sabit `true` olamaz; build-time (env/`__DEV__`) kapısına alınır, release'te `false` (09/G5).
- [ ] **Debug servisleri:** `promptDebugService`, `memoryWriterDebugService` release bundle'a girmesin (flag arkası/dinamik import).
- [ ] **Konsol logları:** Release'te console.log/warn temizliği veya susturma.
- [ ] **Dev adres mantığı:** B-5 otomatik adres türetme yalnız dev'de; release gerçek URL.
- [ ] Son kontrol: app'i "yabancı gözüyle" aç — teknik kelime, sayaç, debug girişi görünmüyor mu?

## Park alanı (şimdi YAPILMAYACAK, unutulmayacak)

- Unified Memory ürünü (bkz. 03/4) — Ruhbaz çekirdeği kanıtlanınca ayrışır.
- App serisi/spin-off'lar (bkz. 03/1) — bir "oda" kendi başına tutununca.
- Yerel LLM genişlemesi (iOS, daha büyük modeller) — K10, 6 ay sonra revize.
- Lore/sosyal graph'ın hafızayla tam birleşmesi (links tabanlı traversal).
- Kullanıcı hafızası yedekleme/taşıma (teyze deneyi çıkarımı, 07): kullanıcının kendi deposuna (örn. kendi Drive'ı) hafıza yedeği + cihaz değişiminde geri yükleme; "hafıza cihazda" ilkesiyle uyumlu. Cihaz değiştiren kullanıcının "ilişkisini" kaybetmemesi uzun vadede kritik.
- Backend ölçekleme (K46/F11): çoklu anahtar rotasyonu + rate-limit duyarlı kuyruk + 429 backoff — kullanıcı sayısı artınca; mevcut kota mantığı genişletilir.
- Reklam/ödüllü video (K20/F2) — IAP gelir verisi görüldükten sonra değerlendirilecek.
- TTS denemesi: Supertonic on-device → Gemini TTS (K22/F4) — küçük, bağımsız deney; uygun bir boşlukta yapılabilir.
- Gemini Live API odaları: Manifest, Dert Odası, Diyet Yardımcısı, Kendi Okumanı Yarat (K23/F5) — Faz 6 sonrası vizyon katmanı; yalnız dakika-maliyet mini ölçümü erken yapılabilir.
- Manifest seans-sonu AI eser üretimi: görsel/olumlama sesi/şarkı/video (K25/F6) — üretim maliyeti kalem kalem ölçülmeden açılmaz; video en üst katman.
- LiveKit/realtime altyapı karşılaştırması (Live API'ye alternatif olarak elde dursun).
- Hatırlandıkça buraya eklenecek eski roadmap maddeleri (yeni fikirler önce 07_FIKIR_DEFTERI.md'ye).

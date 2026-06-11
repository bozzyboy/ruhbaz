# FAZ 0 — CİHAZ TESTLERİ (2026-06-11)

> **Doküman tarihi:** 2026-06-11 · **Faz:** Faz 0 (güvenlik + altyapı + görsel uygunluk) · **Cihaz:** Samsung, Android 13.
> **Kural (Ozan direktifi):** Her fazın cihaz testleri AYRI dokümanda tutulur. Bu doküman yalnız Faz 0'ı kapsar; Faz 1 için yeni doküman açılır.

**Nasıl kullanılır:** Claude her kod değişikliğinde buraya test maddesi ekler (değişiklik → test maddesi birebir eşleşir; istisna yok). Sen müsait olduğunda yukarıdan aşağı inersin. Her grubun başındaki **KURULUM kutusu** o grubu koşmadan önce ne yapman gerektiğini söyler.

## 📊 TEST DURUM ÖZETİ (Ozan, 2026-06-11)

| Grup | Sonuç | Not |
|---|---|---|
| F0-A1, F0-A2, F0-A3 | ✅ Geçti (2026-06-11) | Backend güvenlik + genel astro |
| F0-A4, F0-A5, F0-A6 | ⏭️ Atlandı | Ozan yapmayacak (regresyon/curl ön-doğrulamaları zaten Claude'da geçti) |
| F0-B1, F0-B2, F0-B3 | ✅ Geçti (2026-06-11) | B3'te "günlük sorup haftalık yanıt" = app hatası değil; çapraz-satış fırsatı olarak K52'ye not düşüldü |
| F0-B4, F0-B5, F0-B6 | ✅ Geçti (2026-06-11) | B4/B5 cache doğru çalıştı; "seçim diyaloğu" fikri K53'e işlendi |
| F0-C | ⏭️ Atlandı | Ozan: cihaz için anlamı yok (öz-review düzeltmeleri zaten statik doğrulandı) |
| EK1-1 … EK1-6 | ✅ Geçti (2026-06-11) | Görsel uygunluk LLM-only |
| EK1-7 (el sırtı reddi) | ❌→🔧 Düzeltildi | El sırtı hâlâ okutuluyordu; prompt güçlendirildi (EK5-2'de yeniden test) |
| EK1-8, EK1-10 | ✅ Geçti (2026-06-11) | Pati (hayvan profil) + alakasız ret |
| EK1-9 (pati altı) | ⏳ Kalan | Kedinin pati altı fotoğrafı çekilemedi; en sonda tekrar |
| EK2-1 … EK2-3 | ✅ Geçti (2026-06-11) | Çoklu galeri seçimi |
| EK2-4, EK2-5, EK2-6 | ⏳ Ertelendi | İzin uyarısı bazen markasız/beyaz bazen markalı geliyor; chat ekranı aşamasında bakılacak (önemsiz) |
| EK2-7, EK2-8 | ✅ Geçti (2026-06-11) | Desen yorumlama yok + aynı fincan farklı açı |
| EK-3 (uygulama adı) | ⏳ Sonraki derleme | Şu an hâlâ eski etiket görünüyor; yeni APK'da "Ruhbaz Konağı" olur |
| EK-4 (kamera izni) | ✅ Geçti (görünüyor) | Sistem sorgusu geri geldi |

**Bugün eklenen düzeltmeler → EK-5 grubunda yeni test maddeleri var (en altta).** Kalan/ertelenen her şey → **"⏳ KALAN TESTLER"** bölümü (en altta).

**Test düzeni (senin kararın):** Expo Go YOK. Telefonda **dev build APK** + PC'de **Expo dev server** + **token server**.

### 🟢 BAĞLANTI — TEK YOL (bir daha port/QR derdi yok)

PC'de **`baslat.ps1`** dosyasına sağ tıkla → **"Run with PowerShell"** (veya terminalde `powershell -ExecutionPolicy Bypass -File baslat.ps1`). Bu script: eski/asılı süreçleri temizler, token server'ı açar, Expo'yu **HER ZAMAN sabit 8081**'de başlatır ve telefona yazacağın **doğru adresi** ekrana yazar.

**Telefonda bağlan — ÜÇ yol (hangisi kolaysa):**
1. **QR (çalışan yol):** `baslat.ps1` ayrı pencerede bir QR açar (`npm run qr` ile de elle açılır). Bunu **telefonun NORMAL kamera uygulamasıyla** tara → çıkan linke dokun → uygulama açılır. ⚠️ Dev-client'ın **kendi içindeki "Scan QR Code"** tarayıcısını KULLANMA — o Android 13'te bozuk ("cannot read QR"). Bizim QR doğru şemayı (`exp+mobile`) taşıdığı için sistem kamerası okur.
2. **Recently Opened:** İlk bağlantıdan sonra listede çıkar — sadece **DOKUN** (yazma/tarama yok).
3. **Elle:** "Enter URL manually" → `http://<PC-IP>:8081` (şu an `192.168.1.127:8081`). ⚠️ **`localhost` YAZMA** (Wi-Fi yolunda localhost = telefonun kendisi).

**EN SAĞLAM (USB):** Telefonu USB ile bağla → `baslat.ps1` → `adb reverse` → uygulamada **`http://localhost:8081`**. Wi-Fi/IP/QR'dan bağımsız, her zaman çalışır.

**EN SAĞLAM yol (USB):** Telefonu USB ile bağla, `baslat.ps1`'i çalıştır → script `adb reverse` yapar → uygulamada **`http://localhost:8081`** yaz. Bu yol Wi-Fi/IP değişse de QR çalışmasa da **her zaman** çalışır.

> ⚠️ Expo bir gün "Port 8081 dolu, 8082'ye geçeyim mi?" derse **`n`** de, `baslat.ps1`'i çalıştır. **8082'yi asla kabul etme.** Eski ölü `:8082` kaydı listede duruyorsa "Recently Opened" yanında RESET'e dokunup temizle.

**Kurulum kutusu kuralları (hangi değişiklik ne gerektirir):**
- Native/gradle/modül değişikliği → **YENİ APK** kur.
- Yalnız JS/TS değişikliği → mevcut APK yeter; app'te reload (r).
- `agent/token_server.py` değişikliği → **token server'ı yeniden başlat** (en kolayı: `baslat.ps1`'i yeniden çalıştır).
- Doküman değişikliği → hiçbir şey gerekmez.

---

## FAZ 0 — Backend güvenlik + altyapı

### Grup F0-A: Token server güvenlik değişiklikleri

> **📦 KURULUM KUTUSU (F0-A):**
> 1. PC'de: `cd C:\Users\ozany\Documents\Ruhbaz_Fable\agent` → `python token_server.py` (yeni kodla yeniden başlat; eskisi açıksa önce kapat).
> 2. PC'de ikinci pencere: `cd C:\Users\ozany\Documents\Ruhbaz_Fable\mobile` → `npx expo start`.
> 3. Telefonda dev build APK'yı aç (yeni APK GEREKMEZ — bu grup yalnız server + JS değişikliği).
>
> Not: Server tarafı curl ön-doğrulamasını Claude yaptı (health=200, kaldırılan endpoint=404). Aşağıdaki maddeler cihazdan uçtan uca regresyon.

> **ÖNEMLİ — gizli-header değişikliği sonrası:** `agent/.env`'e `AGENT_SHARED_SECRET`, `mobile/.env.local`'a `EXPO_PUBLIC_AGENT_SHARED_SECRET` Claude tarafından eklendi (aynı değer). Senin bir şey yapmana gerek yok; ama `npx expo start`'ı bu değişiklikten SONRA başlatmış olman gerekir (env değerleri bundle'a start sırasında girer). Zaten kurulum kutusundaki sırayı izliyorsan sorun yok.

| # | Test | Beklenen | Durum |
|---|---|---|---|
| F0-A1 | Uygulamayı aç → Suzan'la kahve yorumu başlat → telveli fincan fotoğrafı yükle → yorumu bekle | Yorum normal üretilir (tüm trafik `/gemini-generate` proxy'sinden geçiyor; `/gemini-api-key` kaldırıldı ama istemci onu zaten hiç kullanmıyordu; gizli-header otomatik gidiyor) | ☐ |
| F0-A2 | Aynı seansta sohbete devam et (1-2 takip mesajı yaz) | Yanıtlar gelir, hafıza bağlamı çalışır (embedding `/gemini-embed` yolu sağlam, header'lı) | ☐ |
| F0-A3 | İkram Masası → Genel Astro Günlük aç | Yorum gelir (server cache yoksa cihazdan üretim/fallback'e düşer — `/general-astro` isteği artık header'lı ama endpoint opsiyonel, davranış değişmemeli) | ☐ |
| F0-A4 | (Regresyon, isteğe bağlı) PC tarayıcısından `http://<PC-IP>:8080/gemini-generate`'e POST atmayı dene veya sadece `http://<PC-IP>:8080/health` aç | health açılır; generate tarayıcıdan/headersiz 401 döner (yabancı erişim kapalı) | ☐ |
| F0-A5 | **B-5 doğrulaması:** Her şey kapalıyken PC'nin IP'sini umursamadan sırayla aç: token server → `npx expo start` → telefonda app → herhangi bir yorum başlat | Yorum gelir. App, server adresini artık Expo bağlantısından kendisi buluyor; `.env.local`'daki eski IP satırı SİLİNSE BİLE çalışır (o satır artık yalnız production yedeği) | ☐ |
| F0-A6 | (Regresyon) Wi-Fi yönlendiricin IP'yi değiştirmişse (veya hotspot'a geçersen): server + expo start'ı yeni ağda aç, app'i reload et | Eskiden kopardı; artık yorum yine gelir — IP türetmesi otomatik | ☐ |
| F0-A7 | Ana ekranı aç, en alta kaydır | "Genel Token Sayaçları" ve "Geliştirici Ayarları" panelleri dev build'de GÖRÜNÜR (senin build'in dev — değişiklik hissetmezsin; release build'de otomatik gizlenecekler) | ☐ |
| F0-A8 | (Regresyon) Geliştirici Ayarları'ndan persona/temperature değiştir → bir okuma başlat | Ayarlar dev build'de hâlâ çalışıyor | ☐ |

**Değişen dosya → test eşlemesi (F0-A, şimdiye dek):**

| Değişen dosya | Değişiklik | Karşılayan test |
|---|---|---|
| `agent/token_server.py` | `/gemini-api-key` endpoint'i silindi | F0-A1, F0-A2 + Claude curl (404) |
| `agent/token_server.py` | CORS kaldırıldı + `X-Agent-Secret` zorunlu (generate/embed) | F0-A1, F0-A2, F0-A4 + Claude curl (headersiz=401, yanlış=401, doğru=geçti) |
| `agent/requirements.txt` | flask-cors bağımlılığı silindi | Cihaz testi gerekmez — server ayağa kalkıyor (Claude doğruladı) |
| `agent/token_server.py` | Dinleme adresi env'e bağlandı: varsayılan 127.0.0.1; `agent/.env`'de HOST=0.0.0.0 (telefon LAN erişimi için, Claude ekledi); localhost-dışı dinleme secret'sız BAŞLAMAZ | F0-A1 (telefonun LAN'dan bağlanabilmesi bunu zaten test eder) + Claude doğrulaması (server 0.0.0.0'da kalktı, health=200) |
| `agent/.env.example` | Yeni örnek dosya (doküman) | Cihaz testi gerekmez |
| `mobile/src/config/constants.ts` | `AGENT_SHARED_SECRET` + `agentAuthHeaders()` eklendi | F0-A1, F0-A2, F0-A3 |
| `mobile/src/config/constants.ts` | B-5: `AGENT_API_URL` artık Expo `hostUri`'den türetiliyor (env → yalnız production yedeği) | F0-A5, F0-A6 |
| `mobile/package.json` | `expo-constants` doğrudan bağımlılık yapıldı (JS-only; native modül her Expo build'inde zaten var → YENİ APK GEREKMEZ) | F0-A5 |
| `mobile/scripts/sync-agent-url.js` | Dokunulmadı ama artık GEREKSİZ (IP yazma derdi bitti); ileride kaldırılabilir | — |
| `mobile/src/config/featureFlags.ts` | `ENABLE_DEVELOPER_DEBUG_UI` artık `__DEV__` (build-time kapı; release'de otomatik kapalı) | F0-A7 |
| `mobile/src/screens/HomeScreen.tsx` | Token Sayaçları + Geliştirici Ayarları panelleri bayrağa bağlandı | F0-A7, F0-A8 |
| — (not) | `MemoryDebugScreen` ("Hafıza Özeti" düğmesi, Profil Ayarları'nda) BİLEREK kapatılmadı — ürün özelliği mi debug mi belirsiz; karar Ozan'ın (07 defterine not düşüldü) | — |
| `mobile/eslint.config.js` + `package.json` | ESLint kuruldu (`npm run lint`); 0 hata / 223 uyarı başlangıç çizgisi | Cihaz testi gerekmez — statik araç |

### Grup F0-B: K10 yerel LLM (Gemma) sökümü

> **📦 KURULUM KUTUSU (F0-B):**
> 1. ⚠️ **YENİ APK GEREKİR** — native değişiklik var (LiteRT modülü + gradle bağımlılığı söküldü). **Claude derledi ✅ — kolay yol: MASAÜSTÜNDE `RuhbazKonagi-faz0-debug.apk` (~78MB).** (Asıl konum: `mobile\android\app\build\outputs\apk\debug\app-debug.apk` — DİKKAT: `android\build` değil, `android\app\build`.) Telefona kopyala (USB/Drive/WhatsApp-kendine-gönder) ve üzerine kur; "bilinmeyen kaynak" sorarsa izin ver.
> 2. Yeni APK kurulduktan sonra: token server + `npx expo start` (F0-A kutusundaki gibi).
>
> Not: F0-A ve F0-B'yi TEK oturumda koşacaksan önce yeni APK'yı kur, sonra hepsini sırayla in — iki kez kurulum yapma.

| # | Test | Beklenen | Durum |
|---|---|---|---|
| F0-B1 | Senin Evin → profil seç → Astroloji okuma tipi → yorumcu seçim ekranına gel | Ekranda YALNIZ "Yorumcu Seçimi" var; "Yorumcunun Zekasını Seç" (Free/Pro/Premium IQ) paneli ve yerel model indirme kutusu YOK | ☐ |
| F0-B2 | Aynı ekrandan Selin'i seç → "Yoruma Geç" → Günlük dönem seç → yorumu bekle | Kişisel astro yorumu buluttan (Gemini) üretilir; hata yok | ☐ |
| F0-B3 | Üretilen yoruma takip sorusu yaz (ör. "bu hafta kariyerde ne öne çıkıyor?") | Yanıt gelir (follow-up artık tek yol: bulut) | ☐ |
| F0-B4 | Aynı profil + aynı dönem için ekrandan çıkıp tekrar gir ve aynı dönemi seç | Yorum cache'ten OTOMATİK görünür (aynı metin; yeniden üretim yok). Not: Bu eskiden hiç çalışmıyordu — öz-review'da bulunan cache-anahtarı uyumsuzluğu düzeltildi; bu madde o düzeltmenin testi | ☐ |
| F0-B5 | (Regresyon) Yorumcu seçim ekranından Numeroloji / Rüya / Tarot akışlarına gir | Persona seçimi + "Yoruma Geç" ile ilgili akış normal açılır (ekran sökümünden etkilenmediler) | ☐ |
| F0-B6 | (Regresyon) Kahve yorumu uçtan uca bir kez | Çalışır — kahve yerel LLM'i hiç kullanmıyordu, ama APK değiştiği için bir kez doğrula | ☐ |

**Değişen dosya → test eşlemesi (F0-B):**

| Değişen dosya | Değişiklik | Karşılayan test |
|---|---|---|
| `mobile/src/screens/PersonalAssistantSelectScreen.tsx` | IQ paneli + yerel model UI söküldü; yalnız persona seçimi | F0-B1, F0-B5 |
| `mobile/src/screens/PersonalAstroReadingScreen.tsx` | iqLevel/localGemmaModelId param ve dalları söküldü | F0-B2, F0-B3, F0-B4 |
| `mobile/src/services/astroEngine.ts` | Yerel LLM dalları söküldü; bulut tek yol; cache key 'gemini' | F0-B2, F0-B3, F0-B4 |
| `mobile/App.tsx` | PersonalAstroReading param tipi sadeleşti | F0-B2 (navigasyon çalışıyorsa geçti) |
| `mobile/src/services/localGemmaService.ts` | DOSYA SİLİNDİ | tsc=0 (çağıran kalmadı) + F0-B2 |
| `mobile/android/...` (gitignore'da, disk üzerinde) | RuhbazLiteRtLm modül+paket silindi; MainApplication kaydı + litertlm gradle bağımlılığı + AndroidManifest'teki libedgetpu_litert satırı çıkarıldı | F0-B6 + APK derlendi ✅ (Claude, gradle assembleDebug exit=0) |

### Grup F0-C: Öz-review düzeltmeleri (JS — reload yeter)

> **📦 KURULUM KUTUSU (F0-C):** Yeni APK + `npx expo start` zaten F0-B'de kuruluysa hiçbir şey gerekmez; F0-B ile aynı oturumda koş.

| # | Test | Beklenen | Durum |
|---|---|---|---|
| F0-C1 | = F0-B4 (cache otomatik geri gelme) | (öz-review düzeltmesi #1'in testi — F0-B4'ü işaretlemen yeter) | ☐ |
| F0-C2 | Normal akışta (env'de URL YOKKEN) herhangi bir yorum üret | Çalışır — adres artık Expo bağlantısından türetiliyor; `.env.local`'daki eski URL satırını Claude SİLDİ, sync-agent-url.js arşive taşındı | ☐ |
| F0-C3 | (Regresyon) Server'ı kapatıp app'ten yorum dene | Düzgün hata mesajı görünür (çökme yok) | ☐ |

**Değişen dosya → test eşlemesi (F0-C):**

| Değişen dosya | Değişiklik | Karşılayan test |
|---|---|---|
| `mobile/src/services/astroEngine.ts` | Cache-anahtarı uyumsuzluğu düzeltildi (probe'a 'gemini' segmenti eklendi) | F0-B4 |
| `mobile/src/config/constants.ts` | Adres önceliği: açık env override → hostUri → localhost; env okumaları babel-uyumlu düz erişime çevrildi | F0-C2, F0-A5 |
| `agent/token_server.py` | Varsayılan-korumalı auth (PUBLIC_PATHS={'/health'}); secret koşulsuz zorunlu (başlangıçta net hata) | F0-A4 + Claude curl (4 senaryo ✅) |
| `mobile/scripts/check-turkish-utf8.js` | Tek-dosya argüman desteği (hook hız yolu); tam tarama davranışı değişmedi | Cihaz testi gerekmez — Claude iki modda da koştu ✅ |
| `.claude/hooks/post-edit-check.js` | BOM düzeltmesi (kontroller gerçekten koşuyor artık), artımlı tsc (11.5s→4.3s), stderr yakalama, agent/*.py desteği | Cihaz testi gerekmez — Claude geçti/kaldı senaryolarıyla test etti ✅ |
| `mobile/package.json` | `npm run typecheck` script'i eklendi | Cihaz testi gerekmez |

### Grup EK-1: Görsel uygunluk düzeltmesi (kahve/el/pati — "uygun değil" gınası)

> **📦 KURULUM KUTUSU (EK-1):** Yalnız JS değişikliği — yeni APK GEREKMEZ. `npx expo start` + token server açıkken app'te reload (r) yeter. (F0 gruplarıyla aynı oturumda koşuyorsan zaten hazırsın.)

| # | Test | Beklenen | Durum |
|---|---|---|---|
| EK1-1 | Kahve yorumu → TEK telveli fincan fotoğrafı yükle → başlat | Okuma başlar ("uygun değil" YOK) | ☐ |
| EK1-2 | Kahve yorumu → 2 kare yükle: 1 telveli fincan + 1 telveli tabak (sıra fark etmez, hangi kutuya olduğu fark etmez) | Okuma başlar; iki yüzey de yoruma girer | ☐ |
| EK1-3 | Kahve yorumu → 1 telveli fincan + 1 telvesiz/temiz tabak yükle | Okuma TELVELİ kareyle yine BAŞLAR (eskiden tek temiz kare her şeyi düşürüyordu — düzeltildi) | ☐ |
| EK1-4 | Kahve yorumu → yalnız telvesiz/temiz fincan yükle | Nazik red: telve izi görünen fotoğraf istenir (bu red DOĞRU davranış) | ☐ |
| EK1-5 | Kahve yorumu → fincan+tabak AYNI karede tek fotoğraf | Okuma başlar | ☐ |
| EK1-6 | El okuması → avuç içi + parmaklar görünen fotoğraf | Okuma başlar | ☐ |
| EK1-7 | El okuması → el SIRTI fotoğrafı | Nazik red: avuç içi istenir (DOĞRU davranış) | ☐ |
| EK1-8 | Pati okuması (evcil hayvan profili) → patinin ÜSTÜNDEN/sırtından çekilmiş fotoğraf | Okuma başlar (eskiden reddedebiliyordu — prompt'a alt/üst/pençe esnekliği eklendi) | ☐ |
| EK1-9 | Pati okuması → pati altı veya pençe fotoğrafı | Okuma başlar | ☐ |
| EK1-10 | (Regresyon) Kahve yorumu → alakasız görsel (ör. ekran görüntüsü) TEK başına | Nazik red (DOĞRU davranış — alakasız görsel hâlâ reddediliyor) | ☐ |

**Değişen dosya → test eşlemesi (EK-1):**

| Değişen dosya | Değişiklik | Karşılayan test |
|---|---|---|
| `mobile/src/services/fortuneApiService.ts` | Sınıflandırma token bütçesi 100/120→320 (JSON kırpılması = sahte red'in kök nedeni) | EK1-1, EK1-6 |
| `mobile/src/services/fortuneApiService.ts` | "En az 1 telveli yeter" — tek telvesiz/alakasız kare artık okumayı düşürmüyor | EK1-3, EK1-4, EK1-10 |
| `mobile/src/services/fortuneApiService.ts` | Pati prompt'u: alt/üst/pençe/ayak, tür fark etmez; el: avuç içi+parmaklar, `isInnerPalm !== false` | EK1-6..EK1-9 |
| `mobile/scripts/check-image-contract.js` (yeni) | Sözleşme bekçisi — her değişiklikte otomatik (hook+pre-commit) | Cihaz testi gerekmez — Claude geçti/KALDI senaryolarıyla doğruladı ✅ |
| `AGENTS.md` + `mobile/AGENTS.md` | Sözleşme metni netleştirildi (doküman) | Cihaz testi gerekmez |

### Grup EK-2: Çoklu galeri seçimi + markalı izin uyarıları + desen yasağı bekçisi

> **📦 KURULUM KUTUSU (EK-2):** Yalnız JS değişikliği — yeni APK GEREKMEZ; `npx expo start` + reload yeter. İzin testleri (EK2-4/5/6) için: telefon Ayarlar > Uygulamalar > Ruhbaz > İzinler'den kamera iznini "Sorulsun/Reddet" durumuna çekersen ilk-izin akışını yeniden görebilirsin.

| # | Test | Beklenen | Durum |
|---|---|---|---|
| EK2-1 | Kahve yorumu → "Kahve görseli 1" kutusuna dokun → Galeri → tek seferde 3 kare seç | Üç kare sırayla 1-2-3 slotlarına dolar; tek tek seçmek gerekmez | ☐ |
| EK2-2 | 1. slot doluyken "Kahve görseli 2"ye dokun → Galeri → 2 kare seç | İlk kare slot 2'ye, ikinci kare boş slot 3'e dolar (dolu slot 1 bozulmaz) | ☐ |
| EK2-3 | Kahve yorumu → Kamera ile çek | Kamera TEK kare akışında kalır (çoklu seçim yok — beklenen bu) | ☐ |
| EK2-4 | Kamera izni hiç verilmemişken Kamera'ya dokun | Önce MARKALI açıklama kutusu ("Devam/Vazgeç", emojisiz) → Devam'da sistem izin penceresi açılır | ☐ |
| EK2-5 | Kamera iznini Ayarlar'dan kalıcı reddetmişken Kamera'ya dokun | Markalı kutu "Ayarları Aç" düğmesiyle gelir → düğme telefonun uygulama ayarlarını açar | ☐ |
| EK2-6 | Mikrofon izni kapalıyken sesli soru düğmesine bas | Markalı modal içinde ayar yolunu tarif eden Türkçe mesaj (beyaz sistem uyarısı değil, emojisiz) | ☐ |
| EK2-7 | Üzerinde baskı/desen/logo olan TELVELI fincan yükle → yorum al | Yorum yalnız telve izlerinden bahseder; çiçek/baskı/marka deseni yorum unsuru olarak GEÇMEZ | ☐ |
| EK2-8 | Aynı fincanın 2-3 farklı açıdan karesini yükle → yorum al | Tek bütün yorum gelir (aynı fincan farklı açılar); "ikinci fincanında..." gibi ayrı-kahve dili YOK | ☐ |

**Değişen dosya → test eşlemesi (EK-2):**

| Değişen dosya | Değişiklik | Karşılayan test |
|---|---|---|
| `mobile/src/services/imageService.ts` | `pickImages(maxCount)` — galeriden çoklu seçim (sıra korunur) + izin mesajları ayar-yönlendirmeli | EK2-1, EK2-2 |
| `mobile/src/components/ImageUploader.tsx` | Çoklu seçim desteği + markalı kamera izin kapısı (ön açıklama + Ayarları Aç) | EK2-1..EK2-5 |
| `mobile/src/screens/PersonalReadingSetupScreen.tsx` | Seçilen kareleri slotlara dağıtma (dokunulan slot → boş slotlar) | EK2-1, EK2-2 |
| `mobile/src/services/nativeSttService.ts` | Mikrofon izin mesajları: kalıcı redde ayar yolu tarifi | EK2-6 |
| `mobile/scripts/check-image-contract.js` | Bekçiye eklendi: baskı/desen yasağı + "aynı fincanın farklı açıları" prompt garantileri | EK2-7, EK2-8 + statik ✅ |
| `mobile/AGENTS.md` | Korunan davranışlara çoklu seçim + markalı izin uyarıları eklendi (doküman) | Cihaz testi gerekmez |

### Grup EK-3: Uygulama kimliği "Ruhbaz Konağı" (eski "Falcı Ailesi" temizliği)

> **📦 KURULUM KUTUSU (EK-3):** Hiçbir şey gerekmez — `expo start` yeterli; mevcut dev APK ile çalışır. (Telefondaki uygulama ETİKETİ "mobile" olarak kalır — o, bir SONRAKİ `expo prebuild` + APK derlemesinde "Ruhbaz Konağı" olur; şimdilik beklenen davranış.)

| # | Test | Beklenen | Durum |
|---|---|---|---|
| EK3-1 | `npx expo start` → telefonda app'i aç ve bağlan | Bağlantı normal; terminal/manifest "Ruhbaz Konağı" adını gösterir, hata yok | ☐ |
| EK3-2 | (Regresyon) Herhangi bir yorum üret | Akışlar isim değişiminden etkilenmedi | ☐ |

**Değişen dosya → test eşlemesi (EK-3):**

| Değişen dosya | Değişiklik | Karşılayan test |
|---|---|---|
| `mobile/app.json` | name="Ruhbaz Konağı", slug="ruhbaz-konagi", scheme="ruhbaz"; eski EAS projectId kaldırıldı (Faz 2'de `eas init` ile yeni proje); iOS mikrofon izin metninden "fal" dili çıkarıldı (hukuk çerçevesi) | EK3-1, EK3-2 |
| `mobile/app_0.json`, `app_1.json`, `package_0.json` | Recovery çöpleri `_arsiv/`e taşındı | Cihaz testi gerekmez |

### Grup EK-4: Kamera izni — sistem sorgusu geri geldi (+ QR ile ilişkisi)

> **📦 KURULUM KUTUSU (EK-4):** Yalnız JS değişikliği — **yeni APK GEREKMEZ**, reload (r) yeter. Testten ÖNCE: telefonda Ayarlar > Uygulamalar > Ruhbaz > İzinler > Kamera'yı **"Her seferinde sor"** veya **"İzin verme"** durumuna çek (ilk-izin akışını görmek için).

| # | Test | Beklenen | Durum |
|---|---|---|---|
| EK4-1 | El okuması → fotoğraf kutusuna dokun → **Kamera** | Telefonun **sistem izin penceresi** açılır (eskisi gibi); seni doğrudan ayarlara YOLLAMAZ | ☐ |
| EK4-2 | Sistem penceresinde **İzin Ver** | Kamera açılır, fotoğraf çekebilirsin | ☐ |
| EK4-3 | Sistem penceresinde **Reddet** (bir kez) | Markalı "Tekrar Dene" kutusu çıkar; Tekrar Dene → sistem penceresi yeniden açılır | ☐ |
| EK4-4 | Kamerayı kalıcı reddet (Android "bir daha sorma") sonra Kamera'ya dokun | Markalı "Ayarları Aç" kutusu (doğrudan ayarlara değil, önce markalı kutu) | ☐ |
| EK4-5 | **QR bağlantısı:** Kamera izni verildikten sonra dev-client'ta "Scan QR Code" dene | QR tarayıcı açılır ve okur (kamera izni düzelince QR da düzelir — ikisi aynı izne bağlıydı) | ☐ |

**Değişen dosya → test eşlemesi (EK-4):**

| Değişen dosya | Değişiklik | Karşılayan test |
|---|---|---|
| `mobile/src/components/ImageUploader.tsx` | Kamera izni artık DOĞRUDAN isteniyor (sistem sorgusu çıkar); izin-öncesi ayarlara yönlendirme kaldırıldı; markalı modal yalnız ret/kalıcı-ret için | EK4-1..EK4-4 |
| (dolaylı) dev-client QR tarayıcı | Aynı kamera iznine bağlı — izin düzelince QR da çalışır | EK4-5 |
| `mobile/src/services/geminiDirectService.ts` | Generate isteğine gizli-header | F0-A1 |
| `mobile/src/services/geminiEmbeddingService.ts` | Embed isteğine gizli-header | F0-A2 |
| `mobile/src/services/generalAstroApiService.ts` | General-astro GET'ine gizli-header | F0-A3 |
| `agent/scripts/check_turkish_utf8.py` | Windows konsol UTF-8 düzeltmesi (yalnız script çıktısı) | Cihaz testi gerekmez — Claude koştu, geçti |
| `agent/AGENTS.md` | Endpoint listesi güncellendi (doküman) | Cihaz testi gerekmez |

### Grup EK-5: Okuma kalitesi düzeltmeleri (Ozan testleri, 2026-06-11)

> **📦 KURULUM KUTUSU (EK-5):** Yalnız JS/TS değişikliği — **yeni APK GEREKMEZ**, app'te reload (r) yeter (token server + expo açık olsun).
>
> **🔁 REGRESYON UYARISI (EK5-1/5/6):** Paragraf düzeltmesi TÜM okumaları besleyen tek formatöre (`SelectableFormattedText`) dokundu. Sadece sıra-sayısını değil, **genel paragraf görünümünü de** kontrol et: herhangi bir okumada paragraflar hâlâ düzgün ayrılıyor mu, metin tek blok olmadı mı, madde/başlık bozulmadı mı? Birkaç farklı okuma tipinde (astro, tarot, kahve, rüya) göz at.

| # | Test | Beklenen | Durum |
|---|---|---|---|
| EK5-1 | **Senin Evin** → astroloji okuması al; içinde "7. evdeki", "3. haftada", "12. evindeki" gibi sıra-sayılı ifade olsun. **(Regresyon: başka okuma tiplerinde de paragraflar düzgün mü, bak.)** | Sayı ile kelime AYNI paragrafta kalır; "7." görünce yeni paragrafa kayma YOK. Paragraflar yine var (okuma kolaylığı korunur) | ☐ |
| EK5-2 | El okuması → elin SIRTINI (tırnaklar kameraya bakacak şekilde) yükle | Nazik ret: avuç içi çizgileri istenir; okuma BAŞLAMAZ (eskiden başlıyordu — düzeltildi) | ☐ |
| EK5-3 | (Regresyon) El okuması → gerçek avuç içi (çizgiler net) yükle | Okuma normal başlar (güçlendirilmiş prompt gerçek avuç içini reddetmiyor) | ☐ |
| EK5-4 | Kahve → yalnızca TABAK fotoğrafı yükle → yorum al | Yorum yalnız tabak yüzeyinden bahseder; "fincanın kulbuna yakın" gibi tabakta olmayan parça atfı YOK | ☐ |
| EK5-5 | **İkram Masası** → düz-metin sonuçlu bir genel okuma al (tarot/astro kartı olmayan tip), sıra sayısı geçsin | Paragraf düzeltmesi burada da geçerli (bu ekran eskiden formatörü atlıyordu) | ☐ |
| EK5-6 | **İkram Masası → Genel Burç Uyumu** → uzun bir uyum yorumu al ("1. kişinin / 2. kişinin" geçer) | "1." / "2." sıra sayıları bölünmez; paragraflar düzgün | ☐ |

**Değişen dosya → test eşlemesi (EK-5):**

| Değişen dosya | Değişiklik | Karşılayan test |
|---|---|---|
| `mobile/src/components/SelectableFormattedText.tsx` | Sıra-sayısı koruması kelime-listesinden genel kurala çevrildi (rakam+nokta+küçük harf = sıra sayısı, bölme yok); Türkçe ekler artık kaçmıyor | EK5-1, EK5-5, EK5-6 |
| `mobile/src/screens/GeneralReadingResultScreen.tsx` | İkram Masası düz-metin fallback'i artık `SelectableFormattedText`'ten geçiyor (formatör atlanmıyordu) | EK5-5 |
| `mobile/src/screens/SunCompatibilityScreen.tsx` | Güneş uyumu bölüm metinleri artık `SelectableFormattedText`'ten geçiyor | EK5-6 |
| `mobile/src/services/fortuneApiService.ts` | El sınıflandırma prompt'u güçlendirildi: tırnak/boğum/el sırtı → human_hand_back; avuç çizgileri net değilse varsayılan ret | EK5-2, EK5-3 |
| `mobile/src/services/fortunePromptBuilder.ts` | Yalnız-tabak yüzey kuralı: fincan/kulp gibi olmayan parçalara konum atfı yasaklandı | EK5-4 |

> **Paragraf düzeltmesi kapsamı (Ozan sorusu — "tüm okuma tipleri için genel mi?"):** Düzeltme TEK noktada — `SelectableFormattedText.formatReadableText`. **Senin Evin'in tamamı** (astro, numeroloji, doğum haritası, ilişki, tarot, rüya, kahve/el) ve **İkram Masası'nın tamamı** (genel astro/tarot/I-Ching/ilham kartları + düz-metin fallback + Güneş uyumu) artık bu tek formatörden geçiyor — yukarıdaki iki ekran (GeneralReadingResult fallback + SunCompatibility) bu oturumda eklendi. Not: "Kendini Tanı" altındaki MBTI/kişilik testi açıklamaları STATİK veri (LLM üretimi değil, sıra-sayı riski yok); papatya falı tek-kelime yanıt — kapsam dışı, gerek yok.

---

## ⏳ KALAN TESTLER (Faz 0 — en sonda / koşulları oluşunca)

Bu maddeler bilinçli ertelendi; Faz 0 "bitti" sayılır ama bunlar açık kuyrukta. Faz 1'e geçmeden Ozan müsait olunca dönülür.

| Madde | Neden bekliyor | Ne zaman |
|---|---|---|
| **EK1-9** (pati ALTI fotoğrafı) | Kedinin pati altı fotoğrafı çekilemedi (hayvan izin vermedi) | Fırsat olunca; düşük öncelik |
| **EK2-4, EK2-5, EK2-6** (izin uyarısı tipi) | İzin sorgusu ilk geliş bazen markasız/beyaz, sonra markalı geliyor; tetikleyici net değil. Ozan şimdi vakit ayırmak istemiyor | **K31 (chat ekranı dönüşümü)** aşamasında STT/izin akışıyla birlikte |
| **EK-3** (uygulama adı "Ruhbaz Konağı") | Etiket yeni APK derlenince değişir; şu an eski etiket görünüyor | **Bir sonraki APK derlemesinde** |
| **F0-A4, F0-A5, F0-A6** | Ozan yapmayacak (curl ön-doğrulamaları zaten geçti) | Atlandı — gerekirse ileride |
| **F0-C** | Cihaz için anlamı yok (öz-review düzeltmeleri statik doğrulandı) | Atlandı |

**Atlanan testlerin gerekçesi (Ozan kararı):** F0-A4/5/6 ve F0-C, cihazda elle koşmaya değmeyen, Claude'un curl/statik doğrulamalarıyla zaten kapanmış maddeler. Ozan bunları bilinçli atladı; regresyon riski düşük çünkü değişiklikler ya backend-curl ya statik-araç doğrulamalı.

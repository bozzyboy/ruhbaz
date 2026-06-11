# 12 — CİHAZ TEST LİSTESİ (Ozan tek oturuşta iner)

**Nasıl kullanılır:** Claude her kod değişikliğinde buraya test maddesi ekler (değişiklik → test maddesi birebir eşleşir; istisna yok). Sen müsait olduğunda yukarıdan aşağı inersin. Her grubun başındaki **KURULUM kutusu** o grubu koşmadan önce ne yapman gerektiğini söyler — tahmin etmen gereken hiçbir adım yok.

**Test düzeni (senin kararın):** Expo Go YOK. Telefonda **dev build APK** + PC'de **Expo dev server** (`npx expo start`) + **token server** (`cd agent && python token_server.py`).

**Kurulum kutusu kuralları (hangi değişiklik ne gerektirir):**
- Native/gradle/modül değişikliği → **YENİ APK** kur.
- Yalnız JS/TS değişikliği → mevcut APK yeter; `npx expo start` + app'te reload (r).
- `agent/token_server.py` değişikliği → **token server'ı yeniden başlat** (Ctrl+C → `python token_server.py`).
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
| `mobile/src/services/geminiDirectService.ts` | Generate isteğine gizli-header | F0-A1 |
| `mobile/src/services/geminiEmbeddingService.ts` | Embed isteğine gizli-header | F0-A2 |
| `mobile/src/services/generalAstroApiService.ts` | General-astro GET'ine gizli-header | F0-A3 |
| `agent/scripts/check_turkish_utf8.py` | Windows konsol UTF-8 düzeltmesi (yalnız script çıktısı) | Cihaz testi gerekmez — Claude koştu, geçti |
| `agent/AGENTS.md` | Endpoint listesi güncellendi (doküman) | Cihaz testi gerekmez |

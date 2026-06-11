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

| # | Test | Beklenen | Durum |
|---|---|---|---|
| F0-A1 | Uygulamayı aç → Suzan'la kahve yorumu başlat → telveli fincan fotoğrafı yükle → yorumu bekle | Yorum normal üretilir (tüm trafik `/gemini-generate` proxy'sinden geçiyor; `/gemini-api-key` kaldırıldı ama istemci onu zaten hiç kullanmıyordu) | ☐ |
| F0-A2 | Aynı seansta sohbete devam et (1-2 takip mesajı yaz) | Yanıtlar gelir, hafıza bağlamı çalışır (embedding `/gemini-embed` yolu sağlam) | ☐ |

**Değişen dosya → test eşlemesi (F0-A, şimdiye dek):**

| Değişen dosya | Değişiklik | Karşılayan test |
|---|---|---|
| `agent/token_server.py` | `/gemini-api-key` endpoint'i silindi | F0-A1, F0-A2 + Claude curl (404) |
| `agent/scripts/check_turkish_utf8.py` | Windows konsol UTF-8 düzeltmesi (yalnız script çıktısı) | Cihaz testi gerekmez — Claude koştu, geçti |
| `agent/AGENTS.md` | Endpoint listesi güncellendi (doküman) | Cihaz testi gerekmez |

# FAZ 0 BİTTİ — Güvenlik + Altyapı (2026-06-11)

Değişmez arşiv snapshot'ı. Güncel durum için her zaman `00_HANDOFF.md`'ye bak.

## Ne yapıldı (commit sırasıyla)

| Commit | İş |
|---|---|
| `425c705` | İlk commit: FALCI v3 kopyası + planlama dokümanları; .gitignore güçlendirildi (*.env.local, kişisel txt'ler, settings.local.json); sızıntı taraması temiz |
| `ecdff74` | Claude kurulumu: izin listesi + tsc/UTF-8 PostToolUse hook'u (Ozan sohbette onayladı) |
| `11bef3e` | Kök temizlik: bozuk package.json (binary çöp), app.json, package-lock.json, test_output.txt → `_arsiv/` (bozuk package.json node'u kökten kırıyordu) |
| `aa9c9e9` | **G2:** `/gemini-api-key` endpoint'i silindi (istemci hiç kullanmıyordu — doğrulandı); test listesi başlatıldı |
| `2cf90d3` | **G3:** CORS söküldü + `X-Agent-Secret` zorunlu (app+server TEK commit); gizli değerler agent/.env + mobile/.env.local'da (git dışı); .env.example şablonu |
| `729910d` | .gitignore istisnası + .env.example commit'i |
| `6695efd` | **G4:** dinleme adresi: varsayılan 127.0.0.1; HOST env ile (agent/.env'de HOST=0.0.0.0 — telefon LAN testi için) |
| `2ec2417` | **B-5:** server adresi Expo hostUri'den türetiliyor; expo-constants doğrudan bağımlılık (JS-only) |
| `ed678f7` | Debug kapısı: `ENABLE_DEVELOPER_DEBUG_UI = __DEV__`; HomeScreen'in iki developer paneli bayrağa bağlandı |
| `8921256` | ESLint (eslint-config-expo/flat); 0 hata / 223 uyarı başlangıç çizgisi (react-hooks v6 kuralları şimdilik warn) |
| `d678522` | **K10:** yerel LLM sökümü (−557 satır): localGemmaService silindi; astroEngine/ekranlar/App.tsx temizlendi; Android native söküm (disk üzerinde — android/ gitignore'da); K9/K10 → UYGULANDI |
| `e4f925c` | **Öz-review düzeltmeleri** (aşağıda) |

Backend tek-sağlayıcı kontrolü: kalıntı SIFIR çıktı — server zaten yalnız Gemini (K12 ✅, iş gerekmedi).

## Öz-review (7 bulucu ajan + doğrulama) — ana bulgular ve yapılanlar

1. **DOĞRULANMIŞ BUG — astro cache anahtarı uyumsuzluğu:** ekran girişindeki cache ön-kontrolü 6 parçalı anahtar üretirken kayıt 7 parçalıydı ('gemini' segmenti) → ön-kontrol HİÇ eşleşmiyordu (FALCI v3'ten beri var olan gizli bug). DÜZELTİLDİ.
2. **Adres önceliği:** hostUri'nin env'i gölgelemesi kaçış kapısını kapatıyordu (tünel/farklı makine senaryosu) → sıra: açık env override → hostUri → localhost. Eski URL satırı .env.local'dan silindi; `sync-agent-url.js` arşivlendi.
3. **Fail-open auth tuzağı:** PROTECTED_PATHS allowlist'i yeni endpoint'leri korumasız bırakırdı → varsayılan-KORUMALI modele çevrildi (`PUBLIC_PATHS={'/health'}`); secret koşulsuz zorunlu (eksikse başlangıçta net hata).
4. **Hook sahte-geçiyordu:** PowerShell BOM'u JSON parse'ı sessizce kırıyordu → BOM temizliği; artımlı tsc (11.5s→4.3s); stderr yakalama; agent/*.py desteği; geçti/KALDI senaryolarıyla gerçekten test edildi.
5. AndroidManifest'teki `libedgetpu_litert` kalıntısı çıkarıldı.

## APK

- Debug APK Claude tarafından derlendi (yerel gradle 8.14.3 + Android Studio JBR 21; bozuk gradle-wrapper.jar aşıldı — `.bozuk.bak` olarak duruyor).
- Yol: `mobile\android\app\build\outputs\apk\debug\app-debug.apk` (~78MB).

## Ozan'a kalan TEK iş

📱 `12_CIHAZ_TEST_LISTESI.md` — tek oturuş, kurulum kutuları hazır (F0-A/B/C grupları). Yeni APK kur → token server + expo start → listeyi in.

## Park edilen notlar (Faz 0 kapsamı dışı, bilinçli)

- **Telefonda yetim Gemma dosyası (~GB'larca):** eski APK'yla model indirildiyse cihazda kalır; silme UI'ı da söküldü. Çözüm adayı: tek seferlik startup temizliği (expo-file-system ile `local-ai/` klasörü) — Faz 1 başında küçük iş; ya da Ozan uygulamayı kaldırıp kurar (dev cihazı).
- **Production adres/cleartext sorunu:** release build'de hostUri yok; gerçek backend kararına kadar (Faz 2+) `EXPO_PUBLIC_AGENT_API_URL` + Android cleartext politikası ele alınmalı.
- **MemoryDebugScreen ("Hafıza Özeti"):** ürün mü debug mu — Ozan kararı bekliyor (07 defterinde ❓). Release'e KAPATILMADAN çıkmamalı; karar verilince ya kapıya alınır ya ürünleşir.
- **agentFetch sarmalayıcı:** 3 fetch noktası header'ı elle ekliyor; K6 god-file refactor'ünde tek noktaya toplanır.
- **ESLint warn→error yükseltmesi** (react-hooks v6 kuralları) K6 refactor'üyle birlikte.
- Eski `local-*` cache kayıtları doğal yolla expire olur (müdahale gerekmez).

## Kuyruk (değişmedi)

B-1 lunar/UTC · B-2 efemeris · B-3 thinking budget · B-4 kahve çoklu-görsel · sanitizer kesme failleri · 8 sessiz catch · god file (K6).

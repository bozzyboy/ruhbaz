# 03 — Seri, Ortak Hafıza, Gelir Modeli ve Unified Memory İlişkisi

Bu doküman Ozan'ın dört büyük stratejik sorusunu tek yerde cevaplar:
1. Ruhbaz Konağı bir app SERİSİ mi olmalı, nasıl kategorize edilmeli?
2. Seri app'lerin ortak kullanacağı, platform/LLM/app-agnostik hafıza nasıl olur?
3. "Kullanıcı kendi LLM aboneliğiyle girsin, ben seans satayım, bende API maliyeti oluşmasın" hayali bugün ne kadar mümkün?
4. Unified Memory ayrı bir şey mi?

---

## 1. Seri stratejisi: Konak metaforu

### Önerilen kategorizasyon (konak = evren, odalar = ürünler)

"Ruhbaz Konağı - X" diye düz bir liste yerine, konağın kendisi marka evreni olur; her ürün konağın bir **kanadı/odası** olur. Bu hem pazarlamada hikâye verir hem de mevcut app'in iç yapısıyla (İkram Masası, Senin Evin, Simya Laboratuvarı, Kendini Tanı) aynı dili konuşur:

| Kanat | Kapsam | Durum |
|---|---|---|
| **Sezgi Kanadı** (mevcut app) | Astroloji, sembolik okumalar, spiritüel rehberlik, kendini tanıma | Var — ana ürün |
| **Nefes & Dinginlik Kanadı** | Nefes egzersizleri, meditasyon, uyku | Gelecek fikir |
| **Beden Kanadı** | Beslenme/diet, ritüel-rutinler, hareket | Gelecek fikir |
| **Hikâye/Lore Kanadı** | Persona ailesinin sosyal/lore evreni, Konak Akışı | İçerik katmanı, app değil |

### Net tavsiye: ŞİMDİLİK SERİ YOK

Gerekçeler:
- Her yeni app = ayrı store hesabı işi, ayrı sürüm/QA, ayrı ASO, ayrı hukuki metin, ayrı destek. Solo geliştiriciye N app, N kat yük demektir.
- İlk app henüz gelir üretmiyor ve İngilizcesi yok. Seri, kanıtlanmış bir çekirdeğin kopyalanmasıdır; kanıt yokken seri kurulmaz.
- Konak metaforunun güzelliği: yeni kanat önce TEK app içinde bir "oda" olarak açılır (ucuz deney). Oda kendi başına kullanıcı tutarsa o zaman ayrı app'e "taşınır" (spin-off). Bu yolda hiçbir emek çöpe gitmez.

Seri günü geldiğinde isimlendirme hazır: "Ruhbaz Konağı: Nefes", "Ruhbaz Konağı: Sofra" gibi — ana app "Ruhbaz Konağı" adını tek başına taşır.

---

## 2. Ortak hafıza: "Konak Çekirdeği"

Hedef: seri doğarsa tüm app'lerin paylaşacağı, **kullanıcı cihazında** yaşayan, platform/LLM/app-agnostik hafıza. Bugünden yapılacak şey yeni bir sistem kurmak DEĞİL, mevcut Memory V2'yi taşınabilir hale getirmektir.

### Tasarım ilkeleri

1. **Paket olarak ayrıştır:** Memory V2 servisleri (SQLite şema, node/edge, embedding, prompt-pack) Ruhbaz koduna değil, app-bağımsız bir TypeScript paketine ait olmalı ("konak-cekirdegi"). Ruhbaz bu paketi import eder; ileriki app'ler de aynı paketi import eder.
2. **App siloları:** Her kayıt `app_id` taşır (unified memory dokümanındaki "App-Specific Memory Silos" fikrinin aynısı). Ortak insan bilgisi (kişiler, ilişkiler, temalar) global katmanda; okuma transkriptleri gibi app'e özel veri kendi silosunda.
3. **LLM-agnostik sözleşme:** Çekirdek, "LLM'e şunu sor" demez; "şu bağlam paketini ver / şu gözlemi yaz" der. Hangi modelin çağrılacağı app'in işidir. (Bugünkü memoryPromptPackFormatter bu sözleşmenin embriyosu.)
4. **Platform-agnostik veri formatı:** SQLite + Markdown (LLM-wiki) + JSONL. Bunların üçü de her platformda okunur; Drive'a yedeklenebilir.
5. **Paylaşım mekanizması (ileride, seri doğarsa):** Aynı cihazdaki kardeş app'ler arasında Android'de App Group/ContentProvider, iOS'ta App Group container; veya en basiti kullanıcının kendi Drive'ı üzerinden senkron. Bu karar seri doğduğunda verilir, bugün verilmez.

Önemli: Bu çekirdek, ileride Unified Memory ürünü doğarsa onun "App Silosu" istemcisi olacak şekilde isimlendirme/şema uyumu gözetilerek tasarlanır. Böylece iki vizyon birbirini beklemeden ilerler ama yolda birleşebilir.

---

## 2.5 Stratejik ark: rakipten kanala (Ozan'ın net formülü, 2026-06-11)

> "LLM'ler rakip olarak kalmasın; ileride kullanıcılar LLM'lerin İÇİNDEYKEN Ruhbaz'ı kullanabilsin. O güne dek de app'i, personalarla aralarındaki bağ yüzünden — hem hafıza hem sosyal medyadaki sitcom'umsu lore — silmesinler."

İki perde:

- **Perde 1 — Bağ (bugün):** Chat LLM'leri rakipken Konak'ın silinmeme sigortası BAĞdır: tanınma hissi (hafıza — teyze deneyi), persona ailesiyle ilişki ve sosyal medyada yaşayan sitcom-lore (K37 Konak Bülteni). Kullanıcı app'i bir araç olarak değil, bir İLİŞKİ olarak taşır; ilişki silinmez.
- **Perde 2 — Kanal (yarın):** LLM chat uygulamaları rakipten DAĞITIM KANALINA çevrilir: kullanıcı Claude/ChatGPT/Gemini'nin içindeyken Konak'ın servislerini çağırır. Mekanizma bugünden sabitlenmez — MCP mi, AppFunctions mı, OS-seviyesi ajan protokolleri mi, Drive üzerinden read/write mı, hangisi kazanırsa. ÖNEMLİ GÜVENCE: Faz 6a'daki araç (tool) katmanı protokol-BAĞIMSIZ bir yatırımdır; hangi protokol kazanırsa kazansın aynı araç katmanı ona takılır. Yani "hangi mekanizma?" sorusunun cevabını beklemeden Perde 2'ye hazırlanmış oluruz.

Perde 1 Perde 2'nin ön şartıdır: bağı olmayan bir servisi kimse chat'inin içine davet etmez; bağı olan kullanıcı ise "Konağı Claude'uma bağlayayım" der. Lore + hafıza bugün retention, yarın dağıtım kaldıracıdır.

## 3. Gelir modeli: hayal ile bugünün gerçeği

Ozan'ın ideali: kullanıcı kendi ChatGPT/Claude/Gemini aboneliğiyle (kendi OAuth'u) girsin, zekânın parasını kendi planından ödesin; Ozan yalnız deneyimi/seansı satsın; Ozan'ın sunucusunda sıfır API maliyeti.

### Gerçeklik kontrolü (2026 ortası itibarıyla)

- **Tüketici aboneliği ≠ API erişimi.** ChatGPT Plus, Claude Pro, Gemini aboneliği kullanıcıya chat uygulamasında hak verir; üçüncü parti bir uygulamanın "OAuth ile gir, abonelik kotanı benim app'imde harca" diyebileceği evrensel, resmî bir mekanizma YOKTUR. Bu yönde kıpırdanmalar var (ör. OpenAI'ın kendi araçlarında ChatGPT hesabıyla giriş, Anthropic'in Claude Code'da abonelik girişi) ama bunlar sağlayıcının KENDİ ürünleriyle sınırlı; üçüncü parti mobil app'lere açılmış ve üç sağlayıcıda ortak bir standart değil.
- Dolayısıyla "evrensel, tüm platformlarda, kullanıcının aboneliğiyle çalışan benim app'im" bugün KURULAMAZ. Bunu bilmek rahatlatıcı olmalı: bulamamış olman senin eksiğin değil, mekanizma yok.

### Bugün mümkün olan üç yol

**Model A — Kendi app'in + seans/kredi satışı (ÖNERİLEN İLK ADIM)**
- Kullanıcı IAP ile seans/kredi alır; okumalar Ozan'ın proxy'si üzerinden ucuz modelle (bugünkü flash-lite çizgisi) yapılır.
- "Sıfır API maliyeti" yerine "marjı garantili API maliyeti": seans fiyatı > seans başına token maliyeti olacak şekilde fiyatlanır. Eldeki Excel'ler (FALCI_fal_kredi_finans_modeli) zaten bu hesap için.
- Neden önce bu: tam UX kontrolü (persona, ses, görsel akışlar) yalnız bu modelde mümkün; mevcut kodun %90'ı bu modele hizmet ediyor; store'lar bu modeli sorunsuz kabul eder.

**Model B — MCP sunucusu: "Konak, kullanıcının kendi chat uygulamasının içine gelir" (İKİNCİ FAZ — Ozan'ın hayaline en yakın yol)**
- Ruhbaz, uzak (remote) bir MCP sunucusu olur. Kullanıcı bunu Claude'a/ChatGPT'ye (MCP destekleyen her istemciye) bağlar; konuşma KULLANICININ chat uygulamasında, KULLANICININ aboneliğindeki modelle akar. Zekânın parasını kullanıcının planı öder → Ozan'da inference maliyeti sıfır.
- Ozan'ın MCP sunucusu kendi OAuth'unu işletir: kullanıcı Ruhbaz hesabıyla giriş yapar, satın aldığı seans hakkı sunucuda kontrol edilir → "session satma" hayali burada birebir gerçekleşir.
- MCP tek standart olduğu için platform-platform eklenti (GPT/Gem) geliştirmek GEREKMEZ; bu, Ozan'ın "platforma özel şey yapmam" şartına uyan tek evrensel kapıdır.
- Dürüst sınırlar: (1) MCP'de model Ozan'ın değil; persona tonu tool çıktıları ve yönergelerle taşınır, kontrol app'teki kadar güçlü olmaz. (2) Hedef kitle bugün teknoloji-meraklısı kullanıcı; kitlesel pazar henüz MCP bağlamayı bilmiyor. (3) Hafıza on-device ilkesiyle gerilim var: uzak MCP'ye hafızayı ya kullanıcı cihazından köprüyle ya da kullanıcının kendi deposundan (Drive) vermek gerekir — bu tasarım MCP fazında çözülür.
- Bu yüzden sıralama: A ile gelir ve içerik motoru kanıtlanır → B aynı servis katmanının üstüne "ikinci kapı" olarak açılır. Devam dosyasındaki "headless/MCP tasarım sprinti" bu fazın ön çalışmasıdır.

**Model C — BYOK (kullanıcı kendi API anahtarını girer)**
- Geliştirici maliyeti sıfır; ama API anahtarı tüketici ürünü değildir, kitlesel kullanıcı anahtar alamaz/girmez. Ruhbaz'ın kitlesi için uygun değil; Unified Memory gibi teknik kitleye hitap eden üründe anlamlı (zaten oradaki Option 2 planı bu).

### Özet formül

> Ruhbaz Konağı = (A) app içinde kredi/seans + ucuz model marjı, sonra (B) aynı çekirdeğin MCP kapısı: "Konağı kendi yapay zekânın içine davet et" premium özelliği. C, Ruhbaz için değil Unified Memory için.

---

## 4. Unified Memory ilişkisi

- Unified Memory ayrı bir ÜRÜNDÜR, Ruhbaz'ın altyapısı değildir. Amacı evrensel kişisel hafıza; kapsamı (tüm dijital ayak izi, Chrome eklentisi, masaüstü daemon, Drive hub) Ruhbaz'dan kat kat büyük.
- İkisini aynı anda inşa etmek tükenme garantisidir. Karar önerisi: Unified Memory PARK edilir; fikir klasörü korunur, ara sıra not eklenir.
- Köprü şudur: Ruhbaz'ın "Konak Çekirdeği" (bkz. bölüm 2) app-silo ve wiki/markdown sözleşmelerini Unified Memory dokümanlarındaki şemalarla uyumlu adlandırır. Gün gelir Unified Memory yapılırsa, Ruhbaz onun ilk ve en iyi entegre müşterisi olur (`apps/com.ruhbaz.md` silosu hazır olur).
- Unified Memory'nin doğru doğum sırası da muhtemelen Ruhbaz'dan ÖĞRENEREK olacaktır: Ruhbaz'da kanıtlanan hafıza çekirdeği, evrensel ürünün çekirdeği olarak ayrışır.

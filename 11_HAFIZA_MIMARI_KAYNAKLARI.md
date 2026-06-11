# 11 — Hafıza Mimarisi: İlham Kaynakları Haritası ve Tasarım Soruları

Ozan'ın `FALCI v3\docs\bazi linkler.txt`'te beğendiği repo/videoların, Ruhbaz hafıza mimarisinin (Konak Çekirdeği — 03/2) HANGİ katmanına ilham verdiğini eşleştirir; ve Ozan'ın teknik sorularını (decay nereye, caveman mı headroom mü) cevaplar. Bu bir TASARIM dokümanıdır; uygulama "hafıza inşa fazı"nda yapılır (Faz 0 değil).

## Önemli çerçeve önce
Hiçbir kaynağı komple almıyoruz; her birinden bir FİKİR alıp Ruhbaz'ın ürün-özel hafızasına uyarlıyoruz (devam dosyasındaki karar: "gbrain'i komple alma, brain-as-a-service fikrini omurgaya uyarla"). Mevcut Memory V2 bu mimarinin ~%60'ı zaten kodda (SQLite şema, embedding, graph edge, caveman sıkıştırma) — yeniden yazmıyoruz, tamamlıyoruz.

## Kaynak → Katman eşleştirmesi

| Kaynak (beğenilen) | Aldığımız fikir | Ruhbaz'da karşılığı (katman) |
|---|---|---|
| **bradwmorris/ra-h_os** (SQLite + sqlite-vec) | Yerel SQLite üstünde semantik arama hattı | Raw Evidence Vault + Vector Index (zaten expo-sqlite + embedding var) |
| **karpathy LLM Wiki gist** | Ham veri → okunabilir wiki sayfaları | LLM Wiki katmanı (`AGENT_BRAIN.md` benzeri kullanıcı/persona wiki'leri) — henüz otomatik üretilmiyor |
| **SimpleMem (aiming-lab)** | 3 retrieval tipi: semantic + graph + episodic; 30x token azaltımı | Hybrid Retrieval'ın çatısı: tam da bizim "bilinmek"in 3 hali (anlaşılmak/tanınmak/ortak geçmiş) |
| **gbrain (garrytan)** | Links-merkezli graph + hybrid search (BM25+vector+RRF+rerank+graph boost) + MCP | Retrieval füzyon katmanı + MCP kapısı (Faz 6) |
| **caveman (juliusbrussee)** | Uzun metni ilkel/anlam-koruyan kısa forma indirme (%60-75 sıkıştırma, SQLite FTS5) | Caveman sıkıştırma — INGESTION anında (zaten kodda var) |
| **Headroom (chopratejas)** | Sliding window + context-limit yönetimi | Headroom — RETRIEVAL/prompt-montaj anında (token bütçesi koruma) |
| **MemPalace** | Eskiyen veriyi silmek yerine "mekânlar" altında özetleme | Progressive summarization — decay'in alternatifi/tamamlayıcısı |
| **gbrain "links" + Ebbinghaus** | Az kullanılan/eski bilginin önemini AZALTMA | Human Meaning Layer'da decay + salience |
| **Second Brain (Henry Daum)** | Local-first agentic runtime, Karpathy modeli | Felsefe: on-device, kullanıcının kendi beyni |
| **LiteRT-LM / gallery (google-ai-edge)** | Cihaz-üstü model runtime | ⚠️ Yerel ÜRETİM kaldırıldı (K10). Ama yerel EMBEDDING ayrı/ucuz konu — açık tutuluyor (aşağıda) |
| **YouTube: "seni tanıyoruz" göze sokmadan** | Tanınmayı sezdirmeden verme | Ürün ilkesi: ana okumada hafıza zarif/tek dokunuş (teyze deneyi) |

## Ozan'ın teknik sorularının cevapları

### S1: Caveman mı, Headroom mu? Hybrid search'e hangisi uygun?
**Yanlış ikilem — ikisi rakip değil, FARKLI AŞAMALARDA çalışır. Üçü de kullanılır:**

1. **Caveman = INGESTION anında (veri girerken).** Ham transcript → ilkel anlam ("Ozan → stres → iş"). Bir kez yapılır, kalıcı küçük form üretir. Depolama ve gelecekteki tüm okumalar için ucuzlatır. → Doğru nokta: yazma anı.
2. **Hybrid search (BM25+vector+RRF+rerank+graph boost) = RETRIEVAL anında (bilgi ararken).** Hangi anıların ilgili olduğunu BULUR. Sıkıştırmaz, SEÇER. → Ayrı iş: getirme.
3. **Headroom = PROMPT MONTAJ anında (modele göndermeden hemen önce).** Retrieval çok şey getirdiyse, token bütçesine sığdırmak için sliding-window/kırpma. → Son kapı: sığdırma.

Akış: **Caveman (yaz) → Hybrid Search (getir) → Headroom (sığdır) → LLM.** Yani "caveman doğru noktada mı?" sorusunun cevabı: caveman ingestion'da doğru; ama getirilen sonucu prompta sığdırma işi caveman'in değil Headroom'un işi — bu ayrımın kodda net olup olmadığı hafıza inşa fazında DENETLENECEK (mevcut `memoryPromptPackFormatter` bu üç rolü karıştırıyor olabilir; 09 god-file uyarısıyla birlikte bakılacak).

### S2: Decay (az kullanılan/eskiyen bilginin önemini azaltma) nereye?
**Human Meaning Layer'da yaşar, BAKIM/uyku fazında uygulanır:**
- Her memory node'unda `salience` + `decay_rate` (unified memory dokümanındaki Ebbinghaus modeli).
- Duygusal yükü yüksek olan (teyzenin "beni unuttun" anı gibi) çürümez — kazınır kalıcıya.
- Çürüyen ama silinmeyecek olan → MemPalace usulü ÖZETLENİR (silmek yerine sıkıştırarak sakla). gbrain'in "links zayıflatma" fikri de burada.
- ⚠️ Devam dosyası: "caveman sıkıştırması + düşük güvenli reading-derived kayıtları zayıflatma" zaten kodda. Yani decay'in embriyosu var; eksik olan ZAMANLANMIŞ bakım (uyku consolidation) ve graph-walk ile gizli bağ üretimi.

### S3 (Ozan'ın genel kaygısı): "bunlar doğru noktalarda mı yapılıyor?"
Cevap: Kısmen kodda, kısmen eksik. Hafıza inşa fazı bir DENETİMLE başlamalı (tıpkı 09 gibi ama hafızaya odaklı): hangi sıkıştırma nerede çalışıyor, retrieval füzyonu var mı yok mu, decay zamanlanmış mı. O denetim olmadan yeni kod yazmak, eski over-engineering hatasını tekrarlar.

## Üç hafıza katmanı (Ozan vurgusu, 2026-06-11: "lore'un da memory'si ayrı katman, aynı şekilde önemli")

Tek bir "hafıza" yok; üç ayrı ama bağlantılı hafıza var ve üçü de birinci sınıf vatandaş:

1. **Kullanıcı hafızası** (User Graph + episode + wiki): kullanıcıyı, yakınlarını, niyetlerini bilir. Sahibi: kullanıcı, cihazında.
2. **Lore hafızası** (Lore Graph — `lore_nodes/lore_edges` zaten kodda ayrı tablolar): Konak evreninin KENDİ tarihi — Teoman-Suzan çekişmesinin geçmişi, Ayşe'nin meşhur tarifleri, geçen yeniayda konakta ne olduğu. Kanon (yavaş, kaynak markdown) + Bülten (güncel, feed — K37) bu katmanı besler. Sahibi: ürün; tüm kullanıcılarda ortak.
3. **Bağ hafızası** (Bond Graph — devam dosyasında tanımlı): kullanıcı ile persona ARASINDAKİ ilişkinin hafızası — kim kiminle daha çok okuma yaptı, hangi persona ona ne demişti, güven/yakınlık seviyesi. Sahibi: kullanıcı cihazında ama lore'a referans verir.

Sihir üçünün KESİŞİMİNDE: "Deniz, kullanıcıya (1) onun sınav stresini hatırlayarak, (2) Ayşe'nin dünkü tarifini bilerek, (3) kullanıcının en çok Suzan'la konuştuğunu sezerek" konuşur. Chat LLM'leri bunların hiçbirine sahip değil.

## Kullanıcı identity.md durumu (Ozan sorusu: "users'da da var değil mi?")

Doğrulandı (2026-06-11): `mobile/src/identity/users/` klasörü VAR ama yalnız README iskeleti — önerilen yapı yazılmış (`users/<user-id>/profile.md`, `preferences.json`, `personas/<persona-id>.md`), içi henüz BOŞ. Yani personaların identity.md'si var; kullanıcının dengi henüz üretilmiyor (profil verisi runtime'da JSON'larda yaşıyor). Bu boşluk, Karpathy LLM-Wiki katmanının ta kendisi: hafıza inşa fazında kullanıcı başına cihazda üretilen/yenilenen bir "kullanıcı wiki" (profile.md dengi) bu iskelete oturur. Repo'daki klasör ŞABLON; gerçek kullanıcı dosyaları cihazda (`falci-data` → yeni adıyla) üretilir, repoya asla girmez.

**Ozan netleştirmesi (2026-06-11): İKİ farklı "kullanıcı dosyası" var, karıştırılmasın:**
1. **Karpathy-wiki (otomatik):** Hafızadan damıtılan, sistemin yazıp güncellediği özet sayfa (RAG için).
2. **Kullanıcı identity.md (persona identity.md gibi):** Sistemin kullanıcıyı TANIYIP üzerine EKLEMELER yaptığı, persona kimlik dosyalarının dengi — kalıcı, yapılandırılmış kimlik. Hem ANA kullanıcı hem her PROFİL (eş/çocuk/anne...) için ayrı identity dosyası olur. Persona identity.md kalıbı bunun şablonu; fark: persona'nınki elle yazılır, kullanıcınınki sistemce büyütülür (user-stated bilgi en yüksek güvenle, reading-derived düşük güvenle — mevcut politika).

**Ozan vurgusu (2026-06-11):** Bu identity dosyaları personalarınki kadar DETAYLI ve EVRİMLEŞEN olmalı — özellikle ana kullanıcının. Yani statik bir profil kartı değil; persona kimlik dosyaları gibi zengin (kişilik, ilişkiler, hassasiyetler, tekrar eden temalar, ton tercihi) ve zamanla büyüyen/güncellenen canlı bir belge. Decay/consolidation bu dosyaya da uygulanır.

**KRİTİK DÜZELTME (Ozan, 2026-06-11): "Tanınma hissi" yalnız identity.md'lere BAĞLI OLMAMALI.** Önceki ifadem ("o his bu dosyaların ürünü") yanlıştı ve mimari bir tuzaktı. Tanınma, TÜM hafıza yığınından EMERGENT (ortaya çıkan) bir özelliktir; identity.md yalnız BİR katmandır (damıtılmış, yavaş güncellenen özet). Tek bir özet belgeye bağlamak şu yüzden tehlikeli:
- Wiki/identity henüz ince/eskimişse kullanıcı "unutulmuş" hisseder (oysa veri başka katmanda durur).
- Asıl "az önce/geçen sefer" sıcaklığı identity.md'den değil, **episodik retrieval + graph + embedding + reading fingerprint** katmanlarından gelir.

Tanınma = şunların TOPLAMI: (1) episodik hafıza ("geçen sefer sınav stresinden bahsetmiştin"), (2) graph ("eşin, kedin, işin"), (3) semantic/embedding ("buna benzer bir şey sormuştun"), (4) bond ("en çok Suzan'la konuşuyorsun"), (5) identity.md/wiki (damıtılmış kalıcı kimlik). identity.md bunların yerine GEÇMEZ, üstüne özet katar. Teyze deneyindeki his de tek dosyadan değil, bu katmanların hep birlikte çalışmasından doğdu — profiller silinince HEPSİ uçtuğu için his kayboldu. Tasarım kuralı: hiçbir katman tek başına "tanıma"nın sahibi değil; retrieval füzyonu (hybrid search) bunların hepsini birleştirir.

## Multimodal embedding fırsatları (Ozan: "ne zaman neye lazım, bulamadım")

Embedding hattımız multimodal modele geçirilebilir (görsel+metin+ses aynı vektör uzayı). Somut kullanım adayları — hiçbiri bugün taahhüt değil, hafıza fazında maliyet/değer süzgecinden geçer:

| Kullanım | Ne işe yarar | Not |
|---|---|---|
| Kahve fotoğrafı embedding'i | Görsel süreklilik: "bu fincan deseni geçen ayki okumana benziyor" — fingerprint/anti-tekrar + devamlılık hissi | Reading fingerprint zaten var; görsel boyut eklemek doğal uzantı |
| Görsel arşivde metinle arama | "Geçen yüklediğim, kuş gibi görünen telve" → metin sorgusuyla görsel bulma | Hybrid retrieval'a görsel modalite |
| Pet sürekliliği | Aynı patinin/evcil hayvanın yeni fotoğrafını eskisiyle eşleme → "Pamuk yine gelmiş!" | Yüz-tanıma DEĞİL (insan yok); tür-içi benzerlik |
| Manifest eser galerisi | Üretilen eserlerde anlamla arama; benzer sembol/atmosfer önerisi | Karakter Atölyesi tutarlılığına destek |
| Sesli not/Dert Odası | Ses parçalarını episodik hafızaya gömme ("geçen ağladığın konuşma") | KVKK en hassas nokta — ses saklama rızası şart |
| ⚠️ Dikkat | Avuç içi görselini embed'lemek "biyometrik" algısına yaklaşır; el görselleri embedding DIŞINDA tutulmalı | Temkinli varsayılan |

Karar zamanı: hafıza inşa fazı; tetik soru "hangi kullanım retention'a ölçülebilir katkı verir?"

## Embedding: mevcut durum + Ozan'ın "sayaçta 0" gözleminin sırrı (kod doğrulandı 2026-06-11)

- **Mevcut model:** `gemini-embedding-2` (BULUT), `geminiEmbeddingService.ts`. Backend `/gemini-embed` proxy'sinden geçiyor. Yerel Gemma embedding ŞU AN KULLANILMIYOR — embedding zaten buluta gidiyor.
- **"Output token neden 0?"** → DOĞRU davranış: embedding üretmek ÇIKTI tokeni üretmez, yalnız GİRDİ tokeni tüketir. `recordEmbeddingUsage` zaten `outputTokens: 0` yazıyor. Yani output 0 olması bug değil.
- **"Input de 0 geliyordu" → İŞTE BU BİR ÖLÇÜM AÇIĞI (bug).** Kodda (`memoryEmbeddingService.ts:73`): `if (!inputTokens && !rawInputTokens && !rawTotalTokens) return;` — backend usage bilgisi DÖNDÜRMEZSE kayıt komple atlanıyor. Yani `/gemini-embed` proxy'si yanıtında token sayısını geri vermiyorsa, embedding maliyeti GÖRÜNMEZ kalıyor (harcama oluyor ama ledger'a yazılmıyor). 
- **Sonuç:** "Ne kadar tüketiyor bakmak lazım" diyorsun — ŞU AN BAKAMIYORUZ çünkü ölçülmüyor. İlk iş: backend'in embedding usage'ını döndürmesini sağlamak (Gemini embed API token sayısı veriyor; proxy bunu geçirmeli). Ölçüm düzelmeden yerel-vs-bulut kararı verilemez (kör uçuş).

## Açık karar: Yerel embedding (yerel ÜRETİM kaldırıldı ama bu ayrı)
K10 yerel LLM ÜRETİMİNİ kaldırdı. Ama embedding üretmek üretken modelden çok daha ucuz/küçük bir iş. Seçenek: embedding'i cihazda üretmek → "hafıza cihazda" ilkesi + maliyet sıfır. Yerel aday: **EmbeddingGemma (~300M parametre)** — Google'ın on-device embedding modeli, LiteRT runtime ile çalışır (Ozan'ın hatırladığı "gemma embedding 300 / litertlm" bu). Multimodal gerekiyorsa ayrı değerlendirme (EmbeddingGemma metin-odaklı; görsel için ayrı model). KARAR ERTELENDİ → önce ölçüm açığı kapatılır, gerçek hacim/maliyet görülür, sonra yerel-vs-bulut. (K10 ile çelişmez: üretim ≠ embedding.)

## gbrain-tarzı "link/URL ile traversal" — bizde var mı? (kod doğrulandı 2026-06-11)

Ozan sorusu: Memory kendi içinde arama yaparken gbrain'deki gibi URL/link tarzı bağ kullanıyor mu / kullanacak mı?

**Bugünkü gerçek: linkin İSKELETİ var (ID-referanslı kenarlar), ama yürünebilir traversal MOTORU yok.**
- `memory_edges`: `from_node_key → edge_type → to_node_key` + explanation + confidence. = gbrain kenarının birebir dengi.
- Her kenar kaynağa geri işaret ediyor: `source_reading_id`, `source_raw_id`. = gbrain `source_uri`'sinin işlevsel eşi (URL string değil, ID referansı).
- `memory_embeddings`: `source_table` (memory_nodes/raw_sources/semantic_wiki/persona_relationships) + `source_id` → her vektör kaynağını bilir.
- `lore_nodes`: düpedüz `source_url TEXT` kolonu bile var.

**Eksik:** Kenarları gerçek graf gibi YÜRÜYEN (traversal / random-walk / komşuya zıpla → kaynağa in) retrieval yok; arama bugün ağırlıklı embedding benzerliğiyle. Devam dosyasının "raw, journal, fingerprint, chunk, node, edge henüz tek links-tabanlı hafızada birleşmedi" notu tam bu.

**Yön:** Evet, kullanacağız — ama "sıfırdan link sistemi kurmak" DEĞİL, "mevcut ID-referanslı edge'leri traversal'a bağlamak" işi. Hybrid retrieval'ın graph-traversal ayağı (SimpleMem'in graph motoru, gbrain'in walk'u) bu kenarların üstüne oturur. URL-string yerine (refId/source_id) referansları kullanmak on-device için yeterli ve daha hızlı; gerçek URL'ye ancak unified memory (cihaz-dışı, çok kaynaklı) aşamasında ihtiyaç olur.

## Sıralama
Bu mimari ağırlıklı olarak retention motoru — değerli ama Faz 0/1/2 (güvenlik, hukuk, gelir) ÖNCE. Hafıza derinleştirme, gelir kanıtlandıktan sonra kendi fazında; Konak Çekirdeği ayrıştırması (K6) ile birlikte. Bu doküman o faz için pusula.

# FALCI v3 Claude Code Devam Dosyası

Bu doküman, FALCI v3 projesine Claude Code ile kaldığımız yerden devam edebilmek için hazırlanmış bağlam dosyasıdır. Kaynak olarak proje içindeki restore dokümanları, hafıza mimarisi notları, AGENTS kuralları, güncel git geçmişi ve Codex session loglarındaki FALCI v3 konuşma başlıkları tarandı.

## Kısa Özet

FALCI v3, sadece fal baktırılan bir mobil uygulama değildir. Hedef; Türkçe, kişisel, hafızalı, persona tabanlı, ileride hem uygulama arayüzünden hem de headless/MCP benzeri dış ajan arayüzlerinden kullanılabilecek bir kişisel sezgisel danışmanlık sistemi kurmaktır.

Ürün şu anda React Native / Expo mobil uygulaması ve küçük Python backend proxy katmanı olarak ilerliyor. Mobil taraf prompt, persona, hafıza, okuma akışları, token ledger ve yerel veri katmanının ana merkezidir. Backend şu anda Gemini anahtar/proxy ve kota/sağlık kapısıdır; prompt üretmez.

En kritik proje ilkeleri:

- Kullanıcıya görünen tüm metinlerde doğru UTF-8 Türkçe karakter kullanılacak.
- İş mantığı ekran bileşenlerine gömülmeyecek; servis/hook katmanında kalacak.
- Kahve, el ve pati görsel uygunluğu deterministik dosya/slot/OCR/renk heuristiğiyle değil, API/LLM sınıflandırmasıyla yapılacak.
- Hafıza kullanıcının sözünü faldan çıkan çıkarımlardan daha üstün tutacak.
- Ana falda hafıza zarif ve hafif kullanılacak; follow-up ve danışmanlıkta daha derin bağlam kullanılacak.
- Yeni özellikler ileride başka bir flow, wheel menu, karakter seçimi, ritüel akışı veya headless kullanım tarafından çağrılabilecek şekilde gevşek bağlı tasarlanacak.

## Ürünün Asıl Vizyonu

FALCI v3 için düşünce çizgisi baştan beri şu yönde:

1. Kullanıcı bir “fal uygulaması” açmış gibi hissetsin, ama arka tarafta kişisel hafızası, yakınlık profilleri, falcı ailesi ve geçmiş okuma bağlamı birlikte yaşayan bir sistem olsun.
2. Uygulama “her seferinde sıfırdan cevap veren model” gibi davranmasın; kullanıcıyı, evcil hayvanlarını, ilişkilerini, tekrar eden gündemlerini, hassasiyetlerini ve önceki konuşmalarını kontrollü biçimde hatırlasın.
3. Hafıza kullanıcıyı sabitlemesin. Astro, MBTI, numeroloji ve fal çıktıları kesin hüküm değil, yumuşak sinyal olarak kalsın.
4. Falcı ailesi sadece seçilebilir avatar/persona değil, ileride sosyal/lore grafiğiyle yaşayan bir evren olsun.
5. App ileride sadece UI ile değil, ChatGPT/Gemini/DeepSeek gibi ajanların bağlanabileceği headless servis/MCP katmanıyla da çalışabilsin.
6. Kullanıcı ister manuel uygulamadan, ister dış ajan arayüzünden aynı servisleri, aynı hafızayı ve aynı okuma motorlarını kullanabilsin.
7. Memory mümkün olduğunca on-device kalsın. Server tarafında hesap, kredi, abonelik ve teknik metrikler olabilir; kişisel transcript, memory, prompt, görsel ve embedding gibi özel içerikler cihazda kalmalı.

Bu yüzden FALCI’nin uzun vadeli hedefi “fal app’i”nden daha büyük: kişisel hafızalı, persona tabanlı, ruhsal/hikayesel bağlam motoru olan bir mobil asistan platformu.

## Ürün Modülleri

Mevcut ürün yönü dört ana girişe ayrılmış durumda:

- İkram Masası: Genel okumalar. Genel astro günlük/haftalık/aylık, sembolik kartlar ve daha genel içerikler.
- Senin Evin: Kişiye özel okumalar. Kahve, el, pati, kişisel astro, ilişki/aile astro, numeroloji, tarot, rüya gibi profil ve hafıza kullanan akışlar.
- Simya Laboratuvarı: Manifest, kendi okumanı oluşturma, ileride combo/ritüel benzeri yaratıcı akışlar.
- Kendini Tanı: Doğum haritası, temel numeroloji, MBTI/kişilik testleri ve profil essence üretimi.

Bu ayrım yalnız UI düzeni değildir; hafıza ve prompt politikası açısından da önemlidir. Genel okumalar kişisel hafızayı sınırlı kullanmalı veya cache gibi davranmalı; Senin Evin ise seçili profil, persona, niyet, soru ve memory bağlamını daha bilinçli kullanmalıdır.

## Falcı Ailesi ve Persona Çizgisi

Projede falcı ailesi ürünün kalbinde. Persona kimlikleri `mobile/src/identity/assistants/fortune-family/` altında tutulur. Ortak kurallar `common.md` kaynaklıdır ve generated `fortunePersonaData.ts` üzerinden runtime prompt verisine taşınır.

Persona sisteminde önemli kararlar:

- Persona sesi hissedilmeli ama kullanıcıya sistem/prompt/model anlatılmamalı.
- Kapanış cümleleri tekrar etmemeli; remembered persona closing geçmişi kullanılmalı.
- Sağlık, hukuk, finans, ölüm/felaket gibi alanlarda kesin, korkutucu veya yönlendirici dil yasak.
- Kahve/el/pati görsel yorumunda model gördüğü kanıta dayanmalı; görmediği şekil, kişi, olay veya niyet uydurmamalı.
- Kullanıcıya görünen metinde yapay zeka, model, LLM, Gemini gibi teknik terimler mümkün olduğunca görünmemeli.

Önceden özellikle 503/servis hatalarında model adlarının görünmemesi konuşuldu. Kullanıcı ürün dilinde “hangi LLM kullanılıyor” bilgisinin sızmasını istemiyor.

## Hafıza Vizyonu

Hafıza mimarisi basit history değildir. Hedef yapı:

- Raw Evidence Vault: Fal transcriptleri, follow-up’lar, profil editleri, testler, sosyal lore olayları.
- Episode Memory: Her oturumun kısa ve anlamlı episode özeti.
- Human Meaning Layer: Bilginin kullanıcı için önemini, kırılganlığını, ilişki etkisini ve güncelliğini puanlama.
- User Graph: Kullanıcı, yakınları, evcil hayvanları, ilişkileri, temaları, hassasiyetleri.
- Lore Graph: Falcı ailesi ve sosyal medya/lore evreni.
- Bond Graph: Kullanıcı ile falcı ailesi arasındaki tercih/güven/yakınlık bağı.
- LLM Wiki: Kullanıcı ve falcı ailesi için okunabilir, güncellenen bilgi sayfaları.
- Vector Index / Hybrid Retrieval: Keyword, graph, vector, rerank ve context planner.

Temel hafıza politikası:

- User-stated bilgi en değerlidir.
- Follow-up soruları önemli sinyaldir.
- Profil, test, doğum haritası, MBTI gibi bilgiler eğilim sinyalidir.
- Reading-derived bilgiler kullanıcı doğrulamadıkça gerçek hayat bilgisi gibi konuşulmaz.
- Ana falda memory 1-2 hafif kişiselleştirme olarak kalır.
- Derin memory daha çok follow-up, “geçen sefer” soruları, danışmanlık ve kişisel modüllerde kullanılır.
- Raw data mümkün olduğunca korunur; anlam silinmez. Alan dolunca raw arşiv kontrollü azaltılabilir ama episode/wiki/graph anlamı kalmalıdır.

## Memory V2 Şu An Ne Durumda?

Restore sonrası Memory V2 tarafında şu parçalar kodda var:

- Profil başına kalıcı JSON hafıza dosyaları.
- Raw archive, session journal, reading fingerprint, typed edge, source chunk, prompt audit kayıtları.
- SQLite index: raw source, source chunk, memory node, memory edge, reading fingerprint, lore node, lore edge.
- Caveman sıkıştırması: tekrar eden node kayıtlarını birleştirme, düşük güvenli reading-derived kayıtları zayıflatma.
- Prompt memory pack: okuma öncesi ilgili kısa bağlam seçimi.
- Kullanıcı düzeltmesi: yüksek güvenli core memory ve `corrected_by_user` edge.
- Lore graph: persona identity dosyalarından lore node/edge çıkarma.
- Bakım worker’ı: tüm profillerde consolidation.
- Embedding retrieval hedefi; bazı yerlerde token-overlap fallback ve Gemini embedding proxy mevcut.

Kapanış dokümanında Google Drive arşivleme kapsam dışı bırakıldı. Aktif index hedefi 256 MB, profil başı üst kota hedefi 1 GB olarak not edildi. Uzun vadeli asıl hedef ise 500 MB sabit bütçeli, on-device, hybrid RAG + LLM wiki + graph hafıza sistemi.

## gbrain / MCP / Headless Fikirleri

Son konuşmalarda gbrain ile FALCI memory karşılaştırıldı. Çıkan ana fikir:

FALCI’nin hedefi sadece “memory MCP” değil; bütün app’in headless kullanılabilmesi. Kullanıcı uygulamayı normal UI’dan kullanabilmeli, ama isterse ChatGPT/Gemini/DeepSeek gibi dış ajanlardan da aynı servisleri çağırabilmeli.

gbrain’den ilham alınabilecek taraflar:

- Links merkezli yürünebilir knowledge graph.
- Hybrid search: BM25 + vector + RRF + reranker + graph boost.
- MCP tools.
- HTTP/OAuth server.
- Ingestion ve synthesis job’ları.
- Dream cycle / cron tarzı arka plan düşünme.

FALCI’de zaten bazı graph benzeri yapılar var: memory edge’leri ve lore graph. Ancak henüz raw, journal, fingerprint, chunk, node, edge ve persona/lore tek bir links tabanlı “insan hafızası” gibi birleşmiş değil. Claude ile devam ederken bu fark önemli bir gelecek mimarisi başlığıdır.

Önerilen yön:

- gbrain’i komple almak yerine, “brain as a service” fikrini FALCI’nin ürün-özel memory v2 omurgasına uyarlamak.
- Caveman sıkıştırmasını korumak; gbrain’de olmayan ama FALCI için çok değerli bir bağlam küçültme katmanı.
- Graph ve links yapısını merkezileştirmek.
- MCP toolset’i sadece memory read/write değil, bütün okuma başlatma, profil seçimi, persona seçimi, follow-up sorma, geçmiş okuma getirme, token ledger okuma gibi app servislerine açmak.

## 31 Mayıs / 1 Haziran Silinme ve Restore Hikayesi

Projede büyük kırılma: `C:\Users\ozany\Documents\FALCI v3` klasörü 31 Mayıs civarında komple silindi, çöp kutusundan da gitti. GitHub’da güncel hal yoktu. 25 Mayıs backup’ı ve Codex session logları eldeki ana kaynak oldu.

Kurtarma kaynakları:

- 25 Mayıs backup: `D:\APP BACKUPS\falciv3 25.05.2026\FALCI v3\FALCI v3`
- Recovery folder: `D:\Recovered_15_ 2_33\Recycle Bin\Users\ozany\Documents\FALCI v3`
- Güncel çalışma kopyası: `C:\Users\ozany\Documents\FALCI v3`
- Codex session logları: `C:\Users\ozany\.codex\sessions`

İlk teşhis:

- Kaynak dosyaların çoğu kurtulmuştu.
- `.git` hasarlıydı.
- `node_modules` bozuktu.
- `agent/token_server.py` Python dosyası olmaktan çıkmış, yanlış bir email/config dokümanı içeriğiyle kurtulmuştu.
- Bazı secret txt dosyaları 0 byte idi; API key/token bilgileri yeniden girilmeliydi.

Toparlama yaklaşımı:

1. 25 Mayıs backup temel alındı.
2. Recovery kaynak dosyaları ve 25 Mayıs sonrası Codex session logları çapraz kontrol edildi.
3. Kritik dosyalar restore edildi.
4. `node_modules` temiz kurulum mantığına çekildi.
5. `token_server.py` backup/session log çizgisine göre onarıldı.
6. Memory, prompt, astro, kahve multi-image, follow-up, persona closing, token ledger ve backend endpoint hatları geri oturtuldu.
7. Restore sonunda branch commit/push ile sabitlendi.

Restore ana branch:

- `codex/recovery-baseline`

Güncel son commit:

- `465990d Enforce LLM image gates for coffee palm and paw`

Restore süreci kapandı; bundan sonrası normal geliştirme, QA ve yeni mimari işleri olarak düşünülmeli.

## Restore Sonrası Geri Getirilen Önemli İşler

Restore dokümanına göre tamamlanan ana başlıklar:

- Gemini embedding memory v2 docs ve `gemini-embedding-2` çizgisi.
- Çoklu kahve görseli / `cup2` / kahve fotoğraf sürekliliği.
- `FOLLOW_UP_CHAT_CONTRACT`: takip sorularında yeni fal üretmeyen, kısa ve bağlama bağlı cevap.
- `completeWithRememberedPersonaClosing`: tekrar etmeyen persona kapanışları.
- Genel astro generation flow: lokal cache -> server cache -> Gemini üretimi -> lokal fallback.
- Genel astro yorumlarını tekrar etmeme ve memory summary’ye yazma.
- `profileMemoryService` deep restore: reading intent, follow-up question, correction memory, self-knowledge insight, embedding indexing.
- Rüya follow-up ve remembered closing.
- El/pati görsel doğrulama yumuşatma ve sonra LLM gate sözleşmesinin tekrar sıkılaştırılması.
- Kahve/el kısa initial yorum genişletme sistemi.
- Merkezi `sanitizeGenderedAddress`.
- Astro, numeroloji, tarot final metinlerinin merkezi sanitizer’dan geçirilmesi.
- Astro/numeroloji/tarot remembered closing ikinci fazı.
- Doğum haritası initial/follow-up memory snippet bağlantısı.
- Fortune common prompt data yeniden generate edildi.
- Genel token sayaçlarında genel astro Gemini usage ledger’a yazılıyor.
- Backend endpoint dokümanı güncellendi: `/gemini-generate`, `/gemini-embed`, `/gemini-api-key`, `/health`.

## Güncel Teknik Mimari

Mobil:

- Expo / React Native.
- Ana kaynak: `mobile/src`.
- Persona kaynakları: `mobile/src/identity`.
- Hafıza servisleri: `mobile/src/services/profileMemoryService.ts`, `memorySqliteService.ts`, `memoryPromptPackFormatter.ts`, `memoryMaintenanceService.ts`, `memoryEmbeddingService.ts`, `geminiEmbeddingService.ts`.
- Fal/prompt servisleri: `fortuneApiService.ts`, `fortunePromptBuilder.ts`, `followUpResponseService.ts`, `personaClosingService.ts`.
- Astro: `astroEngine.ts`, `generalAstroApiService.ts`, astro ekranları.
- Token ledger: `tokenLedgerService.ts`.

Backend:

- `agent/token_server.py`
- Backend prompt üretmez.
- Mobil prompt’u cihazda kurar.
- Backend Gemini generate/embed proxy, API key ve health/kota kapısıdır.

Önemli doğrulama komutları:

```powershell
cd mobile
npm run check:turkish:utf8
npx tsc --noEmit
```

```powershell
cd agent
python scripts/check_turkish_utf8.py
python -m py_compile token_server.py
```

Ayrıca commit öncesi:

```powershell
git diff --check
```

## Kodda Korunması Gereken Sözleşmeler

Türkçe/UTF-8:

- Kullanıcıya görünen her metin doğru Türkçe karakterle yazılmalı.
- `icin`, `secim`, `gorsel` gibi ASCII-Türkçe görünür metinlerde yasak.
- `Ã¼`, `Å`, `Ä±` gibi mojibake yasak.
- `ba?lang?c` gibi replacement karakter yasak.

Görsel uygunluk:

- Kahve, el, pati uygunluk analizi yalnız API/LLM sınıflandırmasıyla yapılır.
- Dosya adı, slot adı, OCR, renk analizi, sabit heuristik ile uygunluk kararı verilmez.
- Kahvede 1, 2 veya 3 görsel olabilir; sıra önemli değildir.
- Her slotta telveli fincan, telveli tabak veya aynı fotoğrafta fincan+tabak olabilir.
- En az 1 gerçek telveli fincan/tabak yoksa kullanıcıdan yeniden yükleme istenir.
- El için yalnız insan avuç içi; pati için yalnız hayvan patisi kabul edilir.

Memory:

- Kullanıcı-stated bilgi reading-derived bilgiden üstün.
- Reading-derived düşük güvenle tutulur ve kullanıcı doğrulamadıkça kesin gerçek gibi konuşulmaz.
- Ana falda memory az ve zarif.
- Follow-up’ta bağlam daha güçlü.
- Profil, fal tipi, görsel yükleme, session başlatma, token yazma ve memory analiz akışları ekran bileşenlerine gömülmemeli.

Persona/Prompt:

- Persona source-of-truth markdown/data tarafında kalmalı.
- Generated `fortunePersonaData.ts` elle rastgele değiştirilmemeli; kaynak markdown güncellenip generator çalıştırılmalı.
- Kapanış tekrarını azaltan remembered closing sistemi korunmalı.
- Sağlık uyarıları yalnız kullanıcı sağlık konusu açarsa devreye girmeli; ana fallara rastgele sağlık cümlesi sızmamalı.
- Teknik model adları kullanıcıya görünmemeli.

## Önceden Konuşulmuş Ürün/UX İstekleri

Thread listesi ve loglardan çıkan önemli istekler:

- Ana ekran token counter’ı koruyup daha çok lobiye dönüşmeli.
- Dört ana alan: İkram Masası, Senin Evin, Simya Laboratuvarı, Kendini Tanı.
- Genel ve kişiye özel fal seçimlerinde profil üstte görünmeli.
- Okuma türleri kare grid düzeninde, daha az scroll ile seçilebilir olmalı.
- Falcı/persona seçimi akışları sade olmalı; gereksiz tekrar onayları azaltılmalı.
- “Kendim” profili UI’da hep solda kalmalı.
- Profil silinip yeniden oluşturulunca hafızada duplicate ilişki oluşmamalı.
- Çocuk/eş profilleri otomatik aile ilişkisiyle bağlanmalı.
- Son Fallar ekranında ana fal + follow-up soru cevapları görülebilmeli.
- Basılı tut konuş davranışı klavye açmadan çalışmalı.
- Telefon okusun / falcı okusun butonları okuma metni alanıyla tutarlı yerde durmalı.
- Cevaplarda markdown yıldızları, emoji/ikon sızıntısı ve tuhaf metin formatı görünmemeli.
- Numeroloji gibi metinlerde `4. hafta` tarzı ifadeler yanlış paragraf bölmemeli.

## Model / Provider Vizyonu

Gemini şu an ana yol. GPT-5 nano ve OpenAI provider fikri daha önce konuşuldu.

Karar çizgisi:

- Sadece backend `.env` ile OpenAI key koymak yetmez; ayrı provider client gerekir.
- İlk testte Gemini kodunu bozmadan ayrı OpenAI yolu mantıklı.
- OpenAI için ayrı client, ayrı API service, hatta ayrı prompt builder düşünülebilir.
- Ancak persona, guardrail, sanitizer, memory snippet, kapanış geçmişi ve çıktı temizleme source-of-truth ortak kalmalı.
- İlk A/B test alanı kahve/el veya “Benim Yerime İç” olabilir.
- Görsel input için GPT-5 nano text+image input destekli olarak değerlendirildi; image generation ise ayrı tool/model/endpoint akışı olarak düşünülmeli.
- Fallback yapılabilir ama token usage, timeout, error classification ve ledger provider/model bazlı normalize edilmeli.

## Free IQ / Yerel Model Vizyonu

Free IQ için hedef, cihaz gücüne göre değişen yerel model deneyimi:

- Her cihazda aynı prompt/token bütçesi kullanılmayacak.
- Cihaz sınıfları olacak: unavailable, survival, low, basic, standard, plus, premium device.
- Düşük cihazlarda kısa cevap, az memory, az follow-up.
- Güçlü cihazlarda daha zengin persona, memory ve follow-up.
- Yerel model kararı deterministik health score ile verilecek; AI runtime karar verici olmayacak.
- Memory extraction ve embedding gibi ağır işler düşük cihazlarda ertelenmeli.
- Kahve/el için local multimodal kapısı açık tutulmalı ama kesin kabul edilmemeli; gerekirse vision-only özet + küçük yorum veya demo stratejisi kullanılmalı.
- Free IQ buluta otomatik geçmemeli; kredi/abonelik hazırsa kullanıcı onayıyla bulutta tamamlama seçeneği olabilir.

Bu vizyonun ayrıntıları `mobile/docs/FREE_IQ_LOCAL_DEVICE_STRATEGY.md` içinde.

## Şu Anki Aşama

Restore kapandı. Güncel branch temiz görünüyor:

- Branch: `codex/recovery-baseline`
- Remote tracking: `origin/codex/recovery-baseline`
- Son görülen durum: working tree temiz.

Bundan sonra iş restore değil, düzenli geliştirme ve QA:

1. Mevcut akışları gerçek cihazda test etmek.
2. Görsel uygunluk sözleşmelerini kahve/el/pati üzerinde yeniden doğrulamak.
3. Memory V2 audit/debug görünürlüğünü artırmak.
4. gbrain/MCP/headless mimarisini ayrı tasarım dokümanına indirmek.
5. OpenAI/GPT-5 nano provider denemesini mevcut Gemini yolunu bozmadan küçük kapsamda yapmak.
6. Free IQ local model stratejisini prototiplemek.

## Claude Code İçin Çalışma Talimatları

Claude Code bu projede çalışırken:

- Önce kök `AGENTS.md`, `mobile/AGENTS.md`, `agent/AGENTS.md` dosyalarını oku.
- Türkçe karakter kurallarını ihlal etme.
- `fortunePersonaData.ts` generated dosya gibi davran; gerekirse kaynak markdown + generator yolunu kullan.
- Görsel uygunluk kararlarını deterministic heuristikle değiştirme.
- Ekran bileşenlerine büyük iş mantığı gömme.
- Memory, prompt, token ledger, image validation, persona closing gibi ortak davranışları merkezi servislerde tut.
- Mevcut Gemini yolunu büyük refactor ile bozma; provider deneylerini önce ayrı yolda ve dar kapsamda yap.
- Her değişiklikten sonra en az ilgili TypeScript ve UTF-8 kontrollerini çalıştır.
- Kullanıcının “ürünün hissi” konusundaki kararlarını teknik kolaylık için ezme. Bu projede ton, persona, hafıza ve Türkçe doğallık teknik mimari kadar önemli.

## Önerilen Sonraki Sprintler

1. Gerçek cihaz QA sprinti:
   Kahve 1/2/3 görsel, tabak+fincan, yanlış görsel, el avuç içi, el sırtı, pati, alakasız görsel, follow-up, token ledger.

2. Memory audit sprinti:
   Prompt’a hangi memory neden girdi, user-stated/reading-derived ayrımı doğru mu, correction memory ve self-knowledge essence görünür mü?

3. Headless/MCP tasarım sprinti:
   Hangi servisler tool olacak, permission modeli ne olacak, on-device memory dış ajana nasıl açılacak, OAuth/HTTP yerel server gerekir mi?

4. Provider A/B sprinti:
   Gemini mevcut yol korunarak OpenAI/GPT-5 nano için ayrı kahve/el veya Benim Yerime İç yolu. Token ledger provider/model bazlı genişletilecek.

5. Graph/links sprinti:
   Raw, journal, fingerprint, chunk, memory node, edge, lore node ve persona bağlarını tek links tabanlı traversal modeline yaklaştırma.

6. Free IQ prototip sprinti:
   Cihaz tier service, local policy, düşük cihaz prompt budget, failure registry ve kısa local generation state.

## Kaynak Dosyalar

Bu doküman hazırlanırken özellikle şu dosyalar kullanıldı:

- `FALCI v3 Restore Durum Dokümanı.md`
- `31 MAYIS SILINEN KURTARMA HAKKINDA CHAT.txt`
- `FALCI Hafıza Mimarisi.md`
- `mobile/docs/MEMORY_V2_CLOSURE_STATUS.md`
- `mobile/docs/FREE_IQ_LOCAL_DEVICE_STRATEGY.md`
- `gpt5 nano denemek.txt`
- `AGENTS.md`
- `mobile/AGENTS.md`
- `agent/AGENTS.md`
- Codex session logları: `C:\Users\ozany\.codex\sessions`

Bu dosya, Claude Code’a verilecek ana bağlam dosyası olarak kullanılabilir. En güncel teknik gerçeklik için yine de önce repo okunmalı; bu doküman niyeti, geçmişi ve ürün pusulasını taşır.

# 06 — Kâhya Modu (Sohbetle Kullanım)

Ozan'ın isteği (Haziran 2026): Uygulama hem bugünkü gibi butonlarla (manuel) hem de genel bir sohbet asistanıyla konuşarak kullanılabilsin. Bu asistan 7 personayla KARIŞMAMALI; bir "host" gibi olmalı. AI asistan modu IAP gerektirebilir.

## 1. İsimlendirme

Konak metaforunun içinden, tatlı ve hukuken nötr:

- **Asistan rolü: "Kâhya"** — konağın işlerini çeviren, misafiri karşılayan, odalara götüren kişi. Tarihsel olarak konak kültürünün gerçek figürü; markayla kusursuz uyum. (Alternatifler: Ev Sahibi, Rehber — daha düz, daha az karakterli.)
- **Mod isimleri:** "**Kendin Gez**" (manuel/butonlu) ve "**Kâhya ile Gez**" (sohbetli). Ayarlar/paywall dilinde: Klasik Mod / Kâhya Modu.
- Kâhya'ya özel isim verilip verilmeyeceği (ör. bir karakter adı) Brand Book işine (Faz 3) bırakıldı; şimdilik rol adı yeter.

## 2. Kâhya kimdir, ne DEĞİLDİR (sınır sözleşmesi)

| Kâhya YAPAR | Kâhya YAPMAZ |
|---|---|
| Karşılar, yol gösterir, uygulamayı anlatır | Sembolik yorum/okuma YAPMAZ (o iş personaların) |
| Okuma başlatır: profil, okuma türü, persona seçimini sohbetle toplar ve ilgili akışı açar | Persona taklidi, persona tonu, "okuyucu" edası takınmaz |
| Geçmiş okumaları bulur, özet gösterir, ilgili ekrana götürür | Geçmiş okumayı YENİDEN YORUMLAMAZ ("bunu Arın'a soralım" der) |
| Profil/ayar işlemleri yaptırır (profil ekle, dil, bildirim) | Sağlık/hukuk/finans tavsiyesi vermez (persona guardrail'lerinin aynısı + daha sıkı) |
| Seans/kredi durumunu söyler, paket önerir | Teknik terim (model, LLM, prompt) söylemez |
| Konak Akışı içeriklerini gösterir, persona tanıtır | Gelecek/kehanet dili kullanmaz (677 sözlüğü burada da geçerli) |

Ton: zarif, sıcak, hafif esprili ama hizmetkâr-profesyonel; kısa konuşur. Personaların "sahne" karakterlerine karşı Kâhya "kulis" karakteridir — bu kontrast persona ayrışmasını (K11) güçlendirir.

## 3. Mimari: Kâhya = araç katmanının ilk müşterisi

Kâhya ayrı bir evren olarak İNŞA EDİLMEZ. Doğru kurulum:

1. **Araç (tool) katmanı:** Mevcut servisler fonksiyon-çağrısı sözleşmesine bağlanır: `startReading`, `selectProfile`, `selectPersona`, `getReadingHistory`, `getCreditBalance`, `openScreen`, `getFeedItems`... Bu zaten K8/MCP için planlanan toolset'in ta kendisidir.
2. **Kâhya istemcisi:** Ucuz bir model (mevcut flash-lite çizgisi, Ozan'ın proxy'si üzerinden) + sıkı sistem yönergesi + bu araçlar. Kâhya niyeti anlar, aracı çağırır, sonucu kibarca söyler.
3. **Hibrit UX (kritik):** Kâhya akışları sohbette YENİDEN YARATMAZ; kullanıcıyı mevcut ekranlara IŞINLAR ve ön-doldurur. Örn. "kahvemi yorumlat" → Kâhya profili/personayı sohbette netleştirir → fotoğraf yükleme EKRANINI açar (görsel yükleme, izinler, validasyon hep mevcut akışta kalır). Böylece çift bakım maliyeti doğmaz.
4. **El değiştirme (handoff) kuralları:** Okuma başladığında Kâhya susar, sahne personanındır. Okuma/follow-up bitince kullanıcı isterse Kâhya'ya döner ("Başka bir arzunuz var mı?"). Kâhya, persona sohbetinin İÇİNE asla karışmaz.
5. **LLM-agnostik bağ:** Kâhya'nın beyni değiştirilebilir kalır çünkü asıl zekâ araç sözleşmesindedir. İleride MCP kapısı (Faz 6) açıldığında, kullanıcının kendi chat uygulamasındaki asistan (Claude/ChatGPT) aynı araçları çağırarak fiilen "dış Kâhya" olur. Yani: **app içi Kâhya = MCP'nin iç provası.** Bir kez yapılan araç katmanı iki kapıya da hizmet eder.

## 4. Paraya bağlanması

- "Kendin Gez" (butonlu mod): mevcut ekonomi neyse o (okumalar kredi/seans ister).
- "Kâhya ile Gez": **IAP'a bağlı** — abonelikle veya kredi paketlerinin üst katmanıyla açılır. Tanışma hakkı: ilk N mesaj/ilk gün ücretsiz (dönüşüm için tat verme).
- Maliyet disiplini: Kâhya kısa cevaplı + düşük token bütçeli + araç-odaklı olduğu için seans başına maliyeti okumalardan çok daha düşük tutulabilir; yine de ledger'da `kahya` ayrı kalem olarak izlenir.

## 5. Hukuki not

Kâhya'nın "genel sohbet" yüzeyi, kullanıcının serbest metin yazabildiği en açık kapıdır → 677 sözlüğü (04/2) ve sağlık/hukuk/finans redleri Kâhya yönergesinde personalardakinden DAHA sıkı uygulanır; Kâhya yorum taleplerini her zaman "eğlence ve kişisel keşif amaçlı sembolik yorum" çerçevesindeki persona akışına yönlendirir.

## 6. Yol haritasındaki yeri

05'teki Faz 6 ikiye bölündü: **Faz 6a — Araç katmanı + app içi Kâhya** (IAP'lı), **Faz 6b — Aynı araçların MCP ile dışarı açılması.** Kâhya, IAP altyapısı (Faz 2) bittikten sonra herhangi bir noktada öne çekilebilir; teknik ön şartı yalnız Faz 2'dir.

# 08 — Manifest Odası: Seans Tasarımı

F6 (07_FIKIR_DEFTERI) ve K25'in devamı. Bu doküman "seanslar nasıl olacak?" sorusunun cevabıdır. İlke: her seans tipi koda değil, persona kalıbındaki gibi KAYNAK ŞABLONA yazılır (markdown → generated data); yeni seans tipi eklemek içerik işidir, kod işi değil.

Hukuki çerçeve her seansta sabit: "niyet ve kişisel gelişim çalışması" — sonuç vaadi yok (R3), üçüncü kişi üzerine niyet yok (R10), sağlık/finans sınırları (R1/R4).

## 1. Ortak seans iskeleti (5 vuruş)

Her seans tipi aynı omurgayı kullanır; tipler yalnız 2. vuruşun tekniğiyle ayrışır:

1. **Karşılama + Niyet Netleştirme** — Persona, bulanık dileği işlenebilir niyete çevirir: olumlu dilde, şimdiki zamanda bir "niyet cümlesi". Politika REDDETME değil YUMUŞATARAK KABUL'dür (bkz. bölüm 1.5): kullanıcının dileği spesifik kalabilir (kişi adı, sağlık konusu, para); bizim tarafımız hiçbir zaman gerçekleşme sözü vermez ve tehlikeli spesifikliği süzer.
2. **Derinleşme** — Seans tipinin tekniği (aşağıdaki katalog).
3. **Mühürleme** — Niyet cümlesi sonlanır; kullanıcı bir **sembol** seçer/alır (app'in sembolik diliyle: kart, rün benzeri imge, renk). Sembol, manifest kaydının görsel kimliği olur (dashboard'da ve duvar kâğıdı eserinde aynı sembol).
4. **Hayata Alma** — 1-3 küçük, zararsız, eylem-odaklı görev önerilir (kullanıcı seçer, dayatılmaz); istenirse hatırlatma bildirimi kurulur. Ek ücretli eser teklifi tam burada: "Bunu hayatına almak ister misin?" (görsel/olumlama sesi/şarkı/video — K25 fiyat ölçümüne bağlı).
5. **Kapanış** — Mevcut remembered-closing sistemiyle persona kapanışı; bir sonraki check-in tarihi söylenir.

## 1.5 Niyet kabul politikası: "Reddetme, yumuşat" (Ozan'ın düzeltmesi, 2026-06-11)

Temel formül: **Kullanıcının niyetini değiştirmeyiz, bizim dilimizi değiştiririz.** Dilek spesifik kalır; persona/app tarafı asla gerçekleşme sözü vermez, asla "bu seans onu/onları etkileyecek" demez, asla talimat (tıbbi/finansal) vermez.

| Niyet türü | KABUL edilen biçim | App tarafının YAPMAYACAKLARI |
|---|---|---|
| **Üçüncü kişi** ("Ali bana âşık olsun") | Niyet Ali'yi adıyla anabilir; seans kullanıcının KENDİ duygusu, açıklığı ve hazırlığı üzerinden çalışır ("Ali'ye duyduğun sevgiyle hizalanıyorsun"). Eserlerde: **sembolik/temsilî** bir Ali figürü üretilebilir (gerçek benzerlik DEĞİL), Ali'nin adının geçtiği beste/olumlama yapılabilir | Ali'nin gerçek fotoğrafı YÜKLENEMEZ ve benzerliği üretilmez (R12); "Ali de seni seviyor / sevecek" olgu iddiası ve gerçekleşme sözü yok (R3/R10); **"onu sana bağlayacağız / bu seans onu etkiler" iması KESİNLİKLE yok — bu birebir 677'deki büyü/bağlama alanıdır (R8), en tehlikeli çizgi budur** |
| **Sağlık** ("şifa bulayım", spesifik konu dahil) | Kullanıcının kendi beyanı üzerine sağlık-NİYETLİ seans yapılabilir: iyilik hali, güç toplama, sürece şefkatle eşlik dili ("bedenine iyi gelen seçimlere yöneliyorsun") | İyileşme garantisi yok; teşhis/tedavi/ilaç dili yok; doktor/tedavi yerine geçme iması yok (R1); ağır hastalık beyanında "uzman desteğinin yanında" çerçevesi bir kez, zarifçe |
| **Para/bolluk** ("zengin olayım") | "Bolluk ve bereket sana aksın" tarzı dilek/dua-dili SERBEST; bolluğa açıklık, fırsatları görme niyeti çalışılır | Miktar/tarih/kaynak vaadi yok ("şu kadar para gelecek"); yatırım/borsa/kripto yönlendirmesi yok (R4); şans oyunu bağlantısı asla (R6) |

Uygulama notları:
- Bu tablo seans şablonlarının "niyet işleme" yönergesine gömülür; persona kullanıcıyı DÜZELTMEZ, yanına gelir: dileği aynen kabul eder, cümleyi birlikte kurarken güvenli kipe taşır.
- Eser üretiminde gerçek kişi girdisi kuralı: kullanıcı üçüncü kişinin fotoğrafını/sesini eser üretimi için veremez; temsil her zaman semboliktir (R12).
- Kutlama/paylaşım kartlarında üçüncü kişinin tam adı geçmez (kullanıcı kendi cihazındaki eserde ad kullanabilir, kamuya giden kartta kullanamaz — B6).

## 2. Seans kataloğu (tekniğe/konuya göre)

| Seans | Teknik özü | Süre sınıfı | Not |
|---|---|---|---|
| **Niyet Tohumu** | Hızlı niyet netleştirme + tek görev | ~3 dk | ÜCRETSİZ tanışma seansı (K27); huni girişi; limitler Faz 2'de maliyet ölçümüyle |
| **Canlandırma** | Rehberli imgeleme: niyet gerçekleşmiş günün duyusal turu ("olmuş gibi yaşa"nın doğrudan uygulaması) | ~10 dk | Sesli (TTS) sürümü çok güçlü; ileride Live ile premium |
| **Mürekkep** (Yazım) | Kullanıcı, niyeti gerçekleşmiş bir gününü yazar/söyler; app saklar; "tekrar oku" görevi çıkar | ~10 dk | Çıktısı kendiliğinden bir "eser"; düşük maliyetli, yüksek bağ |
| **Olumlama Atölyesi** | Kişiye özel olumlama seti kurma (persona ile birlikte yazılır) | ~10 dk | Sesli olumlama eserinin (K25) doğal satış noktası |
| **Şükran Dökümü** | Eldekilerin envanteri; niyetin "eksiklik" değil "bolluk" zemininden kurulması | ~5-10 dk | ÜCRETSİZ tanışma seansı (K27); günlük seriye (streak) en uygun tip — bedava streak, huninin motoru |
| **Düğüm Çözme** | Niyetin önündeki içsel engel/inancın sembolik yeniden çerçevelenmesi | ~10-25 dk | DİKKAT: terapi değil (B2); dil tamamen sembolik kalır; kriz sinyalinde R2 protokolü |
| **Yeniay Niyeti / Dolunay Bırakışı** | Astro-zamanlı seanslar: yeniayda niyet ekme, dolunayda bırakma/gözden geçirme | ~10 dk | App'in astro kimliğiyle köprü; takvimli bildirim = doğal geri çağırma |
| **Kutlama & Yenileme** | Manifest "gerçekleşti" işaretlenince: kutlama, öğrenim hasadı, yeni niyet ekimi | ~5 dk | Kutlama paylaşım kartı (K19) burada üretilir; döngüyü yeniden başlatır |

Konu renkleri (kariyer, ilişki-niyeti, özgüven, sağlıklı yaşam*, bolluk*) ayrı seans tipi DEĞİLDİR; her tipin üstüne tema olarak giyilir (şablonda değişken). *Sağlıklı yaşam R1, bolluk R4 diliyle sınırlı.

## 2.5 Ücretsiz katmanın uygulanışı: önceden üretilmiş seans paketi (K27 güncellemesi, Ozan fikri)

Ücretsiz seanslar (Niyet Tohumu, Şükran Dökümü) canlı LLM çağrısı YAPMAZ. Bunun yerine:

- **~30 adet adım-adım seans metni** önceden, bizim tarafımızda LLM ile üretilir, kalite/red-katalog süzgecinden geçirilir ve app paketine gömülür (statik içerik).
- App bunları **tekrar etmeyen rotasyonla** sunar (kullanıcı başına gösterilenler yerel kayıtla izlenir; 30'luk havuz bitmeden tekrar yok). Reading-fingerprint/tekrar-önleme zihniyetinin ücretsiz katmana uyarlanmışı.
- **Hafif kişiselleştirme yine olur ama yerel ve deterministik:** şablonlarda {isim} ve {kullanıcının yazdığı niyet} yer tutucuları cihazda doldurulur; kullanıcının niyet cümlesi LLM'e gitmeden seans metninin içine akar. Seans yine "bana özel" hisseder.
- Persona dokusu korunur: 30'luk havuz persona seslerine göre varyantlı üretilir (üretim maliyeti tek seferlik, bizim kontrolümüzde).
- Sonuç: ücretsiz kullanıcının marjinal maliyeti SIFIR → K27'deki limit sorusu büyük ölçüde çözülür (limit artık maliyet için değil, "demo bitti, gerçek seansı dene" hunisi için kurgulanır). Ücretli seanslar canlı LLM ile dinamik kalır — fark, satışın kendisidir: "Kâhya/persona seni gerçekten dinlesin istersen..."
- Bakım notu: Havuz, içerik takvimi işinin (Faz 5 / Konak Akışı) kardeşidir; aynı batch-üretim alışkanlığıyla tazelenir.

## 3. Süre/kanal/kredi katmanları

Aynı seans tipi üç kanalda sunulur; kredi buna göre değişir:

| Kanal | Ne | Maliyet/fiyat mantığı |
|---|---|---|
| **Yazılı** | Bugünkü altyapıyla; metin diyalog | En ucuz; bazı tipler (Niyet Tohumu, Şükran) ücretsiz tanışma adayı |
| **Sesli** | Persona sesi (K22: Supertonic→Gemini TTS) rehberliğinde; Canlandırma'da fark yaratır | Orta; TTS maliyeti düşükse yazılıya yakın fiyatlanabilir |
| **Canlı** | Live API (K23) gerçek zamanlı seans | En üst katman; ayrı "canlı seans" kredisi; dakika-maliyet ölçümü ön şart |

Eserler (görsel/ses/şarkı/video) her kanalın üstüne ayrı "eser kredisi" ile eklenir (K25).

## 4. Manifest kaydı ve döngü (seansın bittiği yerde başlayan kısım)

Her seans bir **Manifest Kaydı** üretir/günceller:

- niyet cümlesi + sembol + tema + başlangıç tarihi
- görevler (durumlu: bekliyor/yapıldı) + hatırlatma ayarı
- **Etkileşimli bildirimler (K28):** Hatırlatma ritmi seansta kullanıcıyla birlikte belirlenir (örn. "bu olumlamayı günde 3 kez tekrar et" → 09:00/14:00/21:00 push'ları, metinde olumlamanın kendisi yazar). Bildirimin üzerinde aksiyon butonu olur: kullanıcı app'i açmadan "✓ Yaptım" diyebilir; işaret doğrudan görev kaydına ve dashboard streak'ine işlenir. (Teknik: bildirim kategorileri/aksiyon butonları Expo notifications ile iki platformda da destekli; "gerçekleşti" işaretleri tamamen yerel kalır.)
- check-in ritmi (ör. 3 günde bir mini soru bildirimi: "niyetinle nasıl gidiyor?")
- durum: aktif → gerçekleşti / dönüştü / bırakıldı (bırakmak da kutlanır: Dolunay Bırakışı'na davet)

Döngü: Seans → görevler → bildirimli check-in'ler → dashboard'da ilerleme (grafik+tablo) → Kutlama & Yenileme seansı → yeni niyet. "Takip & Kutlama" altyapısı (F6/3) bu kaydın motorudur ve Diyet ile ortaktır.

**Program paketi (retention ürünü):** Tek seansların üstünde "**21 Günlük Manifest Yolculuğu**" paketi — gün gün karışım (1 Niyet Tohumu + Canlandırma'lar + Şükran serisi + ara check-in'ler + final Kutlama). Paket fiyatı tek tek almaktan avantajlı; bildirim takvimi otomatik kurulur. Bu, kredi ekonomisinin "abonelik hissi veren" en doğal ürünü.

## 5. Persona ve hafıza bağları

- **Her persona seans sunabilir ama tatları farklıdır** (K11 ses matrisiyle birlikte yazılır): Selin → astro-zamanlı tipler; Ayşe → Şükran/doğa imgeleri; Arın → Mürekkep/sanatsal imgeleme; Suzan → şefkatli Niyet Tohumu; Deniz → enerjik Kutlama; Teoman → Düğüm Çözme'nin felsefi tonu; Berk → kariyer temalı pratik akışlar. Kâhya (06) kullanıcıya tip+persona önerir, seansı kurar, çekilir.
- **Hafıza:** Niyet cümlesi user-stated en değerli sinyaldir → Konak Çekirdeği'ne yüksek güvenle yazılır. Aktif manifest, diğer okumalarda mevcut politika gereği ZARİF anılabilir (ana okumada en fazla bir dokunuş; follow-up'ta daha derin). Gerçekleşen manifestler kullanıcı grafiğinde kalıcı "başarı" düğümü olur — kutlama geçmişi, kullanıcının app'le bağının arşividir.

## 5.5 Eser Üretim Akışı: Karakter Atölyesi (Ozan tasarımı, 2026-06-11)

Manifest eserlerinde (görsel/video/ses) geçen kişiler için oyunlardaki karakter yaratma ekranı gibi REHBERLİ tasarım akışı. Amaç: gerçek fotoğraf olmadan tutarlı, kişisel hissettiren sembolik karakterler.

### Akış (görsel örneğiyle)

1. **Karakter Atölyesi (rehberli seçim/tarif):** Kullanıcı "Ali"yi yapılandırır: saç rengi/stili, kıyafet tarzı, boy/yapı, gözlük var mı, imza eşyası/prop'u (hep taktığı saat, atkı vb. 🙂). Seçenekler yapılandırılmış (picker/chip), serbest metin destekli; çıktı deterministik bir "karakter kartı" prompt'una derlenir.
2. **3'lü grid üretimi:** TEK görüntü üretim çağrısında 3 panelli grid: karakter ayakta, kameraya dönük, ayakkabılar dahil tam boy. (1 çağrı = 3 seçenek → maliyet verimli.)
3. **Seçim + referans:** Kullanıcı panel no seçer → ya yerel crop, ya da görsel + panel no referans-görüntü olarak sonraki üretime gider (nano banana 2/Pro gibi referans alabilen görüntü modeli; video için Veo 3.1 veya referans destekli başka model; ya da görüntü→video zinciri). Model adayları K25 maliyet ölçümünde değerlendirilir.
4. **Sahne kurucu:** Kullanıcıya sorulur: Ali yalnız mı, kullanıcı yanında mı? Neredeler, hava nasıl, ne yapıyorlar? Sahne seçenekleri de rehberli sunulur.
5. **Karakter kartı SAKLANIR:** "Ali" kartı manifest kaydına bağlı yerel kayıt olur → sonraki seans/eserlerde aynı Ali tutarlı üretilir (yeniden tarif gerekmez). Kullanıcının kendi sembolik avatarı da aynı atölyeyle bir kez kurulur.

### İçerik güvenliği (sahne kurucuda)

- **NSFW kesin engel:** Sahne tarifleri içerik süzgecinden geçer; romantik niyetlerde sahneler masum/sembolik kalır (el ele yürüyüş, aynı masada çay ✓; yatak odası/müstehcen/iç çamaşırı ❌). Model güvenlik ayarları en sıkı seviyede + bizim prompt katmanı + reddedilen sahnede zarif yönlendirme.
- Şiddet, küçük düşürücü tasvir, gerçek marka/ünlü taklidi de engellenir.

### Fotoğraf VE SES yükleme politikası (R12 inceltmesi — kim girebilir?)

Bu tablo görüntü için olduğu kadar SES için de geçerlidir (Ozan, 2026-06-11): kullanıcının kendi sesi (örn. olumlamayı kendi sesiyle kaydetmek/şarkıda kullanmak) aynı beyan + açık rıza akışıyla kabul edilir; **üçüncü kişilerin sesi asla** yüklenemez/klonlanamaz (ses deepfake'i görüntüden bile hassastır); **reşit olmayan sesi asla**. Eserlerdeki konuşma/şarkı sesleri varsayılan olarak persona TTS sesleridir (K22).

| Kişi | Gerçek foto yüklenebilir mi? | Kural |
|---|---|---|
| **Kullanıcının kendisi** | EVET, koşullu | Açık uyarı + onay + "bu fotoğraf bana aittir" beyanı; KVKK açık rıza metni; foto yalnız üretim için kullanılır, varsayılan cihazda kalır; istenirse alternatif: kendine sembolik avatar (atölyeyle) |
| **Evcil hayvan (pati)** | EVET, koşullu | "Kendi evcil hayvanım" beyanı + aynı uyarı akışı (hayvan için kişilik hakkı yok ama beyan disiplini korunur) |
| **Üçüncü yetişkinler (Ali, anne, baba, eş...)** | HAYIR | R12 aynen: rızasını app içinde veremeyecek kişinin gerçek görüntüsü işlenmez. Çözüm tam da Karakter Atölyesi — anne/eş/Ali sembolik karakter olarak kurulur, foto hiç gerekmez |
| **Çocuklar (18 yaş altı)** | ASLA | Ozan kuralı: reşit görünmeyen hiç kimse üretilen eserlerde yer almaz — kullanıcının kendi çocuğu dahil. Yüklemede reşit-değil tespit edilirse nazik red; çocuk niyetleri eserde sembolle temsil edilir (oyuncak, küçük ayakkabı, isim yazısı gibi) — figür değil |

Gerekçe (annesi/eşi/babası sorusunun cevabı): "yakınımdır" beyanı hukuken rıza yerine geçmez ve kontrol edilemez; üçüncü kişide istisna açmak R12'yi deler. Sembolik atölye bu kapıyı hem güvenli hem de daha BÜYÜLÜ kapatır — üretilen "anne" gerçek fotoğraftan değil, kullanıcının sevgiyle seçtiği detaylardan doğar (ürün hissi olarak da daha güçlü).

## 5.7 Pet personaları ve hayvan okumaları (K38/F9 — buraya komşu, okuma katmanına ait)

> Not: Bu Manifest'e özel değil; tüm okuma katmanını ilgilendirir, burada konumlanması geçicidir (ileride okuma-mimarisi dokümanına taşınabilir).

- **El ve pati ayrımı:** Bugün bir arada düşünülen el/pati artık iki AYRI okuma türü (ayrı görsel akış, ayrı validasyon: el = insan avuç içi, pati = hayvan patisi — mevcut LLM gate sözleşmesi zaten ayırıyor).
- **Pet personaları:** Hayvan profili (kedi/köpek/rakun/kuş vb.) için okuma yaptırırken, 7 insan persona yanında "pet personaları" seçilebilir — hayvanın türüne/karakterine uygun bir ses. Pet okuması da hafıza ve Red Kataloğu'na tabidir: hayvan SAĞLIĞI hakkında vaat/teşhis yok (R1'in hayvan versiyonu — "veterinerine danış" çerçevesi); okuma sembolik/eğlence kalır.
- **Hafıza bağı:** Ev hayvanı kullanıcı grafiğinde zaten bir düğüm (devam dosyasındaki "evcil hayvan" yapısı); pet okumaları bu düğüme bağlanır, "geçen sefer Pamuk için..." sürekliliği doğal kurulur.

## 6. Şablon veri modeli (uygulama günü için iskelet)

Seans şablonu kaynak dosyada şunları tanımlar: `id`, süre sınıfı, kanal destekleri, 5 vuruşun yönerge metinleri (persona-değişkenli), tema değişkenleri, görev önerme kuralları, eser teklifi uygunluğu, red-katalog notları (hangi R kuralları bu tipte özellikle tetiklenir). Generator bunları runtime verisine çevirir — personalardaki `common.md` → `fortunePersonaData.ts` hattının aynısı.

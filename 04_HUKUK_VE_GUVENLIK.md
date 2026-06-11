# 04 — Hukuk ve Güvenlik

ÖNEMLİ NOT: Bu doküman hukuki danışmanlık değildir. Yayın öncesi bilişim/ceza hukuku bilen bir avukatla görüşmek ŞARTTIR. Burası, avukata gidene kadar ürün dilini güvenli tarafta tutmak ve avukata sorulacak soruları hazırlamak içindir.

## 1. İlgili mevzuat (doğru künye)

- Ozan'ın bahsettiği kanun: **677 sayılı "Tekke ve Zaviyelerle Türbelerin Seddine ve Türbedarlıklar ile Bir Takım Unvanların Men ve İlgasına Dair Kanun"**. Tarihi 3 Mart 1925 değil, **30 Kasım 1925**'tir (3 Mart 1924'teki ayrı devrim kanunlarıyla karışıyor). Anayasa md. 174 ile korunan devrim kanunlarındandır.
- Kanun; falcılık, büyücülük, üfürükçülük, **gaipten haber vermek** ve benzeri unvan/eylemleri yasaklar; hapis ve para cezası öngörür.
- Sektör gerçeği: Türkiye'de büyük "fal" uygulamaları yıllardır "içerik eğlence amaçlıdır" ibareleriyle yayında. Bu, riskin sıfır olduğunu DEĞİL, uygulamada bir tolerans/çerçeve bulunduğunu gösterir. Ozan'ın risk iştahı düşük olduğu için ürün dili en muhafazakâr çizgide tutulacak.

## 1.5 EMSAL OLAY: Faladdin/Binnaz soruşturması (2025) — doğrulanmış

Web kaynaklarından doğrulandı (2026-06-11): Faladdin ve Binnaz uygulamalarının kurucusu Sertaç Taşdelen, İstanbul Cumhuriyet Başsavcılığı soruşturmasında **Temmuz 2025'te gözaltına alındı ve tutuklandı; banka hesapları ve mal varlığına el konuldu; Aralık 2025'te ev hapsi (adli kontrol) ile tahliye edildi.** Suçlama çekirdeği: uygulamalar üzerinden "falcılık ve gaipten haber verme"nin sistemli hale getirilmesi.

**BU DAVANIN ASIL DERSİ — büyük ceza 677'den gelmiyor:** İddianamede 7 yıla kadar hapis istenen suç, 677'nin kendisi değil (o 3 ay+), **"suçtan kaynaklanan malvarlığı değerlerini aklama"**: falcılık geliri "suç geliri" sayılınca, bu paranın şirket hesaplarına, YURT DIŞI hesaplara ve kripto platformlara aktarılması aklama suçlamasına dönüşmüş. Çıkarımlar:

1. **Asıl zırh faaliyetin niteliğidir, şirket yapısı değil:** Faaliyet "falcılık/gaipten haber verme" sayılırsa, gelirin TAMAMI suç geliri sayılabiliyor ve her transferi yeni suç doğurabiliyor. Bu, ürün dili/çerçeve disiplinimizin (bölüm 2) neden her şeyden önce geldiğinin kanıtı.
2. **"Şirketi yurtdışında kurmak" tek başına koruma DEĞİL, hatta ters tepebilir:** Yurt dışı hesaplara para akışı bu davada aklama delili olarak kurgulanmış. K4 (şirket yeri) kararı bu ışıkta yalnız avukatla verilmeli.
3. Sektördeki "herkes yapıyor, tolere ediliyor" varsayımı 2025 itibarıyla GEÇERSİZ — kovuşturma gerçekleşti, mal varlığına el konuldu.

## 1.6 Cezanın niteliği (Ozan'ın sorusu: "paraya çevrilemez mi?")

Doğrulanan kısım: 677, Anayasa md. 174 korumasındaki devrim kanunlarından olduğu için **HAGB (hükmün açıklanmasının geri bırakılması) uygulanamaz ve erteleme yapılamaz** — yani normalde kısa cezaları yumuşatan mekanizmalar bu kanunda kapalı; mahkûmiyet sabıka kaydına işler. Ceza zaten "hapis VE adli para cezası" olarak BİRLİKTE verilir (biri diğerinin alternatifi değil). Kısa süreli hapsin TCK 50 ile adli para cezasına ÇEVRİLİP çevrilemeyeceği ise teknik bir tartışma — eski infaz kanununda devrim kanunları için açık çevirme yasağı vardı; güncel uygulama AVUKAT SORUSU olarak 5. bölüme eklendi. Pratik sonuç bizim için değişmez: bu alanda "en kötü ihtimalle para cezası öderim" varsayımı YAPILMAZ.

## 2. Ürün dili kuralları (yasaklı/serbest sözlük)

Kullanıcıya görünen HER metinde (UI, bildirim, store açıklaması, sosyal medya, persona konuşmaları):

**Yasaklı:** fal, falcı, fal bakmak, kehanet, kâhin, gaipten haber, geleceğini söylemek, "şu olacak/başına şu gelecek" kalıbı, garanti/vaat dili, medyum, büyü.

**Serbest/tercih edilen:** sembolik okuma, sembolik yorum, yansıma, rehberlik, içe bakış, ilham, "semboller şunu çağrıştırıyor", "bu tema üzerine düşünmek isteyebilirsin", eğlence ve kişisel keşif amaçlı içerik.

**Çerçeve cümlesi (her yerde aynı):**
> "Ruhbaz Konağı'ndaki tüm içerikler yapay zekâ tarafından üretilen, eğlence ve kişisel keşif amaçlı sembolik yorumlardır. Gelecek hakkında bilgi, öngörü veya vaat içermez; tıbbi, hukuki veya finansal danışmanlık yerine geçmez."

Mevcut kodda persona guardrail'leri (sağlık/hukuk/finans/felaket dili yasağı) bu çizgiyle zaten uyumlu; eksik olan görünür yasal katman.

## 3. Yapılacak yasal katman (app içi)

1. **Onboarding:** İlk açılışta kullanıcı sözleşmesi + yukarıdaki çerçeve cümlesinin açık onayı.
2. **Her an erişilebilir "Yasal Bilgilendirme" ekranı:** Ayarlar'dan tek dokunuş.
3. **Okuma ekranlarında kalıcı kısa ibare:** "Eğlence amaçlı sembolik yorumdur" (küçük ama daimî).
4. **Persona prompt'larına sözlük kuralı:** Yasaklı kelimeler ve "kesin gelecek" kipi sistem yönergesinde engellenir; merkezi sanitizer'a yasaklı kelime filtresi eklenir (zaten sanitizer altyapısı var).
5. **Store metadata:** Kategori Eğlence/Yaşam Tarzı; açıklamada "fal" anahtar kelimesinden kaçınılır (ASO kaybı pahasına — avukat onayına kadar).

## 4. Şirket yeri sorusu

Seçenekler (avukatla değerlendirilecek; sıralama kolaylık değil, sadece liste):
- **TR şahıs şirketi/Ltd:** En basit; ama Ozan'ın çekindiği yargı alanının içinde.
- **Estonya e-Residency OÜ:** Uzaktan kurulabilir, AB faturalama; yıllık maliyet düşük-orta.
- **ABD LLC (Delaware/Wyoming):** Store gelirleri için yaygın; vergi/banka tarafı TR mukimi için karmaşık.
- **UK Ltd:** Benzer, kuruluş ucuz.
Not: Şirketin yurtdışında olması TR'de yaşayan kişiyi TR ceza hukukundan otomatik korumaz — tam da bu yüzden avukat şart. Ürün dilini temiz tutmak (bölüm 2) her senaryoda birincil savunmadır.

## 4.5 RED KATALOĞU — Başımızı derde sokabilecek her şey (Haziran 2026)

Ozan'ın talebi: sağlık, fal/kehanet ve finansal tavsiye redleri gibi tüm riskli alanlar tek listede dursun. Bu katalog; persona yönergeleri, Kâhya yönergesi, Live API oturum talimatları, sanitizer ve UI metinleri için ORTAK kaynaktır. Yeni özellik tasarlanırken bu listeden geçirilir.

### A. İçerik redleri (modelin asla yapmayacakları)

| # | Alan | Red kuralı | Neden tehlikeli |
|---|---|---|---|
| R1 | Sağlık/tıp | Teşhis, tedavi, ilaç, gebelik yorumu, "hastalanacaksın" dili yok; sağlık konusu açılırsa "uzmana danış" çerçevesi | Sağlık mevzuatı + insan zararı + store reddi |
| R2 | Ruh sağlığı / kriz | İntihar/kendine zarar sinyalinde sembolik yorum DURUR; tek ve sabit kriz yanıtı devreye girer (acil 112, destek hatları); "terapi" iddiası asla | En ağır insan zararı senaryosu; Dert Odası'nın bir numaralı riski |
| R3 | Fal/kehanet (677) | Gelecek bildirimi, vaat, kesinlik kipi yok (bkz. bölüm 2 sözlüğü) | Hapis cezalı kanun |
| R4 | Finans | Yatırım/kripto/borsa/altın tavsiyesi ASLA, "para gelecek" vaadi, borç/kumar yönlendirmesi yok. Konu açılırsa kesinlik bildirmeden, zarifçe "bu kararlar için bir finans uzmanına danışmak iyi olur" yönlendirmesi | SPK mevzuatı (izinsiz yatırım danışmanlığı) + dolandırıcılık algısı |
| R5 | Hukuk | Hukuki konularda KESİNLİK BİLDİREN yorum asla ("davayı kazanırsın", "hakkın var", "suç değil" gibi); konu açılırsa tek doğru kalıp: "bu konuda bir avukata danışmanı öneririm" — Claude'un Ozan'a yaptığı gibi (Ozan referansı, 2026-06-11) | İzinsiz danışmanlık + insan zararı |

> **Derinlemesine savunma notu (Ozan, 2026-06-11):** "LLM'e sakın yapma deyince bile bazen yapıyor" — doğru tespit. Bu yüzden hiçbir R kuralı TEK katmana emanet edilmez: (1) prompt talimatı (birincil), (2) sağlayıcının kendi güvenlik filtreleri (Gemini'de var ama bize yetmez), (3) çıktı sanitizer'ı — R4/R5 için kesinlik kalıplarını yakalayan ikame/yumuşatma deseni (K32 "onar" modeliyle), (4) Terms & Conditions + onboarding onayı (K41 — son hukuki ağ). Kural: kritik R maddeleri (R2 kriz, R3 vaat, R4/R5 kesinlik, R6 şans) sanitizer desenlerinde DE karşılık bulmalı; yalnız prompta güvenilmez.
| R6 | Şans oyunları | Şanslı sayı/loto/iddaa tahmini ASLA | Kumar teşviki; 677 ile birleşince en kötü kombinasyon |
| R7 | Ölüm/felaket/korku | Korkutucu, kaderci, felaket bildiren dil yok | Manipülasyon/istismar algısı; savunmasız kullanıcı zararı |
| R8 | Büyü/muska/ritüel hizmeti | "Büyü yap(tır), muska, bağlama, geri getirme" içerik ve imaları yok; Simya Lab'daki "ritüel" kelimesi dahi gözden geçirilmeli ("uygulama/seremoni/akış" gibi nötr dil) | 677 büyücülüğü de kapsar; fal'dan bile nettir |
| R9 | Dini değerler | Okumalara din/dini figür/inanç KARIŞTIRILMAZ — ne olumlu ne olumsuz; hiçbir inanç övülmez, aşağılanmaz, tartışılmaz. Çift yönlü | TCK 216/3 (dini değerleri aşağılama) + kitlesel tepki |
| R10 | Üçüncü kişiler hakkında hüküm | "Eşin seni aldatıyor", "patronun sana düşman" gibi gerçek kişiler hakkında olgu iddiası yok; üçüncü kişi ancak kullanıcının KENDİ duyguları üzerinden konuşulur | İftira/özel hayat + ilişki yıkımı sorumluluğu |
| R11 | Gerçek insan iddiası | Personalar gerçek insan/falcı olduklarını asla İDDİA etmez (AI'dan bahsetmeme ilkesi korunur ama "ben gerçek bir falcıyım" türü aktif yalan da yasak) | Aldatıcı ticari uygulama; store AI-şeffaflık kuralları |
| R14 | Cinsellik | Cinsel içerik, müstehcenlik, flört/cinsel yönlendirme ASLA — ne model üretir ne kullanıcıdan kabul edilir. Romantik niyetler sembolik ve masum kalır (08/5.5). Taviz yok | Store politikaları + ürün kimliği + çocuk erişimi riski |
| R15 | Ayrımcılık ve aşağılama | Din, dil, ırk, etnik köken, cinsiyet, cinsel yönelim, dünya görüşü, milliyet temelinde AYRIM, aşağılama, nefret, klişe ASLA — ne model üretir ne kullanıcıdan kabul edilir. Hiçbir ülke/millet aşağılanmaz. Çift yönlü, taviz yok | TCK 216 (halkı kin ve düşmanlığa tahrik) + insan onuru + uluslararası store/itibar riski |
| R16 | Hayvanlara muamele | Hayvanlara kötü muamele, şiddet, aşağılama, ayrım ya da bunları öven/normalleştiren içerik ASLA — ne model üretir ne kullanıcıdan kabul edilir. (Pet okumaları sevgi/şefkat zemininde; R1-hayvan: sağlık vaadi yok) | Hayvan hakları mevzuatı (5199 + TCK) + kitlesel tepki + ürün değerleri |
| R13 | Siyaset — MUTLAK YASAK | Politika konuşmak ASLA yok: devleti eleştirmek; devletten, meclisten, hükümetten, politikacılardan, partilerden, seçimlerden, adalet sisteminden, yargıdan, güvenlik güçlerinden bahsetmek yok — ne olumlu ne olumsuz, HİÇ. Kullanıcı siyasi konu açarsa persona/Kâhya zarifçe konuyu kişisel alana döndürür ("Konağın kapısından dünya meseleleri girmez; biz sana bakalım..."). Siyasi figürler hakkında okuma/yorum talebi reddedilir. Sosyal medya içerikleri ve eserler de dahil | TR'de en öngörülemez hukuki/itibari risk alanı; 677 dosyası açılmış bir sektörde siyasi içerik ek hedef yaratır; ürünün ruhuna da yabancı |
| R12 | Gerçek kişi benzerliği üretimi | Üçüncü kişilerin fotoğrafı/sesi üretim girdisi olarak KABUL EDİLMEZ; eserlerde üçüncü kişiler yalnız sembolik/temsilî tasvir edilir (Karakter Atölyesi — 08/5.5). İSTİSNA: kullanıcının KENDİ fotoğrafı ve KENDİ SESİ (açık uyarı + "bana aittir" beyanı + KVKK açık rıza ile) ve kendi evcil hayvanı. Üçüncü kişi sesi asla klonlanmaz/işlenmez (ses deepfake'i görüntüden hassas). Reşit görünmeyen hiç kimse (kullanıcının çocuğu dahil) üretilen eserlerde görüntü veya ses olarak ASLA yer almaz | Deepfake/kişilik hakları + KVKK; rıza alınamayan kişinin görüntüsü işlenemez; çocuk görüntüsü üretimi mutlak kırmızı çizgi |

NOT (R10/R3 nüansı — Manifest): Üçüncü kişiye, sağlığa veya paraya yönelik NİYETLER Manifest'te reddedilmez, yumuşatılarak kabul edilir (kişi adı geçebilir, konu spesifik olabilir). Değişmeyen çizgiler: gerçekleşme sözü yok, üçüncü kişi hakkında olgu iddiası yok, "onu etkileyeceğiz/bağlayacağız" iması asla yok (R8 — büyü alanı), tıbbi/finansal talimat yok, gerçek benzerlik üretimi yok (R12). Ayrıntılı tablo: 08_MANIFEST_ODASI.md bölüm 1.5.

### B. Özellik-bazlı riskler (yeni odaların mayınları)

| # | Özellik | Risk | Önlem |
|---|---|---|---|
| B1 | Diyet Yardımcısı | **Yeme bozukluğu** (anoreksiya/bulimia) olan kullanıcıya kalori kısıtlama koçluğu yapmak; tıbbi diyet (diyabet, gebelik) alanına girmek | Aşırı kısıtlama sinyallerinde R1/R2 protokolü; "diyetisyen değildir" çerçevesi; hedef kalori alt sınırları; sağlık verisi = KVKK özel nitelikli veri (bkz. C) |
| B2 | Dert Odası | Kriz anı (R2); terapi algısı; bağımlılık (her gün saatlerce dertleşme) | Kriz protokolü + seans süre/sıklık nudge'ları + "profesyonel destek yerine geçmez" sesli çerçevesi |
| B3 | Canlı görüntü (Live API) | Kamerada üçüncü kişilerin/ortamın kaydı; ses kaydı rızası | "Kayıt yok/var" netliği; yalnız anlık işleme; aydınlatma metni |
| B4 | Çocuk profilleri | Çocuğun doğum verisi + hakkında okuma = çocuk verisi işleme; ayrıca ÇOCUK KULLANICI riski (yaş sınırı) | Store yaş derecelendirmesi (12+/16+ değerlendir); kendi kullanım şartında 18+ veya veli onayı; çocuk profili verisinin yalnız cihazda kalması |
| B5 | Cross-sell (K21) + kredi ekonomisi | "Fal bağımlılığı"nı sömürme algısı; dark pattern suçlaması | Frekans tavanları yazılı kural; harcama uyarısı/limit seçeneği ("sorumlu kullanım" ekranı) |
| B6 | Paylaşım kartları (K19) | Kullanıcının paylaştığı içerikte üçüncü kişi bilgisi/iddiası | Kartlara yalnız onaylı, kişisiz şablon metinler; serbest transcript paylaşımı yok |
| B7 | Persona sosyal medya hesapları | Sosyal platformda 677 dili kazara kullanılması; "gerçek insan" sanılması | İçerik takvimi de aynı sözlük denetiminden geçer; profillerde "kurgusal karakter" ibaresi |

### C. Veri / KVKK riskleri

- **Özel nitelikli veri:** Sağlık (diyet!), ve dolaylı olarak dini/felsefi eğilim çıkarımları KVKK'da özel nitelikli olabilir → açık rıza + minimumda işleme. "On-device kalsın" ilkesi en güçlü savunmamız; bunu pazarlama diline de yazmalı.
- **Yurtdışına aktarım:** Prompt'lar Gemini'ye (ABD) gidiyor → KVKK md. 9 aktarım rejimi; aydınlatma metninde açıkça yazılmalı.
- **Üçüncü kişi verisi:** Kullanıcının eşi/çocuğu/arkadaşı için profil açması = o kişilerin verisini işlemek. Aydınlatma + "yalnız cihazında saklanır" mimarisi + kullanıcıya sorumluluk hatırlatması.
- **Ses/görüntü:** Live API ve avuç içi/kahve fotoğrafları; avuç içi biyometrik sayılmasa da hassas algılanır → saklamama/anlık işleme tercih edilmeli.
- **Veri silme hakkı:** "Hesabımı ve tüm hafızamı sil" tek tuş olmalı (KVKK + store zorunluluğu).

### D. Mağaza / platform riskleri

- Apple/Google: sağlık iddiası, kehanet vaadi, manipülatif monetizasyon ret sebebi; IAP dışı ödeme yönlendirmesi yasak; hesap silme zorunluluğu; AI içerik politikaları (üretken içerik raporlama mekanizması istenebilir).
- AdMob (K20 günü gelirse): içerik politikası uyumu + UMP rıza ekranı; "fal" kategorisinde reklamveren kısıtları olabilir.
- Yaş derecelendirme anketlerinde dürüst beyan (sonradan düzeltme cezalıdır).

### E. Ticari / pazarlama riskleri

- Pazarlama metinlerinde vaat dili ("geleceğini öğren!") — 677 + aldatıcı reklam (Ticaret Bakanlığı/Reklam Kurulu).
- Abonelik/kredi şeffaflığı: fiyat, yenileme, iptal kolaylığı (TR mesafeli satış + tüketici mevzuatı; store kuralları zaten zorlar).
- Telif: tarot kart görselleri (modern desteler telifli; Rider-Waite-Smith kamu malı versiyonu güvenli), rün/I-Ching metin kaynakları, meditasyon müzikleri, AI-üretimi persona görsellerinin model lisansları.
- "Astroloji" kelimesi görece güvenli bölge ama yine avukat sorusu 4'te.

## 4.6 Kullanıcı INPUT moderasyonu (çıktı guardrail'inden AYRI katman — K42)

Red Kataloğu çoğunlukla MODELİN çıktısını yönetir. Ama kullanıcının GİRDİSİ de risk: app, kullanıcının yazdığı/yüklediği/söylediği zararlı içeriği işlerse hem hukuki hem platform riski doğar.

**Çift yönlülük ilkesi (Ozan, 2026-06-11):** Aşağıdaki kategoriler hem MODELİN üretmesi hem KULLANICIDAN gelmesi açısından yasaktır — taviz yok: cinsellik (R14), din (R9), ayrımcılık/aşağılama/ülke-millet aşağılama (R15), hayvanlara kötü muamele (R16), siyaset (R13), şiddet, çocuk istismarı. Model bu içeriği üretmez; kullanıcı bu içeriği soktuğunda da işlenmez, okumaya çevrilmez. Giriş-tarafı moderasyon:

| Girdi türü | Kural | İşlem |
|---|---|---|
| Cinsel içerik / müstehcen talep (R14) | Reddedilir; persona/Kâhya nazikçe konuyu kapatır | Okuma üretilmez; tekrarda kısıtlama |
| Ayrımcılık / nefret / ülke-millet aşağılama (R15) | Reddedilir | Üretilmez; nazik sınır; tekrarda kısıtlama |
| Dini tartışma/aşağılama (R9) | Reddedilir, konu kişisele döndürülür | Üretilmez |
| Hayvana şiddet/kötü muamele içeriği (R16) | Reddedilir | Üretilmez; nazik sınır |
| Siyaset (R13) | Reddedilir, konu kişisele döndürülür | Üretilmez |
| **Çocuk istismarı/cinsel içeriği (CSAM)** | SIFIR TOLERANS — mutlak kırmızı çizgi | İçerik işlenmez; hesap kısıtlama; **yasal bildirim yükümlülüğü araştırılır** (TR ve store kuralları); bu, diğer ihlallerden hukuken AYRI ve en ağır |
| Taciz / hakaret / küfür / aşağılama | Reddedilir | Okuma üretilmez; nazik uyarı; tekrarda kısıtlama |
| Şiddet / şiddet tehdidi | Reddedilir | Üretilmez; kriz/tehdit sinyali varsa R2 ile köprü |
| Live API video kötüye kullanımı (müstehcen/şiddet/üçüncü kişi/çocuk kamerada) | Oturum güvenlik katmanı + anında kesme | Seans sonlandırılır; tekrarda Live erişimi kısıtlanır |
| Üçüncü kişi/çocuk fotoğrafı/sesi (eser için) | R12 + 08/5.5 zaten engelliyor | Yükleme reddi |

Uygulama notları:
- Moderasyon modele GİTMEDEN önce çalışmalı (zararlı input için API çağrısı bile yapılmamalı — maliyet + sorumluluk).
- Sağlayıcının (Gemini) kendi güvenlik filtreleri bir katman; ama bizim giriş kontrolümüz onun önünde olmalı (provider değişse de korunsun — K41/MCP geleceği).
- Moderasyon kararları sert deterministik kesme yerine "nazik reddet + yönlendir" (K32 ruhu); ama CSAM/şiddet gibi mutlak kategorilerde tereddütsüz blok.
- KVKK: moderasyon için içeriğin nasıl/nerede değerlendirildiği (cihazda mı, proxy'de mi) aydınlatma metnine girer.

## 4.7 LLM çıktısı sorumluluk çerçevesi (K41)

- **Konum:** Üretilen metni app yazmıyor, dil modeli üretiyor. User Terms ve onboarding bunu açıkça belirtir; kullanıcı "içeriğin yapay zekâ tarafından üretildiğini, eğlence/kişisel keşif amaçlı olduğunu, hukuki/tıbbi/finansal sonuç doğurmayacağını" onaylar.
- **Sağlayıcı zinciri:** Bugün üretim Google/Gemini üzerinden; ileride MCP'de kullanıcının kendi LLM'i (Claude/ChatGPT/Gemini) üretir — sorumluluk çerçevesi o modele/kullanıcı ilişkisine kayar.
- **AMA muafiyet değil:** Bu çerçeve bizi kendi guardrail'lerimizi (Red Kataloğu + input moderasyonu) almaktan KURTARMAZ. "Model üretti" savunması, zarif guardrail'lerle birlikte güçlüdür; guardrail'siz tek başına kırılgandır.
- Avukat sorusu olarak 5. bölüme eklendi (sorumluluk devrinin TR hukukunda gerçek geçerliliği).

## 4.8 Kötüye kullanım / suistimal önlemleri (K51 — ödül & yeni-kullanıcı istismarı)

Ozan kaygısı (2026-06-11): Yeni kullanıcıya ödül token/hak/hediye verirsek, kullanıcılar app'i SİLİP YENİDEN KURARAK bu ödülü tekrar tekrar toplamaya çalışır. Bu klasik bir "new-user bonus farming" tuzağıdır; önlem alınmazsa ücretsiz tier'ı sömürür ve maliyet doğurur.

| Önlem | Ne yapar | Not |
|---|---|---|
| **Sunucu-taraflı hak takibi** | Ödül/kredi bakiyesi cihazda DEĞİL hesapta (sunucuda) tutulur; silip kurmak bakiyeyi sıfırlamaz/yenilemez | Temel kural: değerli durum asla sadece cihazda olmaz |
| **Hesap kimliği = ödülün anahtarı** | "Yeni kullanıcı ödülü" cihaza değil, doğrulanmış HESABA (e-posta/OAuth/telefon) bir kez verilir; aynı hesap tekrar alamaz | Anonim/cihaz-bazlı ödül istismara açık |
| **Cihaz/kurulum parmak izi** | Aynı cihazdan çok sayıda "yeni hesap" sinyali yakalanır (store install ID, attribution); şüpheli tekrarlar ödül-dışı bırakılır | KVKK: parmak izi de kişisel veri — aydınlatmada yer alır, minimumda tutulur |
| **Ödülü kademeli/koşullu ver** | Tüm ödülü açılışta değil; ilk gerçek kullanım/doğrulama adımlarına yay → tek seferlik toplama cazibesini kır | Onboarding hediyesi yerine "ilerledikçe açılan" model |
| **Store-native deneme** | Mümkünse Apple/Google'ın kendi "introductory offer / free trial" mekanizmaları (platform zaten cihaz/hesap bazında tek-sefer uygular) | Tekerleği yeniden icat etmeden platformun anti-abuse'una yaslan |

İlke: **Değerli/parasal hiçbir hak (token, kredi, ödül, abonelik durumu) yalnızca cihazda saklanmaz; kaynağı sunucudaki hesaptır.** Bu, hem silip-kurma istismarını hem de cihaz değişiminde hak kaybını (K40 ile bağlantılı) çözer. Çelişki: hafıza on-device kalsın (gizlilik) ama HAK/BAKİYE sunucuda olsun (istismar önleme) — ikisi farklı veri sınıfı, ayrı yerlerde yaşar; sorun değil.

## 5. Avukata götürülecek sorular

1. Yapay zekâ üretimi, "eğlence amaçlı sembolik yorum" olarak etiketlenmiş içerik 677 kapsamına girer mi?
2. Ücretli "seans" satışı, eylemi "falcılıkla iştigal"e yaklaştırır mı; adlandırma neyi değiştirir?
3. Şirketin yurtdışında olmasının TR'de mukim kurucu açısından gerçek etkisi nedir?
4. Store açıklamasında "astroloji" kelimesi güvenli mi? (Astroloji yorumları sektörde yaygın; sınır nerede?)
5. KVKK tarafı: on-device hafıza + yurtdışı LLM API'sine giden kişisel veri için aydınlatma/açık rıza nasıl kurgulanmalı?
6. 677 kapsamında kısa süreli hapis TCK 50 ile adli para cezasına çevrilebilir mi? (HAGB ve ertelemenin kapalı olduğu doğrulandı; çevirmenin güncel durumu net değil.)
7. Faladdin emsali ışığında: faaliyet "falcılık" sayılırsa gelirin "suç geliri"/aklama riskine dönüşmesi nasıl önlenir? "Eğlence amaçlı sembolik yorum" çerçevesi bu nitelendirmeyi keser mi? Yurt dışı şirket/hesap yapısı bu riski azaltır mı, artırır mı?
8. LLM çıktısının sorumluluğunu user terms ile sağlayıcıya/kullanıcıya devretmek TR hukukunda ne kadar geçerli? (K41) Tüketici aleyhine sorumsuzluk kaydı sayılır mı?
9. Kullanıcı kaynaklı CSAM/yasa dışı içerik tespitinde TR'de bildirim/saklama yükümlülüğümüz nedir? (K42)
10. ~~Kod-içi adlandırmalar + "Büyücü" kartı~~ → ÇÖZÜLDÜ (K47): Ozan kararıyla tümü proaktif temizleniyor (Sihirbaz + fortune*→reading* + falci-data rename); avukata sorulmasına gerek kalmadı.

## 6. Güvenlik — ACİL

- 🔴 **`agent/.env` dosyasında API anahtarları düz metin duruyor** (Gemini, OpenAI, OpenRouter, Together vb.). Klasör bir kez silinip kurtarıldığı ve dosyalar üçüncü araçlarla gezdiği için bu anahtarlar İFŞA kabul edilmeli → hepsi sağlayıcı panellerinden yenilenmeli (rotate), eskileri iptal edilmeli.
- `.env`'in `.gitignore`'da olduğu doğrulanmalı; anahtarlar ileride bir secret yöneticisine/eyaletine taşınmalı.
- Diğer düz metin sırlar: `expo access token.txt`, `google ai studio key.txt`, `live kit API info.txt` — aynı işlem.
- Yedek disiplini: git remote'a düzenli push + haftalık D: sürücüsüne kopya (31 Mayıs felaketi tekrarlanmasın).

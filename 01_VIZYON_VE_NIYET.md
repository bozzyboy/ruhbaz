# 01 — Vizyon ve Niyet

Bu doküman Ozan'ın kim olduğunu, ne kurmak istediğini ve hangi kısıtlar altında çalıştığını anlatır. Teknik detay değil, pusula dokümanıdır.

## Ozan'ın profili ve çalışma koşulları

- Solo geliştirici; yazılım eğitimi yok ya da sınırlı. Fikir üretme kapasitesi yüksek, uygulama kapasitesi kısıtlı.
- Bütçe yok denecek kadar az: dış tasarımcıya (ör. Mobbin aboneliği vb.) para ödeyemez, sunucu maliyeti taşımak istemez.
- Türkiye'de yaşıyor; Türkçe çalışıyor. Hukuki risklere karşı çok hassas (bkz. 04).
- Proje uzadıkça motivasyonu düşüyor ("bitmeyen senfoni"). Bu yüzden kararların DONDURULMASI ve küçük, bitirilebilir adımlar kritik.
- 31 Mayıs 2026'da FALCI v3 klasörü tamamen silindi, büyük emekle restore edildi. Veri kaybı travması var; yedekleme ve git disiplini önemli.

## Marka kararı

- Uygulamanın yeni adı: **Ruhbaz Konağı** (eski adı FALCI / FALCI v3).
- İlk uygulamanın konumlandırması: "Ruhbaz Konağı — Astroloji, Spiritüel Rehberlik ve Sembolik Okumalar".
- "Fal", "kehanet", "gelecekten haber" gibi kelimeler ürün dilinden hukuki nedenlerle çıkarılacak (bkz. 04).

## İlk gerçek kullanıcı doğrulaması (Haziran 2026, bayram)

Bayramda 7-8 kişilik aile günlerce bir aradayken app'i (tek cihazda — Ozan'ın telefonu + lokal server) herkes TEKRAR TEKRAR, HER GÜN kullanmak istedi. "Bu tarz okumalara inanmam, astroloji saçma" diyenler dahil. Henüz cilasız haliyle bile günlük tekrar kullanım isteği yarattı. Bu, ürünün çekirdeğinin (persona + kişisel okuma deneyimi) çalıştığının ilk gerçek kanıtıdır; retention sinyali olarak akılda tutulmalı: en güçlü istek "her gün yeniden bakmak"tı — günlük içerik/bildirim/streak hatlarının (K14, K28, Şükran streak'i) önemini doğrular.

**Teyze deneyi — hafıza tezinin kazara A/B testi:** İnanmayan teyze 2 gün üst üste kahve okuması yaptırdı; gerçek bilgileriyle profil, doğum haritası, el okuması ve follow-up soruları vardı. 3. gün app önceki soru ve okumalarından bir şeylere değindi → teyze "onu tanımasını" ÇOK sevdi. 4. günden önce Ozan test için tüm profilleri (ve hafızaları) sildi → app onu adıyla selamladı ama tanımadı: okuma daha kısa ve jenerik oldu. Teyze ciddi biçimde bozuldu: "Beni neden unuttu?" Çıkarımlar: (1) HAFIZA bir özellik değil, ürünün kendisi — "tanınma hissi" bağ kuran asıl madde ve Memory V2/Konak Çekirdeği yatırımının haklılığı; (2) hafıza kaybı kullanıcı için DUYGUSAL bir kayıp = marka hasarı → kullanıcı hafızasının yedeklenmesi/cihaz taşıma kullanıcıya dönük bir özellik olmak zorunda; (3) tutarsızlık tuzağı: isimle selamlayıp tanımamak, hiç tanımamaktan daha rahatsız edici — hafıza yoksa selamlama da ona göre alçakgönüllü olmalı.

## Rakip tanımı (Ozan tespiti, 2026-06-11)

Ruhbaz Konağı'nın en büyük rakibi mevcut fal uygulamaları DEĞİL, **LLM chat uygulamalarının ta kendisi** (ChatGPT, Gemini, Claude). İnsanlar bu chatlerde "kanun manun hak getire" yoğun biçimde fal baktırıyor ve çok yoğun kullanıyor. Buna karşı Konak'ın savunulabilir farkları — chat LLM'lerinin YAPAMAYACAĞI şeyler:
1. **Persona evreni + lore:** Chat'te karakter yok; Konak'ta birbirleriyle ilişkisi, geçmişi, sosyal medyada yaşayan hayatı olan bir aile var (bkz. 07/F8 lore senkronu).
2. **Alan-tasarımlı hafıza:** Genel chat hafızası değil; okuma geçmişi, yakınlık profilleri, niyetler, tanınma hissi için tasarlanmış hafıza (teyze deneyinin kanıtladığı şey).
3. **Ritüel ve akış tasarımı:** Kahve fotoğrafı yükleme, kart açma, manifest döngüsü, görev/streak — chat penceresinin veremeyeceği biçimli deneyim.
4. **Cross-channel süreklilik:** Sosyal medyadaki Selin ile app'teki Selin aynı canlı karakter (F8) — bir chat modeli bunu yapamaz.

## Ürün vizyonu (özet)

1. Kullanıcıyı gerçekten hatırlayan, persona tabanlı (7 kişilik "konak ailesi"), Türkçe-doğal bir sembolik rehberlik uygulaması.
2. Hafıza mümkün olduğunca cihaz üstünde (on-device); sunucuda yalnız hesap/kredi/teknik metrik.
3. İleride uygulama yalnız kendi arayüzünden değil, MCP/headless katmanıyla dış ajanlardan (Claude, ChatGPT, Gemini) da kullanılabilsin.
4. Uzun vadede "Ruhbaz Konağı" tek app değil, bir seri/evren olabilir: wellness, meditasyon, nefes, beslenme vb. (karar henüz açık — bkz. 03).

## İş modeli niyeti (Ozan'ın ana derdi)

- Ozan kullanıcıya **seans/kredi satarak** para kazanmak istiyor.
- Kendi sunucusunda **API maliyeti oluşmasın** istiyor.
- İdeali: kullanıcı, kendi LLM aboneliğiyle (ChatGPT Plus, Claude Pro, Gemini aboneliği) kendi OAuth'u ile girip kendi plan haklarını kullansın; Ozan yalnız "deneyimi/oturumu" satsın.
- Bunu tüm cihaz ve platformlarda evrensel yapmanın yolunu henüz bilmiyor. Platform-özel eklenti/GPT/Gem geliştirmek İSTEMİYOR (bu seçenekler önerilmeyecek).
- Gerçeklik kontrolü ve mevcut seçeneklerin analizi: bkz. 03 "Gelir modeli yolları".

## Unified Memory (ayrı vizyon)

- `C:\Users\ozany\Documents\unified memory\` klasöründe duran ayrı bir ürün fikri.
- Amaç: platform-, LLM-, app-agnostik, kullanıcının cihazında yaşayan evrensel kişisel hafıza ("her şeyi yakala, hiçbir şeyi unutma, her LLM'e sessizce bağlam ver").
- Ruhbaz Konağı serisi bu hafızanın MÜŞTERİSİ olabilir ama unified memory'nin ana amacı Ruhbaz değil, evrensel hafızanın kendisidir.
- İlişki ve sıralama kararı: bkz. 03 "Unified Memory ilişkisi".

## Ürün ilkeleri (koddan ve geçmiş kararlardan süzülen)

- Kullanıcıya teknik terim (model adı, LLM, prompt) asla gösterilmez.
- Kullanıcının söylediği bilgi, okumalardan çıkarılan bilgiden her zaman üstündür.
- Ana okumada hafıza zarif ve hafif; takip sorularında derin.
- Persona sesi hissedilir ama sistem anlatılmaz.
- Sağlık/hukuk/finans/ölüm konularında kesin, korkutucu, yönlendirici dil yasak.
- Türkçe metinlerde UTF-8 doğruluğu tartışılmaz kural.

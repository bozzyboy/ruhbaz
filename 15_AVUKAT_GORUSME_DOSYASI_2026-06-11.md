# 15 — AVUKAT GÖRÜŞME DOSYASI (avukata hazır)

> **Durum: HAZIR — blok: Ozan (randevu).** Bu dosya bilişim/ceza hukuku bilen bir avukata götürülmek üzere hazırlandı (kaynak: 04_HUKUK_VE_GUVENLIK.md §5; D5 kararı 2026-06-11). Görüşmede bu dosyayı olduğu gibi kullanabilirsin; her sorunun altında avukatın hızlı bağlam kurması için kutu var.

---

## A. Avukata 1 paragraf ürün özeti (görüşme açılışı)

"Ruhbaz Konağı" adlı bir mobil uygulama geliştiriyorum. Kullanıcı; kahve fincanı fotoğrafı, avuç içi fotoğrafı, tarot kartı seçimi, doğum bilgisi gibi girdiler veriyor; uygulama bunlardan **yapay zekâ (Google Gemini) ile üretilen, "eğlence ve kişisel keşif amaçlı sembolik yorum"** metinleri üretiyor. Uygulamanın her yerinde (onboarding onayı, ayarlar ekranı, her okuma ekranında kalıcı ibare) içeriğin yapay zekâ üretimi olduğu, gelecek bilgisi/öngörü/vaat içermediği, tıbbi-hukuki-finansal danışmanlık yerine geçmediği yazıyor. Ürün dilinde "fal, falcı, kehanet, medyum, büyü" kelimeleri hiç kullanılmıyor; model çıktısında da bu dil çok katmanlı kural setiyle engelleniyor. Kullanıcı verisi esas olarak cihazda saklanıyor; yorum üretimi için metin/görsel Google'ın API'sine gidiyor. Henüz yayınlanmadı; Google Play'de yayın öncesi bu görüşmeyi yapıyorum.

## B. Sorular (öncelik sırasıyla)

### S1. Çerçevenin 677 karşısındaki değeri
Yapay zekâ üretimi, "eğlence amaçlı sembolik yorum" olarak etiketlenmiş içerik **677 sayılı kanun** kapsamına girer mi? Bizim aldığımız önlemler (aşağıda D bölümü) nitelendirmeyi değiştirir mi?

> Bağlam: 677, falcılık/büyücülük/gaipten haber vermeyi yasaklıyor; Anayasa md. 174 koruması altında. Sektörde "içerik eğlence amaçlıdır" ibaresiyle yayında olan büyük uygulamalar var; ama 2025 Faladdin soruşturması toleransın garantili olmadığını gösterdi.

### S2. Ücretli "seans" satışının nitelendirmeye etkisi
Ücretli seans/kredi satışı, eylemi "falcılıkla iştigal"e yaklaştırır mı? Satılan şeyin adlandırması ("seans", "okuma", "kredi", "jeton") hukuken bir şey değiştirir mi?

### S3. Faladdin emsali — gelir ve aklama riski
Faaliyet "falcılık" sayılırsa gelirin "suç geliri" sayılması ve transferlerin **aklama** suçlamasına dönüşmesi riski nasıl önlenir? "Eğlence amaçlı sembolik yorum" çerçevesi bu nitelendirmeyi keser mi? Yurt dışı şirket/hesap yapısı bu riski azaltır mı, **artırır mı**?

> Bağlam: Faladdin/Binnaz kurucusu Temmuz 2025'te tutuklandı; iddianamenin ağır kısmı 677 değil, falcılık geliri "suç geliri" sayılınca yurt dışı hesap/kripto transferlerinin aklama olarak kurgulanması (7 yıla kadar). Aralık 2025'te ev hapsiyle tahliye.

### S4. Şirket yapısı ve yeri (K4 kararı buna bağlı)
Şirketin yurtdışında olmasının (Estonya OÜ / ABD LLC / UK Ltd) TR'de mukim kurucu açısından gerçek etkisi nedir? S3 ışığında hangi yapı önerilir?

### S5. "Astroloji" kelimesi ve store metni
Store açıklamasında "astroloji" kelimesi güvenli mi? Astroloji yorumları sektörde yaygın; 677 açısından sınır nerede? ("fal" anahtar kelimesini ASO kaybı pahasına kullanmıyoruz; bu karar doğru mu?)

### S6. KVKK kurgusu
On-device hafıza + yurtdışı LLM API'sine (Google, ABD) giden kişisel veri için aydınlatma metni ve açık rıza nasıl kurgulanmalı? Özellikle: (a) kullanıcının eşi/çocuğu için profil açması (üçüncü kişi verisi), (b) avuç içi/yüz içerebilen fotoğraflar, (c) ses kaydı, (d) KVKK md. 9 yurtdışı aktarım rejimi.

### S7. Cezanın paraya çevrilmesi (bilgi sorusu)
677 kapsamında kısa süreli hapis TCK 50 ile adli para cezasına çevrilebilir mi? (HAGB ve ertelemenin kapalı olduğunu doğruladık; çevirmenin güncel uygulaması net değil.)

### S8. Sorumluluk devri (K41)
LLM çıktısının sorumluluğunu kullanıcı sözleşmesiyle sağlayıcıya/kullanıcıya devretmek TR hukukunda ne kadar geçerli? Tüketici aleyhine sorumsuzluk kaydı sayılır mı? Onboarding'deki açık onay bu çerçeveyi güçlendirir mi?

### S9. Kullanıcı kaynaklı yasa dışı içerik (K42)
Kullanıcı kaynaklı CSAM/yasa dışı içerik tespitinde TR'de bildirim/saklama yükümlülüğümüz nedir? (İçerik işlemeden reddediyoruz; ayrıca bildirim gerekir mi, kime?)

*(04/5'teki 10. soru — kod-içi adlandırmalar + "Büyücü" kartı — K47 kararıyla çözüldü; proaktif temizlendi, avukata sorulmasına gerek kalmadı.)*

## C. Avukatın cevaplarına bağlı kararlar

| Karar | Bekleyen soru |
|---|---|
| K4 şirket yeri/yapısı | S3, S4 |
| Store metadata + kategori + "astroloji" kullanımı | S1, S5 |
| Fiyatlandırma/seans adlandırması (K43) | S2 |
| KVKK aydınlatma + açık rıza ekranları (Faz 2) | S6 |
| User Terms son metni (K41) | S8 |
| Moderasyon bildirim prosedürü (K42) | S9 |

## D. Hâlihazırda aldığımız önlemler (avukata gösterilecek)

1. **Ürün dili:** Kullanıcıya görünen hiçbir metinde "fal/falcı/kehanet/medyum/büyü" yok; "sembolik okuma/yorum, içe bakış, rehberlik" dili kullanılıyor. Tarot "The Magician" kartı "Büyücü" değil "Sihirbaz".
2. **Çerçeve cümlesi her yerde aynı:** "Ruhbaz Konağı'ndaki tüm içerikler yapay zekâ tarafından üretilen, eğlence ve kişisel keşif amaçlı sembolik yorumlardır. Gelecek hakkında bilgi, öngörü veya vaat içermez; tıbbi, hukuki veya finansal danışmanlık yerine geçmez."
3. **Görünür yasal katman:** İlk açılışta açık onay (onay alınmadan uygulamaya girilmiyor, sürümlü); Ayarlar'dan erişilen "Yasal Bilgilendirme" ekranı; her okuma ekranında kalıcı "Eğlence amaçlı sembolik yorumdur." ibaresi.
4. **Model katmanı (çok katmanlı savunma):** Sistem yönergelerinde gelecek-kesinliği/vaat yasağı; sağlık-hukuk-finans-şans oyunu-din-siyaset redleri (Red Kataloğu R1-R16); ayrıca deterministik çıktı temizleyicisi "fal/falcı" kelimelerini yakalayıp ikame ediyor.
5. **Veri mimarisi:** Profiller/okumalar/hafıza cihazda; sunucuda kullanıcı hesabı/verisi tutulmuyor (yalnız üretim anında API'ye giden içerik).
6. **18+ çerçevesi** yasal bilgilendirme metninde.

## E. Görüşme sonrası yapılacaklar (şimdiden bilinçli boş bırakıldı)

- Aydınlatma metni + açık rıza ekranı (S6 cevabına göre yazılacak; yeri hazır: Yasal Bilgilendirme ekranı "Verilerin nerede saklanır?" bölümü).
- User Terms son hali (S8).
- Store metadata dili (S1/S5).
- Şirket kararı (S3/S4) → K4 güncellenir.

# 19 — TEST BAŞLANGIÇ REHBERİ ("kayboldum, nereden başlayayım?" dokümanı)

> Tek kapı burası. Diğer test dokümanlarını düşünme; bu sayfa sana sırayla "şimdi şunu aç" diyecek. Yarıda bırakmak SERBEST — işaretlediğin yerden devam edersin, hiçbir şey bozulmaz.

---

## ADIM 0 — Telefonda doğru APK var mı? (2 dk, bir kere)

1. PC'de `baslat.ps1` çalıştır (proje kökünde; Expo + token server + QR penceresini kendisi açar).
2. Telefonda uygulamayı aç, bağlan, HERHANGİ bir okuma başlatmayı dene (ör. İkram Masası → günlük tarot).
   - **Okuma geliyorsa** → APK doğru, Adım 1'e geç. ✅
   - **Sunucu/bağlantı hatası alıyorsan** → telefondaki APK eski (Faz 0'daki güvenlik değişikliğiyle uyumsuz). Yeni APK şurada: `mobile\android\app\build\outputs\apk\debug\app-debug.apk` — telefona kopyalayıp kur (üzerine kurulum yeterli, verin silinmez), sonra tekrar dene.

Bundan sonrası için **bir daha APK işi YOK** — Faz 1-4'ün tamamı sadece JS; `baslat.ps1` + uygulamayı açmak yetiyor.

## ADIM 1 — 5 dakikalık duman testi (her şeyden önce)

Uygulamayı aç ve sadece şunlara bak:
- [ ] İlk açılışta "Konağa Hoş Geldin" onay ekranı geldi mi? Kabul et → Konak açıldı mı?
- [ ] Home'da kartlar: **İkram Masası · Salon · Simya Odası · Ayna Odası** (eski adlar yok)?
- [ ] Bir kahve okuması uçtan uca çalışıyor mu?

Üçü de tamamsa sistem ayakta demektir; gerisi keyif turu. Biri patladıysa DUR ve bana sadece "Adım 1'de şu oldu" yaz — gerisini ben bulurum.

## ADIM 2 — Sırayla dokümanlar (toplam ~2-3 saat; bölünebilir)

Her dokümanın başında kendi "KURULUM" kutusu var ama hepsi aynı: server açık + app açık. Maddeleri `[x]` işaretleyerek in; takılırsan maddenin yanına tek kelime not düş ("patladı", "garip") yeter.

| Sıra | Doküman | Ne test ediyorsun | Süre |
|---|---|---|---|
| 1 | `13_FAZ1_CIHAZ_TESTLERI_2026-06-11.md` | Yasal ekranlar + ibareler + yeniden adlandırma regresyonu | ~30-40 dk |
| 2 | `14_FAZ2_CIHAZ_TESTLERI_2026-06-11.md` | Moderasyon + Yedek Al/Geri Yükle/Sil | ~30 dk |
| 3 | `16_FAZ3_CIHAZ_TESTLERI_2026-06-11.md` | Persona sesleri/hitap/lore (keyifli kısım) | ~30 dk |
| 4 | `18_FAZ4_CIHAZ_TESTLERI_2026-06-11.md` | Dil anahtarı + İngilizce mod | ~30-40 dk |
| 5 | `12_FAZ0...md` içindeki "⏳ KALAN TESTLER" | Faz 0'dan artanlar (kısa) | ~15 dk |

**Bölme önerisi:** Bir akşam 1-2, başka akşam 3-4-5. Sıra önemli (erken fazın hatası geç fazı kirletir) ama oturum bütünlüğü önemli değil.

⚠️ **Tek dikkat:** 14 no'lu dokümandaki "Tüm Verimi Sil" testini (Grup 2.4) yapmadan ÖNCE aynı gruptaki "Yedek Al" (2.1) gerçekten çalışmış olsun — yoksa test profillerin gider.

## ADIM 3 — Bana dönüş (tek mesaj yeter)

Şöyle yazman yeterli: *"Testler bitti. 13'te hepsi tamam; 14'te 2.3 patladı; 16'da Selin'in tonu garip geldi."* Doküman adı + madde numarası ver, gerisini ben izini sürerim. Beğenmediğin METİN/TON için madde numarası bile gerekmez — cümleyi yapıştırman yeter, tek dosyadan düzeltirim.

## Bekleyen kararların (test DEĞİL — acelesi yok, ayrı liste)

Testlerden bağımsız, vaktin olunca: `handoffs/faz4-bitti_ingilizce-i18n_2026-06-11.md` §2'deki 15 maddelik liste (avukat, Play Console, marka/ses onayları...). Testler bittikten sonra istersen bunları da tek tek üzerinden geçeriz.

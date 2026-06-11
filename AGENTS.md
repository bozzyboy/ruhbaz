# Ruhbaz Konağı (eski adı FALCI v3) — Genel Proje Kuralları

## 🧭 ÖNCE OKU: Oturum Bağlamı ve Güvenlik Çerçevesi

- **Güncel durum + sıradaki adım:** [00_HANDOFF.md](00_HANDOFF.md) — her yeni oturumda ÖNCE bu okunur.
- **Red Kataloğu (R1–R16 + B/C/D/E) ve hukuki çerçeve:** [04_HUKUK_VE_GUVENLIK.md](04_HUKUK_VE_GUVENLIK.md) — kullanıcıya görünen metin, prompt veya persona içeriğine dokunan HER işte bu katalog bağlayıcıdır ("fal/kehanet" dili yasak; "eğlence amaçlı sembolik yorum" çerçevesi).

## ⚠️ KRİTİK: Türkçe Karakter Kuralları (Tüm Proje)

Bu proje Türkçe bir uygulamadır. **Tüm kullanıcıya görünen metinlerde** doğru UTF-8 Türkçe karakterler zorunludur.

### Yasaklanan paternler (hem `mobile/` hem `agent/` için geçerli):

1. **Soru işareti replacement**: `ba?lang?c`, `G?nl?k`, `?li?kiler` → **YASAK**
2. **Mojibake**: `Ã¼`, `Ã¶`, `Å`, `Ä±` → **YASAK**
3. **ASCII-Türkçe**: `icin`, `secim`, `gorsel` → **YASAK**

### Doğru kullanım:
- `başlangıç`, `Günlük`, `İlişkiler` ✅
- `ü`, `ö`, `ş`, `ı` ✅
- `için`, `seçim`, `görsel` ✅

### Doğrulama komutları:
- **Frontend**: `cd mobile && npm run check:turkish:utf8`
- **Backend**: `cd agent && python scripts/check_turkish_utf8.py`

Her iki komutu da commit öncesi çalıştır.

Detaylı kurallar için bkz:
- `mobile/AGENTS.md`
- `agent/AGENTS.md`

## Mimari / UX Gelecek Uyumluluğu

Yeni özellik eklerken her zaman şu soruyu sor: **Bu özellik ileride farklı bir flow'dan çağrılabilir mi?**

- İş mantığını ekran bileşenlerine gömme.
- Profil seçimi, fal türü seçimi, görsel yükleme, oturum başlatma, token yazımı ve hafıza analizi gibi akışları mümkün olduğunca servis/hook katmanında tut.
- UI/UX ileride wheel menu, karakter odaklı seçim, ritüel akışı veya başka bir giriş deneyimine dönüşebilirmiş gibi gevşek bağlı tasarla.
- Yeni ekranlar mevcut iş mantığını yeniden yazmak yerine var olan servisleri çağırabilmeli.

## Kahve / El / Pati Görsel Uygunluk Sözleşmesi (Ozan kuralı — 2026-06-11 netleştirildi)

- Kahve, el ve pati okumalarında görsel uygunluk analizi YALNIZCA API/LLM sınıflandırmasıyla yapılır; deterministik kod, slot adı, dosya adı, OCR, renk analizi veya sabit heuristikle uygunluk kararı verilmez. Analiz adımları arasına deterministik kontrol EKLENMEZ.
- Kahve yorumunda 1, 2 veya 3 görsel yüklenebilir. Görsellerin sırası ve hangi yükleme alanından geldiği ÖNEMSİZDİR; her karede telveli fincan, telveli tabak veya telveli fincan+tabak olabilir (1-3 fincan, 1-3 tabak, 1-3 fincan+tabak — her karışım geçerli).
- Tek kriter TELVE: en az 1 karede telveli fincan veya tabak varsa okuma BAŞLAR; telvesiz/alakasız ek kareler okumayı düşürmez, sadece dışarıda kalır. Hiçbir karede telve yoksa (tümü telvesiz fincan/tabak ya da alakasız görsel) kullanıcıdan yeniden yükleme istenir.
- El okumasında insan avuç içi + parmakların göründüğü fotoğraf kabul edilir; el sırtı/dış yüz veya alakasız görsel reddedilir.
- Pati okumasında hayvan uzvu YETERLİDİR: patinin altı da üstü/sırtı da, pençe, tırnaklı ayak, kuş/sürüngen ayağı — hayvanın çeşidine göre patisi/pençesi/eli/ayağı olması yeter. İnsan eli, hayvan yüzü/bedeni veya alakasız görsel reddedilir.
- **Bekçi:** `cd mobile && npm run check:image:contract` — bu sözleşmenin kod karşılığını statik doğrular (Claude hook'u ve pre-commit otomatik koşar). `mobile/src/services/fortuneApiService.ts` içindeki `SÖZLEŞME-GÖRSEL-1..4` işaretleri silinemez; akış değişiyorsa bekçi de bilinçli güncellenir.

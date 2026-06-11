# Handoff Snapshot — 2026-06-11 · Planlama & Vizyon oturumu

Bu, BU oturumun kalıcı arşiv kaydıdır. Güncel durum her zaman `00_HANDOFF.md`'dedir; bu dosya değişmez (tarihsel kayıt).

## Oturumun konusu
FALCI v3 → **Ruhbaz Konağı** dönüşümü için sıfırdan vizyon + karar + hukuk + yol haritası doküman seti kuruldu. Kod YAZILMADI; FALCI v3'e dokunulmadı. Tek salt-okunur kod denetimi yapıldı (09).

## Bu oturumda alınan/işlenen başlıca kararlar (K1–K45)
- Marka: FALCI → Ruhbaz Konağı; ürün dili 677-uyumlu (fal/kehanet yok, "sembolik yorum").
- Seri yerine konak/oda stratejisi; ortak hafıza = Konak Çekirdeği; unified memory ayrı/park.
- Gelir: önce IAP kredi (Model A), sonra MCP "kanal" (Model B). Platform-özel eklenti ASLA.
- Kâhya Modu (sohbetli host, personalardan ayrı) = MCP araç katmanının iç provası.
- Manifest Odası: 5-vuruş seans iskeleti, katalog, kanal/kredi katmanları, döngü, Karakter Atölyesi.
- Niyet politikası "reddetme-yumuşat"; ücretsiz seanslar deterministik (önden üretilmiş havuz).
- "Reklamsız+beklemesiz" konum; bekleme = atmosfer/cross-promo sahnesi; İçerik Fabrikası + Konak Bülteni (yaşayan lore).
- Red Kataloğu R1–R16 + input moderasyonu (çift yönlü: model+user); Faladdin emsali doğrulandı.
- Persona hitap sistemi (yaş+kültür), renk kimliği, Arın'a Gen-Z tonu.
- Çok sayıda özellik: paylaşım kartları, re-engagement, günlük Aura UI, el/pati ayrımı + pet personaları, veri taşınabilirliği, analitik, fiyatlandırma.

## Kod denetimi sonucu (09 özeti)
Kod sanılandan temiz (duplicate/ölü kod yok denecek kadar az). "Okuma kesilmesi" = üretim sonrası sanitizer'lar (trimIncompleteTail vb.), token değil. Backend'de yeni güvenlik delikleri: açık /gemini-api-key, CORS, 0.0.0.0.

## Oturum sonu durumu (gece güncellemesi)
- Oturum gece boyu sürdü; kararlar K51'e, dokümanlar 11'e ulaştı. Eklenenler: kod kopyası Ruhbaz_Fable'a alındı (geliştirme evi değişti), yerel LLM/IQ tamamen kaldırılma kararı + söküm haritası (10), hafıza mimarisi kaynak eşleştirmesi + 3 hafıza katmanı + identity dosyaları (11), oda adları kesinleşti (İkram Masası·Salon·Simya Odası·Ayna Odası), embedding ölçüm açığı bulundu (B-6), kod-içi fal taraması yapıldı (UI temiz çıktı), K47 adlandırma temizliği, K51 bonus-farming önlemi, Faladdin emsali doğrulandı.
- **OTURUM SONUNDA OZAN GELİŞTİRME İZNİNİ VERDİ:** yeni oturum kurulumlar + Faz 0 ile işe başlayacak (özerk plan 00'da).
- Ozan'ın çalışma çerçevesi netleşti: vizyonda maksimalist, icrada sıralı; AuDHD; asıl risk kapanmamış döngü.
- Handoff sistemi bu oturumda kuruldu (00 = kapı, handoffs/ = arşiv).

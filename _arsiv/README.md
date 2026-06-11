# _arsiv — Bozuk / Çöp Kök Dosyalar (Faz 0, 2026-06-11)

FALCI v3 kopyasından gelen, 09_KOD_SAGLIGI_RAPORU'nda tespit edilen bozuk kök dosyalar.
SİLİNMEDİ, buraya taşındı (geri dönüş ihtimaline karşı). Gerçek proje dosyaları `mobile/` altındadır.

| Dosya | Neden burada |
|---|---|
| `package.json` | Binary çöp (recovery hasarı) — node'un kökten çalışmasını engelliyordu (`ERR_INVALID_PACKAGE_CONFIG`) |
| `app.json` | Alakasız recovery içeriği (bir kütüphanenin test dosyası) |
| `package-lock.json` | Geçersiz JSON (recovery hasarı) |
| `test_output.txt` | Eski debug çıktısı (Gemini 429 hata logu) — git'e girmiyor (.gitignore) |

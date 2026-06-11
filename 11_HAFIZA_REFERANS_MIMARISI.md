# 11 — Hafıza Referans Mimarisi (beğenilen repo/videolardan ne, nereye?)

Kaynak liste: `docs/bazi linkler.txt` (gbrain, Caveman/Cavemem, MemPalace, SimpleMem, Headroom, Karpathy LLM-wiki, Second Brain, ra-h_os + videolar). Bu doküman, o referanslardan HANGİ fikrin, Konak Çekirdeği'nin HANGİ katmanına alındığını sabitler. Hafıza işi yapılırken HEP buradan kontrol edilir (Ozan talebi, 2026-06-11).

## 0. Ana fikir: Bunlar rakip değil, KATMAN arkadaşı

Ozan'ın "headroom mu, caveman mı, hybrid search mü daha uygun?" sorusunun cevabı: **üçü aynı işin farklı katmanlarında çalışır, birbirinin alternatifi değil.** Sıkıştırma (depolama tarafı) ≠ pencere yönetimi (istek anı) ≠ geri çağırma (arama). Doğru mimari üçünü doğru katmana koyar:

```
YAKALA → ÇIKAR (Caveman)  → SAKLA (graph+links) → BAKIM (decay/MemPalace/uyku) 
                                                      ↓
PROMPT'A KOY (Headroom/bütçe) ← GERİ ÇAĞIR (SimpleMem 3 motor + gbrain hybrid stack)
```

## 1. Katman katman eşleme

| Katman | Referans | Alınan fikir | Bizde karşılığı | Durum |
|---|---|---|---|---|
| **Çıkarım** (veri girerken) | **Caveman** (JuliusBrussee) | İlkel/yoğun anlam çıkarımı: uzun diyalogdan `[USER]→[STRESS]→[WORK]` gibi düşük-entropi kayıt; %60-75
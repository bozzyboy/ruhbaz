# RUHBAZ — Giriş/Açılış Sinematik Video Prompt'u (Google Flow / Veo) — 2026-06-15

> Ozan brief'i: 2 parça × ~8 sn. Parça 1'in SON frame'i = Parça 2'nin İLK frame'i (Flow'da frame-continuation). 7 konak sakini reference image olarak verilir (yüzler TAM açılmaz, gizemli kalır). Parça 1 paleti = Ozan'ın PNG'lerindeki **günbatımı pastel**; Parça 2 paleti = **gece** (fuşyadan başlayıp kahve/mor/altın/indigo). **App lobi arka planı = AKŞAM DEĞİL, GÜNDÜZ** aynı sahnenin pastel hâli (ayrı, full-bleed).

## Global stil (her iki parçada sabit tut)
Cinematic live-action, photoreal, full-frame look, wide cinematic lens (~24mm), smooth stabilized drone motion, shallow-to-deep focus, warm filmic grade, dreamlike grounded realism. NO on-screen text, NO captions, NO logos/watermarks, NO modern/electronic objects, NO fast cuts. 16:9, ~8s.

## SHOT 1 — "Pencere ve Deniz" (~8s, GÜNBATIMI, pastel)
**EN prompt (Flow'a yapıştır):**
> Cinematic photoreal drone shot, golden-hour sunset. Interior point of view inside an elegant old seaside manor, looking out through a large open window. In soft-focus foreground, a weathered wooden table at the window holds a porcelain Turkish coffee cup with grounds, scattered rune stones, a fanned spread of tarot cards, I-Ching coins, a rolled astrology birth chart with one curled corner beside a brass compass and ruler, a magnifying glass, and a strand of amber prayer beads. On both sides of the window, ultra-sheer white tulle curtains billow softly in a gentle sea breeze. Beyond the window: a wide stone terrace and patio, a lush garden, then a calm sea exactly at the manor's level (sea-level, not on a cliff); a wooden pier extends into the water with a small rowboat tied to it. Soft pastel sunset sky — peach, powder pink, soft lilac, antique white, warm gold. The camera performs a slow, smooth drone fly-through: it glides forward between the billowing curtains, out through the open window, and lifts gently into the air above the terrace and garden, beginning to turn back so the whole manor and the sea start to come into view. Calm, dreamy, luxurious mood. Audio: soft lapping waves, a distant seagull, breeze through curtains, warm gentle ambient strings.
> Negative: no text, no captions, no logos, no people, no modern devices, no harsh motion.

**Son frame hedefi:** drone havalanmış, hafifçe dönmüş; konak + bahçe + deniz çerçeveye girmeye başlamış (bu frame'i indir → Shot 2'nin ilk frame'i yap).

## SHOT 2 — "Kapılar Alacakaranlıkta Açılıyor" (~8s, GECE'ye dönüş, fuşya/kahve)
**EN prompt (Flow'a yapıştır — başlangıç frame'i olarak Shot 1'in son frame'ini ver):**
> Continue seamlessly from the provided first frame (seaside manor seen from the air at dusk). Cinematic photoreal drone shot. The light shifts from sunset to dusk to early night: the sky deepens through fuchsia, plum and warm brown into indigo; warm amber lamplight begins to glow inside the manor windows. The camera performs a gentle dolly-in / slow descent toward the manor's tall grand front doors. A warm, elegant host figure (the Kâhya) opens the doors from inside, and soft dim golden light spills out. Behind the doors, in low warm light, the seven residents of the manor stand — their faces kept in soft shadow and backlight, not fully revealed, mysterious — making gentle welcoming gestures (a hand extended, a slight bow, an inviting wave), inviting the viewer inside. The camera keeps a slow, inviting push toward the threshold, as if the viewer is being welcomed in. Mysterious, warm, enchanting mood. Palette: night — fuchsia, plum/purple, warm brown, gold lamplight, deep indigo. Audio: a soft door creak, faint fireplace crackle, a hushed warm welcoming murmur, low ambient music swelling gently.
> Negative: no text, no captions, no logos, residents' faces NOT fully lit or revealed (keep mysterious), no harsh cuts, no fast motion.

## Kullanım notları (Flow)
1. **Süreklilik:** Shot 1'i üret → beğendiğin alımın **son frame'ini** indir → Shot 2'yi "image-to-video / first frame" olarak o frame'le başlat. Böylece iki 8sn dikişsiz birleşir.
2. **7 sakin reference image:** her sakinin görünüş kimliğini reference olarak ver (Shot 2'de tutarlı dursunlar), ama prompt "faces in shadow / not fully revealed" dediği için gizem korunur.
3. **Palet ayrımı:** Shot 1 = günbatımı pastel (senin PNG'lerin); Shot 2 = gece (fuşya→kahve→altın→indigo). Grade'i shot başına ayarla.
4. **App lobi arka planı (AYRI iş):** aynı sahnenin **gündüz** pastel hâli, full-bleed (statik ya da çok hafif loop). Bu video = açılış/onboarding; lobi bg = gündüz sürüm.

## B lobi güncellemesi (Ozan notu)
- Düzen: full-bleed art/video arka plan (ayrı "atmosfer görseli kutusu" YOK — bg'nin kendisi sahne).
- Butonlar: **Keşfet** ve **Kâhya ile gez** → daha **küçük + yan yana** (alt köşede/ortada), iki büyük yığılmış kart değil.
- Alt nav (Konak/Okumalar/Profil): **şimdilik YOK**.
- App bg paleti: **gündüz** pastel (akşam değil).

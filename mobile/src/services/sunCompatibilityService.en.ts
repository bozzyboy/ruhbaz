// =====================================================================
// sunCompatibilityService.en.ts — İNGİLİZCE (EN) SÜRÜM (Faz 4, açık #2)
//
// Yapı, sunCompatibilityService.ts içindeki TR sabitleriyle birebir
// aynıdır: aynı anahtarlar, aynı dizi sıraları, aynı kayıt sayıları
// (12 burç etiketi, 6 bölüm etiketi, 6x10 şablon, 6 ton seviyesi).
// Tipler ./sunCompatibilityService dosyasından import edilir (yalnız tip;
// çalışma zamanında döngü oluşturmaz).
//
// Lookup anahtarları KORUNMUŞTUR (çevrilmez):
//  - ZodiacSignId ('aries'..'pisces') ve SunCompatibilitySectionId
//    ('general'..'neighbor') iki dilde AYNIDIR; geçmiş dosyası anahtarları
//    bu id'lerden üretilir ve dile bağlı değildir.
//
// Çeviri çerçevesi: eğlence + sembolik yorum; olasılık/davet kipi ("may",
// "can", "often"); kesinlik/kehanet dili, evlilik vaadi, tıbbi/hukuki/
// finansal yönlendirme YOKTUR. Şablonlardaki {a}/{b}/{tone}/{toneLower}
// yer tutucuları TR şablonlarla aynı dağılımdadır.
// =====================================================================

import type { SunCompatibilitySectionId, ZodiacSignId } from './sunCompatibilityService';

export const ZODIAC_LABELS_EN: Record<ZodiacSignId, string> = {
  aries: 'Aries',
  taurus: 'Taurus',
  gemini: 'Gemini',
  cancer: 'Cancer',
  leo: 'Leo',
  virgo: 'Virgo',
  libra: 'Libra',
  scorpio: 'Scorpio',
  sagittarius: 'Sagittarius',
  capricorn: 'Capricorn',
  aquarius: 'Aquarius',
  pisces: 'Pisces',
};

export const SECTION_LABELS_EN: Record<SunCompatibilitySectionId, string> = {
  general: 'Overall Harmony',
  love: 'Love',
  work: 'Work',
  home: 'Sharing a Home',
  friendship: 'Friendship and Companionship',
  neighbor: 'Being Neighbors',
};

export const SECTION_TEMPLATES_EN: Record<SunCompatibilitySectionId, string[]> = {
  general: [
    '{a} and {b} may move at different speeds at first glance, yet when they grow curious about each other’s world, a good balance can take shape. {tone} For this pair, the main task is to talk openly about who needs more space and not let small hurts grow bigger.',
    '{a} tends to protect their own rhythm, while {b} may look for a different kind of security or movement. {tone} If they avoid taking each other’s reflexes personally in daily life, the harmony flows more easily.',
    'In this pairing, harmony depends on both sides understanding each other without trying to change one another. Between {a} and {b}, {toneLower} Even so, with steady, regular care a warmer bond can be built, and when shared decisions are not rushed, the ground of the relationship grows firmer.',
    'When {a} and {b} see each other’s strengths, they can create a complementary effect. {tone} But if expectations are left unspoken, small differences become needlessly tiring.',
    'Together, these two signs may feel the relationship as lively at times and as an instructive test at others. {tone} The key to harmony is noticing that they are often telling the same story in different languages.',
    'There is a natural field of curiosity between {a} and {b}; one can open a window the other never noticed. {tone} When they show flexibility, the bond becomes warmer and more sustainable.',
    'In the bigger picture, this pairing does not fit a single mold; waves of closeness and distance may come and go with the day. {tone} If both sides keep their intentions clear, the common ground does not get lost.',
    'When {a} and {b} respect each other’s boundaries, they can create a comfortable shared space. {tone} The best results come from talking regularly instead of assuming what the other expects.',
    'For this pair, harmony works through complementing each other more than through similarity. {tone} A shared rhythm settles in over time; observation serves better than hasty decisions.',
    'Attraction or curiosity between {a} and {b} can spark quickly, yet lasting closeness asks for consistent behavior. {tone} As they learn each other’s tender spots, the bond becomes less tiring.',
  ],
  love: [
    'In love, {a} and {b} may show their feelings in different ways. {tone} When love languages are spoken about openly, false expectations fade and closeness feels safer.',
    'In a romantic bond, this pair can both attract and occasionally surprise each other. {tone} Especially when attention, loyalty, and the need for freedom are balanced, the relationship flows more easily.',
    '{a} may build love from one place while {b} expects a different language of closeness. {tone} That is why affection should be confirmed not only with words but with actions too.',
    'In this pairing, the strength of romantic harmony depends on neither side hiding their vulnerability. {tone} When one pulls back, the other should not rush to judgment but offer space instead.',
    'In matters of love, {a} and {b} can hold up a powerful mirror to each other. {tone} Even when passion is present, what carries the relationship is daily care and open communication.',
    'The flirtatious energy in this pair can be lively, yet over the long run, building trust matters more. {tone} The ups and downs of emotion should not be turned into a personal battle.',
    'Romantically, {a} and {b} can learn a great deal from each other. {tone} If jealousy, distance, or differing expectations are talked through early, the relationship tires less.',
    'In love, this bond may move warmly at times and cautiously at others. {tone} Both sides should balance affection with the need for freedom and security at the same time.',
    'The core question of romantic harmony is whether two people share the same definition of a relationship. {tone} Once that definition is clear, sign differences become easier to manage.',
    'Between {a} and {b}, love is a space that can grow under the right conditions but strains quickly when neglected. {tone} Love languages, time together, and expectations of loyalty should be kept out in the open.',
  ],
  work: [
    'In a working relationship, {a} and {b} may move with different priorities. {tone} If tasks are divided clearly, this difference turns into productivity.',
    'When this pair builds something together at work, one may seek speed while the other seeks quality or safety. {tone} If lines of authority stay untangled, the shared result comes out stronger.',
    '{a} and {b} can complement each other professionally, yet their decision-making styles may clash. {tone} Putting schedules, responsibilities, and expectations in writing reduces friction.',
    'In work harmony, this pairing feeds on the exchange of ideas. {tone} Who makes the final call and who manages which area should be settled from the start.',
    'This pair may carry different senses of risk in a project. {tone} If one rushes while the other wants to double-check, a realistic plan should be placed between them.',
    'When {a} and {b} work together and make room for each other’s strengths, the results are good. {tone} It is especially important that criticism stays focused on the work, not the person.',
    'In a professional bond, harmony depends on the clarity of the shared goal. {tone} When the goal blurs, the signs’ different reflexes become more visible.',
    'This pairing can build a practical balance at work, but the rhythm of communication needs some structure. {tone} When meetings, deadlines, and responsibilities are clear, productivity rises.',
    '{a} and {b} can teach each other new methods in the workplace. {tone} The best results come when they soften the competition and focus on shared success.',
    'In work harmony, this pair moves well with the right system. {tone} Where planning or clear leadership is missing, small differences can grow into real tension.',
  ],
  home: [
    'For {a} and {b} sharing a home, order, space, and privacy should be discussed from the start. {tone} When household duties are clear, daily friction shrinks.',
    'Sharing the same home, this pair may run on different tempos and habits. {tone} Even if the rules of shared space are never written down, they should be spoken out loud.',
    '{a} and {b} should understand each other’s need for quiet, social time, and order at home. {tone} If small chores are shared before they pile up, harmony comes easier.',
    'As housemates, this pairing can be comfortable or tiring; what decides it is the clarity of boundaries. {tone} Guests, cleaning, and spending should be settled early on.',
    'Living under one roof, one of this pair may act more lively while the other stays more measured. {tone} They need to build a shared rhythm without trying to correct each other’s way of living.',
    '{a} and {b} can find balance at home with the right division of tasks. {tone} The biggest risk is letting unspoken expectations quietly pile up.',
    'Home life tests the patience and flexibility of these two signs. {tone} When personal space is respected, living together becomes more enjoyable.',
    'In the same space, {a} and {b} can bring each other both movement and balance. {tone} But without a shared order, small habits become far too visible.',
    'Harmony between housemates is less about cleaning and more about communication and sharing space. {tone} Planned conversations prevent needless quiet tension.',
    '{a} and {b} can settle in more comfortably as they get used to each other’s rhythm at home. {tone} In the early days, setting the rules kindly but clearly works well.',
  ],
  friendship: [
    'In friendship, {a} and {b} can give each other fresh points of view. {tone} The most important thing in this friendship is letting the balance of expectation and distance stay natural.',
    'In a bond of friendship, this pair can have fun together yet show different sensitivities at times. {tone} If openness is chosen over taking offense, the bond grows stronger.',
    'In friendship, {a} and {b} can work like two distinct rhythms that complete each other. {tone} As shared interests grow, the connection becomes sturdier.',
    'This friendship may draw close quickly at times and ask for distance at others. {tone} If neither side reads that as personal rejection, the bond relaxes.',
    'In friendship, {a} and {b} can feed each other’s courage or calm. {tone} When they steer clear of needless rivalry, the relationship is more enjoyable.',
    'Conversation and shared experience hold an important place in this pair’s friendship. {tone} If their different ways of deciding are not judged, a long-lasting bond can form.',
    '{a} and {b} can balance each other in social settings. {tone} When one needs movement and the other needs security, a middle path should be sought.',
    'As a friendship, this pairing is instructive and lively. {tone} Even with different priorities now and then, the bond holds as long as respect is kept.',
    'Trust in this friendship may build slowly. {tone} Consistency, keeping one’s word, and small gestures strengthen the relationship.',
    'If {a} and {b} stay curious about each other’s world, a lovely friendship can form. {tone} As long as the giving never becomes one-sided, the relationship stays in balance.',
  ],
  neighbor: [
    'As neighbors, the best harmony for {a} and {b} comes with respectful distance and clear boundaries. {tone} Helping each other works beautifully, but private space should stay untouched.',
    'When these two signs are neighbors, daily courtesy shapes the relationship. {tone} If matters like noise, shared areas, and how often to visit stay open, problems shrink.',
    '{a} and {b} can support each other as neighbors, yet too much closeness may grow tiring. {tone} A balanced distance is more peaceful in the long run.',
    'In neighborly harmony, this pairing feeds on practical helpfulness. {tone} Small gestures sweeten the relationship but should not turn into expectations.',
    'This pair can build a respectful bond in the same building or neighborhood. {tone} The key point is to talk about problems directly and kindly, not through hints.',
    '{a} and {b} may live at different rhythms as neighbors. {tone} When shared-space rules and quiet hours are clear, harmony rises.',
    'Between these two signs as neighbors, a warm but measured bond is the healthier kind. {tone} Helping when needed and stepping back when needed keeps the balance.',
    'In this pairing, the neighborly relationship is shaped by small habits. {tone} Steady courtesy and open communication resolve possible friction before it grows.',
    'If {a} and {b} understand each other’s boundaries as neighbors, they get along comfortably. {tone} Too many comments, too many expectations, or sudden outbursts can strain the harmony.',
    'In a neighborly bond, respect, quiet, and trust come forward for this pair. {tone} A well-meaning but measured closeness is the most fruitful form.',
  ],
};

// TR scoreTone ile aynı 6 eşik sırası: <15, <30, <45, <60, <75, geri kalan.
export const SCORE_TONES_EN: string[] = [
  'The harmony here looks low; in this bond, patience, clear boundaries, and realistic expectations matter a great deal.',
  'The harmony is challenging but not closed off; if both sides put in conscious effort, a balance can be built.',
  'The harmony comes in waves; some areas flow easily while certain topics ask for special care.',
  'The harmony sits at a fair-to-good level; with the right communication, the bond can grow more balanced.',
  'The harmony is strong; when the differences are handled well, the relationship can feel nourishing and natural.',
  'The harmony is very strong; both sides can join each other’s rhythm with ease, and the bond may flow on its own.',
];

// TR başlık kalıbının karşılığı: `${a} - ${b} ${READING_TITLE_SUFFIX_EN}`
export const READING_TITLE_SUFFIX_EN = 'Sun Sign Compatibility';

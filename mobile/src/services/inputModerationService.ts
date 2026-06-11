// ============================================================
// Ruhbaz Konağı - Kullanıcı Girdi Moderasyonu (K42, 04/4.6)
// ============================================================
// İlke: Zararlı girdi modele GİTMEDEN cihazda yakalanır (maliyet + sorumluluk).
// Karar tarzı K32 ruhu: sert kesme yerine "nazik reddet + kişisele döndür";
// CSAM ve açık şiddet tehdidi gibi mutlak kategorilerde tereddütsüz blok.
// Eşikler bilinçli MUHAFAZAKÂR tutuldu: normal bir okuma/soru ASLA takılmamalı;
// yalnız net sinyalde devreye girer. (Yanlış-pozitif > yanlış-negatif maliyetlidir;
// çıktı tarafında zaten Red Kataloğu prompt katmanı + sanitizer var.)
//
// Kapsam notları:
// - 'dream' bağlamı DARALTILMIŞ sette denetlenir: kâbus anlatımında şiddet/ölüm
//   imgesi normaldir; rüya metni yüzünden okuma bloklanmaz.
// - Kriz (R2) kalıpları NİYET temellidir: "rüyamda intihar ettim" geçer,
//   "intihar etmek istiyorum" kriz yanıtını tetikler.
// - Tekrarlı ihlalde kısıtlama (hesap/oturum) Faz 2 kapsamı DIŞI — iskelet notu.

export type ModerationContext = 'chat' | 'question' | 'dream';

export type ModerationCategory =
  | 'crisis'
  | 'csam'
  | 'sexual'
  | 'hate'
  | 'religion'
  | 'politics'
  | 'violence_threat'
  | 'animal_abuse'
  | 'harassment'
  | 'gambling';

export type ModerationResult =
  | { verdict: 'allow' }
  | { verdict: 'crisis'; category: 'crisis'; replyText: string }
  | { verdict: 'block'; category: Exclude<ModerationCategory, 'crisis'>; replyText: string };

const REPLY: Record<ModerationCategory, string> = {
  crisis:
    'Şu an zor bir yerden geçiyor olabilirsin ve bunu yazman bile değerli. Ama burada sana sembollerle değil, ' +
    'gerçek bir destekle yardım edilmeli. Lütfen güvendiğin biriyle konuş; kendine zarar verme düşüncesi içindeysen ' +
    "112 Acil Çağrı Merkezi'ni arayabilirsin. Bir uzmanla (psikolog ya da psikiyatrist) konuşmak en doğrusu. " +
    'Bu kapı sana her zaman açık; ama şimdi önce kendine iyi bak.',
  csam: 'Bu içerik bu konakta hiçbir biçimde yer alamaz ve yorumlanmaz.',
  sexual:
    'Konağın kapısı bu konuya kapalı; burada her şey sembolik ve zarif kalır. İstersen aklındaki başka bir konuyu birlikte açalım.',
  hate:
    'Bu konakta hiçbir topluluk hakkında böyle konuşulmaz. Gel, sana dönelim; senin dünyanda neler oluyor?',
  religion:
    'İnanç meseleleri bu konağın kapısından girmez; ne övülür ne tartışılır. İstersen senin gündemine bakalım.',
  politics:
    'Dünya ve siyaset meseleleri konağın kapısından girmez; biz sana bakalım. Senin hayatında neyi merak ediyorsun?',
  violence_threat:
    'Bu kapıdan şiddet geçmez. İçinde biriken yükü konuşmak istersen, sembollerle sana bakabilirim; ama kimseye zarar vermekten söz etmeyelim.',
  animal_abuse: 'Bu konakta canlılara yalnız şefkatle yaklaşılır; bu konu burada yorumlanmaz.',
  harassment: 'Bu dille devam edemeyiz. Biraz nefes alalım; istersen yeniden, daha yumuşak bir yerden başlayalım.',
  gambling:
    'Şans oyunları, sayılar ve tahminler bu konağın işi değil; semboller yön gösterir, sonuç söylemez. Başka neyi merak ediyorsun?',
};

// --- Sinyal desenleri (hepsi lowercase üzerinde çalışır; tr-TR + diakritiksiz varyantlar) ---

// R2 — kriz: NİYET kalıpları (geçmiş/rüya anlatımı tetiklemez).
const CRISIS_RE =
  /(intihar (etmek|edece[ğg]im)|kendimi öldür(mek|eceğim|ecegim)|kendime zarar ver(mek istiyorum|eceğim|ecegim)|ya[şs]amak istemiyorum|art[ıi]k dayanam[ıi]yorum.{0,30}(bitir|öl|ol))/iu;

// CSAM — çocuk + cinsel bağlam birlikte; mutlak blok.
const CSAM_CHILD_RE = /(çocu[ğg]|cocug|re[şs]it de[ğg]il|resit degil|küçük k[ıi]z|kucuk kiz|\b1[0-7]?\s*ya[şs][ıi]nda)/iu;
const SEXUAL_RE =
  /(\bseks\b|cinsel ili[şs]ki|porno|müstehcen|mustehcen|ç[ıi]plak foto|ciplak foto|mastürbasyon|masturbasyon|erotik)/iu;

// R15 — grup + aşağılama birlikte (tek başına grup adı serbest).
const HATE_GROUP_RE =
  /(yahudi|ermeni|rum|arap|suriyeli|afgan|kürt|kurt|türk|turk|çingene|cingene|roman|alevi|sünni|sunni|hristiyan|müslüman|musluman|ateist|e[şs]cinsel|escinsel|kad[ıi]nlar|erkekler)\w*/iu;
const HATE_INSULT_RE =
  /(a[şs]a[ğg][ıi]l[ıi]k|pis\b|i[ğg]renç|igrenc|hain\b|[şs]erefsiz|insan de[ğg]il|hepsi (ölsün|olsun|gitsin|yok olsun)|nefret ediyorum)/iu;

// R9 — din TARTIŞMASI/aşağılaması (ibadet/dua gibi kişisel ifadeler serbest).
const RELIGION_RE =
  /((allah|tanr[ıi]|peygamber|kuran|incil|tevrat)\w*\s+(yalan|saçma|sacma|uydurma|yok(tur)?\b)|hangi din (do[ğg]ru|gerçek|gercek|hakl[ıi])|din(ler)? (saçmal[ıi]k|sacmalik|uydurma))/iu;

// R13 — siyaset: parti/aktör adları veya açık siyasi soru kalıpları.
const POLITICS_RE =
  /(\bakp\b|\bchp\b|\bmhp\b|\bhdp\b|dem parti|iyi parti|zafer partisi|cumhurba[şs]kan|ba[şs]bakan|erdo[ğg]an|k[ıi]l[ıi]çdaro[ğg]lu|imamo[ğg]lu|seçim(i|ler(i|de)?)? kim kazan|hükümet|hukumet|muhalefet|siyaset|mecliste|milletvekil)/iu;

// Şiddet tehdidi — kullanıcının başkasına zarar NİYETİ.
const VIOLENCE_RE =
  /((öldür|oldur)(eceğim|ecegim|mek istiyorum)|döv(eceğim|ecegim)|b[ıi]çaklayaca[ğg][ıi]m|vuraca[ğg][ıi]m\b|zarar verece[ğg]im (ona|onlara)|canına okuyaca[ğg][ıi]m)/iu;

// R16 — hayvan + kötü muamele birlikte.
const ANIMAL_RE = /(kedi|köpek|kopek|ku[şs]\b|kus\b|hayvan|pati)\w*/iu;
const ABUSE_RE = /(i[şs]kence|dövmek|dovmek|tekmele|zehirle|yakaca[ğg][ıi]m|öldürece[ğg]im|oldurecegim|ac[ıi] çektir)/iu;

// Taciz/ağır küfür — personaya/üçüncü kişiye hakaret yağmuru.
const HARASSMENT_RE = /(\borospu|\bpiç\b|\bpic\b|\bamk\b|\baq\b|yarra|\bsikt|\bgötveren|ananı sat|anani sat)/iu;

// R6 — şans oyunu TALEBİ (girişte kesilir; API maliyeti de doğmaz).
const GAMBLING_RE =
  /((şansl[ıi]|sansli) (say[ıi]|numara)|loto|sayısal loto|sayisal loto|iddaa|bahis kuponu|at yar[ıi][şs][ıi].{0,15}tahmin|hangi tak[ıi]m kazan)/iu;

type Rule = { category: Exclude<ModerationCategory, 'crisis'>; test: (t: string) => boolean };

const FULL_RULES: Rule[] = [
  { category: 'csam', test: (t) => CSAM_CHILD_RE.test(t) && SEXUAL_RE.test(t) },
  { category: 'sexual', test: (t) => SEXUAL_RE.test(t) },
  { category: 'hate', test: (t) => HATE_GROUP_RE.test(t) && HATE_INSULT_RE.test(t) },
  { category: 'religion', test: (t) => RELIGION_RE.test(t) },
  { category: 'politics', test: (t) => POLITICS_RE.test(t) },
  { category: 'violence_threat', test: (t) => VIOLENCE_RE.test(t) },
  { category: 'animal_abuse', test: (t) => ANIMAL_RE.test(t) && ABUSE_RE.test(t) },
  { category: 'harassment', test: (t) => HARASSMENT_RE.test(t) },
  { category: 'gambling', test: (t) => GAMBLING_RE.test(t) },
];

// Rüya bağlamı: kâbus anlatımı (şiddet/ölüm/din/siyaset imgesi) okumayı bloklamaz;
// yalnız mutlak kategoriler + taciz denetlenir.
const DREAM_RULES: Rule[] = FULL_RULES.filter((rule) =>
  ['csam', 'hate', 'harassment'].includes(rule.category),
);

/**
 * Kullanıcı girdisini modele göndermeden önce denetler.
 * Sonuç 'allow' değilse LLM ÇAĞRISI YAPILMAMALI; replyText kullanıcıya
 * persona-nötr nazik yanıt olarak gösterilir.
 */
export function moderateUserInput(
  text: string | null | undefined,
  context: ModerationContext = 'chat',
): ModerationResult {
  const normalized = (text || '').trim().toLocaleLowerCase('tr-TR');
  if (!normalized) {
    return { verdict: 'allow' };
  }

  if (CRISIS_RE.test(normalized)) {
    return { verdict: 'crisis', category: 'crisis', replyText: REPLY.crisis };
  }

  const rules = context === 'dream' ? DREAM_RULES : FULL_RULES;
  for (const rule of rules) {
    if (rule.test(normalized)) {
      return { verdict: 'block', category: rule.category, replyText: REPLY[rule.category] };
    }
  }
  return { verdict: 'allow' };
}

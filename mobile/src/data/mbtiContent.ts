// =====================================================================
// mbtiContent.ts — MBTI testi içerik sabitleri (TR) + dil seçicileri
// Faz 4: MbtiTestScreen içindeki statik TR içerik buraya BIREBIR taşındı
// (soru çiftleri, tip tanımları, arketipler, tip detayları, özet kalıpları).
// EN karşılıkları ./mbtiContent.en dosyasındadır; seçiciler aktif dile göre
// doğru seti döndürür. Tip kodları (ISTJ vb.) ve boyut anahtarları (IE/SN/
// FT/JP) evrenseldir, ÇEVRİLMEZ.
// =====================================================================

import { getAppLanguage } from '../i18n';
import {
  MBTI_QUESTIONS_EN,
  MBTI_STRINGS_EN,
  MBTI_TYPE_ARCHETYPES_EN,
  MBTI_TYPE_DESCRIPTIONS_EN,
  MBTI_TYPE_DETAIL_EN,
} from './mbtiContent.en';

export type MbtiQuestion = {
  id: number;
  left: string;
  right: string;
};

export type MbtiTypeArchetype = {
  name: string;
  reason: string;
};

export type MbtiTypeDetail = {
  theme: string;
  self: string;
  strengths: string;
  growth: string;
  relationships: string;
  rhythm: string;
};

export type MbtiStrings = {
  mbtiTestName: string;
  buildMbtiSummary: (type: string, description: string) => string;
  buildGenericSummary: (input: {
    testTitle: string;
    resultTitle: string;
    description: string;
    dimensionSummary: string;
  }) => string;
};

export const MBTI_QUESTIONS: MbtiQuestion[] = [
  { id: 1, left: 'Günlük işlerimde liste yaparım', right: 'Günlük işlerimde hafızama güvenirim' },
  { id: 2, left: 'Yeni bir bilgiye önce şüpheyle yaklaşırım', right: 'Yeni bir bilgiye önce inanmak isterim' },
  { id: 3, left: 'Yalnız zaman beni sıkar', right: 'Yalnız zamana ihtiyaç duyarım' },
  { id: 4, left: 'Durumları çoğunlukla olduğu gibi kabul ederim', right: 'Mevcut hâlle kolay yetinmem, başka ihtimaller ararım' },
  { id: 5, left: 'Odamı / alanımı temiz tutarım', right: 'Eşyaları gelişigüzel bırakırım' },
  { id: 6, left: '"Mekanik" görünmek bana kötü gelir', right: 'Zihnimin mekanik işlemesini isterim' },
  { id: 7, left: 'Enerjik biriyim', right: 'Sakin ve yumuşak tempoluyum' },
  { id: 8, left: 'Sorularda net seçenekler olmasını severim', right: 'Sorularda açık uçlu cevap alanı olmasını severim' },
  { id: 9, left: 'Dağınık biriyim', right: 'Düzenli biriyim' },
  { id: 10, left: 'Eleştiri veya sert sözler beni kolay incitir', right: 'Eleştiri veya sert sözlere karşı kalın deriliyim' },
  { id: 11, left: 'Grupla daha iyi çalışırım', right: 'Tek başıma daha iyi çalışırım' },
  { id: 12, left: 'Karar verirken şimdiye ve eldeki gerçeğe odaklanırım', right: 'Karar verirken gelecekteki ihtimallere odaklanırım' },
  { id: 13, left: 'Çok önceden plan yaparım', right: 'Son dakikada plan yaparım' },
  { id: 14, left: 'İnsanların bana saygı duyması benim için daha belirleyicidir', right: 'İnsanların beni sevmesi benim için daha belirleyicidir' },
  { id: 15, left: 'Partiler beni yorar', right: 'Partiler beni ateşler' },
  { id: 16, left: 'Bir ortama girince uyum sağlamaya yönelirim', right: 'Bir ortama girince kendimi belli etmeye yönelirim' },
  { id: 17, left: 'Seçenekleri açık tutarım', right: 'Karar verip bağlanırım' },
  { id: 18, left: 'Bir şeyleri onarmakta iyi olmak isterim', right: 'İnsanlara iyi gelmekte iyi olmak isterim' },
  { id: 19, left: 'Daha çok konuşurum', right: 'Daha çok dinlerim' },
  { id: 20, left: 'Bir olayı anlatırken ne olduğunu söylerim', right: 'Bir olayı anlatırken ne anlama geldiğini söylerim' },
  { id: 21, left: 'Başladığım işi mümkünse hemen bitirmek isterim', right: 'Başladığım işi ertelemeye veya zamana yaymaya meyilliyim' },
  { id: 22, left: 'Önemli seçimlerde kalbimi izlemeye yakınım', right: 'Önemli seçimlerde aklımı izlemeye yakınım' },
  { id: 23, left: 'Evde kalırım', right: 'Dışarı çıkıp gezmeyi severim' },
  { id: 24, left: 'Bir konuyu anlamak için önce büyük resmi görmek isterim', right: 'Bir konuyu anlamak için önce detayları görmek isterim' },
  { id: 25, left: 'Yeni durumlarda doğaçlama yapmaya güvenirim', right: 'Yeni durumlara hazırlık yaparak girmek isterim' },
  { id: 26, left: 'Ahlakı adalet üzerinden kurarım', right: 'Ahlakı şefkat üzerinden kurarım' },
  { id: 27, left: 'Çok yüksek sesle bağırmakta zorlanırım', right: 'Uzağa seslenmek doğal gelir' },
  { id: 28, left: 'Bir şeyi anlamak için teorik çerçeve kurarım', right: 'Bir şeyi anlamak için deneyip gözlemlemeyi isterim' },
  { id: 29, left: 'Hayat ritmimde sıkı çalışmaya eğilimliyim', right: 'Hayat ritmimde keyif ve eğlenceye alan açmaya eğilimliyim' },
  { id: 30, left: 'Duygularla rahatsız olurum', right: 'Duygulara değer veririm' },
  { id: 31, left: 'İnsanların önünde performans sergilemeyi severim', right: 'Topluluk önünde konuşmaktan kaçınırım' },
  { id: 32, left: '"Kim, ne, ne zaman?" diye sorarım', right: '"Neden?" diye sorarım' },
];

export const MBTI_TYPE_DESCRIPTIONS: Record<string, string> = {
  ISTJ: 'Düzenli, güvenilir ve sorumluluk odaklı bir yapı. Somut bilgiyle ilerlemeyi ve verilen sözün tutulmasını önemser.',
  ISFJ: 'Koruyucu, dikkatli ve sadık bir yapı. İnsanların ihtiyaçlarını fark eder, ilişkilerde güvenli alan kurmaya çalışır.',
  INFJ: 'Sezgisel, derinlikli ve anlam arayan bir yapı. İnsanları ve olayları görünmeyen bağlarıyla okumaya eğilimlidir.',
  INTJ: 'Stratejik, bağımsız ve uzun vadeli düşünen bir yapı. Büyük resmi kurar, sistemi iyileştirmek ister.',
  ISTP: 'Sakin, pratik ve çözüm odaklı bir yapı. Kriz anında soğukkanlı kalıp eldeki araçlarla yol bulabilir.',
  ISFP: 'Duyarlı, estetik ve özgürlük seven bir yapı. İç değerlerine sadık kalır, samimiyetsizliği hızlı hisseder.',
  INFP: 'İdealist, içten ve değer odaklı bir yapı. Kendi anlam dünyasıyla uyumlu seçimler yapmak ister.',
  INTP: 'Analitik, meraklı ve bağımsız düşünen bir yapı. Fikirlerin mantığını kurcalamayı ve olasılıkları açmayı sever.',
  ESTP: 'Hızlı, cesur ve deneyim odaklı bir yapı. Anda karar alır, hareket ederek öğrenir.',
  ESFP: 'Canlı, sıcak ve deneyimden beslenen bir yapı. İnsanlarla bağ kurmayı ve hayatı hissetmeyi önemser.',
  ENFP: 'Yaratıcı, hevesli ve olasılık odaklı bir yapı. İnsanların potansiyelini görür, yeni yollar açmayı sever.',
  ENTP: 'Zeki, esnek ve tartışarak düşünen bir yapı. Kalıpları zorlar, fikirleri farklı açılardan test eder.',
  ESTJ: 'Organize, net ve sonuç odaklı bir yapı. Sorumluluk alır, düzen kurar ve işlerin yürümesini ister.',
  ESFJ: 'Sosyal, destekleyici ve uyum odaklı bir yapı. İnsanların iyi hissetmesini ve ilişkilerin düzenli akmasını önemser.',
  ENFJ: 'İlham veren, ilişkisel ve yön gösterici bir yapı. İnsanları ortak bir anlam etrafında toparlayabilir.',
  ENTJ: 'Kararlı, stratejik ve liderlik odaklı bir yapı. Hedef koyar, kaynakları düzenler ve ilerleme bekler.',
};

export const MBTI_TYPE_ARCHETYPES: Record<string, MbtiTypeArchetype> = {
  ISTJ: {
    name: 'Lojistikçi',
    reason: 'Bu benzetme, ISTJ’nin düzen kurma, sorumluluk taşıma ve işleri güvenilir bir sistem içinde yürütme eğiliminden gelir. Bir yapının dağılmadan işlemesi için ayrıntıları, zamanı ve görevleri takip eden kişidir.',
  },
  ISFJ: {
    name: 'Koruyucu',
    reason: 'ISFJ çevresindeki insanların ihtiyaçlarını sessizce fark eder ve güvenli bir alan kurmaya çalışır. Bu yüzden koruyucu benzetmesi, hem pratik destek verme hem de ilişkileri özenle kollama tarafını anlatır.',
  },
  INFJ: {
    name: 'Savunucu',
    reason: 'INFJ yalnızca olanı değil, olması gerekeni de düşünür. İnsanların potansiyelini ve kırılgan yanlarını sezdiği için bir anlamı, bir insanı ya da bir değeri derinden savunabilir.',
  },
  INTJ: {
    name: 'Mimar / Stratejist',
    reason: 'INTJ önce büyük resmi kurar, sonra o resme uygun sistemi tasarlar. Mimar benzetmesi buradan gelir: görünen yapının arkasındaki planı, taşıyıcı fikri ve uzun vadeli sonucu düşünür.',
  },
  ISTP: {
    name: 'Virtüöz',
    reason: 'ISTP bir şeyi teoride değil, eline alıp deneyerek anlamaya yatkındır. Virtüöz benzetmesi, pratik ustalık, soğukkanlı müdahale ve araçları sezgisel kullanma becerisini anlatır.',
  },
  ISFP: {
    name: 'Maceracı',
    reason: 'ISFP iç değerlerini ve duyularını takip ederek yaşar. Maceracı benzetmesi büyük gürültülü maceradan çok, kendine özgü yolu deneme, hissetme ve estetik seçimlerle var olma halidir.',
  },
  INFP: {
    name: 'Arabulucu',
    reason: 'INFP insanların iç dünyasını ve değerlerini anlamaya çalışır. Arabulucu benzetmesi, çatışmanın altında yatan duyguyu görme ve daha sahici bir anlam arama eğiliminden gelir.',
  },
  INTP: {
    name: 'Mantıkçı',
    reason: 'INTP fikirlerin iç tutarlılığını kurcalar, varsayımları test eder ve kavramları birbirine bağlar. Mantıkçı benzetmesi, dünyayı önce açıklanabilir bir zihinsel model olarak anlamasından gelir.',
  },
  ESTP: {
    name: 'Girişimci',
    reason: 'ESTP fırsatı anda görür ve harekete geçmekten çekinmez. Girişimci benzetmesi, risk alabilen, pratik düşünen ve sahada öğrenen tarafını anlatır.',
  },
  ESFP: {
    name: 'Eğlendirici',
    reason: 'ESFP bulunduğu ortama canlılık, temas ve sıcaklık getirir. Eğlendirici benzetmesi yalnızca neşeli olmayı değil, insanların anda daha rahat ve gerçek hissetmesini sağlamayı anlatır.',
  },
  ENFP: {
    name: 'Kampanyacı',
    reason: 'ENFP bir fikrin, insanın ya da ihtimalin enerjisini büyütebilir. Kampanyacı benzetmesi, heyecanı paylaşma, insanları cesaretlendirme ve yeni yollar açma eğiliminden gelir.',
  },
  ENTP: {
    name: 'Tartışmacı',
    reason: 'ENTP fikirleri çarpıştırarak düşünür; soru sormak, itiraz etmek ve kalıpları esnetmek onun zihinsel oyun alanıdır. Tartışmacı benzetmesi bu canlı test etme enerjisini anlatır.',
  },
  ESTJ: {
    name: 'Yönetici',
    reason: 'ESTJ hedefi, görevi ve sorumluluğu netleştirerek ilerler. Yönetici benzetmesi, dağınık kaynakları düzene sokma ve işlerin gerçekten yürümesini sağlama becerisinden gelir.',
  },
  ESFJ: {
    name: 'Konsül',
    reason: 'ESFJ sosyal düzeni, nezaketi ve aidiyeti önemser. Konsül benzetmesi, insanları bir arada tutma, ihtiyaçları fark etme ve ortak yaşamı yumuşatma tarafını anlatır.',
  },
  ENFJ: {
    name: 'Önder',
    reason: 'ENFJ insanları ortak bir anlam ve gelişim duygusu etrafında toparlayabilir. Önder benzetmesi, yalnızca liderlikten değil, başkalarının potansiyelini harekete geçirme becerisinden gelir.',
  },
  ENTJ: {
    name: 'Komutan',
    reason: 'ENTJ hedef koyar, strateji kurar ve insanları ilerlemeye çağırır. Komutan benzetmesi, karar alma cesareti ve büyük yapıları harekete geçirme eğiliminden gelir.',
  },
};

export const MBTI_TYPE_DETAIL: Record<string, MbtiTypeDetail> = {
  ISTJ: {
    theme: 'Düzen, güvenilirlik ve sorumluluk üzerinden dünyayı anlamlandırırsın.',
    self: 'ISTJ tipi çoğu zaman önce gerçeğe, kanıta ve geçmişte işe yaramış yöntemlere bakar. Söylenen şeyden çok yapılan şeye güvenir; istikrar, sadakat ve netlik onun için önemlidir.',
    strengths: 'Planlı ilerleme, sözünü tutma, detayları kaçırmama ve kriz anında pratik kalma güçlü yanlarındır. İnsanlar sana güvenebilir çünkü başladığın işi bitirme eğilimin yüksektir.',
    growth: 'Bazen esneklik gerektiren durumlarda fazla katılaşabilir ya da duygusal ihtiyaçları ikincil görebilirsin. Her şeyin kontrol edilebilir olmadığını kabul etmek sana iyi gelir.',
    relationships: 'İlişkide sadakat, emek ve süreklilik beklersin. Büyük romantik jestlerden çok güvenilir davranışlar senin için sevgi göstergesidir.',
    rhythm: 'Düzenli takvim, açık görevler ve net sorumluluklar seni rahatlatır. Belirsiz ve sürekli değişen ortamlar enerjini tüketebilir.',
  },
  ISFJ: {
    theme: 'Şefkat, düzen ve koruyucu dikkat senin ana eksenin.',
    self: 'ISFJ tipi çevresindeki insanların ihtiyaçlarını sessizce fark eder. Aidiyet, güven ve iyi niyetli emek onun dünyasında çok değerlidir.',
    strengths: 'İncelik, sadakat, sabır ve pratik destek verme güçlü yanlarındır. İnsanların küçük ihtiyaçlarını hatırlaman ilişkilerde sıcaklık yaratır.',
    growth: 'Kendi ihtiyaçlarını ertelemeye veya kırılmamak için susmaya meyilli olabilirsin. Sınır koymak sevgisizlik değil, ilişkinin sağlıklı kalmasıdır.',
    relationships: 'İlişkide güvenli bağ, tutarlılık ve özen beklersin. Sevilmek kadar değerinin fark edilmesi de önemlidir.',
    rhythm: 'Tanıdık düzenler, yumuşak geçişler ve anlamlı sorumluluklar sana iyi gelir. Fazla sert ve duyarsız ortamlar seni içe kapatabilir.',
  },
  INFJ: {
    theme: 'Anlam, sezgi ve derin bağ arayışı ön planda.',
    self: 'INFJ tipi olayların görünen yüzünden çok altında yatan anlamı okur. İnsanların niyetlerini, duygusal iklimi ve uzun vadeli yönü sezme eğilimi güçlüdür.',
    strengths: 'Derin empati, vizyon, içgörü ve insanları dönüştüren bir rehberlik potansiyelin vardır. Karmaşık duyguları anlamlandırabilirsin.',
    growth: 'Bazen çok fazla anlam yükleyebilir veya herkesi içten içe taşımaya çalışabilirsin. Sezgini gerçek verilerle dengelemek rahatlatıcı olur.',
    relationships: 'Yüzeysel bağlar seni doyurmaz; samimiyet, ruhsal yakınlık ve dürüstlük istersin. Anlaşılmadığını hissetmek seni sessizce uzaklaştırabilir.',
    rhythm: 'Yalnız kalıp içini topladığın zamanlara ihtiyaç duyarsın. Ama anlamlı bir amaç olduğunda uzun süre odaklanabilirsin.',
  },
  INTJ: {
    theme: 'Strateji, bağımsızlık ve büyük resmi kurma arzusu belirgin.',
    self: 'INTJ tipi sistemleri, olasılıkları ve uzun vadeli sonuçları düşünür. Bir şeyin neden çalıştığını ya da neden çalışmadığını anlamak ister.',
    strengths: 'Stratejik düşünme, bağımsız karar alma, karmaşık yapıları sadeleştirme ve hedefe kilitlenme güçlü yanlarındır.',
    growth: 'Bazen insan faktörünü veya duygusal geçişleri gereksiz ayrıntı gibi görebilirsin. İlişkilerde açıklık kadar sıcaklık da etkilidir.',
    relationships: 'Zihinsel uyum, dürüstlük ve kişisel alana saygı beklersin. Güvenmediğin yerde kolay kolay açılmazsın.',
    rhythm: 'Uzun vadeli hedefler, net yetki alanı ve düşünme alanı seni besler. Mikroyönetim ve anlamsız tekrarlar seni yorar.',
  },
  ISTP: {
    theme: 'Sakin gözlem, pratik çözüm ve özgür hareket alanı.',
    self: 'ISTP tipi olanı olduğu gibi inceler, fazla konuşmadan sistemi anlamaya çalışır. Bir şeyi deneyerek, söküp takarak veya doğrudan yaşayarak öğrenir.',
    strengths: 'Soğukkanlılık, pratik zeka, hızlı uyum ve eldeki araçlarla çözüm üretme güçlü yanlarındır.',
    growth: 'Duyguları açıklamak ya da uzun vadeli planı sürdürmek bazen zorlayabilir. İç dünyanı tamamen kapatmadan ifade etmek ilişkilerini rahatlatır.',
    relationships: 'Baskı ve fazla beklenti seni uzaklaştırabilir. Saygı, alan ve doğal yakınlık olduğunda bağın güçlenir.',
    rhythm: 'Esnek planlar, gerçek problemler ve hareket alanı sana iyi gelir. Fazla teorik veya aşırı duygusal ortamlar enerjini düşürebilir.',
  },
  ISFP: {
    theme: 'İç değerler, estetik duyarlılık ve özgür ifade.',
    self: 'ISFP tipi kendi iç pusulasına göre yaşamak ister. Zorla kalıba sokulmak yerine hissettiği doğruluğu takip eder.',
    strengths: 'Samimiyet, duyarlılık, estetik bakış ve anda kalabilme güçlü yanlarındır. İnsanlara yumuşak ama gerçek bir temas sunarsın.',
    growth: 'Çatışmadan kaçmak veya kararları fazla ertelemek seni sıkıştırabilir. İç değerini korurken daha açık konuşmak iyi gelir.',
    relationships: 'İlişkide doğallık, nezaket ve baskısız yakınlık istersin. Kontrol edilmek ya da yargılanmak seni hızla kapatır.',
    rhythm: 'Yaratıcı alan, duyusal deneyim ve sakin tempo seni besler. Sert rekabet ve sürekli performans beklentisi yorucu olabilir.',
  },
  INFP: {
    theme: 'İdeal, anlam ve içtenlik arayışı çok güçlü.',
    self: 'INFP tipi hayatı değerleri ve iç dünyası üzerinden okur. Bir şeyin doğru hissettirmesi, mantıklı görünmesi kadar önemlidir.',
    strengths: 'Empati, hayal gücü, derin sadakat ve insanların özünü görme yeteneği güçlü yanlarındır.',
    growth: 'Gerçek dünya sınırları idealindeki kadar temiz olmadığında hayal kırıklığı yaşayabilirsin. Küçük somut adımlar büyük anlamları taşır.',
    relationships: 'Güvenli, yargısız ve derin bağlar istersin. Duygularının hafife alınması seni incitebilir.',
    rhythm: 'Yalnız düşünme, yazma, üretme ve anlamlı projeler sana iyi gelir. Fazla mekanik rutinler iç motivasyonunu düşürebilir.',
  },
  INTP: {
    theme: 'Merak, analiz ve fikirlerin iç mantığını kurma isteği.',
    self: 'INTP tipi bir fikri hemen kabul etmek yerine parçalara ayırır. Tutarlılık, açıklama gücü ve zihinsel özgürlük onun için önemlidir.',
    strengths: 'Analitik düşünme, özgün bağlantılar kurma, karmaşık konuları çözme ve bağımsız sorgulama güçlü yanlarındır.',
    growth: 'Düşüncede çok kalıp uygulamayı erteleyebilir veya duygusal ihtiyaçları geç fark edebilirsin. Bitmiş olan bazen mükemmelden değerlidir.',
    relationships: 'Zihinsel alan, dürüst tartışma ve baskısız yakınlık beklersin. Duygusal baskı altında geri çekilebilirsin.',
    rhythm: 'Serbest araştırma, problem çözme ve kendi hızında çalışma seni besler. Aşırı prosedür ve sosyal zorunluluklar yorabilir.',
  },
  ESTP: {
    theme: 'Hareket, deneyim ve anın fırsatını yakalama.',
    self: 'ESTP tipi hayatı doğrudan temas ederek öğrenir. Beklemektense denemeyi, teoridense sahada görmeyi tercih eder.',
    strengths: 'Cesaret, hızlı karar, pratik zeka ve sosyal çeviklik güçlü yanlarındır. Krizde donmak yerine hareket edebilirsin.',
    growth: 'Kısa vadeli heyecan uzun vadeli sonucu gölgeleyebilir. Bir adım geri çekilip etkileri tartmak sana avantaj sağlar.',
    relationships: 'Canlılık, dürüstlük ve birlikte deneyim yaşamak istersin. Fazla kontrol veya drama seni bunaltabilir.',
    rhythm: 'Dinamik ortamlar, gerçek hedefler ve hareket alanı seni besler. Uzun soyut toplantılar ve bekleme süreçleri enerjini düşürür.',
  },
  ESFP: {
    theme: 'Canlılık, temas ve hayatı hissederek yaşama.',
    self: 'ESFP tipi bulunduğu ortama sıcaklık ve hareket getirir. İnsanları, deneyimleri ve anın duygusunu güçlü algılar.',
    strengths: 'Sosyal sıcaklık, doğallık, pratik neşe ve insanları rahatlatma güçlü yanlarındır.',
    growth: 'Zor konuları ertelemek veya sadece iyi hissettiren seçeneğe yönelmek bazen bedel çıkarabilir. Planlı küçük sorumluluklar özgürlüğünü korur.',
    relationships: 'İlişkide eğlence, temas, ilgi ve karşılıklı canlılık istersin. Soğukluk ya da ilgisizlik seni hızlı etkiler.',
    rhythm: 'İnsanlı, hareketli ve somut sonuç veren ortamlar sana iyi gelir. Tekdüze ve izole çalışmalar yorucu olabilir.',
  },
  ENFP: {
    theme: 'Olasılık, ilham ve insan potansiyeline duyulan merak.',
    self: 'ENFP tipi hayatı bağlantılar, ihtimaller ve anlamlar üzerinden okur. Yeni fikirler ve samimi bağlar enerjisini yükseltir.',
    strengths: 'Yaratıcılık, insanları cesaretlendirme, esnek düşünme ve güçlü sezgisel bağlantılar kurma güçlü yanlarındır.',
    growth: 'Çok fazla seçenek arasında dağılabilir veya başladığın şeyi bitirmekte zorlanabilirsin. Özgürlüğü koruyan sade yapılar sana iyi gelir.',
    relationships: 'İlişkide samimiyet, oyun, derin konuşma ve gelişim istersin. Tekdüzelik ya da duygusal kapalılık seni uzaklaştırabilir.',
    rhythm: 'Yeni projeler, anlamlı insan teması ve keşif alanı seni besler. Katı rutinler motivasyonunu düşürebilir.',
  },
  ENTP: {
    theme: 'Fikir, tartışma ve kalıpları esnetme enerjisi.',
    self: 'ENTP tipi olasılıkları test eder, sistemlerin açıklarını görür ve zihinsel oyun alanlarını sever. Soru sormak onun için yakınlaşma biçimi bile olabilir.',
    strengths: 'Hızlı zeka, esneklik, yaratıcı problem çözme ve ezber bozma güçlü yanlarındır.',
    growth: 'Her şeyi tartışmaya açmak bazen karşı tarafı yorabilir. Fikrin gücü kadar duygusal zamanlama da önemlidir.',
    relationships: 'Zihinsel canlılık, mizah ve özgürlük beklersin. Fazla kuralcı ya da alıngan bağlar seni sıkıştırabilir.',
    rhythm: 'Yenilik, strateji, tartışma ve değişken problemler seni besler. Tekrarlı operasyonel işler çabuk sıkıcı gelebilir.',
  },
  ESTJ: {
    theme: 'Düzen kurma, sonuç alma ve sorumluluk taşıma.',
    self: 'ESTJ tipi işlerin net, ölçülebilir ve uygulanabilir olmasını ister. Belirsizliği azaltır, görevleri organize eder.',
    strengths: 'Liderlik, planlama, karar alma ve sistemi çalıştırma güçlü yanlarındır. İnsanlar senden yön ve netlik alabilir.',
    growth: 'Bazen hız ve verimlilik adına duygusal nüansları kaçırabilirsin. Dinlemek, otoriteni zayıflatmaz; güveni artırır.',
    relationships: 'İlişkide sadakat, açıklık ve sorumluluk beklersin. Dağınıklık veya kararsızlık seni zorlayabilir.',
    rhythm: 'Hedefi belli işler, net roller ve sonuç odaklı ekipler sana iyi gelir. Belirsiz, plansız ortamlar sabrını tüketir.',
  },
  ESFJ: {
    theme: 'Uyum, destek ve ilişkisel düzen kurma.',
    self: 'ESFJ tipi çevresindeki insanların iyi olup olmadığını fark eder. Aidiyet, nezaket ve karşılıklı emek onun için önemlidir.',
    strengths: 'Sosyal organizasyon, destek verme, pratik bakım ve insanları bir arada tutma güçlü yanlarındır.',
    growth: 'Herkesi memnun etmeye çalışmak seni yorabilir. Kendi ihtiyacını açık söylemek ilişkide denge kurar.',
    relationships: 'İlgiyi, sürekliliği ve açık takdiri beklersin. Soğukluk veya belirsiz mesafe seni huzursuz edebilir.',
    rhythm: 'İnsan odaklı görevler, ortak ritüeller ve düzenli iletişim seni besler. Değerinin görülmediği yerde hızla yıpranabilirsin.',
  },
  ENFJ: {
    theme: 'İnsanları anlama, yön verme ve ortak anlam kurma.',
    self: 'ENFJ tipi ilişkilerdeki potansiyeli ve grubun duygusal yönünü güçlü hisseder. İnsanların gelişimine katkı vermek ister.',
    strengths: 'İlham verme, empati, liderlik ve insanları ortak hedefe toplama güçlü yanlarındır.',
    growth: 'Başkalarının duygularını fazla üstlenebilir veya kendi ihtiyacını geri plana atabilirsin. Yardım etmekle kontrol etmek arasındaki çizgiye dikkat etmek iyi gelir.',
    relationships: 'Derinlik, açıklık ve karşılıklı büyüme beklersin. Duygusal kopukluk veya belirsizlik seni zorlayabilir.',
    rhythm: 'Anlamlı ekipler, gelişim alanları ve insan etkisi olan projeler seni besler. Değer çatışması yaşadığın ortamlarda çok yorulabilirsin.',
  },
  ENTJ: {
    theme: 'Strateji, liderlik ve güçlü ilerleme arzusu.',
    self: 'ENTJ tipi hedefi görür, yolu kurar ve kaynakları harekete geçirmek ister. Potansiyeli boşa harcamak ona zor gelir.',
    strengths: 'Kararlılık, vizyon, organizasyon ve zor kararları alabilme güçlü yanlarındır.',
    growth: 'Bazen hızın ve netliğin başkalarına sert gelebilir. İnsanların duygusal uyum sürecine alan açmak sonuçları iyileştirir.',
    relationships: 'Zihinsel güç, dürüstlük ve gelişim beklersin. Pasiflik veya belirsiz beklentiler seni sabırsızlaştırabilir.',
    rhythm: 'Büyük hedefler, yetki, stratejik alan ve güçlü ekipler seni besler. Etkisiz bürokrasi enerjini düşürür.',
  },
};

// Sonuç kaydı sırasında üretilen, kullanıcıya görünür kalıcı metin kalıpları.
// TR çıktıları, ekranda daha önce gömülü olan şablonlarla birebir aynıdır.
export const MBTI_STRINGS: MbtiStrings = {
  mbtiTestName: 'MBTI Kişilik Testi',
  buildMbtiSummary: (type, description) => `MBTI Kişilik Testi sonucu: ${type}. ${description}`,
  buildGenericSummary: ({ testTitle, resultTitle, description, dimensionSummary }) =>
    `${testTitle} sonucu: ${resultTitle}. ${description} Boyutlar: ${dimensionSummary}.`,
};

// ---------------------------------------------------------------------
// Dil seçicileri — aktif uygulama diline göre doğru içerik setini döndürür.
// ---------------------------------------------------------------------

export function getMbtiQuestions(): MbtiQuestion[] {
  return getAppLanguage() === 'en' ? MBTI_QUESTIONS_EN : MBTI_QUESTIONS;
}

export function getMbtiTypeDescriptions(): Record<string, string> {
  return getAppLanguage() === 'en' ? MBTI_TYPE_DESCRIPTIONS_EN : MBTI_TYPE_DESCRIPTIONS;
}

export function getMbtiTypeArchetypes(): Record<string, MbtiTypeArchetype> {
  return getAppLanguage() === 'en' ? MBTI_TYPE_ARCHETYPES_EN : MBTI_TYPE_ARCHETYPES;
}

export function getMbtiTypeDetail(): Record<string, MbtiTypeDetail> {
  return getAppLanguage() === 'en' ? MBTI_TYPE_DETAIL_EN : MBTI_TYPE_DETAIL;
}

export function getMbtiStrings(): MbtiStrings {
  return getAppLanguage() === 'en' ? MBTI_STRINGS_EN : MBTI_STRINGS;
}

// ============================================================
// Ruhbaz Konağı - Kişisel I-Ching + Rün (konuşmalı) okuma servisi (Faz 5.4 = B)
// ============================================================
// Tarot/rüya kalıbı: Gemini + moderasyon + persona sesi + hafıza + takip soruları +
// 677-uyumlu dil + persona kapanışı. Cast (hexagram/rün seçimi) cihazda deterministik
// (seeded); divinationData verisi (locale-aware) yeniden kullanılır. Persona YALNIZ
// sesi/ritmi belirler; I-Ching/Rün dışı sembolik araçlara değinmez.

import { filterModeratedFollowUps, moderateUserInput } from './inputModerationService';
import type { SubjectProfile, ProfileMemorySnippet } from '../types/memory';
import { getRunes, getIChingHexagrams } from '../data/divinationDataI18n';
import {
  PERSONAL_FOLLOW_UP_MAX_OUTPUT_TOKENS,
  PERSONAL_FOLLOW_UP_TOKEN_INSTRUCTION,
  PERSONAL_INITIAL_READING_MAX_OUTPUT_TOKENS,
  PERSONAL_INITIAL_READING_TOKEN_INSTRUCTION,
} from '../config/llmTokenPolicy';
import { READING_PERSONA_DATA } from './readingPersonaData';
import { getReadingPersonaData } from './personaDataI18n';
import { generateGeminiTextDirect } from './geminiDirectService';
import {
  appendHealthProfessionalReminder,
  completeWithRememberedPersonaClosing,
  sanitizeGenderedAddress,
  userAskedHealthConcern,
} from './personaClosingService';
import { buildAnimalProfileInstructionFromMemory, buildAnimalProfileInstructionFromProfile } from './animalProfilePrompt';
import { formatPromptMemoryPack } from './memoryPromptPackFormatter';
import { formatPetMentionMemoryContext, formatStandardPersonalMemoryContext } from './personalMemoryPromptContext';
import { cleanFollowUpReply, FOLLOW_UP_CHAT_CONTRACT, getSimpleFollowUpReply } from './followUpResponseService';
import { enOutputLanguageSystemDirective, enOutputLanguageUserTurnReminder } from './promptLanguage';
import { buildDivinationSpecificityContext } from './readingSpecificityBank';
import { getReadingSafetyCore } from './readingCommonPrompt';

type PersonaId = keyof typeof READING_PERSONA_DATA;

export type DivinationKind = 'iching' | 'rune';

export interface IChingCast {
  present: { name: string; situation: string; advice: string };
  future: { name: string; situation: string; advice: string } | null;
  changingLineNumbers: number[];
}
export interface RuneDraw {
  positionNo: number;
  rune: string;
  keyword: string;
  message: string;
  path: string;
}
export interface RuneCast {
  runes: RuneDraw[];
}
export interface DivinationCast {
  kind: DivinationKind;
  iching?: IChingCast;
  rune?: RuneCast;
}

export type DivinationFollowUpMessage = { role: 'user' | 'assistant'; text: string };

const DIVINATION_MAX_OUTPUT_TOKENS = PERSONAL_INITIAL_READING_MAX_OUTPUT_TOKENS;
const DIVINATION_FOLLOW_UP_MAX_OUTPUT_TOKENS = PERSONAL_FOLLOW_UP_MAX_OUTPUT_TOKENS;

function personaId(value?: string): PersonaId {
  return (value && value in READING_PERSONA_DATA ? value : 'suzan') as PersonaId;
}

function hashString(value: string) {
  let h = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function seededRandom(seed: string) {
  let state = hashString(seed) || 1;
  return () => {
    state = Math.imul(1664525, state) + 1013904223;
    return (state >>> 0) / 4294967296;
  };
}

// --- Cast (deterministik, seeded) ---
function castIChing(seed: string): IChingCast {
  const random = seededRandom(`iching:${seed}`);
  const lines: number[] = [];
  for (let i = 0; i < 6; i += 1) {
    const v = Math.floor(random() * 16);
    let lineVal = 8;
    if (v < 1) lineVal = 6;
    else if (v < 6) lineVal = 7;
    else if (v < 13) lineVal = 8;
    else lineVal = 9;
    lines.push(lineVal);
  }
  const baseBinary = lines.map((l) => (l === 7 || l === 9 ? '1' : '0')).join('');
  const endBinary = lines.map((l) => (l === 7 || l === 6 ? '1' : '0')).join('');
  const hexagrams = getIChingHexagrams();
  const baseHex = hexagrams.find((h) => h.binary === baseBinary) || hexagrams[0];
  const changingLineNumbers = lines
    .map((l, idx) => (l === 6 || l === 9 ? idx + 1 : null))
    .filter((x): x is number => x !== null);
  const endHex = changingLineNumbers.length ? hexagrams.find((h) => h.binary === endBinary) || hexagrams[0] : null;
  return {
    present: { name: baseHex.name, situation: baseHex.situation, advice: baseHex.advice },
    future:
      endHex && endHex.binary !== baseBinary
        ? { name: endHex.name, situation: endHex.situation, advice: endHex.advice }
        : null,
    changingLineNumbers,
  };
}

function castRune(seed: string): RuneCast {
  const random = seededRandom(`rune:${seed}`);
  const deck = [...getRunes()];
  const runes: RuneDraw[] = [];
  for (let pos = 1; pos <= 3 && deck.length; pos += 1) {
    const idx = Math.floor(random() * deck.length);
    const r = deck.splice(idx, 1)[0];
    runes.push({ positionNo: pos, rune: r.rune, keyword: r.keyword, message: r.message, path: r.path });
  }
  return { runes };
}

export function castDivination(kind: DivinationKind, seed: string): DivinationCast {
  return kind === 'iching' ? { kind, iching: castIChing(seed) } : { kind, rune: castRune(seed) };
}

const RUNE_POSITION_LABELS = ['Kök / geçmiş etki', 'Şu anki enerji', 'Olası yönelim'];

function formatCastForPrompt(cast: DivinationCast): string {
  if (cast.kind === 'iching' && cast.iching) {
    const ic = cast.iching;
    const parts = [
      `Şimdiki durum hexagramı: ${ic.present.name}`,
      `Durum: ${ic.present.situation}`,
      `Tavsiye çekirdeği: ${ic.present.advice}`,
    ];
    if (ic.future) {
      parts.push(`Değişen çizgiler (alttan): ${ic.changingLineNumbers.join(', ')}.`);
      parts.push(`Dönüşüm hexagramı: ${ic.future.name}`);
      parts.push(`Dönüşüm durumu: ${ic.future.situation}`);
      parts.push(`Dönüşüm tavsiyesi: ${ic.future.advice}`);
    } else {
      parts.push('Değişen çizgi yok; durum sabit, enerji şimdiki hexagramda yoğunlaşıyor.');
    }
    return parts.join('\n');
  }
  if (cast.kind === 'rune' && cast.rune) {
    return cast.rune.runes
      .map((r, i) =>
        [
          `${r.positionNo}. ${RUNE_POSITION_LABELS[i] || 'Konum'}`,
          `Rün: ${r.rune} (${r.keyword})`,
          `Rün mesajı: ${r.message}`,
          `Rün yolu: ${r.path}`,
        ].join('\n'),
      )
      .join('\n\n');
  }
  return '';
}

function cleanGeneratedText(text: string) {
  return text
    .replace(/\r\n/g, '\n')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

// Diğer alanların araçları gövdeye sızarsa nötrle (prompt zaten yasaklıyor; ek güvence).
function stripDivinationDomainLeaks(text: string) {
  return cleanGeneratedText(text)
    .replace(/\bfincan(?:ın|daki|da|dan|ı|a)?\b/gi, 'semboller')
    .replace(/\btelve(?:nin|leri|lerde|lerden|yi|ye|de|den)?\b/gi, 'işaretler')
    .replace(/\btabak(?:ta|tan|taki|ı|a)?\b/gi, 'dizilim')
    .replace(/\bavuç içi\b/gi, 'dizilim')
    .replace(/\bel çizgileri?\b/gi, 'semboller')
    .replace(/\bkahve yorumu\b/gi, 'okuma')
    .replace(/\btarot kart(?:ı|ları|lar)?\b/gi, 'semboller')
    .replace(/\s{2,}/g, ' ')
    .replace(/ \n/g, '\n')
    .trim();
}

function memoryContext(kind: DivinationKind, profileName: string, memorySnippet?: ProfileMemorySnippet | null, isAnimal = false) {
  const domainLabel = kind === 'iching' ? 'I-Ching okuması' : 'rün okuması';
  const lines = [
    '## Profil ve Hafıza Bağlamı',
    isAnimal || memorySnippet?.relationshipPrimary === 'evcil_hayvan'
      ? `- Bu ${domainLabel} ${profileName || 'seçili profil'} adlı evcil hayvan için yapılıyor.`
      : `- Bu ${domainLabel} ${profileName || 'seçili kişi'} için yapılıyor.`,
    '- Kullanıcının bu oturumda yazdığı konu/soru ve takip soruları birincil sinyaldir.',
    '- Önceki yorumlardan türeyen temalar düşük öncelikli arka plandır; çekilen semboller ve soru desteklemiyorsa ana konu yapılmaz.',
  ];
  if (!memorySnippet) return lines.join('\n');
  if (memorySnippet.isSelf) {
    lines.push('- Profil hesap sahibinin kendisi; anlatımda sen/siz dili tutarlı olsun.');
  } else {
    lines.push(`- Okuma hesap sahibinden farklı biri için olabilir; seçili profil olan ${profileName} sabit kalmalı.`);
  }
  if (memorySnippet.relationshipLabel) lines.push(`- Hesap sahibiyle yakınlık: ${memorySnippet.relationshipLabel}.`);
  const animalContext = buildAnimalProfileInstructionFromMemory(memorySnippet);
  if (animalContext) lines.push(animalContext);
  if (memorySnippet.profileGender) lines.push(`- Profil cinsiyet bilgisi: ${memorySnippet.profileGender}; hitapları buna göre seç.`);
  if (memorySnippet.userStatedTopics?.length) {
    lines.push(`- Kullanıcının kendi söylediği güçlü konular: ${memorySnippet.userStatedTopics.slice(0, 8).join(', ')}.`);
  }
  const promptMemoryPack = formatPromptMemoryPack(memorySnippet);
  if (promptMemoryPack) lines.push(promptMemoryPack);
  const standardMemory = formatStandardPersonalMemoryContext({
    profileName,
    readingLabel: domainLabel,
    memorySnippet,
    includePromptPack: false,
  });
  if (standardMemory) lines.push(standardMemory);
  return lines.join('\n');
}

function buildBaseSystem(params: {
  kind: DivinationKind;
  assistantId: string;
  profileName: string;
  memorySnippet?: ProfileMemorySnippet | null;
  isAnimalProfile?: boolean;
}) {
  const id = personaId(params.assistantId);
  const identity = getReadingPersonaData()[id];
  const isAnimal = Boolean(params.isAnimalProfile || params.memorySnippet?.relationshipPrimary === 'evcil_hayvan');
  const domainName = params.kind === 'iching' ? 'I-Ching (Değişimler Kitabı)' : 'Rün';
  const symbolWord = params.kind === 'iching' ? 'hexagram ve değişen çizgiler' : 'rün taşları ve sembolleri';
  return [
    enOutputLanguageSystemDirective(),
    identity.systemBody,
    getReadingSafetyCore(),
    [
      `## ${domainName} Direktifleri`,
      `- Bu oturumun alanı ${domainName} okuması. Seçili persona yalnızca ses, hitap ve yorum ritmini belirler.`,
      `- Yorumu yalnızca çekilen ${symbolWord} üzerinden kur; kahve, fincan, telve, tabak, el/avuç, doğum haritası, numeroloji, tarot kartı ya da rüya objeleriyle yorum yapma; metafor olarak bile değinme.`,
      params.kind === 'iching'
        ? '- Şimdiki hexagramı durum, değişen çizgileri dönüm noktası, dönüşüm hexagramını olası yönelim olarak işle; değişen çizgi yoksa durumun sabitliğini vurgula.'
        : '- Üç rünü konumlarıyla (kök/geçmiş etki, şu anki enerji, olası yönelim) birbirine bağlayarak akan bir hikâye gibi yorumla; tek tek liste gibi kopuk anlatma.',
      '- Kendini tanıtma, adınla/rolünle başlama, sistemden veya yapay zekadan bahsetme; ilk cümle doğrudan yoruma girsin.',
      '- Kullanıcıya görünen metinde yorumcu/persona adı, public label veya rol tanıtımı yazma.',
      '- Hukuken kesin gelecek iddiası kurma; "yorum", "okuma", "sembolik yorum", "izlenim", "olasılık", "eğilim" dili kullan.',
      '- Sağlık ve finans alanlarında spesifik tavsiye verme. İnsan sağlığıyla ilgili endişede doktora/uygun sağlık uzmanına, hayvan sağlığıyla ilgili endişede veterinere görünmeyi nazikçe öner.',
      '- "Şunu ye/iç geçer", "kesin geçecek", "kesin iyileşecek", ilaç/doz/tedavi/beslenme reçetesi veya kesin sonuç dili yasak.',
      '- Kullanıcı bir konu/soru yazdıysa bunu kendi aklına gelmiş gibi sahiplenme; "aklıma geldi" gibi ifadeler kullanma.',
      '- Hafıza veya önceki okuma kaynağını açık etme; "önceki okumanda", "hafızanda", "sana daha önce çıkmıştı" gibi cümleler kurma.',
      '- Kullanıcının niyeti/sorusu varsa bu oturumun ana eksenidir; ilk paragrafta doğrudan o soruya dön ve tüm okumayı o bağlamda yorumla.',
      '- Bu okuma KİŞİYE ÖZEL olmalı: çekilen sembolleri kullanıcının bilinen dünyasıyla — mizacı ve hassasiyetleri, son konu/soru/takip mesajları, öne çıkan ilişkileri ve okuma geçmişinden süzülen temalar — tek bir doku hâlinde birleştir; jenerik, herkese uyabilecek bir okuma kurma.',
      '- Bu bağlamı yalnızca doğal tanışıklık olarak kullan; kaynağını (hafıza, profil, doğum haritası, numeroloji) asla adlandırma ve bu araçlarla okuma yapma.',
      '- Sembollerin anlamlarını tek tek "şu taş/çizgi şunu gösterir" diye SIRALAMA; hepsini tek bir kişiye özel sentez içinde erit. Sözlük tanımı veya madde madde anlatım yasak; semboller hikâyenin içinde birbirine bağlansın.',
      '- Çekilişi bu kişinin somut hayat akışına bağla; tanıdık ve doğru-yere-değen hissettiren, kanıtla (sembol + bilinen bağlam) desteklenmiş bir okuma kur.',
      isAnimal
        ? '- Seçili profil evcil hayvansa okumayı insan hayatı şablonuna çevirme. Sembolleri hayvanın mizacı, oyun/dinlenme düzeni, ev içi güveni, duyuları ve sahibiyle bağı üzerinden yorumla; kariyer, evlilik, romantik ilişki, okul gibi insan temaları kurma.'
        : '',
      '- Sembol dilini sezgisel ve psikolojik oku; kesin hüküm, korkutucu felaket, ölüm, ağır hastalık veya geri dönülmez hüküm verme.',
      '- Yanıt başlıksız, listesiz, sohbet gibi akan düz yazı olsun. Markdown, yıldızlı vurgu, emoji, ikon veya dekoratif sembol kullanma.',
      `- Ana okuma yorumunda ${PERSONAL_INITIAL_READING_TOKEN_INSTRUCTION}`,
      '- Ana yorum kısa cevap gibi KALMASIN: en az 3-4 dolu paragraf olsun ve geçmiş izi, şimdiki olasılık, yakın gelecek kapısı ile uygulanabilir tavsiyeyi birlikte, doyurucu biçimde taşısın. Tek-iki paragraflık kısa okuma eksik sayılır.',
      '- Kullanıcı konu/soru GİRMESE bile (genel okuma) bu doluluk ve kişiye özellik aynen korunur: çekilişi kişinin bilinen bağlamına (mizaç, geçmiş temalar, öne çıkan ilişkiler) ve güncel hayat akışına bağlayarak yaz; jenerik, kısa veya herkese uyan bir metne kaçma.',
      `- Takip sorularında: ${FOLLOW_UP_CHAT_CONTRACT}`,
      '- Oturum boyunca aynı çekiliş, aynı profil ve önceki soru cevap bağlamı korunmalı.',
      '- Kapanışta yeni imza cümlesi üretme; sistem persona kapanışını sonradan ekleyecek.',
      '- Türkçe karakterleri daima doğru UTF-8 yaz: ç, ğ, ı, İ, ö, ş, ü.',
    ]
      .filter(Boolean)
      .join('\n'),
    memoryContext(params.kind, params.profileName, params.memorySnippet, isAnimal),
  ]
    .filter(Boolean)
    .join('\n\n');
}

export async function createPersonalDivinationReading(params: {
  profile: SubjectProfile;
  assistantId: string;
  assistantLabel: string;
  kind: DivinationKind;
  cast: DivinationCast;
  question?: string;
  memorySnippet?: ProfileMemorySnippet | null;
  usedClosings?: string[];
}) {
  const moderation = moderateUserInput(params.question, 'question');
  if (moderation.verdict !== 'allow') {
    return {
      text: moderation.replyText,
      closingSentence: '',
      modelName: 'local-input-moderation',
      usage: { inputTokens: 0, outputTokens: 0, totalTokens: 0 },
      specificityUsage: { events: [], cues: [] },
    };
  }
  const isAnimal = params.profile.relationshipPrimary === 'evcil_hayvan';
  const systemText = buildBaseSystem({
    kind: params.kind,
    assistantId: params.assistantId,
    profileName: params.profile.displayName,
    memorySnippet: params.memorySnippet,
    isAnimalProfile: isAnimal,
  });
  const domainName = params.kind === 'iching' ? 'I-Ching' : 'Rün';
  // Anlamsal + tekrar-önlemeli 2 micro life event; kişiye özel dokuyu güçlendirir,
  // usage döner ki ekran appendReadingSpecificityUsage ile kaydedip tekrarı önlesin.
  // Cast imzasını seed'e kat: aynı soru/genel okumada bile her çekiliş farklı sıralama üretsin
  // (snippet yüklenemese bile tekrar-çeşitlilik bozulmaz).
  const castSeed =
    params.cast.kind === 'iching'
      ? `${params.cast.iching?.present.name || ''}:${params.cast.iching?.changingLineNumbers.join(',') || ''}`
      : params.cast.rune?.runes.map((rune) => rune.rune).join('') || '';
  const specificity = buildDivinationSpecificityContext({
    seed: `${params.profile.profileId}:${params.kind}:${params.question?.slice(0, 80) || 'genel'}:${castSeed}`,
    memorySnippet: params.memorySnippet,
    focusQuestion: params.question,
    messages: [],
  });
  const userText = [
    `Profil adı: ${params.profile.displayName}`,
    buildAnimalProfileInstructionFromProfile(params.profile),
    `${domainName} çekilişi:\n${formatCastForPrompt(params.cast)}`,
    params.question
      ? [
          `KULLANICININ ANA SORUSU / NİYETİ: ${params.question}`,
          formatPetMentionMemoryContext(params.question, params.memorySnippet),
          'Bu soru ana bağlamdır. İlk paragrafta doğrudan bu soruya dön; sembolleri bu sorunun cevabını kuracak şekilde bağla.',
        ]
          .filter(Boolean)
          .join('\n')
      : `Kullanıcı genel bir ${domainName} okuması istedi; çekilişi onun güncel hayat akışına dair sezgisel bir yorumla işle.`,
    isAnimal
      ? 'Yorumu önce hayvanın genel enerjisi ve güven/oyun ritmiyle başlat; sonra sembolleri ev içi davranış, duyular ve sahibiyle bağı üzerinden işle. Son bölümde sahibine uygulanabilir yumuşak bir öneri ver.'
      : 'Yorumu önce çekilişin genel enerjisiyle başlat, sonra sembollerin ilişkisini işle, son bölümde uygulanabilir bir yön ve yumuşak toparlama ver.',
    specificity.text,
    PERSONAL_INITIAL_READING_TOKEN_INSTRUCTION,
    enOutputLanguageUserTurnReminder(),
  ]
    .filter(Boolean)
    .join('\n\n');
  const data = await generateGeminiTextDirect(
    {
      system_instruction: { parts: [{ text: systemText }] },
      contents: [{ role: 'user', parts: [{ text: userText }] }],
      generationConfig: { temperature: 0.74, maxOutputTokens: DIVINATION_MAX_OUTPUT_TOKENS },
    },
    70000,
    { usageMode: 'raw' },
  );
  const completed = await completeWithRememberedPersonaClosing({
    text: stripDivinationDomainLeaks(data.text),
    assistantId: params.assistantId,
    domain: params.kind,
    seed: `${params.profile.profileId}:${params.kind}:${params.question?.slice(0, 120) || 'genel'}`,
    usedClosings: params.usedClosings,
    allowHealthClosing: userAskedHealthConcern(params.question),
    isAnimalProfile: isAnimal,
  });
  return {
    text: sanitizeGenderedAddress(
      appendHealthProfessionalReminder(completed.text, { userText: params.question, isAnimalProfile: isAnimal }),
      { assistantId: params.assistantId, memorySnippet: params.memorySnippet, isAnimalProfile: isAnimal },
    ),
    closingSentence: completed.closingSentence,
    modelName: data.model,
    usage: data.usage,
    specificityUsage: specificity.usage,
  };
}

export async function createPersonalDivinationFollowUp(params: {
  profileName: string;
  assistantId: string;
  assistantLabel: string;
  kind: DivinationKind;
  cast: DivinationCast;
  readingText: string;
  question: string;
  previousFollowUps?: DivinationFollowUpMessage[];
  memorySnippet?: ProfileMemorySnippet | null;
  usedClosings?: string[];
}) {
  const simpleReply = getSimpleFollowUpReply(params.question);
  if (simpleReply) {
    return { text: simpleReply, closingSentence: '', modelName: 'local-follow-up-reply', usage: { inputTokens: 0, outputTokens: 0, totalTokens: 0 } };
  }
  const moderation = moderateUserInput(params.question, 'question');
  if (moderation.verdict !== 'allow') {
    return {
      text: moderation.replyText,
      closingSentence: '',
      modelName: 'local-input-moderation',
      usage: { inputTokens: 0, outputTokens: 0, totalTokens: 0 },
    };
  }
  const isAnimal = params.memorySnippet?.relationshipPrimary === 'evcil_hayvan';
  const systemText = buildBaseSystem({
    kind: params.kind,
    assistantId: params.assistantId,
    profileName: params.profileName,
    memorySnippet: params.memorySnippet,
    isAnimalProfile: isAnimal,
  });
  const domainName = params.kind === 'iching' ? 'I-Ching' : 'Rün';
  const conversation = filterModeratedFollowUps(params.previousFollowUps)
    .map((message) => `${message.role === 'user' ? 'Kullanıcı' : 'Yorumcu'}: ${message.text}`)
    .join('\n');
  const userText = [
    `Profil adı: ${params.profileName}`,
    buildAnimalProfileInstructionFromMemory(params.memorySnippet),
    `${domainName} çekilişi:\n${formatCastForPrompt(params.cast)}`,
    `İlk yorum:\n${params.readingText}`,
    conversation ? `Önceki soru cevaplar:\n${conversation}` : '',
    `Kullanıcının son sorusu:\n${params.question}`,
    formatPetMentionMemoryContext(params.question, params.memorySnippet),
    isAnimal
      ? `Sadece son soruya cevap ver; ama aynı çekiliş ve evcil hayvan bağlamı korunmalı, insan hayatı şablonuna kayma. ${PERSONAL_FOLLOW_UP_TOKEN_INSTRUCTION}`
      : `Sadece son soruya cevap ver; ama aynı çekiliş ve önceki bağlam korunmalı. ${PERSONAL_FOLLOW_UP_TOKEN_INSTRUCTION}`,
    enOutputLanguageUserTurnReminder(),
  ]
    .filter(Boolean)
    .join('\n\n');
  const data = await generateGeminiTextDirect(
    {
      system_instruction: { parts: [{ text: systemText }] },
      contents: [{ role: 'user', parts: [{ text: userText }] }],
      generationConfig: { temperature: 0.7, maxOutputTokens: DIVINATION_FOLLOW_UP_MAX_OUTPUT_TOKENS },
    },
    70000,
    { usageMode: 'raw' },
  );
  const completed = await completeWithRememberedPersonaClosing({
    text: stripDivinationDomainLeaks(data.text),
    assistantId: params.assistantId,
    domain: params.kind,
    seed: `${params.profileName}:${params.kind}:${params.question}:${params.previousFollowUps?.length || 0}`,
    usedClosings: params.usedClosings,
    allowHealthClosing: userAskedHealthConcern(params.question),
    isAnimalProfile: isAnimal,
  });
  return {
    text: sanitizeGenderedAddress(
      cleanFollowUpReply(appendHealthProfessionalReminder(completed.text, { userText: params.question, isAnimalProfile: isAnimal })),
      { assistantId: params.assistantId, memorySnippet: params.memorySnippet, isAnimalProfile: isAnimal },
    ),
    closingSentence: completed.closingSentence,
    modelName: data.model,
    usage: data.usage,
  };
}

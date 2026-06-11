// =====================================================================
// mbtiContent.en.ts — İNGİLİZCE (EN) SÜRÜM
// Faz 4 — onay: Ozan
//
// Yapı, mbtiContent.ts ile birebir aynıdır: aynı alan adları, aynı soru
// id'leri ve sırası, aynı kayıt sayıları (32 soru çifti, 16 tip tanımı,
// 16 arketip, 16 tip detayı). Tipler ./mbtiContent dosyasından import
// edilir; burada _EN sonekli sabitler export edilir.
//
// Lookup anahtarları KORUNMUŞTUR (çevrilmez):
//  - MBTI tip kodları (ISTJ ... ENTJ) ve harfler (I/E, S/N, F/T, J/P)
//  - soru id'leri ve boyut puanlama düzeni
//
// Çeviri çerçevesi: öz-keşif + eğlence; sıcak ama abartısız; olasılık
// kipi ("tends to", "may"); tanı/kesin hüküm dili YOKTUR.
// =====================================================================

import type { MbtiQuestion, MbtiStrings, MbtiTypeArchetype, MbtiTypeDetail } from './mbtiContent';

export const MBTI_QUESTIONS_EN: MbtiQuestion[] = [
  { id: 1, left: 'I make lists for my daily tasks', right: 'I rely on my memory for daily tasks' },
  { id: 2, left: 'I approach new information with doubt first', right: 'I want to believe new information first' },
  { id: 3, left: 'Time alone bores me', right: 'I need time alone' },
  { id: 4, left: 'I mostly accept situations as they are', right: 'I rarely settle for what is; I look for other possibilities' },
  { id: 5, left: 'I keep my room / space tidy', right: 'I leave things wherever they land' },
  { id: 6, left: 'Seeming "mechanical" feels bad to me', right: 'I want my mind to work mechanically' },
  { id: 7, left: 'I am an energetic person', right: 'I am calm and soft-paced' },
  { id: 8, left: 'I like questions with clear options', right: 'I like questions with open-ended answer space' },
  { id: 9, left: 'I am a messy person', right: 'I am an orderly person' },
  { id: 10, left: 'Criticism or harsh words hurt me easily', right: 'I am thick-skinned about criticism or harsh words' },
  { id: 11, left: 'I work better with a group', right: 'I work better on my own' },
  { id: 12, left: 'When deciding, I focus on the present and the facts at hand', right: 'When deciding, I focus on future possibilities' },
  { id: 13, left: 'I plan far in advance', right: 'I plan at the last minute' },
  { id: 14, left: 'People respecting me matters more to me', right: 'People liking me matters more to me' },
  { id: 15, left: 'Parties tire me out', right: 'Parties fire me up' },
  { id: 16, left: 'When I enter a room, I lean toward blending in', right: 'When I enter a room, I lean toward standing out' },
  { id: 17, left: 'I keep my options open', right: 'I decide and commit' },
  { id: 18, left: 'I want to be good at fixing things', right: 'I want to be good at being good for people' },
  { id: 19, left: 'I talk more', right: 'I listen more' },
  { id: 20, left: 'When telling a story, I say what happened', right: 'When telling a story, I say what it meant' },
  { id: 21, left: 'I want to finish what I start as soon as possible', right: 'I tend to postpone or spread out what I start' },
  { id: 22, left: 'In important choices, I lean toward following my heart', right: 'In important choices, I lean toward following my head' },
  { id: 23, left: 'I stay at home', right: 'I love going out and exploring' },
  { id: 24, left: 'To understand a topic, I want the big picture first', right: 'To understand a topic, I want the details first' },
  { id: 25, left: 'In new situations, I trust my improvisation', right: 'I want to enter new situations prepared' },
  { id: 26, left: 'I build my morality on justice', right: 'I build my morality on compassion' },
  { id: 27, left: 'Shouting very loudly is hard for me', right: 'Calling out across a distance feels natural' },
  { id: 28, left: 'To understand something, I build a theoretical frame', right: 'To understand something, I want to try it and observe' },
  { id: 29, left: 'In my life rhythm, I lean toward hard work', right: 'In my life rhythm, I lean toward making room for joy and fun' },
  { id: 30, left: 'Emotions make me uncomfortable', right: 'I value emotions' },
  { id: 31, left: 'I enjoy performing in front of people', right: 'I avoid speaking in front of a crowd' },
  { id: 32, left: 'I ask "Who, what, when?"', right: 'I ask "Why?"' },
];

export const MBTI_TYPE_DESCRIPTIONS_EN: Record<string, string> = {
  ISTJ: 'An orderly, dependable and responsibility-focused profile. Values moving forward with concrete facts and keeping the promises that are made.',
  ISFJ: 'A protective, attentive and loyal profile. Notices what people need and works to build a safe space within relationships.',
  INFJ: 'An intuitive, deep and meaning-seeking profile. Tends to read people and events through their unseen connections.',
  INTJ: 'A strategic, independent and long-term thinking profile. Builds the big picture and wants to improve the system.',
  ISTP: 'A calm, practical and solution-focused profile. Can stay cool in a crisis and find a way with the tools at hand.',
  ISFP: 'A sensitive, aesthetic and freedom-loving profile. Stays true to inner values and senses insincerity quickly.',
  INFP: 'An idealistic, sincere and value-driven profile. Wants to make choices that align with its own world of meaning.',
  INTP: 'An analytical, curious and independently thinking profile. Loves probing the logic of ideas and opening up possibilities.',
  ESTP: 'A fast, bold and experience-driven profile. Decides in the moment and learns by doing.',
  ESFP: 'A lively, warm profile nourished by experience. Cares about connecting with people and feeling life fully.',
  ENFP: 'A creative, enthusiastic and possibility-focused profile. Sees people’s potential and loves opening new paths.',
  ENTP: 'A sharp, flexible profile that thinks by debating. Pushes against molds and tests ideas from different angles.',
  ESTJ: 'An organized, clear and results-focused profile. Takes responsibility, builds order and wants things to run.',
  ESFJ: 'A social, supportive and harmony-focused profile. Cares that people feel good and that relationships flow smoothly.',
  ENFJ: 'An inspiring, relational and guiding profile. Can gather people around a shared sense of meaning.',
  ENTJ: 'A determined, strategic and leadership-focused profile. Sets goals, organizes resources and expects progress.',
};

export const MBTI_TYPE_ARCHETYPES_EN: Record<string, MbtiTypeArchetype> = {
  ISTJ: {
    name: 'Logistician',
    reason: 'This image comes from the ISTJ tendency to build order, carry responsibility and run things within a reliable system. It is the person who tracks the details, the timing and the tasks so a structure keeps working without falling apart.',
  },
  ISFJ: {
    name: 'Protector',
    reason: 'The ISFJ quietly notices the needs of the people around them and works to create a safe space. The protector image captures both the practical support they give and the careful way they watch over relationships.',
  },
  INFJ: {
    name: 'Advocate',
    reason: 'The INFJ thinks not only about what is, but about what ought to be. Because they sense people’s potential and fragile sides, they can deeply stand up for a meaning, a person or a value.',
  },
  INTJ: {
    name: 'Architect / Strategist',
    reason: 'The INTJ first builds the big picture, then designs the system that fits it. That is where the architect image comes from: they think about the plan behind the visible structure, the load-bearing idea and the long-term outcome.',
  },
  ISTP: {
    name: 'Virtuoso',
    reason: 'The ISTP tends to understand something not in theory but by picking it up and trying it. The virtuoso image captures their practical mastery, cool-headed intervention and intuitive way with tools.',
  },
  ISFP: {
    name: 'Adventurer',
    reason: 'The ISFP lives by following their inner values and senses. The adventurer image is less about loud, dramatic adventure and more about trying their own path, feeling their way and existing through aesthetic choices.',
  },
  INFP: {
    name: 'Mediator',
    reason: 'The INFP tries to understand people’s inner worlds and values. The mediator image comes from their tendency to see the feeling beneath a conflict and to search for a more genuine meaning.',
  },
  INTP: {
    name: 'Logician',
    reason: 'The INTP probes the inner consistency of ideas, tests assumptions and connects concepts to each other. The logician image comes from understanding the world first as an explainable mental model.',
  },
  ESTP: {
    name: 'Entrepreneur',
    reason: 'The ESTP spots the opportunity in the moment and does not hesitate to act. The entrepreneur image captures their willingness to take risks, think practically and learn in the field.',
  },
  ESFP: {
    name: 'Entertainer',
    reason: 'The ESFP brings liveliness, contact and warmth to any room. The entertainer image is not only about being cheerful; it is about helping people feel more at ease and more real in the moment.',
  },
  ENFP: {
    name: 'Campaigner',
    reason: 'The ENFP can amplify the energy of an idea, a person or a possibility. The campaigner image comes from their tendency to share excitement, encourage people and open new paths.',
  },
  ENTP: {
    name: 'Debater',
    reason: 'The ENTP thinks by colliding ideas; asking questions, objecting and stretching molds is their mental playground. The debater image captures that lively testing energy.',
  },
  ESTJ: {
    name: 'Executive',
    reason: 'The ESTJ moves forward by clarifying the goal, the task and the responsibility. The executive image comes from their skill in bringing scattered resources into order and making sure things actually get done.',
  },
  ESFJ: {
    name: 'Consul',
    reason: 'The ESFJ values social order, courtesy and belonging. The consul image captures their way of holding people together, noticing needs and softening shared life.',
  },
  ENFJ: {
    name: 'Leader',
    reason: 'The ENFJ can gather people around a shared sense of meaning and growth. The leader image comes not only from leadership itself, but from the ability to activate other people’s potential.',
  },
  ENTJ: {
    name: 'Commander',
    reason: 'The ENTJ sets the goal, builds the strategy and calls people forward. The commander image comes from the courage to make decisions and the drive to set large structures in motion.',
  },
};

export const MBTI_TYPE_DETAIL_EN: Record<string, MbtiTypeDetail> = {
  ISTJ: {
    theme: 'You make sense of the world through order, reliability and responsibility.',
    self: 'The ISTJ profile usually looks first at facts, evidence and methods that have worked before. It trusts what is done more than what is said; stability, loyalty and clarity matter to it.',
    strengths: 'Planned progress, keeping your word, missing no details and staying practical in a crisis are your strong sides. People can rely on you because your tendency to finish what you start is high.',
    growth: 'In situations that call for flexibility you may sometimes harden too much, or treat emotional needs as secondary. Accepting that not everything can be controlled is good for you.',
    relationships: 'In a relationship you expect loyalty, effort and continuity. Reliable behavior, more than grand romantic gestures, is your sign of love.',
    rhythm: 'A regular calendar, clear tasks and well-defined responsibilities put you at ease. Vague, constantly shifting environments can drain your energy.',
  },
  ISFJ: {
    theme: 'Compassion, order and protective attention are your main axis.',
    self: 'The ISFJ profile quietly notices the needs of the people around it. Belonging, trust and well-meant effort are deeply valuable in its world.',
    strengths: 'Thoughtfulness, loyalty, patience and practical support are your strong sides. Remembering people’s small needs creates warmth in relationships.',
    growth: 'You may tend to postpone your own needs or stay silent to avoid getting hurt. Setting a boundary is not a lack of love; it is what keeps a relationship healthy.',
    relationships: 'In a relationship you expect a secure bond, consistency and care. Being valued matters as much as being loved.',
    rhythm: 'Familiar routines, gentle transitions and meaningful responsibilities are good for you. Overly harsh, insensitive environments can make you withdraw.',
  },
  INFJ: {
    theme: 'Meaning, intuition and the search for deep connection are in the foreground.',
    self: 'The INFJ profile reads the meaning beneath events more than their visible surface. Its tendency to sense people’s intentions, the emotional climate and the long-term direction is strong.',
    strengths: 'You carry deep empathy, vision, insight and the potential for guidance that transforms people. You can make sense of complex feelings.',
    growth: 'You may sometimes load too much meaning onto things, or quietly carry everyone inside you. Balancing your intuition with real data is a relief.',
    relationships: 'Shallow bonds do not satisfy you; you want sincerity, inner closeness and honesty. Feeling misunderstood can make you drift away in silence.',
    rhythm: 'You need times of solitude to gather yourself. But when there is a meaningful purpose, you can stay focused for a long time.',
  },
  INTJ: {
    theme: 'Strategy, independence and the urge to build the big picture stand out.',
    self: 'The INTJ profile thinks in systems, possibilities and long-term outcomes. It wants to understand why something works, or why it does not.',
    strengths: 'Strategic thinking, independent decisions, simplifying complex structures and locking onto a goal are your strong sides.',
    growth: 'You may sometimes treat the human factor or emotional transitions as unnecessary detail. In relationships, warmth is as effective as clarity.',
    relationships: 'You expect mental harmony, honesty and respect for personal space. Where you do not trust, you do not open up easily.',
    rhythm: 'Long-term goals, a clear domain of authority and room to think nourish you. Micromanagement and pointless repetition wear you out.',
  },
  ISTP: {
    theme: 'Calm observation, practical solutions and free room to move.',
    self: 'The ISTP profile examines things as they are, trying to understand the system without much talk. It learns by trying, by taking apart and reassembling, or by living it directly.',
    strengths: 'Cool-headedness, practical intelligence, quick adaptation and producing solutions with the tools at hand are your strong sides.',
    growth: 'Explaining feelings or sustaining a long-term plan can sometimes be hard. Expressing your inner world without shutting it down completely eases your relationships.',
    relationships: 'Pressure and excessive expectations can push you away. When there is respect, space and natural closeness, your bond grows stronger.',
    rhythm: 'Flexible plans, real problems and room to move are good for you. Overly theoretical or overly emotional settings can lower your energy.',
  },
  ISFP: {
    theme: 'Inner values, aesthetic sensitivity and free expression.',
    self: 'The ISFP profile wants to live by its own inner compass. Rather than being forced into a mold, it follows what feels true.',
    strengths: 'Sincerity, sensitivity, an aesthetic eye and the ability to stay in the moment are your strong sides. You offer people a soft but real kind of contact.',
    growth: 'Avoiding conflict or postponing decisions too long can box you in. Speaking more openly while protecting your inner values is good for you.',
    relationships: 'In a relationship you want naturalness, kindness and closeness without pressure. Being controlled or judged shuts you down quickly.',
    rhythm: 'Creative space, sensory experience and a calm tempo nourish you. Harsh competition and constant performance expectations can be exhausting.',
  },
  INFP: {
    theme: 'The search for ideals, meaning and sincerity is very strong.',
    self: 'The INFP profile reads life through its values and inner world. Whether something feels right matters as much as whether it looks logical.',
    strengths: 'Empathy, imagination, deep loyalty and the ability to see the essence of people are your strong sides.',
    growth: 'When real-world limits are not as clean as your ideal, you may feel disappointed. Small concrete steps carry big meanings.',
    relationships: 'You want safe, non-judgmental and deep bonds. Having your feelings taken lightly can hurt you.',
    rhythm: 'Thinking alone, writing, creating and meaningful projects are good for you. Overly mechanical routines can lower your inner motivation.',
  },
  INTP: {
    theme: 'Curiosity, analysis and the urge to build the inner logic of ideas.',
    self: 'The INTP profile takes an idea apart instead of accepting it right away. Consistency, explanatory power and mental freedom matter to it.',
    strengths: 'Analytical thinking, original connections, untangling complex topics and independent questioning are your strong sides.',
    growth: 'You may linger too long in thought and postpone action, or notice emotional needs late. Done is sometimes more valuable than perfect.',
    relationships: 'You expect mental space, honest debate and closeness without pressure. Under emotional pressure you may pull back.',
    rhythm: 'Free exploration, problem solving and working at your own pace nourish you. Excessive procedure and social obligations can be tiring.',
  },
  ESTP: {
    theme: 'Action, experience and seizing the opportunity of the moment.',
    self: 'The ESTP profile learns life through direct contact. It prefers trying over waiting, and seeing it in the field over theory.',
    strengths: 'Courage, quick decisions, practical intelligence and social agility are your strong sides. In a crisis you can move instead of freezing.',
    growth: 'Short-term excitement can overshadow the long-term outcome. Stepping back to weigh the effects gives you an advantage.',
    relationships: 'You want liveliness, honesty and shared experiences. Too much control or drama can suffocate you.',
    rhythm: 'Dynamic settings, real goals and room to move nourish you. Long abstract meetings and waiting periods lower your energy.',
  },
  ESFP: {
    theme: 'Liveliness, contact and living life by feeling it.',
    self: 'The ESFP profile brings warmth and motion to any room it enters. It perceives people, experiences and the feeling of the moment strongly.',
    strengths: 'Social warmth, naturalness, practical cheer and putting people at ease are your strong sides.',
    growth: 'Postponing hard topics or reaching only for what feels good can sometimes carry a cost. Small planned responsibilities protect your freedom.',
    relationships: 'In a relationship you want fun, contact, attention and mutual liveliness. Coldness or indifference affects you quickly.',
    rhythm: 'People-filled, lively settings with tangible results are good for you. Monotonous, isolated work can be exhausting.',
  },
  ENFP: {
    theme: 'Possibility, inspiration and curiosity about human potential.',
    self: 'The ENFP profile reads life through connections, possibilities and meanings. New ideas and sincere bonds raise its energy.',
    strengths: 'Creativity, encouraging people, flexible thinking and strong intuitive connections are your strong sides.',
    growth: 'You may scatter among too many options or struggle to finish what you started. Simple structures that protect your freedom are good for you.',
    relationships: 'In a relationship you want sincerity, play, deep conversation and growth. Monotony or emotional closedness can push you away.',
    rhythm: 'New projects, meaningful human contact and room for discovery nourish you. Rigid routines can lower your motivation.',
  },
  ENTP: {
    theme: 'The energy of ideas, debate and stretching the molds.',
    self: 'The ENTP profile tests possibilities, sees the gaps in systems and loves mental playgrounds. Asking questions can even be its way of getting closer.',
    strengths: 'Quick wit, flexibility, creative problem solving and breaking set patterns are your strong sides.',
    growth: 'Opening everything up for debate can sometimes tire the other side. Emotional timing matters as much as the power of the idea.',
    relationships: 'You expect mental liveliness, humor and freedom. Overly rule-bound or touchy bonds can box you in.',
    rhythm: 'Novelty, strategy, debate and shifting problems nourish you. Repetitive operational work can get boring fast.',
  },
  ESTJ: {
    theme: 'Building order, getting results and carrying responsibility.',
    self: 'The ESTJ profile wants things to be clear, measurable and workable. It reduces uncertainty and organizes the tasks.',
    strengths: 'Leadership, planning, decision-making and keeping the system running are your strong sides. People can get direction and clarity from you.',
    growth: 'In the name of speed and efficiency you may sometimes miss emotional nuances. Listening does not weaken your authority; it builds trust.',
    relationships: 'In a relationship you expect loyalty, openness and responsibility. Messiness or indecision can strain you.',
    rhythm: 'Goal-defined work, clear roles and results-focused teams are good for you. Vague, unplanned settings wear out your patience.',
  },
  ESFJ: {
    theme: 'Harmony, support and building relational order.',
    self: 'The ESFJ profile notices whether the people around it are doing well. Belonging, courtesy and mutual effort matter to it.',
    strengths: 'Social organization, giving support, practical care and holding people together are your strong sides.',
    growth: 'Trying to please everyone can wear you out. Stating your own need openly creates balance in a relationship.',
    relationships: 'You expect attention, continuity and open appreciation. Coldness or vague distance can unsettle you.',
    rhythm: 'People-centered tasks, shared rituals and regular communication nourish you. Where your worth goes unseen, you can wear down quickly.',
  },
  ENFJ: {
    theme: 'Understanding people, giving direction and building shared meaning.',
    self: 'The ENFJ profile strongly senses the potential in relationships and the emotional direction of a group. It wants to contribute to people’s growth.',
    strengths: 'Inspiring others, empathy, leadership and gathering people around a shared goal are your strong sides.',
    growth: 'You may take on other people’s feelings too much, or push your own needs into the background. Watching the line between helping and controlling is good for you.',
    relationships: 'You expect depth, openness and mutual growth. Emotional disconnection or uncertainty can strain you.',
    rhythm: 'Meaningful teams, room to grow and projects with human impact nourish you. In settings where your values clash, you can tire very quickly.',
  },
  ENTJ: {
    theme: 'Strategy, leadership and a strong drive to move forward.',
    self: 'The ENTJ profile sees the goal, builds the road and wants to set resources in motion. Wasting potential is hard for it to bear.',
    strengths: 'Determination, vision, organization and the ability to make hard decisions are your strong sides.',
    growth: 'Your speed and directness may sometimes feel harsh to others. Making room for people’s emotional adjustment improves the results.',
    relationships: 'You expect mental strength, honesty and growth. Passivity or vague expectations can make you impatient.',
    rhythm: 'Big goals, authority, strategic room and strong teams nourish you. Ineffective bureaucracy lowers your energy.',
  },
};

// Sonuç kaydı sırasında üretilen kalıcı metin kalıpları (EN).
export const MBTI_STRINGS_EN: MbtiStrings = {
  mbtiTestName: 'MBTI Personality Test',
  buildMbtiSummary: (type, description) => `MBTI Personality Test result: ${type}. ${description}`,
  buildGenericSummary: ({ testTitle, resultTitle, description, dimensionSummary }) =>
    `${testTitle} result: ${resultTitle}. ${description} Dimensions: ${dimensionSummary}.`,
};

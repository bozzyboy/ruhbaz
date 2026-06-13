// ============================================================
// Ruhbaz Konağı - Yasal Metinler (TEK KAYNAK)
// ============================================================
// ⚠️ TASLAK — Ozan onayı bekliyor (D2: ton sıcak-ama-net).
// Bu dosyadaki metinler avukat görüşü öncesi çalışma taslağıdır;
// onay sonrası yalnız bu dosya güncellenir, ekranlar buradan okur.
// Çerçeve cümlesi 04_HUKUK_VE_GUVENLIK.md bölüm 2 ile birebir aynıdır.
// ============================================================

import { getAppLanguage } from '../i18n';

/** Sözleşme/onay metni sürümü — metin değişirse artır; kullanıcıdan yeniden onay istenir. */
export const LEGAL_CONSENT_VERSION = 1;

/** Çerçeve cümlesi (04/2) — her yerde aynı, kelimesi kelimesine. */
export const LEGAL_FRAME_SENTENCE =
  "Ruhbaz Konağı'ndaki tüm içerikler yapay zekâ tarafından üretilen, eğlence ve kişisel keşif amaçlı sembolik yorumlardır. " +
  'Gelecek hakkında bilgi, öngörü veya vaat içermez; tıbbi, hukuki veya finansal danışmanlık yerine geçmez.';

/** Okuma ekranlarında görünen kalıcı kısa ibare. */
export const READING_DISCLAIMER_SHORT = 'Yapay zeka tarafından üretilen eğlence amaçlı sembolik bir yorumdur.';

/** Onboarding onay ekranı başlığı. */
export const ONBOARDING_TITLE = 'Konağa Hoş Geldin';

/** Onboarding onay ekranı gövdesi (TASLAK). */
export const ONBOARDING_BODY = [
  'Ruhbaz Konağı; sembollerle, hikâyelerle ve içe bakışla vakit geçirebileceğin bir keşif alanı. ' +
    'İçeri girmeden önce, bu konağın ne olduğunu ve ne olmadığını açıkça söylemek isteriz:',
  LEGAL_FRAME_SENTENCE,
  'Konaktaki karakterler kurgusal yorumculardır; söyledikleri ilham vermek ve düşündürmek içindir, ' +
    'hayatına dair kararların her zaman senindir. Sağlık, hukuk veya para gibi önemli konularda ' +
    'mutlaka ilgili uzmana danışmalısın.',
  'Devam ederek bu çerçeveyi anladığını ve kabul ettiğini onaylamış olursun.',
] as const;

/** Onboarding onay butonu etiketi. */
export const ONBOARDING_ACCEPT_LABEL = 'Anladım, kabul ediyorum';

/** Yasal Bilgilendirme ekranı bölümleri (TASLAK). */
export const LEGAL_INFO_SECTIONS: ReadonlyArray<{ title: string; body: string }> = [
  {
    title: 'Bu uygulama nedir?',
    body:
      'Ruhbaz Konağı, eğlence ve kişisel keşif amaçlı sembolik yorumlar sunan bir uygulamadır. ' +
      'Konaktaki tüm okumalar ve sohbetler yapay zekâ tarafından üretilir; konaktaki karakterler kurgusal yorumculardır.',
  },
  {
    title: 'İçerikler ne anlama gelir?',
    body:
      LEGAL_FRAME_SENTENCE +
      ' Yorumlar, sembollerin çağrışımları üzerinden ilham vermeyi ve düşündürmeyi amaçlar; ' +
      'gerçek hayattaki olaylar hakkında bilgi ya da öngörü niteliği taşımaz.',
  },
  {
    title: 'Neyin yerine geçmez?',
    body:
      'Buradaki hiçbir içerik tıbbi teşhis veya tedavi, hukuki görüş, finansal ya da yatırım tavsiyesi, ' +
      'psikolojik danışmanlık veya terapi yerine geçmez. Bu alanlardaki ihtiyaçların için lütfen ilgili uzmana başvur. ' +
      'Acil bir durumda 112 Acil Çağrı Merkezi’ni arayabilirsin.',
  },
  {
    title: 'Verilerin nerede saklanır?',
    body:
      'Profillerin, okumaların ve uygulama hafızası cihazında saklanır. Yorum üretilirken yazdığın metin ve ' +
      'yüklediğin görseller, yanıtın oluşturulması için yapay zekâ servis sağlayıcısına iletilir. ' +
      'Ayrıntılı aydınlatma metni, uygulama mağazaya hazırlanırken bu ekranda yayımlanacaktır.',
  },
  {
    title: 'Yaş sınırı',
    body: 'Ruhbaz Konağı 18 yaş ve üzeri kullanıcılar içindir.',
  },
  {
    title: 'İletişim',
    body: 'Soruların ve geri bildirimlerin için iletişim kanalları, uygulamanın mağaza sayfasında yer alacaktır.',
  },
];

// ============================================================
// EN sürümler (Faz 4 — ⚠️ TASLAK; avukat görüşmesi sonrası finalize edilir.
// Çeviri değil lokalleştirme; çerçeve anlamı TR ile birebir aynı kalmalıdır.)
// ============================================================

export const LEGAL_FRAME_SENTENCE_EN =
  'All content in Ruhbaz Manor is AI-generated symbolic interpretation, created for entertainment and personal discovery. ' +
  'It does not contain information, foresight or promises about the future, and it is not a substitute for medical, legal or financial advice.';

export const READING_DISCLAIMER_SHORT_EN = 'An AI-generated symbolic interpretation, for entertainment.';

export const ONBOARDING_TITLE_EN = 'Welcome to the Manor';

export const ONBOARDING_BODY_EN = [
  'Ruhbaz Manor is a place of discovery — symbols, stories and quiet reflection. ' +
    'Before you step in, we want to be clear about what this manor is, and what it is not:',
  LEGAL_FRAME_SENTENCE_EN,
  'The characters of the manor are fictional readers; what they say is meant to inspire and make you think — ' +
    'every decision about your life remains yours. For important matters such as health, legal or financial questions, ' +
    'please consult the relevant professional.',
  'By continuing, you confirm that you understand and accept this framework.',
] as const;

export const ONBOARDING_ACCEPT_LABEL_EN = 'I understand and accept';

export const LEGAL_INFO_SECTIONS_EN: ReadonlyArray<{ title: string; body: string }> = [
  {
    title: 'What is this app?',
    body:
      'Ruhbaz Manor is an app that offers symbolic interpretations for entertainment and personal discovery. ' +
      'All readings and conversations are AI-generated; the characters of the manor are fictional readers.',
  },
  {
    title: 'What does the content mean?',
    body:
      LEGAL_FRAME_SENTENCE_EN +
      ' Interpretations aim to inspire and invite reflection through the language of symbols; ' +
      'they are not information or foresight about real-life events.',
  },
  {
    title: 'What does it not replace?',
    body:
      'Nothing here replaces medical diagnosis or treatment, legal opinion, financial or investment advice, ' +
      'psychological counselling or therapy. For needs in these areas, please consult the relevant professional. ' +
      'In an emergency, contact your local emergency services.',
  },
  {
    title: 'Where is your data stored?',
    body:
      'Your profiles, readings and the app\'s memory are stored on your device. When an interpretation is generated, ' +
      'the text you write and the images you upload are sent to the AI service provider to produce the response. ' +
      'A detailed privacy notice will be published on this screen as the app prepares for store release.',
  },
  {
    title: 'Age requirement',
    body: 'Ruhbaz Manor is intended for users aged 18 and over.',
  },
  {
    title: 'Contact',
    body: 'Contact channels for questions and feedback will be available on the app\'s store page.',
  },
];

// --- Dil seçicileri: ekranlar buradan okur; dil değişiminde otomatik güncellenir ---

export function getLegalFrameSentence(): string {
  return getAppLanguage() === 'en' ? LEGAL_FRAME_SENTENCE_EN : LEGAL_FRAME_SENTENCE;
}

export function getReadingDisclaimerShort(): string {
  return getAppLanguage() === 'en' ? READING_DISCLAIMER_SHORT_EN : READING_DISCLAIMER_SHORT;
}

export function getOnboardingTexts(): {
  title: string;
  body: readonly string[];
  acceptLabel: string;
} {
  return getAppLanguage() === 'en'
    ? { title: ONBOARDING_TITLE_EN, body: ONBOARDING_BODY_EN, acceptLabel: ONBOARDING_ACCEPT_LABEL_EN }
    : { title: ONBOARDING_TITLE, body: ONBOARDING_BODY, acceptLabel: ONBOARDING_ACCEPT_LABEL };
}

export function getLegalInfoSections(): ReadonlyArray<{ title: string; body: string }> {
  return getAppLanguage() === 'en' ? LEGAL_INFO_SECTIONS_EN : LEGAL_INFO_SECTIONS;
}

// ============================================================
// Ruhbaz Konağı - Yasal Metinler (TEK KAYNAK)
// ============================================================
// ⚠️ TASLAK — Ozan onayı bekliyor (D2: ton sıcak-ama-net).
// Bu dosyadaki metinler avukat görüşü öncesi çalışma taslağıdır;
// onay sonrası yalnız bu dosya güncellenir, ekranlar buradan okur.
// Çerçeve cümlesi 04_HUKUK_VE_GUVENLIK.md bölüm 2 ile birebir aynıdır.
// ============================================================

/** Sözleşme/onay metni sürümü — metin değişirse artır; kullanıcıdan yeniden onay istenir. */
export const LEGAL_CONSENT_VERSION = 1;

/** Çerçeve cümlesi (04/2) — her yerde aynı, kelimesi kelimesine. */
export const LEGAL_FRAME_SENTENCE =
  "Ruhbaz Konağı'ndaki tüm içerikler yapay zekâ tarafından üretilen, eğlence ve kişisel keşif amaçlı sembolik yorumlardır. " +
  'Gelecek hakkında bilgi, öngörü veya vaat içermez; tıbbi, hukuki veya finansal danışmanlık yerine geçmez.';

/** Okuma ekranlarında görünen kalıcı kısa ibare. */
export const READING_DISCLAIMER_SHORT = 'Eğlence amaçlı sembolik yorumdur.';

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

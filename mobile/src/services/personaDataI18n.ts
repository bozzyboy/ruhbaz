// ============================================================
// Ruhbaz Konağı - Persona verisi dil seçici (Faz 4)
// ============================================================
// Tüm prompt üreten servisler persona gövdesini/kapanışlarını BURADAN okur;
// dil tercihi EN ise identity.en.md kaynaklı üretilmiş veri döner
// (EN dosyası olmayan persona generator'da TR'ye düşer — build asla kırılmaz).
// Tipler TR üretiminden türetilir; iki üretim aynı şemadadır.

import { COMMON_READING_IDENTITY_BODY, READING_PERSONA_DATA } from './readingPersonaData';
import { COMMON_READING_IDENTITY_BODY_EN, READING_PERSONA_DATA_EN } from './readingPersonaData.en';
import { getAppLanguage } from '../i18n';

export type ReadingPersonaDataMap = typeof READING_PERSONA_DATA;

/** Aktif uygulama diline göre persona veri haritası. */
export function getReadingPersonaData(): ReadingPersonaDataMap {
  return getAppLanguage() === 'en' ? READING_PERSONA_DATA_EN : READING_PERSONA_DATA;
}

/** Aktif dile göre ortak kimlik gövdesi (Vision/Safety/Address/Length). */
export function getCommonReadingIdentityBody(): string {
  return getAppLanguage() === 'en' ? COMMON_READING_IDENTITY_BODY_EN : COMMON_READING_IDENTITY_BODY;
}

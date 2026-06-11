// ============================================================
// Ruhbaz Konağı - Genel okuma içeriği dil seçici (Faz 4)
// ============================================================
// İkram Masası'nın deterministik içerik setleri (tarot/melek/rün/I-Ching/
// numeroloji/ilham) aktif uygulama diline göre buradan okunur.
// Kanonik anahtarlar (TarotCard.name, rune adı, hexagram no/binary) iki dilde
// AYNIDIR; yalnız kullanıcıya görünen metin değişir.

import {
  ANGEL_CARDS,
  ANGEL_NUMBERS,
  ICHING_HEXAGRAMS,
  INSPIRATION_PARTS,
  NUMEROLOGY_MEANINGS,
  RUNES,
  TAROT_CARDS,
} from './divinationData';
import {
  ANGEL_CARDS_EN,
  ANGEL_NUMBERS_EN,
  ICHING_HEXAGRAMS_EN,
  INSPIRATION_PARTS_EN,
  NUMEROLOGY_MEANINGS_EN,
  RUNES_EN,
  TAROT_CARDS_EN,
} from './divinationData.en';
import { getAppLanguage } from '../i18n';

export function getTarotCards() {
  return getAppLanguage() === 'en' ? TAROT_CARDS_EN : TAROT_CARDS;
}

export function getAngelCards() {
  return getAppLanguage() === 'en' ? ANGEL_CARDS_EN : ANGEL_CARDS;
}

export function getAngelNumbers() {
  return getAppLanguage() === 'en' ? ANGEL_NUMBERS_EN : ANGEL_NUMBERS;
}

export function getRunes() {
  return getAppLanguage() === 'en' ? RUNES_EN : RUNES;
}

export function getIChingHexagrams() {
  return getAppLanguage() === 'en' ? ICHING_HEXAGRAMS_EN : ICHING_HEXAGRAMS;
}

export function getInspirationParts() {
  return getAppLanguage() === 'en' ? INSPIRATION_PARTS_EN : INSPIRATION_PARTS;
}

export function getNumerologyMeanings() {
  return getAppLanguage() === 'en' ? NUMEROLOGY_MEANINGS_EN : NUMEROLOGY_MEANINGS;
}

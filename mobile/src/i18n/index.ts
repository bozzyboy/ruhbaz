// ============================================================
// Ruhbaz Konağı - i18n kurulumu (Faz 4)
// ============================================================
// Dil seçimi zinciri: kayıtlı tercih > cihaz dili (Hermes Intl varsa) > 'tr'.
// BİLİNÇLİ TASARIM: expo-localization (native modül) KULLANILMADI ki bu faz
// yeni APK gerektirmesin; release öncesi istenirse daha sağlam cihaz-dili
// algılama için eklenebilir (yalnız detectDeviceLanguage değişir).
// Tercih falci-data/app-language.json'da saklanır (D3: dizin adı migration'a kadar sabit).

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as FileSystem from 'expo-file-system/legacy';
import { tr } from './locales/tr';
import { en } from './locales/en';

export type AppLanguage = 'tr' | 'en';

const DATA_DIR = `${FileSystem.documentDirectory}falci-data/`;
const LANGUAGE_FILE = `${DATA_DIR}app-language.json`;

function detectDeviceLanguage(): AppLanguage {
  try {
    const locale =
      typeof Intl !== 'undefined' && typeof Intl.DateTimeFormat === 'function'
        ? Intl.DateTimeFormat().resolvedOptions().locale || ''
        : '';
    return locale.toLowerCase().startsWith('en') ? 'en' : 'tr';
  } catch {
    return 'tr';
  }
}

export async function readStoredLanguage(): Promise<AppLanguage | null> {
  try {
    const info = await FileSystem.getInfoAsync(LANGUAGE_FILE);
    if (!info.exists) return null;
    const raw = JSON.parse(await FileSystem.readAsStringAsync(LANGUAGE_FILE)) as { language?: string };
    return raw.language === 'en' || raw.language === 'tr' ? raw.language : null;
  } catch {
    return null;
  }
}

async function storeLanguage(language: AppLanguage): Promise<void> {
  try {
    const info = await FileSystem.getInfoAsync(DATA_DIR);
    if (!info.exists) {
      await FileSystem.makeDirectoryAsync(DATA_DIR, { intermediates: true });
    }
    await FileSystem.writeAsStringAsync(LANGUAGE_FILE, JSON.stringify({ language }));
  } catch {
    // dil tercihi yazılamazsa uygulama akışı bozulmaz; bir sonraki açılışta yeniden seçilir
  }
}

/** App açılışında bir kez çağrılır (App.tsx). Senkron init + asenkron tercih düzeltmesi. */
export function initI18n(): void {
  if (i18n.isInitialized) return;
  void i18n.use(initReactI18next).init({
    resources: {
      tr: { translation: tr },
      en: { translation: en },
    },
    lng: detectDeviceLanguage(),
    fallbackLng: 'tr',
    interpolation: { escapeValue: false },
    returnNull: false,
  });
  void readStoredLanguage().then((stored) => {
    if (stored && stored !== i18n.language) {
      void i18n.changeLanguage(stored);
    }
  });
}

/** Ayarlar'daki dil anahtarı bunu çağırır; tercih kalıcıdır. */
export async function setAppLanguage(language: AppLanguage): Promise<void> {
  await i18n.changeLanguage(language);
  await storeLanguage(language);
}

export function getAppLanguage(): AppLanguage {
  return i18n.language === 'en' ? 'en' : 'tr';
}

export default i18n;

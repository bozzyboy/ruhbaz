// ============================================================
// Ruhbaz Konağı - Yasal Onay Servisi
// ============================================================
// Onboarding'deki çerçeve onayını cihazda saklar (falci-data/legal-consent.json).
// LEGAL_CONSENT_VERSION artarsa kullanıcıdan yeniden onay istenir.
// NOT: Dizin adı D3 kararıyla release öncesi migration'a kadar değişmiyor.

import * as FileSystem from 'expo-file-system/legacy';
import { LEGAL_CONSENT_VERSION } from '../config/legalTexts';

const DATA_DIR = `${FileSystem.documentDirectory}falci-data/`;
const CONSENT_FILE = `${DATA_DIR}legal-consent.json`;

type LegalConsentRecord = {
  version: number;
  acceptedAt: string;
};

async function ensureDir(path: string) {
  const info = await FileSystem.getInfoAsync(path);
  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(path, { intermediates: true });
  }
}

/** Geçerli sürüm için onay verilmiş mi? Hata durumunda güvenli taraf: false (onay ekranı gösterilir). */
export async function hasAcceptedLegalConsent(): Promise<boolean> {
  try {
    const info = await FileSystem.getInfoAsync(CONSENT_FILE);
    if (!info.exists) {
      return false;
    }
    const raw = await FileSystem.readAsStringAsync(CONSENT_FILE);
    const record = JSON.parse(raw) as Partial<LegalConsentRecord>;
    return typeof record.version === 'number' && record.version >= LEGAL_CONSENT_VERSION;
  } catch {
    return false;
  }
}

export async function recordLegalConsentAcceptance(): Promise<void> {
  const record: LegalConsentRecord = {
    version: LEGAL_CONSENT_VERSION,
    acceptedAt: new Date().toISOString(),
  };
  await ensureDir(DATA_DIR);
  await FileSystem.writeAsStringAsync(CONSENT_FILE, JSON.stringify(record, null, 2));
}

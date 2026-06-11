// ============================================================
// Ruhbaz Konağı - Veri Taşınabilirliği (K40, Faz 2 İSKELETİ)
// ============================================================
// Yedek alma + geri yükleme: kullanıcının SEÇTİĞİ klasöre (Android Storage
// Access Framework) tek JSON dosyası yazılır/okunur. Yeni native modül yok —
// expo-file-system'in SAF desteğiyle çalışır (yeni APK gerektirmez).
//
// Kapsam: falci-data/ altındaki tüm dosyalar (profiller, okumalar, hafıza,
// ledger, yasal onay) + SQLite veritabanı (falci-memory-v2.db ve varsa -wal/-shm).
// İkili dosyalar base64, metin dosyaları düz utf8 taşınır.
//
// ⚠️ Geri yükleme AÇIK veritabanı dosyasının üzerine yazar; tutarlılık için
// geri yükleme sonrası UYGULAMA YENİDEN BAŞLATILMALI (çağıran ekran kullanıcıya
// bunu açıkça söyler). KVKK "tüm verimi sil" tek-tuşu da burada (wipeAllLocalData).

import * as FileSystem from 'expo-file-system/legacy';
import { trackEvent } from './analyticsService';

const DOC_DIR = FileSystem.documentDirectory || '';
const DATA_DIR = `${DOC_DIR}falci-data/`;
const SQLITE_DIR = `${DOC_DIR}SQLite/`;
const DB_FILES = ['falci-memory-v2.db', 'falci-memory-v2.db-wal', 'falci-memory-v2.db-shm'];

const BACKUP_MARKER = 'ruhbaz-konagi-backup';
const BACKUP_SCHEMA_VERSION = 1;

export type BackupFileEntry = {
  /** documentDirectory'ye göre göreli yol (ör. "falci-data/account-state.json"). */
  relPath: string;
  encoding: 'utf8' | 'base64';
  content: string;
};

export type BackupBundle = {
  marker: typeof BACKUP_MARKER;
  schemaVersion: number;
  createdAt: string;
  files: BackupFileEntry[];
};

function isTextFile(name: string) {
  return /\.(json|md|txt)$/i.test(name);
}

async function collectDirFiles(dirUri: string, relBase: string, out: BackupFileEntry[]) {
  const info = await FileSystem.getInfoAsync(dirUri);
  if (!info.exists || !info.isDirectory) return;
  const names = await FileSystem.readDirectoryAsync(dirUri);
  for (const name of names) {
    const childUri = `${dirUri}${name}`;
    const childInfo = await FileSystem.getInfoAsync(childUri);
    if (childInfo.isDirectory) {
      await collectDirFiles(`${childUri}/`, `${relBase}${name}/`, out);
    } else if (isTextFile(name)) {
      out.push({ relPath: `${relBase}${name}`, encoding: 'utf8', content: await FileSystem.readAsStringAsync(childUri) });
    } else {
      out.push({
        relPath: `${relBase}${name}`,
        encoding: 'base64',
        content: await FileSystem.readAsStringAsync(childUri, { encoding: FileSystem.EncodingType.Base64 }),
      });
    }
  }
}

/** Cihazdaki tüm uygulama verisini tek yedek paketinde toplar. */
export async function collectBackupBundle(): Promise<BackupBundle> {
  const files: BackupFileEntry[] = [];
  await collectDirFiles(DATA_DIR, 'falci-data/', files);
  for (const dbName of DB_FILES) {
    const uri = `${SQLITE_DIR}${dbName}`;
    const info = await FileSystem.getInfoAsync(uri);
    if (info.exists && !info.isDirectory) {
      files.push({
        relPath: `SQLite/${dbName}`,
        encoding: 'base64',
        content: await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 }),
      });
    }
  }
  return { marker: BACKUP_MARKER, schemaVersion: BACKUP_SCHEMA_VERSION, createdAt: new Date().toISOString(), files };
}

function backupFileName(createdAt: string) {
  return `ruhbaz-yedek-${createdAt.slice(0, 19).replace(/[:T]/g, '-')}.json`;
}

export type ExportResult = { ok: true; fileName: string; fileCount: number } | { ok: false; reason: 'cancelled' | 'error'; message?: string };

/**
 * Kullanıcıdan klasör izni ister (SAF) ve yedeği oraya yazar.
 * Kullanıcı klasör seçmezse { ok:false, reason:'cancelled' } döner.
 */
export async function exportBackupToUserFolder(): Promise<ExportResult> {
  try {
    const permission = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
    if (!permission.granted) {
      return { ok: false, reason: 'cancelled' };
    }
    const bundle = await collectBackupBundle();
    const fileName = backupFileName(bundle.createdAt);
    const fileUri = await FileSystem.StorageAccessFramework.createFileAsync(
      permission.directoryUri,
      fileName,
      'application/json',
    );
    await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(bundle));
    trackEvent({ name: 'backup_exported' });
    return { ok: true, fileName, fileCount: bundle.files.length };
  } catch (err: any) {
    return { ok: false, reason: 'error', message: String(err?.message || err) };
  }
}

export type BackupListing = { uri: string; name: string };

/** Kullanıcının seçtiği klasördeki yedek dosyalarını (ruhbaz-yedek-*.json) listeler. */
export async function listBackupsInUserFolder(): Promise<
  { ok: true; backups: BackupListing[] } | { ok: false; reason: 'cancelled' | 'error'; message?: string }
> {
  try {
    const permission = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
    if (!permission.granted) {
      return { ok: false, reason: 'cancelled' };
    }
    const uris = await FileSystem.StorageAccessFramework.readDirectoryAsync(permission.directoryUri);
    const backups = uris
      .map((uri) => ({ uri, name: decodeURIComponent(uri.split('%2F').pop() || uri.split('/').pop() || uri) }))
      .filter((item) => /ruhbaz-yedek-.*\.json$/i.test(item.name))
      .sort((a, b) => b.name.localeCompare(a.name));
    return { ok: true, backups };
  } catch (err: any) {
    return { ok: false, reason: 'error', message: String(err?.message || err) };
  }
}

export type ImportResult = { ok: true; fileCount: number } | { ok: false; reason: 'invalid' | 'error'; message?: string };

async function ensureParentDirs(relPath: string) {
  const parts = relPath.split('/').slice(0, -1);
  let current = DOC_DIR;
  for (const part of parts) {
    current = `${current}${part}/`;
    const info = await FileSystem.getInfoAsync(current);
    if (!info.exists) {
      await FileSystem.makeDirectoryAsync(current, { intermediates: true });
    }
  }
}

/**
 * Seçilen yedek dosyasını MEVCUT VERİNİN ÜZERİNE yazar.
 * Çağıran ekran ÖNCE açık uyarı/onay göstermek ve İŞLEM SONRASI kullanıcıdan
 * uygulamayı yeniden başlatmasını istemekle yükümlüdür (açık DB tutarlılığı).
 */
export async function importBackupFromUri(backupFileUri: string): Promise<ImportResult> {
  try {
    const raw = await FileSystem.readAsStringAsync(backupFileUri);
    const bundle = JSON.parse(raw) as Partial<BackupBundle>;
    if (bundle.marker !== BACKUP_MARKER || !Array.isArray(bundle.files)) {
      return { ok: false, reason: 'invalid', message: 'Bu dosya bir Ruhbaz Konağı yedeği değil.' };
    }
    // GERÇEK "üzerine yazma": önce mevcut veri tamamen temizlenir. Aksi halde
    // (a) yedekte olmayan yerel dosyalar karışır, (b) yedekte -wal yokken cihazda
    // kalan eski -wal restart sonrası geri yüklenen DB'nin üstüne oynar (bozulma).
    const wipeResult = await wipeAllLocalData();
    if (!wipeResult.ok) {
      return { ok: false, reason: 'error', message: `Mevcut veri temizlenemedi: ${wipeResult.message || ''}` };
    }
    for (const file of bundle.files) {
      if (!file?.relPath || file.relPath.includes('..')) continue;
      await ensureParentDirs(file.relPath);
      const target = `${DOC_DIR}${file.relPath}`;
      if (file.encoding === 'base64') {
        await FileSystem.writeAsStringAsync(target, file.content, { encoding: FileSystem.EncodingType.Base64 });
      } else {
        await FileSystem.writeAsStringAsync(target, file.content);
      }
    }
    trackEvent({ name: 'backup_restored' });
    return { ok: true, fileCount: bundle.files.length };
  } catch (err: any) {
    return { ok: false, reason: 'error', message: String(err?.message || err) };
  }
}

/**
 * KVKK tek tuş: cihazdaki TÜM uygulama verisini siler (falci-data/ + SQLite).
 * Çağıran ekran çift onay göstermek zorundadır. Geri dönüşü YOKTUR.
 */
export async function wipeAllLocalData(): Promise<{ ok: boolean; message?: string }> {
  try {
    const dataInfo = await FileSystem.getInfoAsync(DATA_DIR);
    if (dataInfo.exists) {
      await FileSystem.deleteAsync(DATA_DIR, { idempotent: true });
    }
    for (const dbName of DB_FILES) {
      const uri = `${SQLITE_DIR}${dbName}`;
      const info = await FileSystem.getInfoAsync(uri);
      if (info.exists) {
        await FileSystem.deleteAsync(uri, { idempotent: true });
      }
    }
    return { ok: true };
  } catch (err: any) {
    return { ok: false, message: String(err?.message || err) };
  }
}

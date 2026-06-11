/* eslint-disable no-console */
// PostToolUse hook (Edit|Write):
//  - mobile/ altındaki dosyalarda: UTF-8/Türkçe kontrolü (yalnız değişen dosya) +
//    .ts/.tsx için artımlı tsc --noEmit.
//  - agent/ altındaki .py dosyalarında: python UTF-8/Türkçe kontrolü.
// Çıkış kodu 2 = engelleyici hata (Claude'a geri beslenir). Diğer durumlar sessiz geçer.
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

let input = '';
try {
  input = fs.readFileSync(0, 'utf8');
} catch (e) {
  process.exit(0);
}

let filePath = '';
try {
  // Windows/PowerShell kaynaklı BOM'u temizle — yoksa JSON.parse sessizce patlar
  // ve hook hiçbir kontrol koşmadan 0 ile çıkar.
  const payload = JSON.parse(input.replace(/^﻿/, '').trim());
  filePath = (payload.tool_input && payload.tool_input.file_path) || '';
} catch (e) {
  process.exit(0);
}
if (!filePath) process.exit(0);

const projectDir = process.env.CLAUDE_PROJECT_DIR || path.resolve(__dirname, '..', '..');
const mobileDir = path.join(projectDir, 'mobile');
const agentDir = path.join(projectDir, 'agent');
const norm = path.resolve(filePath);
const lower = norm.toLowerCase();
const inMobile = lower.startsWith(mobileDir.toLowerCase() + path.sep);
const inAgent = lower.startsWith(agentDir.toLowerCase() + path.sep);
if (!inMobile && !inAgent) process.exit(0);

const ext = path.extname(norm).toLowerCase();
const failures = [];

function captureError(e) {
  // check script'leri bulguları stderr'e yazar; tsc stdout'a yazar — ikisini de al.
  const err = e.stderr ? String(e.stderr) : '';
  const out = e.stdout ? String(e.stdout) : '';
  return [err, out].filter((part) => part.trim()).join('\n') || String(e.message);
}

if (inMobile) {
  // UTF-8 / Türkçe karakter kontrolü — yalnız değişen dosya (hızlı yol)
  if (['.ts', '.tsx', '.js', '.json', '.md'].includes(ext)) {
    try {
      execSync(`node scripts/check-turkish-utf8.js "${norm}"`, { cwd: mobileDir, stdio: 'pipe' });
    } catch (e) {
      failures.push('UTF-8/Türkçe karakter kontrolü BAŞARISIZ:\n' + captureError(e));
    }
  }

  // Görsel uygunluk sözleşmesi (kahve/el/pati = yalnız LLM kararı) — statik, <100ms
  if (['.ts', '.tsx'].includes(ext)) {
    try {
      execSync('node scripts/check-image-contract.js', { cwd: mobileDir, stdio: 'pipe' });
    } catch (e) {
      failures.push('GÖRSEL UYGUNLUK SÖZLEŞMESİ BAŞARISIZ:\n' + captureError(e));
    }
  }

  // Artımlı tsc --noEmit (node_modules kuruluysa)
  if (['.ts', '.tsx'].includes(ext)) {
    const tscJs = path.join(mobileDir, 'node_modules', 'typescript', 'lib', 'tsc.js');
    if (fs.existsSync(tscJs)) {
      const buildInfo = path.join(mobileDir, 'node_modules', '.cache', 'ruhbaz-tsbuildinfo');
      try {
        execSync(`node "${tscJs}" --noEmit --incremental --tsBuildInfoFile "${buildInfo}"`, {
          cwd: mobileDir,
          stdio: 'pipe',
        });
      } catch (e) {
        failures.push('tsc --noEmit BAŞARISIZ:\n' + captureError(e));
      }
    }
  }
}

if (inAgent && ext === '.py') {
  try {
    execSync('python scripts/check_turkish_utf8.py', { cwd: agentDir, stdio: 'pipe' });
  } catch (e) {
    // python yoksa sessiz geç; varsa ve kontrol patladıysa engelle.
    if (!/not recognized|not found|ENOENT/i.test(String(e.message))) {
      failures.push('Backend UTF-8/Türkçe kontrolü BAŞARISIZ:\n' + captureError(e));
    }
  }
}

if (failures.length) {
  console.error(failures.join('\n\n'));
  process.exit(2);
}
process.exit(0);

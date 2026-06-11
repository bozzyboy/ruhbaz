/* eslint-disable no-console */
// PostToolUse hook (Edit|Write): mobile TS/TSX değişikliğinde tsc --noEmit + UTF-8 kontrolü.
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
  const payload = JSON.parse(input);
  filePath = (payload.tool_input && payload.tool_input.file_path) || '';
} catch (e) {
  process.exit(0);
}
if (!filePath) process.exit(0);

const projectDir = process.env.CLAUDE_PROJECT_DIR || path.resolve(__dirname, '..', '..');
const mobileDir = path.join(projectDir, 'mobile');
const norm = path.resolve(filePath);
const inMobile = norm.toLowerCase().startsWith(mobileDir.toLowerCase() + path.sep);
if (!inMobile) process.exit(0);

const ext = path.extname(norm).toLowerCase();
const failures = [];

// UTF-8 / Türkçe karakter kontrolü (bağımsız script, node_modules gerektirmez)
if (['.ts', '.tsx', '.js', '.json', '.md'].includes(ext)) {
  try {
    execSync('node scripts/check-turkish-utf8.js', { cwd: mobileDir, stdio: 'pipe' });
  } catch (e) {
    failures.push('UTF-8/Türkçe karakter kontrolü BAŞARISIZ:\n' + String(e.stdout || e.message));
  }
}

// tsc --noEmit (node_modules kuruluysa)
if (['.ts', '.tsx'].includes(ext)) {
  const tscJs = path.join(mobileDir, 'node_modules', 'typescript', 'lib', 'tsc.js');
  if (fs.existsSync(tscJs)) {
    try {
      execSync(`node "${tscJs}" --noEmit`, { cwd: mobileDir, stdio: 'pipe' });
    } catch (e) {
      failures.push('tsc --noEmit BAŞARISIZ:\n' + String(e.stdout || e.message));
    }
  }
}

if (failures.length) {
  console.error(failures.join('\n\n'));
  process.exit(2);
}
process.exit(0);

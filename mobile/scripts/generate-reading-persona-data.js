const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const identityRoot = path.join(root, 'src', 'identity', 'assistants', 'reading-family');
const commonIdentityPath = path.join(identityRoot, 'common.md');
const outputPath = path.join(root, 'src', 'services', 'readingPersonaData.ts');

function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) {
    throw new Error('Identity file is missing frontmatter.');
  }
  const yaml = match[1];
  const body = match[2].trim();
  const readScalar = (key) => {
    const scalar = yaml.match(new RegExp(`^${key}:\\s*(.+?)\\s*$`, 'm'));
    return scalar ? scalar[1].replace(/^['"]|['"]$/g, '').trim() : '';
  };
  const primaryBlock = yaml.match(/^primary_domain:\s*\r?\n([\s\S]*?)(?=\r?\n\S|$)/m);
  const primaryDomainLabel = primaryBlock?.[1]?.match(/^\s+label:\s*(.+?)\s*$/m)?.[1]?.trim() || '';
  const ageValue = readScalar('age');
  return {
    body,
    id: readScalar('id'),
    displayName: readScalar('display_name') || readScalar('public_label') || readScalar('id'),
    age: ageValue ? Number(ageValue) : null,
    primaryDomainLabel,
  };
}

function parseClosingLibrary(body, id) {
  const section = body.match(/# Persona Closing Library\s*([\s\S]*?)(?=\r?\n# Implementation Notes|\r?\n# [^\n]+|$)/);
  if (!section) {
    throw new Error(`${id}: missing Persona Closing Library section.`);
  }
  const library = {};
  const lines = section[1].split(/\r?\n/);
  let tone = null;
  let current = null;
  const flush = () => {
    if (tone && current) {
      const sentence = current.join(' ').replace(/\s+/g, ' ').trim();
      if (sentence) library[tone].push(sentence);
    }
    current = null;
  };
  for (const line of lines) {
    const heading = line.match(/^##\s+([a-z_ -]+)\s*$/i);
    if (heading) {
      flush();
      tone = heading[1].trim();
      library[tone] = [];
      continue;
    }
    if (!tone) continue;
    const numbered = line.match(/^\s*\d+\.\s+(.+?)\s*$/);
    if (numbered) {
      flush();
      current = [numbered[1]];
      continue;
    }
    const continuation = line.trim();
    if (current && continuation) {
      current.push(continuation);
    }
  }
  flush();
  for (const [toneName, sentences] of Object.entries(library)) {
    if (!sentences.length) throw new Error(`${id}: empty closing tone ${toneName}.`);
    const broken = sentences.find((sentence) => !/[.!?…]$/.test(sentence));
    if (broken) throw new Error(`${id}: closing is not terminally punctuated: ${broken}`);
  }
  return library;
}

function stripClosingLibrary(body) {
  return body
    .replace(/\r?\n# Persona Closing Library\s*[\s\S]*?(?=\r?\n# Implementation Notes|\r?\n# [^\n]+|$)/, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

const entries = fs
  .readdirSync(identityRoot, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => {
    const filePath = path.join(identityRoot, entry.name, 'identity.md');
    const raw = fs.readFileSync(filePath, 'utf8');
    const meta = parseFrontmatter(raw);
    if (!meta.id) throw new Error(`${filePath}: missing id.`);
    return [
      meta.id,
      {
        assistantId: meta.id,
        displayName: meta.displayName,
        age: meta.age,
        primaryDomainLabel: meta.primaryDomainLabel,
        systemBody: stripClosingLibrary(meta.body),
        closingLibrary: parseClosingLibrary(meta.body, meta.id),
      },
    ];
  })
  .sort(([a], [b]) => a.localeCompare(b, 'tr'));

const data = Object.fromEntries(entries);
const commonIdentityBody = fs.readFileSync(commonIdentityPath, 'utf8').trim();
const source = `// Generated from mobile/src/identity/assistants/reading-family/*/identity.md and common.md. Do not edit by hand. Update identity markdown and regenerate.\n\nexport const COMMON_READING_IDENTITY_BODY = ${JSON.stringify(commonIdentityBody, null, 2)};\n\nexport const READING_PERSONA_DATA = ${JSON.stringify(data, null, 2)} as Record<string, { assistantId: string; displayName: string; age: number | null; primaryDomainLabel: string; systemBody: string; closingLibrary: Record<string, string[]> }>;\n`;

fs.writeFileSync(outputPath, source, 'utf8');
console.log(`Generated ${path.relative(root, outputPath)} with ${entries.length} personas.`);

// --- EN sürümü (Faz 4): identity.en.md varsa onu kullanır, yoksa TR'ye düşer ---
// EN ses dosyaları TASLAK aşamasındayken bile build kırılmaz (fallback TR).
// Her EN systemBody'ye çıktı-dili sözleşmesi eklenir (TR-fallback'te bile EN yanıt güvencesi).
const OUTPUT_LANGUAGE_BLOCK_EN = [
  '# Output Language',
  '',
  'The user is using the app in English. Respond entirely in natural, fluent English.',
  'Never mix Turkish words into user-visible text. Use the vocabulary of "symbolic reading /',
  'interpretation / reflection"; never call yourself a fortune teller or psychic, and never',
  'promise future outcomes — keep everything in the language of possibility and invitation.',
].join('\n');
const entriesEn = fs
  .readdirSync(identityRoot, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => {
    const enPath = path.join(identityRoot, entry.name, 'identity.en.md');
    const trPath = path.join(identityRoot, entry.name, 'identity.md');
    const usedPath = fs.existsSync(enPath) ? enPath : trPath;
    const raw = fs.readFileSync(usedPath, 'utf8');
    const meta = parseFrontmatter(raw);
    if (!meta.id) throw new Error(`${usedPath}: missing id.`);
    return [
      meta.id,
      {
        assistantId: meta.id,
        displayName: meta.displayName,
        age: meta.age,
        primaryDomainLabel: meta.primaryDomainLabel,
        systemBody: `${stripClosingLibrary(meta.body)}\n\n${OUTPUT_LANGUAGE_BLOCK_EN}`,
        closingLibrary: parseClosingLibrary(meta.body, `${meta.id} (en)`),
        isEnglishSource: fs.existsSync(enPath),
      },
    ];
  })
  .sort(([a], [b]) => a.localeCompare(b, 'tr'));

const enFallbackCount = entriesEn.filter(([, value]) => !value.isEnglishSource).length;
const dataEn = Object.fromEntries(entriesEn.map(([id, value]) => {
  const { isEnglishSource, ...rest } = value;
  return [id, rest];
}));
const commonEnPath = path.join(identityRoot, 'common.en.md');
const commonIdentityBodyEn = fs.existsSync(commonEnPath)
  ? fs.readFileSync(commonEnPath, 'utf8').trim()
  : commonIdentityBody;
const outputPathEn = path.join(root, 'src', 'services', 'readingPersonaData.en.ts');
const sourceEn = `// Generated from mobile/src/identity/assistants/reading-family/*/identity.en.md and common.en.md (TR fallback when missing). Do not edit by hand.\n\nexport const COMMON_READING_IDENTITY_BODY_EN = ${JSON.stringify(commonIdentityBodyEn, null, 2)};\n\nexport const READING_PERSONA_DATA_EN = ${JSON.stringify(dataEn, null, 2)} as Record<string, { assistantId: string; displayName: string; age: number | null; primaryDomainLabel: string; systemBody: string; closingLibrary: Record<string, string[]> }>;\n`;
fs.writeFileSync(outputPathEn, sourceEn, 'utf8');
console.log(
  `Generated ${path.relative(root, outputPathEn)} (${entriesEn.length} personas, ${enFallbackCount} TR-fallback).`,
);

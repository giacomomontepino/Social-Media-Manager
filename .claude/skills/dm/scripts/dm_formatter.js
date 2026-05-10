#!/usr/bin/env node
/**
 * dm_formatter.js — Formatta e salva DM freddi multi-social
 * Uso:
 *   node dm_formatter.js --text "testo dm" --platform linkedin --lead "Mario Rossi"
 *   node dm_formatter.js --text "testo dm" --platform x --lead "Mario Rossi" --copy
 */

import { mkdirSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PLANS_DIR = resolve(__dirname, '../../../../plans');

const WORD_LIMITS = { linkedin: [150, 180], x: [100, 140], threads: [100, 130] };

function validateLength(text, platform) {
  const words = text.trim().split(/\s+/).length;
  const [lo, hi] = WORD_LIMITS[platform.toLowerCase()] ?? [0, 9999];
  if (words < lo) console.log(`⚠️  DM troppo corto: ${words} parole (minimo ${lo} per ${platform})`);
  else if (words > hi) console.log(`⚠️  DM troppo lungo: ${words} parole (massimo ${hi} per ${platform})`);
  else console.log(`✓ Lunghezza OK: ${words} parole (${lo}-${hi} per ${platform})`);
  return words;
}

function saveDm(text, platform, leadName) {
  mkdirSync(PLANS_DIR, { recursive: true });
  const safeName = leadName.toLowerCase().replace(/\s+/g, '_');
  const today = new Date().toISOString().split('T')[0];
  const filename = `dm_${platform}_${safeName}_${today}.txt`;
  const path = resolve(PLANS_DIR, filename);
  writeFileSync(path, text, 'utf8');
  console.log(`✓ DM salvato: ${path}`);
  return path;
}

async function copyToClipboard(text) {
  try {
    const { default: clipboardy } = await import('clipboardy');
    clipboardy.writeSync(text);
    console.log('✓ DM copiato negli appunti');
  } catch {
    console.error('⚠️  Impossibile copiare negli appunti');
  }
}

async function main(text, platform, leadName, copy = false) {
  console.log(`\n--- DM ${platform.toUpperCase()} — ${leadName} ---`);
  console.log(text);
  console.log('---');
  validateLength(text, platform);
  saveDm(text, platform, leadName);
  if (copy) await copyToClipboard(text);
}

// CLI
const args = process.argv.slice(2);
const get = (flag) => { const i = args.indexOf(flag); return i !== -1 ? args[i + 1] : null; };

const text = get('--text');
const platform = get('--platform');
const lead = get('--lead');

if (!text || !platform || !lead) {
  console.log('Uso: node dm_formatter.js --text "testo" --platform linkedin|x|threads --lead "Nome" [--copy]');
  process.exit(1);
}

main(text, platform, lead, args.includes('--copy')).catch(e => { console.error(e.message); process.exit(1); });

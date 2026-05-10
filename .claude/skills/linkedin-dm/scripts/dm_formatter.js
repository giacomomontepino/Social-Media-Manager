#!/usr/bin/env node
/**
 * linkedin_dm_formatter.js — Formatta, valida e salva DM freddi LinkedIn (2 varianti)
 * Uso:
 *   node dm_formatter.js --variant-a "testo diretto" --variant-b "testo narrativo" --lead "Mario Rossi"
 *   node dm_formatter.js --variant-a "testo" --variant-b "testo" --lead "Mario" --copy a
 */

import { mkdirSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PLANS_DIR = resolve(__dirname, '../../../../plans');
const MIN_WORDS = 150;
const MAX_WORDS = 180;

function validate(text, variantLabel) {
  const words = text.trim().split(/\s+/).length;
  if (words < MIN_WORDS) console.log(`⚠️  Variante ${variantLabel}: ${words} parole — troppo corta (minimo ${MIN_WORDS})`);
  else if (words > MAX_WORDS) console.log(`⚠️  Variante ${variantLabel}: ${words} parole — troppo lunga (massimo ${MAX_WORDS})`);
  else console.log(`✓ Variante ${variantLabel}: ${words} parole — OK`);
  return words;
}

function save(textA, textB, leadName) {
  mkdirSync(PLANS_DIR, { recursive: true });
  const safe = leadName.toLowerCase().replace(/\s+/g, '_');
  const today = new Date().toISOString().split('T')[0];
  const path = resolve(PLANS_DIR, `linkedin_dm_${safe}_${today}.txt`);
  const content = `=== VARIANTE A — Diretta ===\n\n${textA}\n\n=== VARIANTE B — Narrativa ===\n\n${textB}`;
  writeFileSync(path, content, 'utf8');
  console.log(`✓ Salvato: ${path}`);
  return path;
}

async function copyToClipboard(text) {
  try {
    const { default: clipboardy } = await import('clipboardy');
    clipboardy.writeSync(text);
    console.log('✓ Copiato negli appunti');
  } catch {
    console.error('⚠️  Impossibile copiare negli appunti');
  }
}

async function main(textA, textB, leadName, copyVariant = null) {
  console.log(`\n=== DM LinkedIn — ${leadName} ===`);
  console.log(`\n--- Variante A (Diretta) ---\n${textA}`);
  console.log(`\n--- Variante B (Narrativa) ---\n${textB}\n`);
  validate(textA, 'A');
  validate(textB, 'B');
  save(textA, textB, leadName);
  if (copyVariant === 'a') await copyToClipboard(textA);
  else if (copyVariant === 'b') await copyToClipboard(textB);
}

// CLI
const args = process.argv.slice(2);
const get = (flag) => { const i = args.indexOf(flag); return i !== -1 ? args[i + 1] : null; };

const variantA = get('--variant-a');
const variantB = get('--variant-b');
const lead = get('--lead');

if (!variantA || !variantB || !lead) {
  console.log('Uso: node dm_formatter.js --variant-a "testo" --variant-b "testo" --lead "Nome" [--copy a|b]');
  process.exit(1);
}

main(variantA, variantB, lead, get('--copy')).catch(e => { console.error(e.message); process.exit(1); });

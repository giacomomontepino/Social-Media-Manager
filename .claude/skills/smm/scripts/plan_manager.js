#!/usr/bin/env node
/**
 * plan_manager.js — Gestisce il file editorial-plan.md
 * Uso:
 *   node plan_manager.js --check
 *   node plan_manager.js --today
 *   node plan_manager.js --status DATE PLATFORM STATUS
 *   node plan_manager.js --metrics-check
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PLAN_PATH = resolve(__dirname, '../../../../plans/editorial-plan.md');

const STATUS_SYMBOLS = { scheduled: '⬜', created: '🟡', published: '✅' };

function readRaw() {
  if (!existsSync(PLAN_PATH)) {
    console.error('❌ Piano non trovato. Lancia /smm per crearlo.');
    process.exit(1);
  }
  return readFileSync(PLAN_PATH, 'utf8');
}

function parseFrontmatter(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  return Object.fromEntries(
    match[1].split('\n').filter(l => l.includes(':')).map(l => {
      const [k, ...v] = l.split(':');
      return [k.trim(), v.join(':').trim()];
    })
  );
}

function parseTableRows(raw) {
  return raw.split('\n')
    .filter(l => l.startsWith('|') && !l.startsWith('| Date') && !l.includes('---'))
    .map(l => l.split('|').map(p => p.trim()).filter(Boolean))
    .filter(parts => parts.length >= 8)
    .map(parts => ({
      date: parts[0], platform: parts[1], stage: parts[2], topic: parts[3],
      format: parts[4], hook: parts[5], cta: parts[6], status: parts[7],
    }));
}

function check() {
  const raw = readRaw();
  const fm = parseFrontmatter(raw);
  const rows = parseTableRows(raw);
  console.log(`✓ Piano trovato: ${fm.period ?? 'N/A'}`);
  console.log(`  Obiettivo: ${fm.monthly_goal ?? 'N/A'}`);
  console.log(`  Post totali: ${rows.length}`);
  const published = rows.filter(r => r.status === STATUS_SYMBOLS.published).length;
  const created = rows.filter(r => r.status === STATUS_SYMBOLS.created).length;
  const scheduled = rows.filter(r => r.status === STATUS_SYMBOLS.scheduled).length;
  console.log(`  ✅ Pubblicati: ${published}  🟡 Creati: ${created}  ⬜ Da fare: ${scheduled}`);
}

function todayPosts() {
  const raw = readRaw();
  const rows = parseTableRows(raw);
  const todayStr = new Date().toISOString().split('T')[0];
  const results = rows.filter(r => r.date === todayStr && r.status === STATUS_SYMBOLS.scheduled);
  if (!results.length) {
    console.log(`Nessun post schedulato per oggi (${todayStr}).`);
  } else {
    console.log(`Post di oggi (${todayStr}):`);
    results.forEach(r => console.log(`  • ${r.platform} (${r.stage}) — ${r.topic} [${r.format}]`));
  }
  return results;
}

function updateStatus(targetDate, platform, newStatus) {
  const raw = readRaw();
  const symbol = STATUS_SYMBOLS[newStatus];
  if (!symbol) {
    console.error(`❌ Status non valido: ${newStatus}. Usa: scheduled, created, published`);
    process.exit(1);
  }
  const lines = raw.split('\n');
  let updated = false;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('|') && lines[i].includes(targetDate) && lines[i].includes(platform)) {
      const parts = lines[i].split('|');
      if (parts.length >= 9) {
        parts[parts.length - 2] = ` ${symbol} `;
        lines[i] = parts.join('|');
        updated = true;
        break;
      }
    }
  }
  if (!updated) {
    console.error(`⚠️  Riga non trovata per ${targetDate} / ${platform}`);
    process.exit(1);
  }
  writeFileSync(PLAN_PATH, lines.join('\n'), 'utf8');
  console.log(`✓ Status aggiornato: ${targetDate} ${platform} → ${symbol}`);
}

function metricsCheck() {
  const raw = readRaw();
  const fm = parseFrontmatter(raw);
  const lastReview = fm.last_metrics_review ?? '';
  if (!lastReview) { console.log('0'); return; }
  try {
    const lastDt = new Date(lastReview);
    const days = Math.floor((Date.now() - lastDt.getTime()) / 86400000);
    console.log(String(days));
  } catch {
    console.log('0');
  }
}

// CLI
const args = process.argv.slice(2);
const get = (flag) => { const i = args.indexOf(flag); return i !== -1 ? args[i + 1] : null; };

if (args.includes('--check')) check();
else if (args.includes('--today')) todayPosts();
else if (args.includes('--status')) {
  const i = args.indexOf('--status');
  updateStatus(args[i + 1], args[i + 2], args[i + 3]);
} else if (args.includes('--metrics-check')) metricsCheck();
else console.log('Uso: node plan_manager.js --check | --today | --status DATE PLATFORM STATUS | --metrics-check');

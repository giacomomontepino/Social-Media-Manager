#!/usr/bin/env node
/**
 * threads_publisher.js — Pubblica post su Threads via Meta Graph API
 * Uso:
 *   node publisher.js --dry-run
 *   node publisher.js --text "testo" [--image-url URL]
 */

import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, '../../../../.env') });

const ACCESS_TOKEN = process.env.THREADS_ACCESS_TOKEN;
const USER_ID = process.env.THREADS_USER_ID;
const API_BASE = 'https://graph.threads.net/v1.0';

function checkCredentials() {
  if (!ACCESS_TOKEN || !USER_ID) {
    console.error('❌ Credenziali Threads mancanti. Compila THREADS_ACCESS_TOKEN e THREADS_USER_ID in .env');
    console.error('   Guida: .claude/setup/api-credentials.md');
    process.exit(1);
  }
}

async function dryRun() {
  checkCredentials();
  const url = new URL(`${API_BASE}/${USER_ID}`);
  url.searchParams.set('fields', 'id,username');
  url.searchParams.set('access_token', ACCESS_TOKEN);
  const r = await fetch(url);
  if (r.ok) {
    const data = await r.json();
    console.log(`✓ Auth OK — dry run completato. Account: @${data.username ?? 'N/A'}`);
  } else {
    console.error(`❌ Auth fallita: ${r.status} ${await r.text()}`);
    process.exit(1);
  }
}

async function createMediaContainer(text, imageUrl = null) {
  const url = new URL(`${API_BASE}/${USER_ID}/threads`);
  url.searchParams.set('media_type', imageUrl ? 'IMAGE' : 'TEXT');
  url.searchParams.set('text', text);
  url.searchParams.set('access_token', ACCESS_TOKEN);
  if (imageUrl) url.searchParams.set('image_url', imageUrl);

  const r = await fetch(url, { method: 'POST' });
  if (!r.ok) throw new Error(`createMediaContainer fallito: ${r.status} ${await r.text()}`);
  const data = await r.json();
  console.log(`✓ Container creato: ${data.id}`);
  return data.id;
}

async function publishContainer(containerId) {
  await new Promise(res => setTimeout(res, 3000));
  const url = new URL(`${API_BASE}/${USER_ID}/threads_publish`);
  url.searchParams.set('creation_id', containerId);
  url.searchParams.set('access_token', ACCESS_TOKEN);

  const r = await fetch(url, { method: 'POST' });
  if (!r.ok) throw new Error(`publishContainer fallito: ${r.status} ${await r.text()}`);
  const data = await r.json();
  const postUrl = `https://www.threads.net/@giacomomontepino/post/${data.id}`;
  console.log(`✓ Post pubblicato: ${postUrl}`);
  return postUrl;
}

async function main(text, imageUrl = null) {
  checkCredentials();
  const containerId = await createMediaContainer(text, imageUrl);
  return publishContainer(containerId);
}

// CLI
const args = process.argv.slice(2);
const get = (flag) => { const i = args.indexOf(flag); return i !== -1 ? args[i + 1] : null; };

if (args.includes('--dry-run')) {
  dryRun().catch(e => { console.error(e.message); process.exit(1); });
} else if (get('--text')) {
  main(get('--text'), get('--image-url')).catch(e => { console.error(e.message); process.exit(1); });
} else {
  console.log('Uso: node publisher.js --dry-run | --text "testo" [--image-url URL]');
}

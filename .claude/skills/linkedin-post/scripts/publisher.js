#!/usr/bin/env node
/**
 * linkedin_publisher.js — Pubblica post su LinkedIn via API v2
 * Uso:
 *   node publisher.js --dry-run
 *   node publisher.js --text "testo" [--image path/img.jpg]
 *   node publisher.js --text "testo" --carousel img1 img2 img3
 */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, '../../../../.env') });

const ACCESS_TOKEN = process.env.LINKEDIN_ACCESS_TOKEN;
const PERSON_ID = process.env.LINKEDIN_PERSON_ID;
const API_BASE = 'https://api.linkedin.com/v2';

function headers() {
  return {
    'Authorization': `Bearer ${ACCESS_TOKEN}`,
    'Content-Type': 'application/json',
    'X-Restli-Protocol-Version': '2.0.0',
  };
}

function checkCredentials() {
  if (!ACCESS_TOKEN || !PERSON_ID) {
    console.error('❌ Credenziali LinkedIn mancanti. Compila LINKEDIN_ACCESS_TOKEN e LINKEDIN_PERSON_ID in .env');
    console.error('   Guida: .claude/setup/api-credentials.md');
    process.exit(1);
  }
}

async function dryRun() {
  checkCredentials();
  const r = await fetch(`${API_BASE}/userinfo`, { headers: headers() });
  if (r.ok) {
    const data = await r.json();
    console.log(`✓ Auth OK — dry run completato. Account: ${data.name ?? 'N/A'}`);
  } else {
    console.error(`❌ Auth fallita: ${r.status} ${await r.text()}`);
    process.exit(1);
  }
}

async function registerUpload() {
  const payload = {
    registerUploadRequest: {
      recipes: ['urn:li:digitalmediaRecipe:feedshare-image'],
      owner: `urn:li:person:${PERSON_ID}`,
      serviceRelationships: [{ relationshipType: 'OWNER', identifier: 'urn:li:userGeneratedContent' }],
    },
  };
  const r = await fetch(`${API_BASE}/assets?action=registerUpload`, {
    method: 'POST', headers: headers(), body: JSON.stringify(payload),
  });
  if (!r.ok) throw new Error(`registerUpload fallito: ${r.status} ${await r.text()}`);
  const data = await r.json();
  const uploadUrl = data.value.uploadMechanism['com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest'].uploadUrl;
  const asset = data.value.asset;
  return { uploadUrl, asset };
}

async function uploadImage(imagePath) {
  const { uploadUrl, asset } = await registerUpload();
  const imgData = readFileSync(imagePath);
  const r = await fetch(uploadUrl, {
    method: 'PUT',
    body: imgData,
    headers: { 'Authorization': `Bearer ${ACCESS_TOKEN}` },
  });
  if (!r.ok) throw new Error(`Upload immagine fallito: ${r.status}`);
  console.log(`✓ Immagine caricata: ${asset}`);
  return asset;
}

async function publishPost(text, assetUrn = null, carouselUrns = null) {
  const media = assetUrn
    ? [{ status: 'READY', media: assetUrn }]
    : carouselUrns
    ? carouselUrns.map(urn => ({ status: 'READY', media: urn }))
    : null;

  const body = {
    author: `urn:li:person:${PERSON_ID}`,
    lifecycleState: 'PUBLISHED',
    specificContent: {
      'com.linkedin.ugc.ShareContent': {
        shareCommentary: { text },
        shareMediaCategory: media ? 'IMAGE' : 'NONE',
        ...(media && { media }),
      },
    },
    visibility: { 'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC' },
  };

  const r = await fetch(`${API_BASE}/ugcPosts`, {
    method: 'POST', headers: headers(), body: JSON.stringify(body),
  });
  if (!r.ok) throw new Error(`Publish fallito: ${r.status} ${await r.text()}`);
  const postId = r.headers.get('x-restli-id') ?? (await r.json()).id ?? '';
  const postUrl = `https://www.linkedin.com/feed/update/${postId}/`;
  console.log(`✓ Post pubblicato: ${postUrl}`);
  return postUrl;
}

async function main(text, imagePath = null, carouselPaths = null) {
  checkCredentials();
  let assetUrn = null;
  let carouselUrns = null;
  if (imagePath) assetUrn = await uploadImage(imagePath);
  else if (carouselPaths) carouselUrns = await Promise.all(carouselPaths.map(uploadImage));
  return publishPost(text, assetUrn, carouselUrns);
}

// CLI
const args = process.argv.slice(2);
const get = (flag) => { const i = args.indexOf(flag); return i !== -1 ? args[i + 1] : null; };
const getAll = (flag) => { const i = args.indexOf(flag); if (i === -1) return null; const vals = []; let j = i + 1; while (j < args.length && !args[j].startsWith('--')) vals.push(args[j++]); return vals.length ? vals : null; };

if (args.includes('--dry-run')) {
  dryRun().catch(e => { console.error(e.message); process.exit(1); });
} else if (get('--text')) {
  main(get('--text'), get('--image'), getAll('--carousel')).catch(e => { console.error(e.message); process.exit(1); });
} else {
  console.log('Uso: node publisher.js --dry-run | --text "testo" [--image path] [--carousel img1 img2]');
}

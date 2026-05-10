#!/usr/bin/env node
// Script one-shot per pubblicare il post Drake su LinkedIn
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.resolve(__dirname, '../../../../.env') });

const ACCESS_TOKEN = process.env.LINKEDIN_ACCESS_TOKEN;
const PERSON_ID = process.env.LINKEDIN_PERSON_ID;
const API_BASE = 'https://api.linkedin.com/v2';

const POST_TEXT = `Ho costruito da zero il mio sistema SMM
con Claude Code. In una settimana.

Niente abbonamenti. Niente tool esterni.
Un sistema che sa esattamente come voglio comunicare.

Ecco com'è fatto.

La pipeline:

🔍 Un Researcher che analizza trend per React Native e mobile dev.
✍️ Un Writer che conosce le regole di ogni piattaforma.
🔄 Un Reviewer che itera fino a 3 volte per affinare il draft.
🎨 Un Visual Agent che crea le grafiche via Canva MCP.

Tutto parte da un unico comando.

Le integrazioni:

🔵 LinkedIn con OAuth 2.0 — posta sul profilo personale.
🐦 X API v2 in Node.js — post singoli e thread.
🧵 Threads via Meta Graph — token rinnovabile ogni 60 giorni.

Ogni script ha un --dry-run che verifica l'autenticazione prima di pubblicare.

La parte più interessante:

Un sistema di references.

📸 Carichi screenshot di post che ti ispirano — tuoi o di altri creator.
🧠 Il sistema li legge, estrae pattern testuali e visivi e ti fa domande.
⚙️ Poi aggiorna automaticamente le istruzioni del Writer e del Visual Agent.

Una memoria che si evolve nel tempo.

Cosa ho imparato:

La parte più lenta non è il codice.
È definire esattamente come vuoi che il sistema si comporti.
Ogni istruzione agli agenti è una scelta di positioning.

Un sistema del genere non sostituisce il pensiero.
Lo amplifica.

Stai costruendo qualcosa di simile nel tuo workflow?
Curioso di sentire cosa.

#ReactNative #ClaudeCode #PersonalBrand #DeveloperLife #Automation`;

const IMAGE_PATH = path.resolve(__dirname, '../../../references/visuals/linkedin/drake-meme-output.png');

const headers = {
  'Authorization': `Bearer ${ACCESS_TOKEN}`,
  'Content-Type': 'application/json',
  'X-Restli-Protocol-Version': '2.0.0',
};

async function registerUpload() {
  const payload = {
    registerUploadRequest: {
      recipes: ['urn:li:digitalmediaRecipe:feedshare-image'],
      owner: `urn:li:person:${PERSON_ID}`,
      serviceRelationships: [{ relationshipType: 'OWNER', identifier: 'urn:li:userGeneratedContent' }],
    },
  };
  const r = await fetch(`${API_BASE}/assets?action=registerUpload`, {
    method: 'POST', headers, body: JSON.stringify(payload),
  });
  if (!r.ok) throw new Error(`registerUpload fallito: ${r.status} ${await r.text()}`);
  const data = await r.json();
  const uploadUrl = data.value.uploadMechanism['com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest'].uploadUrl;
  return { uploadUrl, asset: data.value.asset };
}

async function main() {
  console.log('📤 Caricamento immagine...');
  const { uploadUrl, asset } = await registerUpload();
  const imgData = fs.readFileSync(IMAGE_PATH);
  const upRes = await fetch(uploadUrl, {
    method: 'PUT',
    body: imgData,
    headers: { 'Authorization': `Bearer ${ACCESS_TOKEN}` },
  });
  if (!upRes.ok) throw new Error(`Upload fallito: ${upRes.status}`);
  console.log(`✓ Immagine caricata: ${asset}`);

  console.log('📝 Pubblicazione post...');
  const body = {
    author: `urn:li:person:${PERSON_ID}`,
    lifecycleState: 'PUBLISHED',
    specificContent: {
      'com.linkedin.ugc.ShareContent': {
        shareCommentary: { text: POST_TEXT },
        shareMediaCategory: 'IMAGE',
        media: [{ status: 'READY', media: asset }],
      },
    },
    visibility: { 'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC' },
  };

  const r = await fetch(`${API_BASE}/ugcPosts`, {
    method: 'POST', headers, body: JSON.stringify(body),
  });
  if (!r.ok) throw new Error(`Publish fallito: ${r.status} ${await r.text()}`);
  const postId = r.headers.get('x-restli-id') ?? '';
  const postUrl = `https://www.linkedin.com/feed/update/${postId}/`;
  console.log(`✅ Post pubblicato: ${postUrl}`);
}

main().catch(e => { console.error('❌', e.message); process.exit(1); });

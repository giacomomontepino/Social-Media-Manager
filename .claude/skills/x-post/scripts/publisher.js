#!/usr/bin/env node
/**
 * x_publisher.js — Pubblica post/thread su X (Twitter) via API v2
 * Uso:
 *   node publisher.js --dry-run
 *   node publisher.js --tweet "testo" [--image path]
 *   node publisher.js --thread tweet1 tweet2 ... [--image path]
 */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';
import { TwitterApi } from 'twitter-api-v2';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, '../../../../.env') });

const API_KEY = process.env.X_API_KEY;
const API_KEY_SECRET = process.env.X_API_KEY_SECRET;
const ACCESS_TOKEN = process.env.X_ACCESS_TOKEN;
const ACCESS_TOKEN_SECRET = process.env.X_ACCESS_TOKEN_SECRET;

function checkCredentials() {
  const missing = Object.entries({ X_API_KEY: API_KEY, X_API_KEY_SECRET: API_KEY_SECRET, X_ACCESS_TOKEN: ACCESS_TOKEN, X_ACCESS_TOKEN_SECRET: ACCESS_TOKEN_SECRET })
    .filter(([, v]) => !v).map(([k]) => k);
  if (missing.length) {
    console.error(`❌ Credenziali X mancanti: ${missing.join(', ')}`);
    console.error('   Guida: .claude/setup/api-credentials.md');
    process.exit(1);
  }
}

function getClient() {
  return new TwitterApi({ appKey: API_KEY, appSecret: API_KEY_SECRET, accessToken: ACCESS_TOKEN, accessSecret: ACCESS_TOKEN_SECRET });
}

async function dryRun() {
  checkCredentials();
  const client = getClient();
  const me = await client.v2.me();
  console.log(`✓ Auth OK — dry run completato. Account: @${me.data.username}`);
}

async function uploadMedia(imagePath) {
  const client = getClient();
  const mediaId = await client.v1.uploadMedia(imagePath);
  console.log(`✓ Media caricato: ${mediaId}`);
  return mediaId;
}

async function postTweet(text, mediaId = null, replyTo = null) {
  const client = getClient();
  const params = { text };
  if (mediaId) params.media = { media_ids: [mediaId] };
  if (replyTo) params.reply = { in_reply_to_tweet_id: replyTo };
  const response = await client.v2.tweet(params);
  const tweetId = response.data.id;
  console.log(`✓ Tweet pubblicato: https://x.com/i/web/status/${tweetId}`);
  return tweetId;
}

async function postThread(tweets, imagePath = null) {
  const mediaId = imagePath ? await uploadMedia(imagePath) : null;
  let replyTo = null;
  const tweetIds = [];
  for (let i = 0; i < tweets.length; i++) {
    const mid = i === 0 ? mediaId : null;
    const tweetId = await postTweet(tweets[i], mid, replyTo);
    tweetIds.push(tweetId);
    replyTo = tweetId;
  }
  console.log(`✓ Thread pubblicato (${tweets.length} tweet). Primo: https://x.com/i/web/status/${tweetIds[0]}`);
  return tweetIds[0];
}

async function main(tweets, imagePath = null) {
  checkCredentials();
  if (tweets.length === 1) {
    const mediaId = imagePath ? await uploadMedia(imagePath) : null;
    return postTweet(tweets[0], mediaId);
  } else {
    return postThread(tweets, imagePath);
  }
}

// CLI
const args = process.argv.slice(2);
const get = (flag) => { const i = args.indexOf(flag); return i !== -1 ? args[i + 1] : null; };
const getAll = (flag) => { const i = args.indexOf(flag); if (i === -1) return null; const vals = []; let j = i + 1; while (j < args.length && !args[j].startsWith('--')) vals.push(args[j++]); return vals.length ? vals : null; };

if (args.includes('--dry-run')) {
  dryRun().catch(e => { console.error(e.message); process.exit(1); });
} else if (get('--tweet')) {
  main([get('--tweet')], get('--image')).catch(e => { console.error(e.message); process.exit(1); });
} else if (getAll('--thread')) {
  main(getAll('--thread'), get('--image')).catch(e => { console.error(e.message); process.exit(1); });
} else {
  console.log('Uso: node publisher.js --dry-run | --tweet "testo" [--image path] | --thread t1 t2 t3');
}

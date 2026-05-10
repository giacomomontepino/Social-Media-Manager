#!/usr/bin/env node
/**
 * meme_generator.cjs — Genera meme Drake con testo custom
 * Uso: node meme_generator.cjs
 */

const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '../../../..');
const TEMPLATE_PATH = path.join(ROOT, '.claude/references/visuals/linkedin/Drake-Hotline-Bling.jpg');
const OUTPUT_PATH = path.join(ROOT, '.claude/references/visuals/linkedin/drake-meme-output.png');

// Testo dei due pannelli
const TOP_TEXT = 'Pagare $99/mese\nper Hootsuite,\nBuffer, Later';
const BOTTOM_TEXT = 'Costruire il mio\nsistema SMM con\nClaude Code\nin una settimana';
const SIGNATURE = 'Giacomo Montepino';

async function generate() {
  const img = await loadImage(TEMPLATE_PATH);
  const W = img.width;
  const H = img.height;
  const panelH = H / 2;
  const textX = W * 0.52;       // testo inizia al 52% (dopo Drake)
  const textW = W * 0.44;       // larghezza area testo
  const fontSize = Math.round(W * 0.055);
  const signatureSize = Math.round(W * 0.028);

  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext('2d');

  // Disegna immagine originale
  ctx.drawImage(img, 0, 0, W, H);

  // Funzione helper: disegna testo con outline (stile meme classico)
  function drawMemeText(text, x, y, maxWidth, size, color = '#000000') {
    ctx.font = `bold ${size}px Impact, Arial Black, sans-serif`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';

    const lines = text.split('\n');
    const lineH = size * 1.25;

    lines.forEach((line, i) => {
      const ly = y + i * lineH;
      // Outline bianco
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = size * 0.12;
      ctx.lineJoin = 'round';
      ctx.strokeText(line, x, ly, maxWidth);
      // Testo nero
      ctx.fillStyle = color;
      ctx.fillText(line, x, ly, maxWidth);
    });

    return lines.length * lineH;
  }

  // Testo pannello TOP (rifiuto) — centra verticalmente nel pannello
  const topLines = TOP_TEXT.split('\n').length;
  const topBlockH = topLines * fontSize * 1.25;
  const topY = (panelH - topBlockH) / 2;
  drawMemeText(TOP_TEXT, textX, topY, textW, fontSize);

  // Testo pannello BOTTOM (approvazione)
  const bottomLines = BOTTOM_TEXT.split('\n').length;
  const bottomBlockH = bottomLines * fontSize * 1.25;
  const bottomY = panelH + (panelH - bottomBlockH) / 2;
  drawMemeText(BOTTOM_TEXT, textX, bottomY, textW, fontSize);

  // Firma in basso a destra
  ctx.font = `bold ${signatureSize}px Arial, sans-serif`;
  ctx.textAlign = 'right';
  ctx.textBaseline = 'bottom';
  ctx.fillStyle = 'rgba(0,0,0,0.6)';
  ctx.fillText(SIGNATURE, W - 10, H - 8);

  // Salva
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(OUTPUT_PATH, buffer);
  console.log(`✓ Meme generato: ${OUTPUT_PATH}`);
  console.log(`  Dimensioni: ${W}x${H}px`);
}

generate().catch(e => { console.error(e.message); process.exit(1); });

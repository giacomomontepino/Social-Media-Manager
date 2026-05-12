#!/usr/bin/env node
/**
 * carousel_generator.cjs — Caroselli LinkedIn stile reference + enhanced
 *
 * Tipi di slide:
 *   'black'   → sfondo nero, testo centrato, forme decor opzionali
 *   'white'   → sfondo bianco, testo centrato, badge opzionale, marker highlight
 *   'bubble'  → sfondo nero + speech bubble bianca centrata
 *   'accent'  → sfondo accent color (orange/cyan), testo centrato
 *   'split'   → metà nera + metà bianca, testo su entrambe
 *   'graphic' → numero/parola enorme semi-trasparente come sfondo grafico
 *
 * Uso: node carousel_generator.cjs
 */

const { createCanvas, registerFont } = require('canvas');
const fs   = require('fs');
const path = require('path');

registerFont('/Library/Fonts/SF-Pro-Rounded-Black.otf',   { family: 'SFR', weight: '900' });
registerFont('/Library/Fonts/SF-Pro-Rounded-Bold.otf',    { family: 'SFR', weight: '700' });
registerFont('/Library/Fonts/SF-Pro-Rounded-Regular.otf', { family: 'SFR', weight: '400' });

const ROOT       = path.resolve(__dirname, '../../../..');
const OUTPUT_DIR = path.join(ROOT, '.claude/output/carousel');
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

const C = {
  black:  '#000000',
  white:  '#FFFFFF',
  orange: '#E8A838',
  cyan:   '#00D4FF',
  dark:   '#111111',
  gray:   '#888888',
};

const W      = 1200;
const H      = 1200;
const AUTHOR = 'Giacomo Montepino';

// =============================================================================
// SLIDES
// =============================================================================

const SLIDES = [

  // 1 — BLACK: hook + watermark grafico "55"
  {
    type: 'graphic',
    bg: C.black,
    watermark: { text: '55', color: 'rgba(232,168,56,0.08)', size: 680 },
    lines: [
      { text: 'Expo SDK 55',             size: 110, color: C.white,  weight: '900' },
      { text: 'è uscita.',               size: 110, color: C.white,  weight: '900' },
      { text: 'La Legacy Architecture',  size:  62, color: C.cyan,   weight: '900' },
      { text: 'non esiste più.',         size:  62, color: C.white,  weight: '900' },
    ],
    dots: [
      { x: 120, y: 160,  r: 18, color: C.orange },
      { x: 1080,y: 200,  r: 12, color: C.cyan   },
      { x: 90,  y: 1050, r: 14, color: C.cyan   },
      { x: 1100,y: 980,  r: 20, color: C.orange },
    ],
    arrow: false,
  },

  // 2 — BUBBLE: insight principale
  {
    type: 'bubble',
    lines: [
      { text: 'Da SDK 55 in poi',         size: 60, color: C.dark,   weight: '900' },
      { text: 'la New Architecture',      size: 60, color: C.dark,   weight: '900' },
      { text: 'non è più opzionale.',     size: 60, color: C.dark,   weight: '900' },
      { text: 'È l\'unica opzione.',      size: 60, color: C.orange, weight: '900', marker: true },
    ],
    bubbleAccent: C.orange,
    arrow: true,
  },

  // 3 — GRAPHIC: RN 0.83 con watermark numero
  {
    type: 'graphic',
    bg: C.black,
    watermark: { text: '0.83', color: 'rgba(0,212,255,0.07)', size: 480 },
    lines: [
      { text: 'React Native',   size: 88, color: C.white,  weight: '900' },
      { text: '0.83',           size: 88, color: C.cyan,   weight: '900' },
      { text: 'è incluso.',     size: 88, color: C.orange, weight: '900' },
      { text: '', size: 20 },
      { text: 'React 19.2 · Network Inspector · DevTools desktop',
                                size: 38, color: 'rgba(255,255,255,0.6)', weight: '400' },
    ],
    dots: [
      { x: 100,  y: 100, r: 14, color: C.cyan   },
      { x: 1100, y: 140, r: 22, color: C.orange },
      { x: 1080, y: 1080,r: 16, color: C.cyan   },
    ],
    arrow: true,
  },

  // 4 — ACCENT (orange): Network Inspector
  {
    type: 'accent',
    bg: C.orange,
    lines: [
      { text: 'Network',        size: 110, color: C.black, weight: '900' },
      { text: 'Inspector.',     size: 110, color: C.black, weight: '900' },
      { text: '', size: 28 },
      { text: 'Vedi ogni request HTTP',  size: 52, color: 'rgba(0,0,0,0.75)', weight: '700' },
      { text: 'con il file sorgente',    size: 52, color: 'rgba(0,0,0,0.75)', weight: '700' },
      { text: 'che l\'ha generata.',     size: 52, color: 'rgba(0,0,0,0.75)', weight: '700' },
      { text: '', size: 16 },
      { text: 'Zero configurazione.',    size: 52, color: C.black, weight: '900' },
    ],
    dots: [
      { x: 80,   y: 80,   r: 30, color: 'rgba(0,0,0,0.12)' },
      { x: 1120, y: 1120, r: 40, color: 'rgba(0,0,0,0.1)'  },
      { x: 1100, y: 80,   r: 18, color: 'rgba(0,0,0,0.15)' },
    ],
    arrow: true,
  },

  // 5 — SPLIT: prima / dopo New Architecture
  {
    type: 'split',
    left: {
      bg: C.white,
      label: { text: 'PRIMA', color: C.black, size: 38 },
      lines: [
        { text: 'Bridge',    size: 72, color: C.dark,  weight: '900' },
        { text: 'lento.',    size: 72, color: C.dark,  weight: '900' },
        { text: 'Native',    size: 52, color: C.gray,  weight: '700' },
        { text: 'modules',   size: 52, color: C.gray,  weight: '700' },
        { text: 'sincroni.', size: 52, color: C.gray,  weight: '700' },
      ],
    },
    right: {
      bg: C.black,
      label: { text: 'ORA', color: C.cyan, size: 38 },
      lines: [
        { text: 'JSI',       size: 72, color: C.white, weight: '900' },
        { text: 'diretto.',  size: 72, color: C.orange,weight: '900' },
        { text: 'Turbo',     size: 52, color: C.cyan,  weight: '700' },
        { text: 'Modules',   size: 52, color: C.cyan,  weight: '700' },
        { text: 'on-demand.',size: 52, color: C.cyan,  weight: '700' },
      ],
    },
    arrow: true,
  },

  // 6 — WHITE: come migrare, con marker sullo step critico
  {
    type: 'white',
    badge: { text: 'Come migrare a SDK 55', color: C.white, bg: C.dark },
    lines: [
      { text: '1.  Aggiorna expo a ^55',              size: 50, color: C.dark,   weight: '900' },
      { text: '2.  npx expo install --fix',           size: 50, color: C.dark,   weight: '900' },
      { text: '3.  Controlla reactnative.directory',  size: 44, color: C.dark,   weight: '900', marker: true, markerColor: 'rgba(232,168,56,0.3)' },
      { text: '4.  Testa su device fisico',           size: 50, color: C.dark,   weight: '900' },
      { text: '', size: 16 },
      { text: 'Non saltare il punto 3.',              size: 48, color: C.orange, weight: '900' },
    ],
    arrow: true,
  },

  // 7 — BUBBLE: warning librerie
  {
    type: 'bubble',
    lines: [
      { text: 'Alcune librerie',      size: 64, color: C.dark,   weight: '900' },
      { text: 'usano ancora',         size: 64, color: C.dark,   weight: '900' },
      { text: 'il vecchio bridge.',   size: 64, color: C.dark,   weight: '900' },
      { text: '', size: 12 },
      { text: 'Controlla PRIMA',      size: 64, color: C.orange, weight: '900', marker: true },
      { text: 'di aggiornare.',       size: 64, color: C.orange, weight: '900' },
    ],
    bubbleAccent: C.cyan,
    arrow: true,
  },

  // 8 — BLACK: CTA finale + dots decoration
  {
    type: 'graphic',
    bg: C.black,
    watermark: null,
    lines: [
      { text: 'React Native nel 2026', size: 80, color: C.white,  weight: '900' },
      { text: 'è un\'altra cosa.',     size: 80, color: C.orange, weight: '900' },
      { text: '', size: 36 },
      { text: 'Salva questo post ↑',   size: 56, color: C.cyan,   weight: '700' },
      { text: 'Seguimi per altri',     size: 42, color: 'rgba(255,255,255,0.5)', weight: '400' },
      { text: 'contenuti su RN.',      size: 42, color: 'rgba(255,255,255,0.5)', weight: '400' },
    ],
    dots: [
      { x: 100,  y: 100,  r: 40, color: 'rgba(232,168,56,0.25)' },
      { x: 1100, y: 100,  r: 24, color: 'rgba(0,212,255,0.25)'  },
      { x: 100,  y: 1100, r: 20, color: 'rgba(0,212,255,0.2)'   },
      { x: 1100, y: 1100, r: 50, color: 'rgba(232,168,56,0.2)'  },
      { x: 600,  y: 80,   r: 12, color: 'rgba(255,255,255,0.15)'},
    ],
    arrow: false,
  },

];

// =============================================================================
// HELPERS
// =============================================================================

function setFont(ctx, weight, size) {
  ctx.font = `${weight} ${size}px SFR`;
}

function drawAuthor(ctx, onDark) {
  setFont(ctx, '700', 28);
  ctx.textAlign    = 'center';
  ctx.textBaseline = 'top';
  ctx.fillStyle    = onDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.3)';
  ctx.fillText(AUTHOR, W / 2, 36);
}

function drawArrow(ctx, onDark) {
  setFont(ctx, '900', 52);
  ctx.textAlign    = 'right';
  ctx.textBaseline = 'bottom';
  ctx.fillStyle    = onDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.18)';
  ctx.fillText('→', W - 52, H - 44);
}

function drawDots(ctx, dots) {
  for (const d of (dots || [])) {
    ctx.fillStyle = d.color;
    ctx.beginPath();
    ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
    ctx.fill();
  }
}

function wrapText(ctx, text, maxW) {
  const words = text.split(' ');
  const lines = [];
  let cur = '';
  for (const w of words) {
    const test = cur ? `${cur} ${w}` : w;
    if (ctx.measureText(test).width <= maxW) { cur = test; }
    else { if (cur) lines.push(cur); cur = w; }
  }
  if (cur) lines.push(cur);
  return lines;
}

function measureBlock(ctx, lines, maxW) {
  let h = 0;
  for (const ln of lines) {
    if (!ln.text) { h += (ln.size || 24) * 0.7; continue; }
    setFont(ctx, ln.weight || '900', ln.size);
    const wrapped = wrapText(ctx, ln.text, maxW);
    h += wrapped.length * ln.size * 1.18;
  }
  return h;
}

// Disegna blocco centrato, con marker highlight opzionale
function drawBlock(ctx, lines, startY, maxW, align = 'center') {
  let y = startY;
  const xBase = align === 'center' ? W / 2 : (W - maxW) / 2;

  for (const ln of lines) {
    if (!ln.text) { y += (ln.size || 24) * 0.7; continue; }
    setFont(ctx, ln.weight || '900', ln.size);
    ctx.textAlign    = align === 'center' ? 'center' : 'left';
    ctx.textBaseline = 'top';

    const wrapped = wrapText(ctx, ln.text, maxW);
    for (const wl of wrapped) {
      const tw = ctx.measureText(wl).width;
      const lx = align === 'center' ? W / 2 - tw / 2 : xBase;

      // marker highlight (rettangolo colorato dietro il testo)
      if (ln.marker) {
        const mColor = ln.markerColor || 'rgba(0,212,255,0.25)';
        const pad    = { x: 16, y: 6 };
        ctx.fillStyle = mColor;
        ctx.beginPath();
        const mr = 8;
        const mx = lx - pad.x, my = y - pad.y;
        const mw = tw + pad.x * 2, mh = ln.size + pad.y * 2;
        ctx.moveTo(mx + mr, my);
        ctx.lineTo(mx + mw - mr, my);
        ctx.arcTo(mx + mw, my, mx + mw, my + mr, mr);
        ctx.lineTo(mx + mw, my + mh - mr);
        ctx.arcTo(mx + mw, my + mh, mx + mw - mr, my + mh, mr);
        ctx.lineTo(mx + mr, my + mh);
        ctx.arcTo(mx, my + mh, mx, my + mh - mr, mr);
        ctx.lineTo(mx, my + mr);
        ctx.arcTo(mx, my, mx + mr, my, mr);
        ctx.closePath();
        ctx.fill();
      }

      ctx.fillStyle = ln.color || C.white;
      if (align === 'center') ctx.fillText(wl, W / 2, y);
      else ctx.fillText(wl, xBase, y);

      y += ln.size * 1.18;
    }
  }
  return y;
}

// Pill badge centrata
function drawBadge(ctx, badge, y) {
  setFont(ctx, '900', 42);
  ctx.textAlign    = 'center';
  ctx.textBaseline = 'middle';
  const tw  = ctx.measureText(badge.text).width;
  const ph  = 54, pw = tw + 56, r = ph / 2;
  const rx  = (W - pw) / 2, ry = y;

  ctx.fillStyle = badge.bg;
  ctx.beginPath();
  ctx.moveTo(rx + r, ry);
  ctx.arcTo(rx + pw, ry, rx + pw, ry + ph, r);
  ctx.arcTo(rx + pw, ry + ph, rx, ry + ph, r);
  ctx.arcTo(rx, ry + ph, rx, ry, r);
  ctx.arcTo(rx, ry, rx + pw, ry, r);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = badge.color;
  ctx.fillText(badge.text, W / 2, ry + ph / 2);
  return ry + ph + 44;
}

// Speech bubble
function drawBubble(ctx, bW, bH, cx, cy) {
  const pad = 64;
  const w = bW + pad * 2, h = bH + pad * 2;
  const x = cx - w / 2, y = cy - h / 2;
  const r = 44, tH = 44, tX = x + r + 24;

  ctx.fillStyle = C.white;
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(tX + 56, y + h);
  ctx.lineTo(tX, y + h + tH);
  ctx.lineTo(tX - 8, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
  ctx.fill();
  return { x, y, w, h };
}

// Watermark (testo enorme semitrasparente)
function drawWatermark(ctx, wm) {
  if (!wm) return;
  setFont(ctx, '900', wm.size);
  ctx.textAlign    = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle    = wm.color;
  ctx.fillText(wm.text, W / 2, H / 2);
}

// =============================================================================
// RENDERERS
// =============================================================================

function renderGraphic(slide) {
  const canvas = createCanvas(W, H);
  const ctx    = canvas.getContext('2d');
  ctx.fillStyle = slide.bg || C.black;
  ctx.fillRect(0, 0, W, H);

  drawWatermark(ctx, slide.watermark);
  drawDots(ctx, slide.dots);
  drawAuthor(ctx, slide.bg === C.black || !slide.bg);

  const maxW   = W - 140;
  const blockH = measureBlock(ctx, slide.lines, maxW);
  const startY = (H - blockH) / 2;
  drawBlock(ctx, slide.lines, startY, maxW);

  if (slide.arrow) drawArrow(ctx, true);
  return canvas;
}

function renderWhite(slide) {
  const canvas = createCanvas(W, H);
  const ctx    = canvas.getContext('2d');
  ctx.fillStyle = C.white;
  ctx.fillRect(0, 0, W, H);
  drawAuthor(ctx, false);

  const maxW   = W - 120;
  const badgeH = slide.badge ? 54 + 44 : 0;
  const blockH = measureBlock(ctx, slide.lines, maxW);
  let y = (H - badgeH - blockH) / 2;

  if (slide.badge) y = drawBadge(ctx, slide.badge, y);
  drawBlock(ctx, slide.lines, y, maxW);

  if (slide.arrow) drawArrow(ctx, false);
  return canvas;
}

function renderAccent(slide) {
  const canvas = createCanvas(W, H);
  const ctx    = canvas.getContext('2d');
  ctx.fillStyle = slide.bg;
  ctx.fillRect(0, 0, W, H);

  drawDots(ctx, slide.dots);
  // author su accent: usa testo scuro
  setFont(ctx, '700', 28);
  ctx.textAlign = 'center'; ctx.textBaseline = 'top';
  ctx.fillStyle = 'rgba(0,0,0,0.4)';
  ctx.fillText(AUTHOR, W / 2, 36);

  const maxW   = W - 140;
  const blockH = measureBlock(ctx, slide.lines, maxW);
  const startY = (H - blockH) / 2;
  drawBlock(ctx, slide.lines, startY, maxW);

  if (slide.arrow) {
    setFont(ctx, '900', 52);
    ctx.textAlign = 'right'; ctx.textBaseline = 'bottom';
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    ctx.fillText('→', W - 52, H - 44);
  }
  return canvas;
}

function renderSplit(slide) {
  const canvas = createCanvas(W, H);
  const ctx    = canvas.getContext('2d');
  const half   = W / 2;

  // Sfondo
  ctx.fillStyle = slide.left.bg;
  ctx.fillRect(0, 0, half, H);
  ctx.fillStyle = slide.right.bg;
  ctx.fillRect(half, 0, half, H);

  // Linea divisoria
  ctx.strokeStyle = 'rgba(128,128,128,0.3)';
  ctx.lineWidth   = 2;
  ctx.beginPath();
  ctx.moveTo(half, 0);
  ctx.lineTo(half, H);
  ctx.stroke();

  // Label PRIMA / ORA
  const drawLabel = (text, color, x, isLeft) => {
    setFont(ctx, '900', 36);
    ctx.textAlign    = 'center';
    ctx.textBaseline = 'top';
    ctx.fillStyle    = color;
    ctx.fillText(text, x, 70);
    // underline
    const tw = ctx.measureText(text).width;
    ctx.fillRect(x - tw / 2, 110, tw, 4);
  };
  drawLabel(slide.left.label.text,  slide.left.label.color,  half / 2,        true);
  drawLabel(slide.right.label.text, slide.right.label.color, half + half / 2, false);

  // Testo sinistro
  const maxHalf = half - 60;
  const blockLH = measureBlock(ctx, slide.left.lines, maxHalf);
  let   yL      = (H - blockLH) / 2 + 20;
  for (const ln of slide.left.lines) {
    if (!ln.text) { yL += (ln.size || 24) * 0.7; continue; }
    setFont(ctx, ln.weight || '900', ln.size);
    ctx.textAlign = 'center'; ctx.textBaseline = 'top';
    ctx.fillStyle = ln.color;
    const wrapped = wrapText(ctx, ln.text, maxHalf);
    for (const wl of wrapped) {
      ctx.fillText(wl, half / 2, yL);
      yL += ln.size * 1.18;
    }
  }

  // Testo destro
  const blockRH = measureBlock(ctx, slide.right.lines, maxHalf);
  let   yR      = (H - blockRH) / 2 + 20;
  for (const ln of slide.right.lines) {
    if (!ln.text) { yR += (ln.size || 24) * 0.7; continue; }
    setFont(ctx, ln.weight || '900', ln.size);
    ctx.textAlign = 'center'; ctx.textBaseline = 'top';
    ctx.fillStyle = ln.color;
    const wrapped = wrapText(ctx, ln.text, maxHalf);
    for (const wl of wrapped) {
      ctx.fillText(wl, half + half / 2, yR);
      yR += ln.size * 1.18;
    }
  }

  // Author e arrow
  setFont(ctx, '700', 26);
  ctx.textAlign = 'center'; ctx.textBaseline = 'top';
  ctx.fillStyle = 'rgba(128,128,128,0.5)';
  ctx.fillText(AUTHOR, W / 2, 36);
  if (slide.arrow) drawArrow(ctx, false);
  return canvas;
}

function renderBubble(slide) {
  const canvas = createCanvas(W, H);
  const ctx    = canvas.getContext('2d');
  ctx.fillStyle = C.black;
  ctx.fillRect(0, 0, W, H);
  drawAuthor(ctx, true);

  const maxW   = W - 200;
  const blockH = measureBlock(ctx, slide.lines, maxW);
  const cx     = W / 2;
  const cy     = H / 2 - 20;
  const { x, y, w, h } = drawBubble(ctx, maxW, blockH, cx, cy);

  // Pallino accent
  if (slide.bubbleAccent) {
    ctx.fillStyle = slide.bubbleAccent;
    ctx.beginPath();
    ctx.arc(x + w * 0.76, y + h + 44, 26, 0, Math.PI * 2);
    ctx.fill();
  }

  // Testo dentro bubble (centrare v nella bubble)
  const pad    = 64;
  const innerH = measureBlock(ctx, slide.lines, maxW);
  const startY = y + pad + (blockH - innerH) / 2;

  // Override: usa drawBlock centrato nella bubble
  let ty = y + pad;
  for (const ln of slide.lines) {
    if (!ln.text) { ty += (ln.size || 24) * 0.7; continue; }
    setFont(ctx, ln.weight || '900', ln.size);
    ctx.textAlign = 'center'; ctx.textBaseline = 'top';

    const wrapped = wrapText(ctx, ln.text, maxW);
    for (const wl of wrapped) {
      if (ln.marker) {
        const tw  = ctx.measureText(wl).width;
        const lx  = cx - tw / 2;
        const mColor = ln.markerColor || 'rgba(232,168,56,0.25)';
        ctx.fillStyle = mColor;
        ctx.fillRect(lx - 12, ty - 4, tw + 24, ln.size + 8);
      }
      ctx.fillStyle = ln.color || C.dark;
      ctx.fillText(wl, cx, ty);
      ty += ln.size * 1.18;
    }
  }

  if (slide.arrow) drawArrow(ctx, true);
  return canvas;
}

// =============================================================================
// MAIN
// =============================================================================

const RENDERERS = {
  graphic: renderGraphic,
  white:   renderWhite,
  accent:  renderAccent,
  split:   renderSplit,
  bubble:  renderBubble,
};

async function generate() {
  console.log(`Generando ${SLIDES.length} slide...`);
  SLIDES.forEach((slide, i) => {
    const num    = String(i + 1).padStart(2, '0');
    const render = RENDERERS[slide.type];
    if (!render) throw new Error(`Tipo sconosciuto: ${slide.type}`);
    const canvas = render(slide);
    const out    = path.join(OUTPUT_DIR, `slide-${num}.png`);
    fs.writeFileSync(out, canvas.toBuffer('image/png'));
    console.log(`  ✓ slide-${num}.png (${slide.type})`);
  });
  console.log(`\n✅ ${SLIDES.length} slide → ${OUTPUT_DIR}`);
}

generate().catch(e => { console.error('❌', e.message); process.exit(1); });

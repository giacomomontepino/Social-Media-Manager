const { createCanvas, registerFont } = require('canvas');
const fs = require('fs');
const path = require('path');

const FONT_BLACK = '/Library/Fonts/SF-Pro-Rounded-Black.otf';
const FONT_BOLD  = '/Library/Fonts/SF-Pro-Rounded-Bold.otf';
const FONT_REG   = '/Library/Fonts/SF-Pro-Rounded-Regular.otf';

if (fs.existsSync(FONT_BLACK)) registerFont(FONT_BLACK, { family: 'SFRounded', weight: '900' });
if (fs.existsSync(FONT_BOLD))  registerFont(FONT_BOLD,  { family: 'SFRounded', weight: '700' });
if (fs.existsSync(FONT_REG))   registerFont(FONT_REG,   { family: 'SFRounded', weight: '400' });

const W = 1080;
const H = 1080;
const OUT = path.join(__dirname, '../../../output/threads/visual.png');

// Warm personal palette (storytelling post)
const BG      = '#F5F0E8';
const INK     = '#1A1A1A';
const MUTED   = '#888888';
const ACCENT  = '#E8A838';

function wrapText(ctx, text, maxWidth) {
  const words = text.split(' ');
  const lines = [];
  let current = '';
  for (const word of words) {
    const test = current ? current + ' ' + word : word;
    if (ctx.measureText(test).width > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);
  return lines;
}

const canvas = createCanvas(W, H);
const ctx = canvas.getContext('2d');

// Background
ctx.fillStyle = BG;
ctx.fillRect(0, 0, W, H);

// Accent top stripe
ctx.fillStyle = ACCENT;
ctx.fillRect(0, 0, W, 8);

// Terminal window decoration (top left)
const termX = 80;
const termY = 80;
const termW = 320;
const termH = 56;
ctx.fillStyle = INK;
ctx.globalAlpha = 0.06;
ctx.beginPath();
ctx.roundRect(termX, termY, termW, termH, 10);
ctx.fill();
ctx.globalAlpha = 1;

// Terminal dots
const dotColors = ['#FF5F56', '#FFBD2E', '#27C93F'];
dotColors.forEach((c, i) => {
  ctx.fillStyle = c;
  ctx.beginPath();
  ctx.arc(termX + 20 + i * 22, termY + termH / 2, 7, 0, Math.PI * 2);
  ctx.fill();
});

// Terminal text
ctx.font = '400 22px SFRounded';
ctx.fillStyle = INK;
ctx.globalAlpha = 0.5;
ctx.textAlign = 'left';
ctx.textBaseline = 'middle';
ctx.fillText('$ /smm', termX + 88, termY + termH / 2);
ctx.globalAlpha = 1;

// Main headline — big, left-aligned, vertically centered-ish
const textX = 80;
const textMaxW = W - 160;

ctx.font = '900 72px SFRounded';
ctx.fillStyle = INK;
ctx.textBaseline = 'top';

const headline = 'Ho smesso di usare Hootsuite.';
const headLines = wrapText(ctx, headline, textMaxW);
const headLineH = 82;
const headTotalH = headLines.length * headLineH;

// Subtext
ctx.font = '400 34px SFRounded';
const sub = 'Ho costruito il mio SMM\ncon Claude Code.';
const subLines = sub.split('\n');
const subLineH = 46;
const subTotalH = subLines.length * subLineH;

const gap1 = 32;
const gap2 = 48;

// Cursor blink decoration
const cursorW = 6;
const cursorH = 72;

const totalContentH = headTotalH + gap1 + subTotalH;
const startY = (H - totalContentH) / 2 - 20;

// Draw headline
let y = startY;
headLines.forEach(line => {
  ctx.font = '900 72px SFRounded';
  ctx.fillStyle = INK;
  ctx.fillText(line, textX, y);
  y += headLineH;
});

// Accent underline on last headline word
ctx.font = '900 72px SFRounded';
const lastLine = headLines[headLines.length - 1];
const lastLineW = ctx.measureText(lastLine).width;
ctx.fillStyle = ACCENT;
ctx.globalAlpha = 0.6;
ctx.fillRect(textX, startY + headTotalH - 6, Math.min(lastLineW, 200), 5);
ctx.globalAlpha = 1;

y += gap1;

// Draw subtext
subLines.forEach(line => {
  ctx.font = '400 34px SFRounded';
  ctx.fillStyle = MUTED;
  ctx.fillText(line, textX, y);
  y += subLineH;
});

// Handle
ctx.font = '400 26px SFRounded';
ctx.fillStyle = MUTED;
ctx.textAlign = 'left';
ctx.textBaseline = 'bottom';
ctx.fillText('Giacomo Montepino', textX, H - 60);

// Bottom accent dot
ctx.fillStyle = ACCENT;
ctx.beginPath();
ctx.arc(W - 80, H - 60, 10, 0, Math.PI * 2);
ctx.fill();

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, canvas.toBuffer('image/png'));
console.log('Visual Threads salvato:', OUT);

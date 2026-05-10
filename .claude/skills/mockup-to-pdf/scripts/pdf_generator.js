#!/usr/bin/env node
/**
 * pdf_generator.js — Genera PDF proposta mockup professionale con pdfkit
 * Uso:
 *   node pdf_generator.js --dry-run
 *   node pdf_generator.js --content content.json --output proposta_cliente.pdf
 */

import { createWriteStream, readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import PDFDocument from 'pdfkit';

const __dirname = dirname(fileURLToPath(import.meta.url));

function hexToRgb(hex) {
  const h = hex.replace('#', '');
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

function generatePdf(content, outputPath) {
  return new Promise((resolve_p, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 56 });
    const stream = createWriteStream(outputPath);
    doc.pipe(stream);

    const brandHex = content.brand_color ?? '#0A66C2';
    const [br, bg, bb] = hexToRgb(brandHex);
    const today = new Date().toLocaleDateString('it-IT');

    const W = 595 - 112; // A4 width minus margins

    function hr() {
      doc.moveDown(0.3).moveTo(56, doc.y).lineTo(56 + W, doc.y).strokeColor(brandHex).lineWidth(1).stroke().moveDown(0.3);
    }

    function h1(text) {
      doc.fontSize(28).fillColor(brandHex).font('Helvetica-Bold').text(text).moveDown(0.3);
    }

    function h2(text) {
      doc.fontSize(16).fillColor(brandHex).font('Helvetica-Bold').text(text).moveDown(0.2);
      hr();
    }

    function body(text) {
      doc.fontSize(11).fillColor('#000000').font('Helvetica').text(text, { lineGap: 4 }).moveDown(0.4);
    }

    function bold(text) {
      doc.fontSize(11).fillColor('#000000').font('Helvetica-Bold').text(text).moveDown(0.2);
    }

    function small(text) {
      doc.fontSize(9).fillColor('#888888').font('Helvetica').text(text).moveDown(0.2);
    }

    // COVER
    doc.moveDown(6);
    h1(content.business_name);
    doc.fontSize(14).fillColor('#888888').font('Helvetica').text(`Il tuo concept app — realizzato esclusivamente per ${content.business_name}`).moveDown(0.5);
    doc.moveTo(56, doc.y).lineTo(56 + W, doc.y).strokeColor(brandHex).lineWidth(2).stroke().moveDown(0.5);
    body('Giacomo Montepino — Mobile Developer & AI Expert');
    small(`Data: ${today}`);
    doc.addPage();

    // SEZIONE 2 — IL TUO BUSINESS OGGI
    h2('Il Tuo Business Oggi');
    body(content.business_today ?? '');
    doc.addPage();

    // SEZIONE 3 — LA TUA APP
    h2('La Tua App');
    body(content.app_description ?? '');
    doc.moveDown(0.3);
    for (const func of content.core_functions ?? []) {
      bold(func.title);
      body(func.description);
    }
    doc.addPage();

    // SEZIONE 4 — LE SCHERMATE
    h2('Le Schermate');
    for (const screen of content.screens ?? []) {
      bold(screen.title);
      if (screen.description) body(screen.description);
      if (screen.value) {
        doc.fontSize(10).fillColor(brandHex).font('Helvetica-Bold').text(`Valore: ${screen.value}`).moveDown(0.2);
      }
      if (screen.image_path && existsSync(screen.image_path)) {
        doc.image(screen.image_path, { width: 283 }).moveDown(0.3);
      }
      doc.moveDown(0.3);
    }
    doc.addPage();

    // SEZIONE 5 — COME PORTA CLIENTI
    h2('Come Porta Clienti');
    for (const strategy of content.acquisition_strategies ?? []) {
      bold(strategy.title);
      body(strategy.description);
      if (strategy.result) {
        doc.fontSize(10).fillColor('#2e7d32').font('Helvetica').text(`→ ${strategy.result}`).moveDown(0.2);
      }
      doc.moveDown(0.2);
    }
    doc.addPage();

    // SEZIONE 6 — ROADMAP
    h2('Roadmap');
    const phases = [
      ['1 — Brief & Definizione', '1 settimana', 'Raccolta requisiti, priorità funzioni'],
      ['2 — Design & Prototipo', '2 settimane', 'UI/UX, flussi, prototipo interattivo'],
      ['3 — Sviluppo', '3-4 settimane', 'Sviluppo React Native, test su device'],
      ['4 — Test & Lancio', '1 settimana', 'QA, deploy App Store / Play Store'],
    ];
    // Header
    doc.rect(56, doc.y, W, 20).fill(brandHex);
    const headerY = doc.y - 20;
    doc.fillColor('#ffffff').fontSize(10).font('Helvetica-Bold');
    doc.text('Fase', 56 + 4, headerY + 5, { width: 160 });
    doc.text('Durata', 56 + 164, headerY + 5, { width: 90 });
    doc.text('Descrizione', 56 + 254, headerY + 5, { width: W - 254 });
    doc.moveDown(0.1);
    // Rows
    phases.forEach((row, idx) => {
      const rowY = doc.y;
      const bg2 = idx % 2 === 0 ? '#ffffff' : '#f5f5f5';
      doc.rect(56, rowY, W, 22).fill(bg2);
      doc.fillColor('#000000').fontSize(10).font('Helvetica');
      doc.text(row[0], 56 + 4, rowY + 6, { width: 156 });
      doc.text(row[1], 56 + 164, rowY + 6, { width: 86 });
      doc.text(row[2], 56 + 254, rowY + 6, { width: W - 258 });
      doc.y = rowY + 22;
    });
    doc.moveDown(0.5);
    doc.addPage();

    // SEZIONE 7 — PROSSIMI PASSI
    h2('Prossimi Passi');
    body(content.closing ?? 'Prenota una call gratuita di 30 minuti per parlare del concept.');
    doc.moveDown(0.5);
    bold('Giacomo Montepino');
    body('giacomomontepino75@gmail.com');

    doc.end();
    stream.on('finish', () => {
      console.log(`✓ PDF generato: ${outputPath}`);
      resolve_p(outputPath);
    });
    stream.on('error', reject);
  });
}

function dryRun() {
  console.log('✓ pdfkit installato — dry run OK');
}

// CLI
const args = process.argv.slice(2);
const get = (flag) => { const i = args.indexOf(flag); return i !== -1 ? args[i + 1] : null; };

if (args.includes('--dry-run')) {
  dryRun();
} else if (get('--content')) {
  const content = JSON.parse(readFileSync(get('--content'), 'utf8'));
  const output = get('--output') ?? 'proposta.pdf';
  generatePdf(content, output).catch(e => { console.error(e.message); process.exit(1); });
} else {
  console.log('Uso: node pdf_generator.js --dry-run | --content content.json [--output proposta.pdf]');
}

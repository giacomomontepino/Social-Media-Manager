#!/usr/bin/env python3
"""
pdf_generator.py — Genera PDF proposta mockup professionale con reportlab
Uso:
  pdf_generator.py --content content.json --output proposta_cliente.pdf
  pdf_generator.py --dry-run
Content JSON format: vedere esempio in SKILL.md
"""

import argparse
import json
import sys
from datetime import date
from pathlib import Path


def _check_deps():
    try:
        from reportlab.lib.pagesizes import A4
        from reportlab.platypus import SimpleDocTemplate
        return True
    except ImportError:
        print("❌ reportlab non installato. Esegui: pip install reportlab Pillow", file=sys.stderr)
        sys.exit(1)


def generate_pdf(content, output_path):
    from reportlab.lib import colors
    from reportlab.lib.pagesizes import A4
    from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
    from reportlab.lib.units import cm
    from reportlab.platypus import (
        HRFlowable, Image, PageBreak, Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle,
    )

    doc = SimpleDocTemplate(
        output_path,
        pagesize=A4,
        rightMargin=2 * cm,
        leftMargin=2 * cm,
        topMargin=2 * cm,
        bottomMargin=2 * cm,
    )

    styles = getSampleStyleSheet()
    brand_color = colors.HexColor(content.get("brand_color", "#0A66C2"))

    style_title = ParagraphStyle("Title", parent=styles["Title"], textColor=brand_color, fontSize=28, spaceAfter=12)
    style_subtitle = ParagraphStyle("Subtitle", parent=styles["Normal"], fontSize=14, textColor=colors.gray, spaceAfter=8)
    style_h2 = ParagraphStyle("H2", parent=styles["Heading2"], textColor=brand_color, fontSize=16, spaceAfter=8)
    style_body = ParagraphStyle("Body", parent=styles["Normal"], fontSize=11, leading=16, spaceAfter=6)
    style_bold = ParagraphStyle("Bold", parent=styles["Normal"], fontSize=11, fontName="Helvetica-Bold", spaceAfter=4)
    style_small = ParagraphStyle("Small", parent=styles["Normal"], fontSize=9, textColor=colors.gray)

    story = []

    # COVER
    story.append(Spacer(1, 4 * cm))
    story.append(Paragraph(content["business_name"], style_title))
    story.append(Paragraph(f"Il tuo concept app — realizzato esclusivamente per {content['business_name']}", style_subtitle))
    story.append(Spacer(1, 1 * cm))
    story.append(HRFlowable(width="100%", thickness=2, color=brand_color))
    story.append(Spacer(1, 0.5 * cm))
    story.append(Paragraph("Giacomo Montepino — Mobile Developer & AI Expert", style_body))
    story.append(Paragraph(f"Data: {date.today().strftime('%d/%m/%Y')}", style_small))
    story.append(PageBreak())

    # SEZIONE 2 — IL TUO BUSINESS OGGI
    story.append(Paragraph("Il Tuo Business Oggi", style_h2))
    story.append(HRFlowable(width="100%", thickness=1, color=brand_color))
    story.append(Spacer(1, 0.3 * cm))
    story.append(Paragraph(content.get("business_today", ""), style_body))
    story.append(PageBreak())

    # SEZIONE 3 — LA TUA APP
    story.append(Paragraph("La Tua App", style_h2))
    story.append(HRFlowable(width="100%", thickness=1, color=brand_color))
    story.append(Spacer(1, 0.3 * cm))
    story.append(Paragraph(content.get("app_description", ""), style_body))
    story.append(Spacer(1, 0.5 * cm))
    for func in content.get("core_functions", []):
        story.append(Paragraph(func["title"], style_bold))
        story.append(Paragraph(func["description"], style_body))
        story.append(Spacer(1, 0.2 * cm))
    story.append(PageBreak())

    # SEZIONE 4 — LE SCHERMATE
    story.append(Paragraph("Le Schermate", style_h2))
    story.append(HRFlowable(width="100%", thickness=1, color=brand_color))
    story.append(Spacer(1, 0.3 * cm))
    for screen in content.get("screens", []):
        story.append(Paragraph(screen["title"], style_bold))
        story.append(Paragraph(screen.get("description", ""), style_body))
        if screen.get("value"):
            story.append(Paragraph(f"Valore: {screen['value']}", ParagraphStyle("Value", parent=styles["Normal"], fontSize=10, textColor=brand_color, fontName="Helvetica-Bold")))
        if screen.get("image_path") and Path(screen["image_path"]).exists():
            story.append(Image(screen["image_path"], width=10 * cm, height=6 * cm))
        story.append(Spacer(1, 0.5 * cm))
    story.append(PageBreak())

    # SEZIONE 5 — STRATEGIA ACQUISIZIONE
    story.append(Paragraph("Come Porta Clienti", style_h2))
    story.append(HRFlowable(width="100%", thickness=1, color=brand_color))
    story.append(Spacer(1, 0.3 * cm))
    for strategy in content.get("acquisition_strategies", []):
        story.append(Paragraph(strategy["title"], style_bold))
        story.append(Paragraph(strategy["description"], style_body))
        if strategy.get("result"):
            story.append(Paragraph(f"→ {strategy['result']}", ParagraphStyle("Result", parent=styles["Normal"], fontSize=10, textColor=colors.green)))
        story.append(Spacer(1, 0.3 * cm))
    story.append(PageBreak())

    # SEZIONE 6 — ROADMAP
    story.append(Paragraph("Roadmap", style_h2))
    story.append(HRFlowable(width="100%", thickness=1, color=brand_color))
    story.append(Spacer(1, 0.3 * cm))
    phases = [
        ["Fase", "Durata", "Descrizione"],
        ["1 — Brief & Definizione", "1 settimana", "Raccolta requisiti, priorità funzioni"],
        ["2 — Design & Prototipo", "2 settimane", "UI/UX, flussi, prototipo interattivo"],
        ["3 — Sviluppo", "3-4 settimane", "Sviluppo React Native, test su device"],
        ["4 — Test & Lancio", "1 settimana", "QA, deploy App Store / Play Store"],
    ]
    table = Table(phases, colWidths=[5 * cm, 3 * cm, 9 * cm])
    table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), brand_color),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.lightgrey),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#F5F5F5")]),
        ("FONTSIZE", (0, 0), (-1, -1), 10),
        ("PADDING", (0, 0), (-1, -1), 6),
    ]))
    story.append(table)
    story.append(PageBreak())

    # SEZIONE 7 — CHIUSURA
    story.append(Paragraph("Prossimi Passi", style_h2))
    story.append(HRFlowable(width="100%", thickness=1, color=brand_color))
    story.append(Spacer(1, 0.3 * cm))
    story.append(Paragraph(content.get("closing", "Prenota una call gratuita di 30 minuti per parlare del concept."), style_body))
    story.append(Spacer(1, 0.5 * cm))
    story.append(Paragraph("Giacomo Montepino", style_bold))
    story.append(Paragraph("giacomomontepino75@gmail.com", style_body))

    doc.build(story)
    print(f"✓ PDF generato: {output_path}")
    return output_path


def dry_run():
    _check_deps()
    print("✓ reportlab installato — dry run OK")


if __name__ == "__main__":
    _check_deps()
    parser = argparse.ArgumentParser(description="PDF Generator")
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--content", type=str, help="Path al file JSON con i contenuti")
    parser.add_argument("--output", type=str, default="proposta.pdf")
    args = parser.parse_args()

    if args.dry_run:
        dry_run()
    elif args.content:
        with open(args.content, "r", encoding="utf-8") as f:
            content = json.load(f)
        generate_pdf(content, args.output)
    else:
        parser.print_help()

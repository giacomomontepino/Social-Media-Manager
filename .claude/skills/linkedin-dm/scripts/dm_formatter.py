#!/usr/bin/env python3
"""
linkedin_dm_formatter.py — Formatta, valida e salva DM freddi LinkedIn
Produce 2 varianti: Diretta (profilo business/numeri) e Narrativa (profilo personale/valori)
Uso:
  dm_formatter.py --variant-a "testo diretto" --variant-b "testo narrativo" --lead "Mario Rossi"
  dm_formatter.py --variant-a "testo" --variant-b "testo" --lead "Mario" --copy a
"""

import argparse
import sys
from datetime import date
from pathlib import Path

PLANS_DIR = Path(__file__).parents[4] / "plans"
MIN_WORDS, MAX_WORDS = 150, 180


def validate(text, variant_label):
    words = len(text.split())
    if words < MIN_WORDS:
        print(f"⚠️  Variante {variant_label}: {words} parole — troppo corta (minimo {MIN_WORDS})")
    elif words > MAX_WORDS:
        print(f"⚠️  Variante {variant_label}: {words} parole — troppo lunga (massimo {MAX_WORDS})")
    else:
        print(f"✓ Variante {variant_label}: {words} parole — OK")
    return words


def save(text_a, text_b, lead_name):
    PLANS_DIR.mkdir(parents=True, exist_ok=True)
    safe = lead_name.lower().replace(" ", "_")
    path = PLANS_DIR / f"linkedin_dm_{safe}_{date.today().isoformat()}.txt"
    content = f"=== VARIANTE A — Diretta ===\n\n{text_a}\n\n=== VARIANTE B — Narrativa ===\n\n{text_b}"
    path.write_text(content, encoding="utf-8")
    print(f"✓ Salvato: {path}")
    return str(path)


def copy_to_clipboard(text):
    try:
        import pyperclip
        pyperclip.copy(text)
        print("✓ Copiato negli appunti")
    except ImportError:
        print("⚠️  pyperclip non installato: pip install pyperclip", file=sys.stderr)


def main(text_a, text_b, lead_name, copy_variant=None):
    print(f"\n=== DM LinkedIn — {lead_name} ===")
    print(f"\n--- Variante A (Diretta) ---\n{text_a}")
    print(f"\n--- Variante B (Narrativa) ---\n{text_b}")
    print()
    validate(text_a, "A")
    validate(text_b, "B")
    save(text_a, text_b, lead_name)
    if copy_variant == "a":
        copy_to_clipboard(text_a)
    elif copy_variant == "b":
        copy_to_clipboard(text_b)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="LinkedIn DM Formatter")
    parser.add_argument("--variant-a", required=True)
    parser.add_argument("--variant-b", required=True)
    parser.add_argument("--lead", required=True)
    parser.add_argument("--copy", choices=["a", "b"])
    args = parser.parse_args()
    main(args.variant_a, args.variant_b, args.lead, copy_variant=args.copy)

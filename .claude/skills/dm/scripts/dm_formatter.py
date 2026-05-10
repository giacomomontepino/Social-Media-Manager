#!/usr/bin/env python3
"""
dm_formatter.py — Formatta e salva DM freddi
Uso:
  dm_formatter.py --text "testo dm" --platform linkedin --lead "Mario Rossi"
  dm_formatter.py --text "testo dm" --platform x --lead "Mario Rossi" --copy
"""

import argparse
import sys
from datetime import date
from pathlib import Path

PLANS_DIR = Path(__file__).parents[4] / "plans"
WORD_LIMITS = {"linkedin": (150, 180), "x": (100, 140), "threads": (100, 130)}


def validate_length(text, platform):
    words = len(text.split())
    lo, hi = WORD_LIMITS.get(platform.lower(), (0, 9999))
    if words < lo:
        print(f"⚠️  DM troppo corto: {words} parole (minimo {lo} per {platform})")
    elif words > hi:
        print(f"⚠️  DM troppo lungo: {words} parole (massimo {hi} per {platform})")
    else:
        print(f"✓ Lunghezza OK: {words} parole ({lo}-{hi} per {platform})")
    return words


def save_dm(text, platform, lead_name):
    PLANS_DIR.mkdir(parents=True, exist_ok=True)
    safe_name = lead_name.lower().replace(" ", "_")
    filename = f"dm_{platform}_{safe_name}_{date.today().isoformat()}.txt"
    path = PLANS_DIR / filename
    path.write_text(text, encoding="utf-8")
    print(f"✓ DM salvato: {path}")
    return str(path)


def copy_to_clipboard(text):
    try:
        import pyperclip
        pyperclip.copy(text)
        print("✓ DM copiato negli appunti")
    except ImportError:
        print("⚠️  pyperclip non installato. Esegui: pip install pyperclip", file=sys.stderr)
    except Exception as e:
        print(f"⚠️  Impossibile copiare: {e}", file=sys.stderr)


def main(text, platform, lead_name, copy=False):
    print(f"\n--- DM {platform.upper()} — {lead_name} ---")
    print(text)
    print("---")
    validate_length(text, platform)
    save_dm(text, platform, lead_name)
    if copy:
        copy_to_clipboard(text)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="DM Formatter")
    parser.add_argument("--text", required=True, help="Testo del DM")
    parser.add_argument("--platform", required=True, choices=["linkedin", "x", "threads"])
    parser.add_argument("--lead", required=True, help="Nome del lead")
    parser.add_argument("--copy", action="store_true", help="Copia negli appunti")
    args = parser.parse_args()
    main(args.text, args.platform, args.lead, copy=args.copy)

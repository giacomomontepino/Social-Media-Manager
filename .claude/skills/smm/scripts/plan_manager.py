#!/usr/bin/env python3
"""
plan_manager.py — Gestisce il file editorial-plan.md
Uso:
  python plan_manager.py --check              Verifica stato piano
  python plan_manager.py --today              Mostra post di oggi
  python plan_manager.py --status DATE PLATFORM STATUS  Aggiorna status
  python plan_manager.py --metrics-check      Giorni da ultima revisione
"""

import argparse
import re
import sys
from datetime import date, datetime
from pathlib import Path

PLAN_PATH = Path(__file__).parents[4] / "plans" / "editorial-plan.md"

STATUS_SYMBOLS = {"scheduled": "⬜", "created": "🟡", "published": "✅"}


def _read_raw():
    if not PLAN_PATH.exists():
        print("❌ Piano non trovato. Lancia /smm per crearlo.", file=sys.stderr)
        sys.exit(1)
    return PLAN_PATH.read_text(encoding="utf-8")


def _parse_frontmatter(raw):
    match = re.match(r"^---\n(.*?)\n---", raw, re.DOTALL)
    if not match:
        return {}
    fm = {}
    for line in match.group(1).splitlines():
        if ":" in line:
            key, _, val = line.partition(":")
            fm[key.strip()] = val.strip()
    return fm


def _parse_table_rows(raw):
    rows = []
    for line in raw.splitlines():
        if line.startswith("|") and not line.startswith("| Date") and "---" not in line:
            parts = [p.strip() for p in line.strip("|").split("|")]
            if len(parts) >= 8:
                rows.append({
                    "date": parts[0],
                    "platform": parts[1],
                    "stage": parts[2],
                    "topic": parts[3],
                    "format": parts[4],
                    "hook": parts[5],
                    "cta": parts[6],
                    "status": parts[7],
                })
    return rows


def check():
    raw = _read_raw()
    fm = _parse_frontmatter(raw)
    rows = _parse_table_rows(raw)
    print(f"✓ Piano trovato: {fm.get('period', 'N/A')}")
    print(f"  Obiettivo: {fm.get('monthly_goal', 'N/A')}")
    print(f"  Post totali: {len(rows)}")
    completed = sum(1 for r in rows if r["status"] == STATUS_SYMBOLS["published"])
    created = sum(1 for r in rows if r["status"] == STATUS_SYMBOLS["created"])
    scheduled = sum(1 for r in rows if r["status"] == STATUS_SYMBOLS["scheduled"])
    print(f"  ✅ Pubblicati: {completed}  🟡 Creati: {created}  ⬜ Da fare: {scheduled}")


def today_posts():
    raw = _read_raw()
    rows = _parse_table_rows(raw)
    today_str = date.today().isoformat()
    results = [r for r in rows if r["date"] == today_str and r["status"] == STATUS_SYMBOLS["scheduled"]]
    if not results:
        print(f"Nessun post schedulato per oggi ({today_str}).")
    else:
        print(f"Post di oggi ({today_str}):")
        for r in results:
            print(f"  • {r['platform']} ({r['stage']}) — {r['topic']} [{r['format']}]")
    return results


def update_status(target_date, platform, new_status):
    raw = _read_raw()
    symbol = STATUS_SYMBOLS.get(new_status)
    if not symbol:
        print(f"❌ Status non valido: {new_status}. Usa: scheduled, created, published", file=sys.stderr)
        sys.exit(1)

    lines = raw.splitlines()
    updated = False
    for i, line in enumerate(lines):
        if line.startswith("|") and target_date in line and platform in line:
            parts = line.split("|")
            if len(parts) >= 9:
                parts[-2] = f" {symbol} "
                lines[i] = "|".join(parts)
                updated = True
                break

    if not updated:
        print(f"⚠️  Riga non trovata per {target_date} / {platform}", file=sys.stderr)
        sys.exit(1)

    PLAN_PATH.write_text("\n".join(lines), encoding="utf-8")
    print(f"✓ Status aggiornato: {target_date} {platform} → {symbol}")


def metrics_check():
    raw = _read_raw()
    fm = _parse_frontmatter(raw)
    last_review = fm.get("last_metrics_review", "")
    if not last_review:
        print("0")
        return
    try:
        last_dt = datetime.fromisoformat(last_review).date()
        days = (date.today() - last_dt).days
        print(str(days))
    except ValueError:
        print("0")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Plan Manager")
    parser.add_argument("--check", action="store_true")
    parser.add_argument("--today", action="store_true")
    parser.add_argument("--status", nargs=3, metavar=("DATE", "PLATFORM", "STATUS"))
    parser.add_argument("--metrics-check", action="store_true")
    args = parser.parse_args()

    if args.check:
        check()
    elif args.today:
        today_posts()
    elif args.status:
        update_status(*args.status)
    elif args.metrics_check:
        metrics_check()
    else:
        parser.print_help()

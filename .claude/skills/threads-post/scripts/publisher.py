#!/usr/bin/env python3
"""
threads_publisher.py — Pubblica post su Threads via Meta Graph API
Uso:
  publisher.py --dry-run                           Testa autenticazione
  publisher.py --text "testo" [--image-url URL]    Pubblica post
"""

import argparse
import os
import sys
import time
from pathlib import Path

import requests
from dotenv import load_dotenv

load_dotenv(Path(__file__).parents[5] / ".env")

ACCESS_TOKEN = os.getenv("THREADS_ACCESS_TOKEN")
USER_ID = os.getenv("THREADS_USER_ID")
API_BASE = "https://graph.threads.net/v1.0"


def _check_credentials():
    if not ACCESS_TOKEN or not USER_ID:
        print("❌ Credenziali Threads mancanti. Compila THREADS_ACCESS_TOKEN e THREADS_USER_ID in .env", file=sys.stderr)
        print("   Guida: .claude/setup/api-credentials.md", file=sys.stderr)
        sys.exit(1)


def dry_run():
    _check_credentials()
    r = requests.get(
        f"{API_BASE}/{USER_ID}",
        params={"fields": "id,username", "access_token": ACCESS_TOKEN},
    )
    if r.status_code == 200:
        data = r.json()
        print(f"✓ Auth OK — dry run completato. Account: @{data.get('username', 'N/A')}")
    else:
        print(f"❌ Auth fallita: {r.status_code} {r.text}", file=sys.stderr)
        sys.exit(1)


def create_media_container(text, image_url=None):
    params = {
        "media_type": "IMAGE" if image_url else "TEXT",
        "text": text,
        "access_token": ACCESS_TOKEN,
    }
    if image_url:
        params["image_url"] = image_url

    r = requests.post(f"{API_BASE}/{USER_ID}/threads", params=params)
    r.raise_for_status()
    container_id = r.json()["id"]
    print(f"✓ Container creato: {container_id}")
    return container_id


def publish_container(container_id):
    # Attendi che il container sia pronto (Media Container può richiedere qualche secondo)
    time.sleep(3)
    r = requests.post(
        f"{API_BASE}/{USER_ID}/threads_publish",
        params={"creation_id": container_id, "access_token": ACCESS_TOKEN},
    )
    r.raise_for_status()
    post_id = r.json()["id"]
    post_url = f"https://www.threads.net/@giacomomontepino/post/{post_id}"
    print(f"✓ Post pubblicato: {post_url}")
    return post_url


def main(text, image_url=None):
    _check_credentials()
    container_id = create_media_container(text, image_url=image_url)
    return publish_container(container_id)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Threads Publisher")
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--text", type=str)
    parser.add_argument("--image-url", type=str)
    args = parser.parse_args()

    if args.dry_run:
        dry_run()
    elif args.text:
        main(args.text, image_url=args.image_url)
    else:
        parser.print_help()

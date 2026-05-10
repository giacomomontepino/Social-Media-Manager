#!/usr/bin/env python3
"""
linkedin_publisher.py — Pubblica post su LinkedIn via API v2
Uso:
  publisher.py --dry-run                                  Testa autenticazione
  publisher.py --text "testo" [--image path/img.jpg]      Post singolo
  publisher.py --text "testo" --carousel img1 img2 img3   Post carosello
"""

import argparse
import json
import os
import sys
from pathlib import Path

import requests
from dotenv import load_dotenv

load_dotenv(Path(__file__).parents[5] / ".env")

ACCESS_TOKEN = os.getenv("LINKEDIN_ACCESS_TOKEN")
PERSON_ID = os.getenv("LINKEDIN_PERSON_ID")
API_BASE = "https://api.linkedin.com/v2"


def _headers():
    return {
        "Authorization": f"Bearer {ACCESS_TOKEN}",
        "Content-Type": "application/json",
        "X-Restli-Protocol-Version": "2.0.0",
    }


def _check_credentials():
    if not ACCESS_TOKEN or not PERSON_ID:
        print("❌ Credenziali LinkedIn mancanti. Compila LINKEDIN_ACCESS_TOKEN e LINKEDIN_PERSON_ID in .env", file=sys.stderr)
        print("   Guida: .claude/setup/api-credentials.md", file=sys.stderr)
        sys.exit(1)


def dry_run():
    _check_credentials()
    r = requests.get(f"{API_BASE}/userinfo", headers=_headers())
    if r.status_code == 200:
        data = r.json()
        print(f"✓ Auth OK — dry run completato. Account: {data.get('name', 'N/A')}")
    else:
        print(f"❌ Auth fallita: {r.status_code} {r.text}", file=sys.stderr)
        sys.exit(1)


def _register_upload(upload_type="feedshare-image"):
    payload = {
        "registerUploadRequest": {
            "recipes": [f"urn:li:digitalmediaRecipe:{upload_type}"],
            "owner": f"urn:li:person:{PERSON_ID}",
            "serviceRelationships": [
                {"relationshipType": "OWNER", "identifier": "urn:li:userGeneratedContent"}
            ],
        }
    }
    r = requests.post(f"{API_BASE}/assets?action=registerUpload", headers=_headers(), json=payload)
    r.raise_for_status()
    data = r.json()
    upload_url = data["value"]["uploadMechanism"]["com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest"]["uploadUrl"]
    asset = data["value"]["asset"]
    return upload_url, asset


def upload_image(image_path):
    upload_url, asset = _register_upload()
    with open(image_path, "rb") as f:
        img_data = f.read()
    r = requests.put(upload_url, data=img_data, headers={"Authorization": f"Bearer {ACCESS_TOKEN}"})
    r.raise_for_status()
    print(f"✓ Immagine caricata: {asset}")
    return asset


def publish_post(text, asset_urn=None, carousel_urns=None):
    body = {
        "author": f"urn:li:person:{PERSON_ID}",
        "lifecycleState": "PUBLISHED",
        "specificContent": {
            "com.linkedin.ugc.ShareContent": {
                "shareCommentary": {"text": text},
                "shareMediaCategory": "NONE" if not asset_urn and not carousel_urns else "IMAGE",
            }
        },
        "visibility": {"com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"},
    }

    if asset_urn:
        body["specificContent"]["com.linkedin.ugc.ShareContent"]["shareMediaCategory"] = "IMAGE"
        body["specificContent"]["com.linkedin.ugc.ShareContent"]["media"] = [
            {"status": "READY", "media": asset_urn}
        ]
    elif carousel_urns:
        body["specificContent"]["com.linkedin.ugc.ShareContent"]["shareMediaCategory"] = "IMAGE"
        body["specificContent"]["com.linkedin.ugc.ShareContent"]["media"] = [
            {"status": "READY", "media": urn} for urn in carousel_urns
        ]

    r = requests.post(f"{API_BASE}/ugcPosts", headers=_headers(), json=body)
    r.raise_for_status()
    post_id = r.headers.get("x-restli-id", r.json().get("id", ""))
    post_url = f"https://www.linkedin.com/feed/update/{post_id}/"
    print(f"✓ Post pubblicato: {post_url}")
    return post_url


def main(text, image_path=None, carousel_paths=None):
    _check_credentials()
    asset_urn = None
    carousel_urns = None

    if image_path:
        asset_urn = upload_image(image_path)
    elif carousel_paths:
        carousel_urns = [upload_image(p) for p in carousel_paths]

    return publish_post(text, asset_urn=asset_urn, carousel_urns=carousel_urns)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="LinkedIn Publisher")
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--text", type=str)
    parser.add_argument("--image", type=str)
    parser.add_argument("--carousel", nargs="+", metavar="IMG")
    args = parser.parse_args()

    if args.dry_run:
        dry_run()
    elif args.text:
        main(args.text, image_path=args.image, carousel_paths=args.carousel)
    else:
        parser.print_help()

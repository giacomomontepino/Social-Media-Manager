#!/usr/bin/env python3
"""
x_publisher.py — Pubblica post/thread su X (Twitter) via API v2
Uso:
  publisher.py --dry-run                           Testa autenticazione
  publisher.py --tweet "testo" [--image path]      Post singolo
  publisher.py --thread tweet1 tweet2 ... [--image path]  Thread (reply chain)
"""

import argparse
import os
import sys
from pathlib import Path

import tweepy
from dotenv import load_dotenv

load_dotenv(Path(__file__).parents[5] / ".env")

API_KEY = os.getenv("X_API_KEY")
API_KEY_SECRET = os.getenv("X_API_KEY_SECRET")
ACCESS_TOKEN = os.getenv("X_ACCESS_TOKEN")
ACCESS_TOKEN_SECRET = os.getenv("X_ACCESS_TOKEN_SECRET")


def _check_credentials():
    missing = [k for k, v in {
        "X_API_KEY": API_KEY,
        "X_API_KEY_SECRET": API_KEY_SECRET,
        "X_ACCESS_TOKEN": ACCESS_TOKEN,
        "X_ACCESS_TOKEN_SECRET": ACCESS_TOKEN_SECRET,
    }.items() if not v]
    if missing:
        print(f"❌ Credenziali X mancanti: {', '.join(missing)}", file=sys.stderr)
        print("   Guida: .claude/setup/api-credentials.md", file=sys.stderr)
        sys.exit(1)


def _get_client():
    return tweepy.Client(
        consumer_key=API_KEY,
        consumer_secret=API_KEY_SECRET,
        access_token=ACCESS_TOKEN,
        access_token_secret=ACCESS_TOKEN_SECRET,
    )


def _get_api_v1():
    auth = tweepy.OAuth1UserHandler(API_KEY, API_KEY_SECRET, ACCESS_TOKEN, ACCESS_TOKEN_SECRET)
    return tweepy.API(auth)


def dry_run():
    _check_credentials()
    client = _get_client()
    me = client.get_me()
    print(f"✓ Auth OK — dry run completato. Account: @{me.data.username}")


def upload_media(image_path):
    api = _get_api_v1()
    media = api.media_upload(filename=image_path)
    print(f"✓ Media caricato: {media.media_id}")
    return str(media.media_id)


def post_tweet(text, media_id=None, reply_to=None):
    client = _get_client()
    kwargs = {"text": text}
    if media_id:
        kwargs["media_ids"] = [media_id]
    if reply_to:
        kwargs["in_reply_to_tweet_id"] = reply_to
    response = client.create_tweet(**kwargs)
    tweet_id = response.data["id"]
    print(f"✓ Tweet pubblicato: https://x.com/i/web/status/{tweet_id}")
    return tweet_id


def post_thread(tweets, image_path=None):
    media_id = upload_media(image_path) if image_path else None
    reply_to = None
    tweet_ids = []

    for i, tweet_text in enumerate(tweets):
        mid = media_id if i == 0 else None
        tweet_id = post_tweet(tweet_text, media_id=mid, reply_to=reply_to)
        tweet_ids.append(tweet_id)
        reply_to = tweet_id

    print(f"✓ Thread pubblicato ({len(tweets)} tweet). Primo: https://x.com/i/web/status/{tweet_ids[0]}")
    return tweet_ids[0]


def main(tweets, image_path=None):
    _check_credentials()
    if len(tweets) == 1:
        media_id = upload_media(image_path) if image_path else None
        return post_tweet(tweets[0], media_id=media_id)
    else:
        return post_thread(tweets, image_path=image_path)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="X Publisher")
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--tweet", type=str)
    parser.add_argument("--thread", nargs="+", metavar="TWEET")
    parser.add_argument("--image", type=str)
    args = parser.parse_args()

    if args.dry_run:
        dry_run()
    elif args.tweet:
        main([args.tweet], image_path=args.image)
    elif args.thread:
        main(args.thread, image_path=args.image)
    else:
        parser.print_help()

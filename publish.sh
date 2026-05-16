#!/bin/bash
# publish.sh v2 — Telegram-ready, CLI-driven, validated
# =====================================================
# Usage:
#   ./publish.sh <audio_path> <title> <description> [--dry-run] [--skip-push]
#
# Flags:
#   --dry-run    : Show what would happen, do NOT modify files or git
#   --skip-push  : Modify files locally, do NOT git push (for review)
#
# Examples:
#   ./publish.sh episodes/SIP_35.m4a "SIP 35 - Demo" "<p>Hello</p>"
#   ./publish.sh episodes/SIP_35.m4a "SIP 35" "<p>...</p>" --dry-run
#   ./publish.sh episodes/SIP_35.m4a "SIP 35" "<p>...</p>" --skip-push

set -euo pipefail

if [ "$#" -lt 3 ]; then
    echo "Usage: ./publish.sh <audio_path> <title> <description> [--dry-run] [--skip-push]"
    exit 1
fi

AUDIO_FILE="$1"
TITLE="$2"
DESC="$3"
shift 3

DRY_RUN=0
SKIP_PUSH=0
for arg in "$@"; do
    case "$arg" in
        --dry-run) DRY_RUN=1; SKIP_PUSH=1 ;;
        --skip-push) SKIP_PUSH=1 ;;
        *) echo "Unknown flag: $arg"; exit 1 ;;
    esac
done

# ─── PRE-CHECKS ──────────────────────────────────────────────────────────
for tool in ffmpeg ffprobe node xmllint git; do
    command -v "$tool" >/dev/null || { echo "❌ Missing: $tool"; exit 1; }
done

[ -f "$AUDIO_FILE" ] || { echo "❌ Audio file not found: $AUDIO_FILE"; exit 1; }

BASENAME=$(basename "$AUDIO_FILE")
EXTENSION="${BASENAME##*.}"

# ─── CONVERT m4a → mp3 IF NEEDED ─────────────────────────────────────────
if [ "$EXTENSION" != "mp3" ]; then
    MP3_NAME="${BASENAME%.*}.mp3"
    MP3_PATH="episodes/$MP3_NAME"
    if [ "$DRY_RUN" -eq 1 ]; then
        echo "🧪 [dry-run] Would convert: $AUDIO_FILE → $MP3_PATH (ffmpeg libmp3lame qscale:a 2)"
    else
        echo "🔄 Converting $BASENAME → $MP3_NAME ..."
        ffmpeg -i "$AUDIO_FILE" -codec:a libmp3lame -qscale:a 2 -y "$MP3_PATH" 2>/dev/null \
            || { echo "❌ ffmpeg convert failed"; exit 1; }
        echo "✅ Converted: $MP3_PATH"
    fi
    BASENAME="$MP3_NAME"
elif [ "$(dirname "$AUDIO_FILE")" != "episodes" ]; then
    if [ "$DRY_RUN" -eq 1 ]; then
        echo "🧪 [dry-run] Would copy $AUDIO_FILE → episodes/$BASENAME"
    else
        cp "$AUDIO_FILE" "episodes/$BASENAME"
    fi
fi

# ─── UPDATE DB ───────────────────────────────────────────────────────────
if [ "$DRY_RUN" -eq 1 ]; then
    node update_db.js --file "$BASENAME" --title "$TITLE" --desc "$DESC" --dry-run
else
    node update_db.js --file "$BASENAME" --title "$TITLE" --desc "$DESC"
fi

# ─── GENERATE + VALIDATE RSS ─────────────────────────────────────────────
if [ "$DRY_RUN" -eq 1 ]; then
    echo "🧪 [dry-run] Would run: node generate_rss.js + bash validate_feed.sh"
    exit 0
fi

node generate_rss.js
bash validate_feed.sh || { echo "❌ feed.xml validation failed — aborting"; exit 1; }

# ─── COMMIT + PUSH ───────────────────────────────────────────────────────
if [ "$SKIP_PUSH" -eq 1 ]; then
    echo "⏸  --skip-push: file đã update local, KHÔNG commit/push. Review xong gõ:"
    echo "     git add . && git commit -m 'Auto-publish: $TITLE' && git push origin main"
    exit 0
fi

git add .
git commit -m "Auto-publish: $TITLE"
git push origin main

echo "✅ Published. Feed: https://Taitrieu123.github.io/SANDO-PODCAST-AUTOMATION/feed.xml"
echo "   Spotify + Apple Podcasts cào trong 5-15 phút."

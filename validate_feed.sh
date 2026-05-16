#!/bin/bash
# validate_feed.sh — kiểm tra feed.xml trước khi push
# Catches: XML invalid, title quá dài, <script> trong description, audio file thiếu

set -euo pipefail

FEED="feed.xml"
[ -f "$FEED" ] || { echo "❌ $FEED not found"; exit 1; }

# 1. XML well-formed
xmllint --noout "$FEED" || { echo "❌ XML không hợp lệ"; exit 1; }

# 2. Title length per item (Apple cắt ~100 chars)
LONG_TITLES=$(xmllint --xpath '//item/title/text()' "$FEED" 2>/dev/null | awk 'length > 100 { print "  - "$0 }')
if [ -n "$LONG_TITLES" ]; then
    echo "⚠️  Title(s) > 100 ký tự (Apple cắt):"
    echo "$LONG_TITLES"
fi

# 3. <script> tag trong description (Spotify/Apple reject)
if xmllint --xpath '//item/description' "$FEED" 2>/dev/null | grep -iq '<script'; then
    echo "❌ Có <script> tag trong description"
    exit 1
fi

# 4. Audio file referenced phải tồn tại (skip external URL)
MISSING=0
while IFS= read -r url; do
    [[ "$url" == http* ]] && continue
    # url format: episodes/xxx.mp3
    fname=$(basename "$url")
    if [ ! -f "episodes/$fname" ]; then
        echo "❌ Missing audio file: episodes/$fname"
        MISSING=1
    fi
done < <(xmllint --xpath 'string(//item/enclosure/@url)' "$FEED" 2>/dev/null | tr ' ' '\n' | grep -v '^$' || true)

[ "$MISSING" -eq 1 ] && exit 1

# 5. Item count vs episodes.json
JSON_COUNT=$(node -e "console.log(require('./episodes.json').length)")
XML_COUNT=$(xmllint --xpath 'count(//item)' "$FEED")
if [ "$JSON_COUNT" != "$XML_COUNT" ]; then
    echo "⚠️  episodes.json có $JSON_COUNT, feed.xml có $XML_COUNT — không khớp"
fi

echo "✅ Validation passed ($XML_COUNT items)"

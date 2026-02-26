#!/bin/bash
# Script thêm episode mới và cập nhật RSS
# Tự động convert m4a → mp3 bằng ffmpeg

if [ "$#" -ne 3 ]; then
    echo "Sử dụng: ./publish.sh <đường_dẫn_audio> \"<tiêu_đề>\" \"<mô_tả>\""
    exit 1
fi

AUDIO_FILE=$1
TITLE=$2
DESC=$3

echo "Đang xử lý audio: $AUDIO_FILE"
BASENAME=$(basename "$AUDIO_FILE")
EXTENSION="${BASENAME##*.}"

# Tự động convert m4a/m4b/aac → mp3 nếu không phải mp3
if [ "$EXTENSION" != "mp3" ]; then
    MP3_NAME="${BASENAME%.*}.mp3"
    echo "🔄 Đang convert $BASENAME → $MP3_NAME ..."
    ffmpeg -i "$AUDIO_FILE" -codec:a libmp3lame -qscale:a 2 -y "episodes/$MP3_NAME" 2>/dev/null
    if [ $? -ne 0 ]; then
        echo "❌ Lỗi convert audio! Kiểm tra ffmpeg."
        exit 1
    fi
    BASENAME="$MP3_NAME"
    echo "✅ Convert thành công → episodes/$BASENAME"
else
    cp "$AUDIO_FILE" "episodes/$BASENAME"
fi

# Thêm vào episodes.json bằng Node.js script nhỏ
node -e "
const fs = require('fs');
const config = require('./podcast_config.json');
let episodes = [];
try { episodes = require('./episodes.json'); } catch(e) {}
const crypto = require('crypto');

const file = 'episodes/$BASENAME';
const stats = fs.statSync(file);
const fileSize = stats.size;
const id = crypto.randomUUID();

const ep = {
  id: id,
  title: '$TITLE',
  description: '$DESC',
  audioFile: '$BASENAME',
  duration: '00:15:00', // Thời lượng tạm tính 15p (Spotify tự đọc lại trên app)
  fileSize: fileSize,
  publishDate: new Date().toISOString(),
  episodeNumber: config.nextEpisodeNumber
};

episodes.unshift(ep);
config.nextEpisodeNumber++;

fs.writeFileSync('./episodes.json', JSON.stringify(episodes, null, 2));
fs.writeFileSync('./podcast_config.json', JSON.stringify(config, null, 2));
console.log('Đã cập nhật cơ sở dữ liệu với episode: ' + ep.title);
"

# Sinh RSS feed
node generate_rss.js

# Git add, commit và push tự động
git add .
git commit -m "Auto-publish episode: $TITLE"
git push origin main

echo "✅ Hoàn tất! RSS feed đã được cập nhật trên GitHub."

# Hệ Thống Tự Động Đăng Podcast (SIP) lên Spotify / Apple Podcasts

Đây là hệ thống giúp đăng tự động các file Audio Overview (từ NotebookLM) lên podcast "SANDO INVESTMENT PODCAST (SIP)".

## Cách Hoạt Động

1. Khi bạn bảo Antigravity: "Đăng podcast audio...":
2. Antigravity tự động tải audio về máy.
3. Chạy lệnh: `./publish.sh <audio_file> "Tiêu Đề" "Mô tả"` 
4. Script này tự copy audio, cập nhật database, sinh file RSS chuẩn iTunes và push lên GitHub.
5. Spotify sẽ tự động nhận diện bài mới.

## Cài đặt ban đầu (Làm 1 lần duy nhất)

1. Tải 31 episodes cũ bằng cách cung cấp link RSS cũ cho script import:
   `node import_existing.js "LINK_RSS_CŨ"`
2. Xác nhận GitHub repository `SANDO-PODCAST-AUTOMATION` đã được thiết lập public và bật GitHub Pages.
3. Trỏ Redirect (chuyển hướng 301) từ Spotify dành cho Creators sang feed mới: `https://copetrieu93.github.io/SANDO-PODCAST-AUTOMATION/feed.xml`.

## Cấu Trúc File

- `podcast_config.json`: Toàn bộ cấu hình kênh podcast (tên, tác giả).
- `episodes.json`: Database lưu toàn bộ thông tin các episodes đã đăng.
- `generate_rss.js`: Lõi của hệ thống → biến JSON thành XML cho Apple/Spotify đọc.
- `publish.sh`: Kịch bản điều phối các thao tác để chạy tự động hoàn toàn.

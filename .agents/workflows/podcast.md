---
description: Tự động đăng tải audio overview từ NotebookLM lên podcast SIP qua GitHub Pages.
---

# Đăng Podcast từ NotebookLM

Thiết lập này giúp tự động hóa quá trình xuất bản Audio Overview từ NotebookLM thẳng lên Spotify Podcast.

// turbo-all
1. Lấy đường dẫn file audio vừa được tải về (thường dùng công cụ `download_audio` của NotebookLM).
2. Xác định Tiêu đề (VD: "SIP 32 - Tên Notebook") và Mô tả cho tập podcast.
3. Chạy tập lệnh publish.sh để thực hiện xuất bản. Câu lệnh mẫu: `cd /Users/trieutai/.gemini/antigravity/scratch/2026-02-26_Podcast_Auto_Upload && bash publish.sh "<đường_dẫn_file_audio>" "<tiêu_đề>" "<mô_tả>"`
4. Xác nhận với người dùng là RSS feed đã được cập nhật thành công.

Lưu ý: Nếu GitHub push yêu cầu xác thực, hãy nhắc người dùng kiểm tra GitHub CLI hoặc SSH keys.

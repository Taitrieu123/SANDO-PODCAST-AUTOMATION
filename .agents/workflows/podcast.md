---
description: Tự động đăng tải audio overview từ NotebookLM lên podcast SIP qua GitHub Pages.
---

# Đăng Podcast từ NotebookLM

Thiết lập này giúp tự động hóa quá trình xuất bản Audio Overview từ NotebookLM thẳng lên Spotify Podcast.

// turbo-all
1. Lấy thông tin Notebook bằng cách tìm kiếm ID hoặc URL của nó thông qua thư viện `mcp_notebooklm_list_notebooks` hoặc `mcp_notebooklm_search_notebooks`.
2. Dùng công cụ `mcp_notebooklm_get_audio_status` để kiểm tra audio đã READY chưa. Nếu chưa báo cho user, nếu rồi thì sang bước tải.
3. Dùng công cụ `mcp_notebooklm_download_audio` để tải Audio Overview về máy. Lưu ý đường dẫn file trả về.
4. Lấy Tên Notebook để làm Tiêu đề (Đừng quên tự động thêm tiền tố "SIP XX - " dựa trên số tập tiếp theo trong file `podcast_config.json`).
5. Lấy Mô tả (Description) hoặc Tóm tắt nội dung chính của Notebook để làm phần mô tả cho Podcast.
6. Chạy tập lệnh publish.sh để thực hiện xuất bản. Mẫu: `cd /Users/trieutai/.gemini/antigravity/scratch/2026-02-26_Podcast_Auto_Upload && bash publish.sh "<đường_dẫn_audio_mới_tải>" "<tiêu_đề_tự_sinh>" "<mô_tả_tự_sinh>"`
7. Xác nhận với người dùng là RSS feed đã được cập nhật thành công lên GitHub và chừng 5-10p nữa Spotify sẽ tự cào về.

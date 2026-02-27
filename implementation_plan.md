# Kế hoạch triển khai (Implementation Plan)

## Mục tiêu
Tạo ra một hệ thống lưu trữ và tự động sinh nguồn dữ liệu RSS Podcast dành riêng cho nền tảng Spotify và Apple Podcasts, sử dụng GitHub Pages làm Hosting Provider (Miễn phí, 100% tự chủ).
Giúp việc phát hành các Audio Overview từ hệ thống NotebookLM thành chuỗi Podcast trở nên mượt mà, chuyên nghiệp.

## Kiến Trúc Hệ Thống
1. **Dữ liệu**: Nằm trong `episodes.json` và cấu hình tại `podcast_config.json`.
2. **Logic Sinh Nguồn**: Viết bằng Node.js (`generate_rss.js`) tự động parse JSON sang chuẩn RSS 2.0 iTunes.
3. **Tự động hóa**: Bash Script `publish.sh` thực thi việc cập nhật biến số và trigger Git commands.
4. **Bảo mật**: Xử lý triệt để khâu escape string XML (đặc biệt với các ký tự `&`, `<`, `>`) chống crash khi Spotify parse dữ liệu.

## Trạng Thái
Đã hoàn thành và triển khai thành công 100%. Xác minh thành công từ phía Spotify Provider.

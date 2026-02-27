# Hệ Thống Tự Động Đăng Podcast (SIP) lên Spotify / Apple Podcasts

Đây là cỗ máy giúp bạn (PM) đăng tự động các file Âm thanh (Audio Overview từ NotebookLM) lên kênh podcast "SANDO INVESTMENT PODCAST (SIP)".

## 🎙️ QUY TRÌNH DUY NHẤT BẠN CẦN LÀM (KHI CÓ TẬP MỚI)

Mọi việc nặng nhọc như viết tiêu đề, viết mô tả SEO, mix nhạc hay convert file... Antigravity sẽ tự động gánh vác 100%. Đây là 2 bước duy nhất bạn cần làm:

### Bước 1: Chuẩn bị nguyên liệu
- Bạn nhấp Tải về (Download) file Audio Overview từ cuốn sổ NotebookLM bạn vừa tạo. MacOS thường tải về file định dạng `.m4a`.
- Copy nguyên file `.m4a` đó (hoặc `.mp3` đều được) quẳng vào thư mục `episodes/` của dự án này.
- **Mẹo nhỏ:** Đổi tên file gọn gàng tiếng Anh không dấu, ví dụ `SIP_33_TenBaiHoc.m4a` để tiện gọi lệnh.

### Bước 2: Ra lệnh cho Trợ lý Antigravity
Gõ vào khung chat lệnh tương tự như sau:
> *"Tập mới từ file `SIP_33_TenBaiHoc.m4a`, lấy nội dung từ sổ `[Tên sổ NotebookLM của bạn]` giúp anh nhé."*

### ☕️ Bước 3: Thưởng thức Cà Phê
Phần còn lại, Antigravity sẽ tự động kích hoạt Chuỗi Dây Chuyền:
1. **Trích xuất trí tuệ:** Truy cập trực tiếp vào cuốn sổ NotebookLM của bạn, đọc tóm tắt nội dung để tự động "đẻ" ra (1) Tiêu đề hấp dẫn, (2) Mô tả SEO chuẩn phong cách SIP.
2. **Xử lý âm thanh:** Tự động convert file `.m4a` thành `.mp3` chất lượng Studio (định dạng tối ưu nhất cho Apple/Spotify).
3. **Đóng gói hình ảnh:** Tự động lấy "ảnh bìa" (Cover Image) mặc định ghép vào Tập podcast mới nhất.
4. **Cập nhật hệ thống:** Ghi nhận vào Database (`episodes.json`) và tạo bản dạng mã chuẩn XML iTunes (`feed.xml`).
5. **Publish toàn cầu:** Tự đẩy nhạc và file XML lên máy chủ GitHub Pages.

Spotify và Apple Podcasts sẽ tự động nhận diện tập mới trong vài phút. Xong!

---

## Cấu Trúc File Kỹ Thuật (Dành cho PM/Coder)
- `podcast_config.json`: Toàn bộ cấu hình kênh podcast (tên tác giả, danh mục).
- `episodes.json`: Bảng điều khiển (database) lưu toàn bộ thông tin các episodes đã đăng.
- `generate_rss.js`: Lõi của hệ thống → biến JSON thành XML cho Apple/Spotify đọc. Tích hợp thuật toán "escapeXml" chống crash cú pháp.
- `publish.sh`: Kịch bản điều phối các thao tác để chạy tự động hoàn toàn.

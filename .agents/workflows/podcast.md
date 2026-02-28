---
description: Tự động đăng tải audio overview từ NotebookLM lên podcast SIP qua GitHub Pages.
---

# Đăng Podcast từ NotebookLM

Người dùng chỉ cần cung cấp: **tên file audio** đã upload vào `/episodes/` và **tên/URL của Notebook NotebookLM**.
AI sẽ tự động sinh tiêu đề + mô tả đẹp, hỏi xác nhận, rồi mới publish.

---

## Bước 1 – Tìm Notebook NotebookLM
// turbo
Dùng `mcp_notebooklm_search_notebooks` hoặc `mcp_notebooklm_list_notebooks` để tìm Notebook theo tên/URL do user cung cấp.

## Bước 2 – Kiểm tra Audio Status
// turbo
Dùng `mcp_notebooklm_get_audio_status` với notebook tìm được.
- Nếu audio chưa READY → thông báo user và dừng.
- Nếu READY → sang bước 3.

## Bước 3 – Tải Audio về máy
// turbo
Dùng `mcp_notebooklm_download_audio` để tải file mp3 về. Lưu lại đường dẫn file.

## Bước 4 – Query nội dung Notebook để sinh tiêu đề + mô tả
// turbo
Dùng `mcp_notebooklm_ask_question` để hỏi 2 câu trong cùng 1 session:

**Câu 1:** "Tóm tắt nội dung chính của notebook này thành 4-6 bullet points ngắn gọn bằng tiếng Việt, mỗi bullet là 1 luận điểm cốt lõi."

**Câu 2 (cùng session):** "Đề xuất một tiêu đề podcast hấp dẫn cho nội dung này, ngắn gọn dưới 12 từ, không cần thêm số tập."

Dựa trên nội dung thu được, tự viết tiêu đề và mô tả theo chuẩn bên dưới.

---

### ⚠️ QUY TẮC BẮT BUỘC – Chuyển phiên âm về từ gốc
NotebookLM ghi âm giọng nói nên các từ tiếng Anh/tên riêng thường bị viết theo phiên âm.
**BẮT BUỘC phải chuyển về từ gốc** khi viết tiêu đề và mô tả:
- "Xi-i-âu" → **CEO** | "Ây-ai" / "Ây Ai" → **AI** | "Pia" → **Peer**
- "Men-tơ" → **Mentor** | "In-vét-tơ" → **Investor** | "Pót-phô-li-ô" → **Portfolio**
- "Ét-xít" → **Exit** | "Pho-miu-la" → **Formula** | "Mác-kết-tinh" → **Marketing**
- "San-đô" hoặc "Xan-đô" → **Sando** | "Uo-rần Bắp-phít" → **Warren Buffett**
- "I-lon Mắt-xờ" → **Elon Musk** | "A-ma-don" → **Amazon**
Áp dụng cho MỌI từ phiên âm tìm thấy trong nội dung.

---

### 📐 CHUẨN VIẾT MÔ TẢ HTML (BẮT BUỘC theo format này)

```html
<p><strong>Câu hook ngắn đặt vấn đề, khơi gợi sự tò mò của người nghe.</strong></p>

<p>1-2 câu giới thiệu bối cảnh và lý do tập này quan trọng.</p>

<p>🎧 <strong>Những nội dung chính trong tập này:</strong></p>

<p>💡 <strong>Điểm 1:</strong> Mô tả ngắn gọn điểm nội dung thứ nhất.</p>

<p>🔑 <strong>Điểm 2:</strong> Mô tả ngắn gọn điểm nội dung thứ hai.</p>

<p>✅ <strong>Điểm 3:</strong> Mô tả ngắn gọn điểm nội dung thứ ba.</p>

<p><em>"Câu quote ấn tượng hoặc lời kêu gọi hành động." 🚀</em></p>
```

**Chú ý:**
- Dùng emoji phù hợp: 💡🔑✅🎯🧠🏆🤝🚀
- KHÔNG dùng phiên âm trong mô tả
- KHÔNG thêm hashtag vào mô tả RSS (Spotify/Apple không hiển thị hashtag)
- Số tập (SIP XX) sẽ được điền tự động dựa trên `config.nextEpisodeNumber` trong `podcast_config.json`

---

## Bước 5 – DỪNG LẠI và trình bày để user duyệt

Trình bày rõ ràng theo format sau trước khi làm bất cứ điều gì:

```
📝 **Tiêu đề đề xuất:**
SIP [số tập] - [Tên hấp dẫn]

📋 **Mô tả đề xuất:**
[Mô tả HTML theo chuẩn trên]

🎵 **File audio:** [tên file]

✅ Duyệt để tôi đăng lên, hoặc nhắn chỉnh sửa nhé!
```

⛔ **KHÔNG chạy bất kỳ lệnh publish nào trước khi user xác nhận.**

---

## Bước 6 – Publish sau khi user duyệt
// turbo
Sau khi user xác nhận (hoặc điều chỉnh xong), chạy lệnh publish:

```bash
cd /Users/trieutai/.gemini/antigravity/scratch/2026-02-26_Podcast_MCP_NOTEBOOKLM && bash publish.sh "<đường_dẫn_audio>" "<tiêu_đề_đã_duyệt>" "<mô_tả_html_đã_duyệt>"
```

## Bước 7 – Xác nhận hoàn thành
// turbo
Thông báo cho user:
- RSS feed đã được cập nhật lên GitHub ✅
- Spotify và Apple Podcasts sẽ tự cào về trong vòng **5-15 phút**
- Link kiểm tra feed: `https://Taitrieu123.github.io/SANDO-PODCAST-AUTOMATION/feed.xml`

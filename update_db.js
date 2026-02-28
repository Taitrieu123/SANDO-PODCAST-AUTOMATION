/**
 * 📌 SCRIPT ĐĂNG TẬP PODCAST MỚI
 * ================================
 * Hướng dẫn sử dụng:
 * 1. Đổi FILE_NAME thành tên file .mp3 trong thư mục /episodes/
 * 2. Điền EPISODE_TITLE (tiêu đề tập)
 * 3. Viết EPISODE_DESCRIPTION theo template HTML bên dưới
 * 4. Chạy: node update_db.js
 * 5. Chạy: node generate_rss.js
 * 6. Chạy: ./publish.sh
 */

const fs = require('fs');
const config = require('./podcast_config.json');
let episodes = [];
try { episodes = require('./episodes.json'); } catch (e) { }
const crypto = require('crypto');

// ============================================================
// ✏️  ĐIỀN THÔNG TIN TẬP MỚI TẠI ĐÂY
// ============================================================

const FILE_NAME = 'Nhân_5_tốc_độ_học_và_hành.mp3'; // Tên file trong thư mục /episodes/

const EPISODE_TITLE = 'SIP 34 - Bí Quyết Nhân 5 Năng Lực Cá Nhân Trong Năm 2026: Học Nhanh, Hành Quyết Liệt';

/**
 * TEMPLATE MÔ TẢ HTML ĐẸP
 * ========================
 * Hướng dẫn:
 * - Dùng <p>...</p> để tạo đoạn văn
 * - Dùng <strong>...</strong> để in đậm từ khóa quan trọng
 * - Dùng <em>...</em> để in nghiêng câu quote ấn tượng
 * - Thêm emoji phù hợp với nội dung (🎧 💡 🔑 ✅ ❌ 🚀)
 * - Mỗi điểm chính nên là 1 thẻ <p> riêng
 */
const EPISODE_DESCRIPTION = `<p>Bạn có đang cảm thấy mình bị bỏ lại phía xa khi thị trường thay đổi chóng mặt, nhưng bản thân vẫn đang loay hoay với cách học tập và làm việc chậm chạp từ thập niên trước?</p><p>✅ <strong>Phương pháp học nhanh gấp 5 lần:</strong> Khám phá cách dùng Notebook LM của Google như một trợ lý cá nhân, kết hợp cùng chu trình học tập trải nghiệm (ELC) để tăng tốc độ tiếp thu.</p><p>✅ <strong>Tư duy "sai nhanh còn hơn đúng chậm":</strong> Xóa bỏ căn bệnh sợ sai và bẫy hoàn hảo, ngừng suy nghĩ quá lâu để bắt tay vào làm ngay, sai thì sửa để chớp lấy cơ hội.</p><p>✅ <strong>Tuyệt chiêu đúc kết để làm chủ kiến thức:</strong> Cách chuyển hóa lý thuyết thành năng lực thực chiến không bao giờ quên bằng việc đúc kết ngay thành slide, ghi âm giọng nói hoặc chia sẻ cho người khác.</p><p>✅ <strong>Xây dựng hệ sinh thái bứt phá:</strong> Bí quyết lọc và xây dựng môi trường xung quanh toàn những người ham học hỏi, vì bạn không thể phát triển nếu những người kề cận đều thụ động.</p><p>Lắng nghe ngay tập này để nâng cấp &quot;lõi&quot; năng lực của bạn, tự động kéo theo sự bứt phá x5, x10 về thu nhập và giá trị trong năm 2026! 👇</p><p>#SIP34 #SandoTrieu #SandoInvestmentPodcast #HocNhanhHanhQuyetLiet #PhatTrienBanThan #NotebookLM</p>`;

// ============================================================
// ⚙️  XỬ LÝ TỰ ĐỘNG (KHÔNG CẦN SỬA TỪ ĐÂY)
// ============================================================

const file = `episodes/${FILE_NAME}`;
const stats = fs.statSync(file);
const fileSize = stats.size;
const id = crypto.randomUUID();

const ep = {
    id: id,
    title: EPISODE_TITLE,
    description: EPISODE_DESCRIPTION,
    audioFile: FILE_NAME,
    duration: '00:15:32', // Thời lượng tạm tính (Spotify/Apple tự đọc lại)
    fileSize: fileSize,
    publishDate: new Date().toISOString(),
    episodeNumber: config.nextEpisodeNumber
};

episodes.unshift(ep);
config.nextEpisodeNumber++;

fs.writeFileSync('./episodes.json', JSON.stringify(episodes, null, 2));
fs.writeFileSync('./podcast_config.json', JSON.stringify(config, null, 2));

console.log('✅ Đã thêm episode mới:');
console.log('   Tiêu đề  :', ep.title);
console.log('   Số tập   :', ep.episodeNumber);
console.log('   File     :', ep.audioFile);
console.log('   Kích thước:', (ep.fileSize / 1024 / 1024).toFixed(1), 'MB');
console.log('');
console.log('📋 Bước tiếp theo:');
console.log('   1. node generate_rss.js   → Tạo file feed.xml mới');
console.log('   2. ./publish.sh           → Đăng lên GitHub Pages');
